import { describe, expect, it } from 'vitest'
import { classifyHand, controlToIntent, gestureToIntent, makeIntent } from './chaos-input'

const source = { id: 'intent-1', identity: 'unverified.local-operator', targetId: 'spatial-demo.object-1' }

describe('CHAOS INPUT / AIP boundary', () => {
  it('maps camera and conventional input into the same canonical intent contract', () => {
    const gesture = gestureToIntent(source, 'AIR_TAP', 0.99)
    const pointer = controlToIntent(source, 'pointer', 'select')
    const keyboard = controlToIntent(source, 'keyboard', 'select')
    expect(gesture?.verb).toBe('select')
    expect(pointer?.verb).toBe(gesture?.verb)
    expect(keyboard?.verb).toBe(gesture?.verb)
    expect(gesture?.version).toBe('0.1')
    expect(pointer?.target).toEqual(gesture?.target)
    expect(keyboard?.authority).toEqual(gesture?.authority)
    expect(gesture?.actor.inputMode).toBe('gesture')
    expect(keyboard?.actor.inputMode).toBe('keyboard')
  })

  it('rejects low-confidence and malformed camera data instead of guessing', () => {
    expect(gestureToIntent(source, 'AIR_TAP', 0.5)).toBeNull()
    expect(gestureToIntent(source, 'AIR_TAP', Number.NaN)).toBeNull()
    expect(gestureToIntent(source, 'AIR_TAP', 1.1)).toBeNull()
    expect(classifyHand([])).toBeNull()
    expect(classifyHand(Array.from({ length: 21 }, () => ({ x: Number.NaN, y: 0 })))).toBeNull()
  })

  it('swipe approval never grants execution authority', () => {
    const intent = gestureToIntent(source, 'SWIPE_RIGHT', 0.99)
    expect(intent?.verb).toBe('approve')
    expect(intent?.authority).toEqual({ riskClass: 'high', requiresConfirmation: true })
    expect(intent?.context.verificationStatus).toBe('experimental')
    expect(gestureToIntent(source, 'SWIPE_RIGHT', 0.90)).toBeNull()
  })

  it('validates source identity and target supplied by the host, not the sensor', () => {
    expect(makeIntent({ id: '', identity: 'x', targetId: 'y', inputMode: 'gesture' }, 'select')).toBeNull()
    expect(makeIntent({ id: '1', identity: '', targetId: 'y', inputMode: 'gesture' }, 'select')).toBeNull()
    expect(makeIntent({ id: '1', identity: 'x', targetId: '', inputMode: 'gesture' }, 'select')).toBeNull()
  })

  it('models stop as a request, not confirmed runtime cancellation', () => {
    const stop = gestureToIntent(source, 'PALM_STOP', 0.99)
    expect(stop?.verb).toBe('stop')
    expect(stop).not.toHaveProperty('execution')
    expect(stop).not.toHaveProperty('receipt')
  })
})
