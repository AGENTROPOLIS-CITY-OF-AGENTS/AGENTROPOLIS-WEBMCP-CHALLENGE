import { describe, expect, it } from 'vitest'
import { cameraModeForPhase } from './camera-director'
import { objectiveToTemporalPlan } from './objective-adapter'
import { allowedOperationsForPhase, isTemporalOperationAllowed } from './leakage-guard'
import { INTERVIEW_TEMPORAL_PLAN, temporalStepAt } from './temporal-plan'
import { STUDIO_SCENE } from '../../demo/studio/studio-scene'

describe('temporal control layer', () => {
  it('exposes bounded operations per phase', () => {
    expect(allowedOperationsForPhase('OBSERVE')).toEqual(['inspect', 'capture'])
    expect(allowedOperationsForPhase('ACT')).toEqual(['translate', 'rotate', 'intensity'])
    expect(allowedOperationsForPhase('VERIFY')).toEqual(['verify'])
    expect(isTemporalOperationAllowed('SEE_AGAIN', 'translate')).toBe(false)
    expect(isTemporalOperationAllowed('RECEIPT', 'verify')).toBe(false)
  })
  it('routes elapsed time to the intended step', () => {
    expect(temporalStepAt(INTERVIEW_TEMPORAL_PLAN, 0).phase).toBe('OBSERVE')
    expect(temporalStepAt(INTERVIEW_TEMPORAL_PLAN, 2500).phase).toBe('ACT')
    expect(temporalStepAt(INTERVIEW_TEMPORAL_PLAN, 7500).phase).toBe('VERIFY')
  })
  it('rejects unknown objectives without fabricating a plan', () => {
    expect(objectiveToTemporalPlan('Build a castle', STUDIO_SCENE).supported).toBe(false)
    expect(objectiveToTemporalPlan('Reconfigure this studio for an interview.', STUDIO_SCENE).plan).toHaveLength(5)
  })
  it('maps protocol phases to controlled camera modes', () => {
    expect(cameraModeForPhase('OBSERVE')).toBe('wide')
    expect(cameraModeForPhase('ACT')).toBe('trackTarget')
    expect(cameraModeForPhase('SEE_AGAIN')).toBe('comparison')
    expect(cameraModeForPhase('RECEIPT')).toBe('pullback')
  })
})
