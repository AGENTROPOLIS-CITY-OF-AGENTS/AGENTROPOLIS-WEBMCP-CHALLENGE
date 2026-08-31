import { requestFingerprint } from './ids'
import type { ActionRequest } from './contracts'

export interface Approval {
  requestId: string
  fingerprint: string
  approvedBy: string
  approvedAt: string
  consumedAt: string | null
}

export class ApprovalStore {
  private approvals = new Map<string, Approval>()

  issue(request: ActionRequest, approvedBy: string): Approval {
    if (request.actor.id === approvedBy) throw new Error('An actor cannot approve its own request.')
    const approval: Approval = {
      requestId: request.requestId,
      fingerprint: requestFingerprint(request),
      approvedBy,
      approvedAt: new Date().toISOString(),
      consumedAt: null,
    }
    this.approvals.set(request.requestId, approval)
    return approval
  }

  consume(request: ActionRequest): Approval {
    const approval = this.approvals.get(request.requestId)
    if (!approval) throw new Error('No approval exists for this request.')
    if (approval.consumedAt) throw new Error('Approval has already been consumed.')
    if (approval.fingerprint !== requestFingerprint(request)) throw new Error('Approval is not bound to this exact request.')
    approval.consumedAt = new Date().toISOString()
    return approval
  }
}
