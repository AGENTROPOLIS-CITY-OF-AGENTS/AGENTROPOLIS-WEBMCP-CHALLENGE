export type Effect = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'
export type ActorType = 'human' | 'agent' | 'service'
export type Operation = 'inspect_district' | 'energize_trace' | 'override_policy'
export type ExecutionStatus = 'DENIED' | 'AWAITING_APPROVAL' | 'EXECUTED' | 'FAILED'

export interface Actor {
  id: string
  type: ActorType
}

export interface ActionRequest {
  requestId: string
  actor: Actor
  tool: string
  action: Operation
  arguments: Record<string, unknown>
  mandate: string | null
  createdAt: string
}

export interface Decision {
  decisionId: string
  requestId: string
  effect: Effect
  reasons: string[]
  policyVersion: string
  decidedAt: string
}

export interface ExecutionReceipt {
  receiptId: string
  requestId: string
  tool: string
  decision: Effect
  approvedBy: string | null
  status: ExecutionStatus
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  policyReasons: string[]
  createdAt: string
  executedAt: string | null
}

export interface ToolInput {
  operation: Operation
  actorId: string
  actorType: ActorType
  mandate: 'observe-grid' | 'operate-grid' | 'none'
  district: 'gateway' | 'identity' | 'policy' | 'forge' | 'vault'
}

export const TOOL_NAME = 'agentropolis_govern_district_action'

export const TOOL_INPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    operation: {
      type: 'string',
      enum: ['inspect_district', 'energize_trace', 'override_policy'],
      description: 'Bounded district operation. Inspection is low risk; energizing requires a human; policy override is prohibited.',
    },
    actorId: { type: 'string', minLength: 3, maxLength: 48, pattern: '^[a-zA-Z0-9._-]+$' },
    actorType: { type: 'string', enum: ['human', 'agent', 'service'] },
    mandate: { type: 'string', enum: ['observe-grid', 'operate-grid', 'none'] },
    district: { type: 'string', enum: ['gateway', 'identity', 'policy', 'forge', 'vault'] },
  },
  required: ['operation', 'actorId', 'actorType', 'mandate', 'district'],
} as const
