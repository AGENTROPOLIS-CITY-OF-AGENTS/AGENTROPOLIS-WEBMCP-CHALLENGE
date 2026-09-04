import type { TemporalPhase } from './temporal-plan'

export type CameraDirectorMode = 'wide' | 'trackTarget' | 'comparison' | 'hold' | 'pullback'
export function cameraModeForPhase(phase: TemporalPhase): CameraDirectorMode {
  if (phase === 'OBSERVE') return 'wide'
  if (phase === 'ACT' || phase === 'DENIED') return 'trackTarget'
  if (phase === 'SEE_AGAIN' || phase === 'VERIFY') return 'comparison'
  if (phase === 'RECEIPT') return 'pullback'
  return 'hold'
}
