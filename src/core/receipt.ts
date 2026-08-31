import { createId } from './ids'
import type { ActionRequest, Decision, ExecutionReceipt, ExecutionStatus } from './contracts'

export function emitReceipt(
  request: ActionRequest,
  decision: Decision,
  status: ExecutionStatus,
  options: { approvedBy?: string | null; output?: Record<string, unknown> | null } = {},
): ExecutionReceipt {
  const now = new Date().toISOString()
  return {
    receiptId: createId('receipt'),
    requestId: request.requestId,
    tool: request.tool,
    decision: decision.effect,
    approvedBy: options.approvedBy ?? null,
    status,
    input: { action: request.action, mandate: request.mandate, actor: request.actor, ...request.arguments },
    output: options.output ?? null,
    policyReasons: decision.reasons,
    createdAt: now,
    executedAt: status === 'EXECUTED' ? now : null,
  }
}
