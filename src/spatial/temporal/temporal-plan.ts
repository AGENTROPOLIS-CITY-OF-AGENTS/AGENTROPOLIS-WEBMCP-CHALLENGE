export type TemporalPhase = 'OBSERVE' | 'ACT' | 'SEE_AGAIN' | 'VERIFY' | 'RECEIPT' | 'DENIED'
export type TemporalOperation = 'inspect' | 'translate' | 'rotate' | 'intensity' | 'capture' | 'verify' | 'receipt' | 'deny'

export interface TemporalActionStep {
  id: string
  phase: TemporalPhase
  startMs: number
  endMs: number
  targetId: string
  agentInstruction: string
  cameraInstruction: string
  allowedOperations: TemporalOperation[]
}

export const INTERVIEW_TEMPORAL_PLAN: TemporalActionStep[] = [
  { id: 'observe', phase: 'OBSERVE', startMs: 0, endMs: 2000, targetId: 'scene', agentInstruction: 'Scan CAMERA, CHAIR, KEY LIGHT, MICROPHONE.', cameraInstruction: 'Wide view, then subtle push toward inspected target.', allowedOperations: ['inspect'] },
  { id: 'act', phase: 'ACT', startMs: 2000, endMs: 5000, targetId: 'authorized-studio-objects', agentInstruction: 'Move chair, rotate camera, reposition key light, adjust microphone.', cameraInstruction: 'Track the currently mutated object from a three-quarter view.', allowedOperations: ['translate', 'rotate', 'intensity'] },
  { id: 'see-again', phase: 'SEE_AGAIN', startMs: 5000, endMs: 7000, targetId: 'scene', agentInstruction: 'Rescan the changed studio and capture the new state.', cameraInstruction: 'Return to a stable comparison angle.', allowedOperations: ['inspect'] },
  { id: 'verify', phase: 'VERIFY', startMs: 7000, endMs: 9000, targetId: 'verification-state', agentInstruction: 'Compare the current state against the interview objective.', cameraInstruction: 'Hold a stable before/after comparison view.', allowedOperations: ['verify'] },
  { id: 'receipt', phase: 'RECEIPT', startMs: 9000, endMs: 10000, targetId: 'receipt', agentInstruction: 'Emit the verified execution receipt.', cameraInstruction: 'Small pullback to reveal the receipt route.', allowedOperations: ['receipt'] },
]

export function temporalStepAt(plan: TemporalActionStep[], elapsedMs: number): TemporalActionStep {
  return plan.find((step) => elapsedMs >= step.startMs && elapsedMs < step.endMs) ?? plan[plan.length - 1]
}
