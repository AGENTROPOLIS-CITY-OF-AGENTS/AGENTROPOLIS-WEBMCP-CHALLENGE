import { createId } from './ids'
import type { ActionRequest, Decision, Effect } from './contracts'

export interface PolicyContext {
  policyVersion: string
}

function result(request: ActionRequest, effect: Effect, reasons: string[], context: PolicyContext): Decision {
  return {
    decisionId: createId('decision'),
    requestId: request.requestId,
    effect,
    reasons,
    policyVersion: context.policyVersion,
    decidedAt: new Date().toISOString(),
  }
}

export function evaluate(request: ActionRequest, context: PolicyContext = { policyVersion: 'wired-chaos/1.0' }): Decision {
  if (!request.mandate) return result(request, 'DENY', ['No mandate was presented; discovery cannot grant authority.'], context)
  if (request.action === 'override_policy') return result(request, 'DENY', ['Policy overrides are prohibited for all tool callers.'], context)
  if (request.action === 'inspect_district') {
    if (request.mandate === 'observe-grid' || request.mandate === 'operate-grid') {
      return result(request, 'ALLOW', ['Read-only district inspection is within the active mandate.'], context)
    }
    return result(request, 'DENY', ['The mandate does not include observation rights.'], context)
  }
  if (request.action === 'energize_trace') {
    if (request.mandate !== 'operate-grid') return result(request, 'DENY', ['Trace energization exceeds the observation mandate.'], context)
    return result(request, 'REQUIRE_APPROVAL', ['Trace energization changes world state and requires a distinct human approver.'], context)
  }
  return result(request, 'DENY', ['The requested action is not recognized by policy.'], context)
}
