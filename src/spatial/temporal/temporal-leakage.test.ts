import { describe, expect, it } from 'vitest'
import { applySpatialMutation } from '../scene-state'
import { assertTemporalOperationAllowed } from './leakage-guard'
import { STUDIO_SCENE } from '../../demo/studio/studio-scene'

describe('Temporal Control Leakage Guard', () => {
  it('blocks mutation operations outside ACT', () => {
    expect(() => assertTemporalOperationAllowed('OBSERVE', 'translate')).toThrow('TEMPORAL_OPERATION_DENIED')
    expect(() => assertTemporalOperationAllowed('SEE_AGAIN', 'intensity')).toThrow('TEMPORAL_OPERATION_DENIED')
    expect(() => assertTemporalOperationAllowed('VERIFY', 'translate')).toThrow('TEMPORAL_OPERATION_DENIED')
    expect(() => assertTemporalOperationAllowed('ACT', 'translate')).not.toThrow()
  })
  it('denial leaves the restricted scene unchanged', () => {
    const before = structuredClone(STUDIO_SCENE)
    expect(() => applySpatialMutation(STUDIO_SCENE, { kind: 'material', objectId: 'mic-01', material: 'restricted-finish' })).toThrow('CAPABILITY_DENIED')
    expect(STUDIO_SCENE).toEqual(before)
  })
})
