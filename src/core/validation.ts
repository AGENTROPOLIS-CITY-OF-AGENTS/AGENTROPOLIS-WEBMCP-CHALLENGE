import type { ActorType, Operation, ToolInput } from './contracts'

const operations = new Set<Operation>(['inspect_district', 'energize_trace', 'override_policy'])
const actorTypes = new Set<ActorType>(['human', 'agent', 'service'])
const mandates = new Set(['observe-grid', 'operate-grid', 'none'])
const districts = new Set(['gateway', 'identity', 'policy', 'forge', 'vault'])
const keys = new Set(['operation', 'actorId', 'actorType', 'mandate', 'district'])

export function validateToolInput(value: unknown): ToolInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Tool input must be an object.')
  const input = value as Record<string, unknown>
  if (Object.keys(input).some((key) => !keys.has(key))) throw new Error('Tool input contains unsupported properties.')
  if (!operations.has(input.operation as Operation)) throw new Error('Unknown operation.')
  if (!actorTypes.has(input.actorType as ActorType)) throw new Error('Unknown actor type.')
  if (!mandates.has(input.mandate as string)) throw new Error('Unknown mandate.')
  if (!districts.has(input.district as string)) throw new Error('Unknown district.')
  if (typeof input.actorId !== 'string' || !/^[a-zA-Z0-9._-]{3,48}$/.test(input.actorId)) {
    throw new Error('actorId must be 3–48 safe identifier characters.')
  }
  return input as unknown as ToolInput
}
