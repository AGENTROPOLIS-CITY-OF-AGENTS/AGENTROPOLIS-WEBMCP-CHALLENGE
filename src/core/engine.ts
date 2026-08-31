import { ApprovalStore } from './approval'
import type { ActionRequest, Decision, ExecutionReceipt, ToolInput } from './contracts'
import { TOOL_NAME } from './contracts'
import { createId } from './ids'
import { evaluate } from './policy'
import { emitReceipt } from './receipt'
import { validateToolInput } from './validation'

export type WorldPhase =
  | 'ORIENTING'
  | 'DISCOVERED'
  | 'REQUESTED'
  | 'IDENTIFIED'
  | 'MANDATE_CHECKED'
  | 'POLICY_DECIDED'
  | 'AWAITING_APPROVAL'
  | 'EXECUTING'
  | 'RECEIPTED'

export type ToolStatus = 'checking' | 'registered' | 'unsupported' | 'error'
export type RequestSource = 'webmcp' | 'guided-demo' | 'visitor'

export interface WorldEvent {
  id: string
  at: string
  phase: WorldPhase
  message: string
}

export interface WorldState {
  toolStatus: ToolStatus
  phase: WorldPhase
  source: RequestSource | null
  request: ActionRequest | null
  decision: Decision | null
  activeReceipt: ExecutionReceipt | null
  receipts: ExecutionReceipt[]
  selectedReceiptId: string | null
  eventLog: WorldEvent[]
  narration: string
  busy: boolean
}

export interface ToolResult {
  requestId: string
  decision: Decision['effect']
  status: ExecutionReceipt['status']
  receiptId: string
  message: string
}

type Listener = () => void

const narration: Record<WorldPhase, string> = {
  ORIENTING: 'Discovery is not authority. Watch a request prove who may act.',
  DISCOVERED: 'A structured tool is visible. The Gateway is open, but authority is still unproven.',
  REQUESTED: 'A real application request just entered the world.',
  IDENTIFIED: 'Identity resolved. The actor now travels with the request.',
  MANDATE_CHECKED: "The corridor is checking whether intent fits the actor's mandate.",
  POLICY_DECIDED: 'Policy has produced a deterministic decision.',
  AWAITING_APPROVAL: 'The packet is physically paused. Only a different human can release it.',
  EXECUTING: 'Authority is valid. The Execution Forge is applying the bounded action.',
  RECEIPTED: 'The outcome is immutable here: inspect its artifact in the Receipt Vault.',
}

export class GovernanceEngine {
  private listeners = new Set<Listener>()
  private approvals = new ApprovalStore()
  private transitionDelay: number
  private state: WorldState = {
    toolStatus: 'checking',
    phase: 'ORIENTING',
    source: null,
    request: null,
    decision: null,
    activeReceipt: null,
    receipts: [],
    selectedReceiptId: null,
    eventLog: [],
    narration: narration.ORIENTING,
    busy: false,
  }

  constructor(options: { transitionDelay?: number } = {}) {
    this.transitionDelay = options.transitionDelay ?? 420
    this.addEvent('ORIENTING', 'HERMES // WEBMCP WARDEN online.')
  }

  getSnapshot = (): WorldState => this.state
  getServerSnapshot = (): WorldState => this.state

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  setToolStatus(status: ToolStatus): void {
    this.patch({ toolStatus: status })
    if (status === 'registered') this.transition('DISCOVERED', 'WebMCP tool registered. Gateway ports powered on.')
    if (status === 'unsupported') this.addEvent('ORIENTING', 'WebMCP unavailable in this browser; local governed requests remain clearly labeled.')
    if (status === 'error') this.addEvent('ORIENTING', 'WebMCP registration failed; no discovery claim was made.')
  }

  selectReceipt(receiptId: string | null): void {
    this.patch({ selectedReceiptId: receiptId })
  }

