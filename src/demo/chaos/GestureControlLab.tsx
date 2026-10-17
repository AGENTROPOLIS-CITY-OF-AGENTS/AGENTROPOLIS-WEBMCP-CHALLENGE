import { useEffect, useRef, useState } from 'react'
import { classifyHand, controlToIntent, gestureToIntent, type AipIntent, type Landmark } from '../../intent/chaos-input'

const TARGETS = ['Identity Plaza', 'Mission Control', 'Commerce District'] as const
type HandDetector = { detectForVideo: (video: HTMLVideoElement, now: number) => { landmarks?: Landmark[][] }; close: () => void }
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
const MODULE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/+esm'

export function GestureControlLab() {
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const detector = useRef<HandDetector | null>(null)
  const frame = useRef<number | null>(null)
  const lastGesture = useRef({ name: '', at: 0, count: 0 })
  const cursor = useRef({ x: 0.5, y: 0.5 })
  const active = useRef(false)
  const [running, setRunning] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('Camera off. Keyboard and pointer controls work without camera.')
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
  const [selected, setSelected] = useState<string>(TARGETS[0])
  const [lastIntent, setLastIntent] = useState<AipIntent | null>(null)

  function emit(verb: 'inspect' | 'select' | 'stop', inputMode: 'gesture' | 'keyboard' | 'pointer', target: string, confidence = 0.99) {
    const source = { id: crypto.randomUUID(), identity: 'local-demo-operator', targetId: target }
    const intent = inputMode === 'gesture'
      ? gestureToIntent(source, verb === 'stop' ? 'PALM_STOP' : verb === 'select' ? 'AIR_TAP' : 'POINT', confidence)
      : controlToIntent(source, inputMode, verb)
    if (!intent) return
    setLastIntent(intent)
    if (verb === 'select') setSelected(target)
    if (verb === 'stop') setStatus('Local demo stopped by STOP intent. No remote agent was cancelled.')
  }

  function shutdown() {
    active.current = false
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    stream.current?.getTracks().forEach(track => track.stop())
    stream.current = null
    detector.current?.close()
    detector.current = null
    if (video.current) video.current.srcObject = null
    setRunning(false)
    setBusy(false)
  }

  useEffect(() => () => {
    active.current = false
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    stream.current?.getTracks().forEach(track => track.stop())
    detector.current?.close()
  }, [])

  async function start() {
    if (active.current || busy) return
    setBusy(true)
    setStatus('Requesting camera permission. Hand-model assets require network access.')
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640 }, audio: false })
      stream.current = media
      if (!video.current) throw new Error('Video surface unavailable')
      video.current.srcObject = media
      await video.current.play()
      const mp = await import(/* @vite-ignore */ MODULE_URL) as {
        FilesetResolver: { forVisionTasks: (wasm: string) => Promise<unknown> }
        HandLandmarker: { createFromOptions: (resolver: unknown, options: object) => Promise<HandDetector> }
      }
      const files = await mp.FilesetResolver.forVisionTasks(WASM_URL)
      detector.current = await mp.HandLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        runningMode: 'VIDEO', numHands: 1,
        minHandDetectionConfidence: 0.8, minHandPresenceConfidence: 0.8, minTrackingConfidence: 0.8,
      })
      active.current = true
      setRunning(true)
      setStatus('Experimental tracking active. Point to aim, pinch to select, open palm to stop.')
      const tick = () => {
        if (!active.current || !video.current || !detector.current) return
        if (video.current.readyState >= 2) {
          const hands = detector.current.detectForVideo(video.current, performance.now()).landmarks
          const points = hands?.[0]
          if (points) {
            const index = points[8]
            const x = Math.max(0, Math.min(1, 1 - index.x))
            const y = Math.max(0, Math.min(1, index.y))
            cursor.current = { x, y }
            setPosition({ x, y })
            const kind = classifyHand(points)
            if (kind && (kind === 'AIR_TAP' || kind === 'PALM_STOP')) {
              const prev = lastGesture.current
              const now = performance.now()
              if (prev.name === kind && now - prev.at < 350) prev.count++
              else prev.count = 1
              prev.name = kind
              prev.at = now
              if (prev.count >= 7) {
                prev.count = 0
                const target = TARGETS[Math.min(TARGETS.length - 1, Math.floor(cursor.current.x * TARGETS.length))]
                if (kind === 'PALM_STOP') {
                  emit('stop', 'gesture', target)
                  shutdown()
                  return
                }
                emit('select', 'gesture', target)
              }
            } else if (!kind) lastGesture.current.count = 0
          }
        }
        frame.current = requestAnimationFrame(tick)
      }
      frame.current = requestAnimationFrame(tick)
    } catch (error) {
      shutdown()
      setStatus('Camera/model unavailable: ' + (error instanceof Error ? error.message : 'unknown error') + '. Conventional controls remain usable.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="chaos-input-heading" style={{ margin: '24px auto', maxWidth: 960, padding: 24, border: '1px solid #18bdcf', borderRadius: 16, background: '#080e16', color: '#e8f6fa' }}>
      <p style={{ letterSpacing: 3, color: '#00d7e9' }}>AGENTROPOLIS // AIP / GIP</p>
      <h2 id="chaos-input-heading">CHAOS INPUT · Experimental Hand Control</h2>
      <p>Control this local demo using deliberate hand gestures, pointer, or keyboard. No financial, agent, OS, or WebMCP execution is connected.</p>
      <p role="status" aria-live="polite">{status}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" disabled={running || busy} onClick={() => void start()}>{busy ? 'Loading...' : 'Start Camera'}</button>
        <button type="button" onClick={() => { shutdown(); setStatus('Camera stopped and tracks released.') }}>Stop Camera</button>
        <button type="button" onClick={() => emit('stop', 'keyboard', selected)}>Emergency Stop (local demo)</button>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 12, background: '#111a29', border: '1px solid #294554' }}>
        <video ref={video} muted playsInline aria-label="Local camera preview" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', opacity: running ? 0.35 : 0 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: 14 }}>
          {TARGETS.map(target => <button key={target} type="button" aria-pressed={selected === target}
            onClick={() => emit('select', 'pointer', target)}
            onFocus={() => emit('inspect', 'keyboard', target)}
            style={{ border: selected === target ? '2px solid #04d8f0' : '1px solid #526170', background: selected === target ? '#173b4f99' : '#0d142699', color: 'white', fontSize: 'clamp(12px, 2vw, 18px)', cursor: 'pointer' }}>
            {target}{selected === target ? ' · SELECTED' : ''}
          </button>)}
        </div>
        {running && <div aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none', left: `${position.x * 100}%`, top: `${position.y * 100}%`, border: '3px solid #00ffff', width: 18, height: 18, borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px cyan' }} />}
      </div>
      <p>Point = aim · Pinch = select · Open palm = local stop. Mouse, touch, Tab and Enter are always available.</p>
      <p style={{ fontSize: 12, color: '#a3b9c7' }}>Privacy: camera permission is opt-in; no recording or gesture-derived emotion inference. First use downloads a third-party ML model. Accuracy, cross-device behavior and model supply chain remain unverified.</p>
      <details><summary>Inspect AIP intent proposal (not an execution receipt)</summary>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{lastIntent ? JSON.stringify(lastIntent, null, 2) : 'No intent yet'}</pre>
      </details>
    </section>
  )
}
