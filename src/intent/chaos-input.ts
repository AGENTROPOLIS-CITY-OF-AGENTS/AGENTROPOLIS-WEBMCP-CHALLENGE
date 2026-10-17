/**
 * CHAOS INPUT -> Agentropolis Intent Protocol (AIP) v0.1.
 * Observation is not identity, inferred intent is not consent, and an
 * intent is NOT an authorization or permission decision.
 *
 * No WebMCP, OS automation, wallet, or network execution exists in this module.
 */
export type InputMode = 'gesture' | 'pointer' | 'keyboard' | 'touch' | 'xr' | 'accessibility'
export type DemoVerb = 'inspect' | 'select' | 'stop' | 'approve' | 'reject' | 'expand' | 'compress'
export type GestureName = 'POINT' | 'AIR_TAP' | 'PALM_STOP' | 'SWIPE_RIGHT' | 'SWIPE_LEFT' | 'PINCH' | 'SPREAD'
export type Landmark = { x: number; y: number; z?: number }

export interface AipIntent {
  version: '0.1'
  id: string
  verb: DemoVerb
  actor: { identity: string; inputMode: InputMode }
  target: { type: 'object'; id: string }
  authority: { requiresConfirmation: boolean; riskClass: 'low' | 'high' }
  context: { source: 'chaos-input'; verificationStatus: 'experimental'; recognitionConfidence?: number }
}

export interface SourceContext {
  id: string
  identity: string
  targetId: string
  inputMode: InputMode
}

const gestureVerb: Record<GestureName, DemoVerb> = {
  POINT: 'inspect',
  AIR_TAP: 'select', // explicit accessible binding for screen controls; configurable per surface
  PALM_STOP: 'stop',
  SWIPE_RIGHT: 'approve',
  SWIPE_LEFT: 'reject',
  PINCH: 'compress',
  SPREAD: 'expand',
}

/** Pure constructor shared by keyboard/pointer/gesture adapters. */
export function makeIntent(source: SourceContext, verb: DemoVerb, confidence?: number): AipIntent | null {
  if (!source.id.trim() || !source.identity.trim() || !source.targetId.trim()) return null
  if (confidence !== undefined && (!Number.isFinite(confidence) || confidence < 0 || confidence > 1)) return null
  const consequential = verb === 'approve' || verb === 'reject'
  return {
    version: '0.1',
    id: source.id,
    verb,
    actor: { identity: source.identity, inputMode: source.inputMode },
    target: { type: 'object', id: source.targetId },
    authority: { requiresConfirmation: consequential, riskClass: consequential ? 'high' : 'low' },
    context: {
      source: 'chaos-input',
      verificationStatus: 'experimental',
      ...(confidence === undefined ? {} : { recognitionConfidence: confidence }),
    },
  }
}

/** Reject ambiguous recognition. Gesture signals never authorize tool execution. */
export function gestureToIntent(
  source: Omit<SourceContext, 'inputMode'> & { inputMode?: 'gesture' | 'xr' },
  name: GestureName,
  confidence: number,
): AipIntent | null {
  const consequential = name === 'SWIPE_RIGHT' || name === 'SWIPE_LEFT'
  const minimum = consequential ? 0.95 : 0.85
  if (!Number.isFinite(confidence) || confidence < minimum || confidence > 1) return null
  return makeIntent({ ...source, inputMode: source.inputMode ?? 'gesture' }, gestureVerb[name], confidence)
}

/** The same AIP constructor for non-camera accessible controls. */
export function controlToIntent(
  source: Omit<SourceContext, 'inputMode'>,
  mode: 'keyboard' | 'pointer' | 'touch' | 'accessibility',
  verb: 'inspect' | 'select' | 'stop',
): AipIntent | null {
  return makeIntent({ ...source, inputMode: mode }, verb)
}

export function pointDistance(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Deterministic landmarks classifier for a *demo*, not affect/emotion inference.
 * 21 landmarks are expected. Only palm-stop, air-tap, and point are recognized.
 */
export function classifyHand(landmarks: Landmark[]): GestureName | null {
  if (landmarks.length !== 21 || landmarks.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) return null
  const wrist = landmarks[0]
  const tips = [4, 8, 12, 16, 20]
  const mids = [3, 6, 10, 14, 18]
  const extended = tips.map((index, i) =>
    pointDistance(landmarks[index], wrist) > pointDistance(landmarks[mids[i]], wrist) * 1.14)
  if (extended.filter(Boolean).length === 5) return 'PALM_STOP'
  if (pointDistance(landmarks[4], landmarks[8]) < 0.055) return 'AIR_TAP'
  return extended[1] ? 'POINT' : null
}