  async submit(rawInput: unknown, source: RequestSource): Promise<ToolResult> {
    if (this.state.busy && this.state.phase !== 'AWAITING_APPROVAL') throw new Error('The governance corridor is processing another request.')
    if (this.state.phase === 'AWAITING_APPROVAL') throw new Error('A request is awaiting a human decision.')

    const input = validateToolInput(rawInput)
    const request = this.toRequest(input)
    this.patch({ busy: true, source, request, decision: null, activeReceipt: null, selectedReceiptId: null })
    this.transition('REQUESTED', `${source === 'guided-demo' ? 'DEMO | ' : ''}${input.operation} packet entered at the Gateway.`)
    await this.wait()
    this.transition('IDENTIFIED', `${input.actorType.toUpperCase()} ${input.actorId} attached to the request.`)
    await this.wait()
    this.transition('MANDATE_CHECKED', input.mandate === 'none' ? 'No valid mandate found. Corridor barrier engaged.' : `Mandate ${input.mandate} resolved.`)
    await this.wait()

    const decision = evaluate(request)
    this.patch({ decision })
    this.transition('POLICY_DECIDED', `Policy decision: ${decision.effect}. ${decision.reasons[0]}`)
    await this.wait()

    if (decision.effect === 'DENY') {
      const receipt = emitReceipt(request, decision, 'DENIED')
      this.archive(receipt, `DENIED receipt ${receipt.receiptId} docked in the Vault.`)
      return this.result(receipt, 'Route terminated before execution.')
    }

    if (decision.effect === 'REQUIRE_APPROVAL') {
      const receipt = emitReceipt(request, decision, 'AWAITING_APPROVAL')
      this.patch({ activeReceipt: receipt, receipts: [...this.state.receipts, receipt], busy: false })
      this.transition('AWAITING_APPROVAL', `Request ${request.requestId} diverted to the Human Approval Chamber.`)
      return this.result(receipt, 'Human approval is required in the world before execution.')
    }

    return this.execute(request, decision, null)
  }

  async approve(approvedBy: string): Promise<ToolResult> {
    const { request, decision } = this.state
    if (!request || !decision || this.state.phase !== 'AWAITING_APPROVAL') throw new Error('No request is awaiting approval.')

    const approval = this.approvals.issue(request, approvedBy)
    this.approvals.consume(request)
    this.patch({ busy: true })
    this.addEvent('AWAITING_APPROVAL', `Human ${approvedBy} approved exact request fingerprint ${approval.fingerprint}.`)
    return this.execute(request, decision, approvedBy)
  }

  denyApproval(deniedBy: string): ToolResult {
    const { request, decision } = this.state
    if (!request || !decision || this.state.phase !== 'AWAITING_APPROVAL') throw new Error('No request is awaiting approval.')

    const receipt = emitReceipt(request, decision, 'DENIED', { output: { deniedBy, reason: 'Human declined approval.' } })
    this.archive(receipt, `Human ${deniedBy} declined. Route terminated and receipt archived.`)
    return this.result(receipt, 'Human declined the state-changing request.')
  }

  private async execute(request: ActionRequest, decision: Decision, approvedBy: string | null): Promise<ToolResult> {
    this.transition('EXECUTING', `${request.action} entered the Execution Forge.`)
    await this.wait()

    const output = request.action === 'inspect_district'
      ? { district: request.arguments.district, condition: 'nominal', changed: false }
      : { district: request.arguments.district, traceState: 'energized', changed: true }

    const receipt = emitReceipt(request, decision, 'EXECUTED', { approvedBy, output })
    this.archive(receipt, `EXECUTED receipt ${receipt.receiptId} entered the Audit Ledger.`)
    return this.result(receipt, 'Execution completed and was receipted.')
  }

  private archive(receipt: ExecutionReceipt, message: string): void {
    this.patch({ activeReceipt: receipt, receipts: [...this.state.receipts, receipt], selectedReceiptId: receipt.receiptId, busy: false })
    this.transition('RECEIPTED', message)
  }

  private result(receipt: ExecutionReceipt, message: string): ToolResult {
    return { requestId: receipt.requestId, decision: receipt.decision, status: receipt.status, receiptId: receipt.receiptId, message }
  }

  private toRequest(input: ToolInput): ActionRequest {
    return {
      requestId: createId('request'),
      actor: { id: input.actorId, type: input.actorType },
      tool: TOOL_NAME,
      action: input.operation,
      arguments: { district: input.district },
      mandate: input.mandate === 'none' ? null : input.mandate,
      createdAt: new Date().toISOString(),
    }
  }

  private transition(phase: WorldPhase, message: string): void {
    this.patch({ phase, narration: narration[phase] })
    this.addEvent(phase, message)
  }

  private addEvent(phase: WorldPhase, message: string): void {
    const event = { id: createId('event'), at: new Date().toISOString(), phase, message }
    this.patch({ eventLog: [...this.state.eventLog.slice(-19), event] })
  }

  private patch(update: Partial<WorldState>): void {
    this.state = { ...this.state, ...update }
    this.listeners.forEach((listener) => listener())
  }

  private wait(): Promise<void> {
    return this.transitionDelay ? new Promise((resolve) => setTimeout(resolve, this.transitionDelay)) : Promise.resolve()
  }
}

export const governanceEngine = new GovernanceEngine()
