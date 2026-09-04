import type { TemporalOperation, TemporalPhase } from './temporal-plan'

const PHASE_OPERATIONS: Record<TemporalPhase, TemporalOperation[]> = {
  OBSERVE: ['inspect', 'capture'], ACT: ['translate', 'rotate', 'intensity'], SEE_AGAIN: ['inspect', 'capture'], VERIFY: ['verify'], RECEIPT: ['receipt'], DENIED: ['deny'],
}

export function allowedOperationsForPhase(phase: TemporalPhase): TemporalOperation[] { return [...PHASE_OPERATIONS[phase]] }
export function isTemporalOperationAllowed(phase: TemporalPhase, operation: TemporalOperation): boolean { return PHASE_OPERATIONS[phase].includes(operation) }
export function assertTemporalOperationAllowed(phase: TemporalPhase, operation: TemporalOperation): void {
  if (!isTemporalOperationAllowed(phase, operation)) throw new Error(`TEMPORAL_OPERATION_DENIED:${phase}:${operation}`)
}
