import { useCallback, useEffect, useRef, useState } from 'react'
import { SceneBoundary } from './SceneBoundary'
import { StaticWorldFallback } from './StaticWorldFallback'
import { governanceEngine } from './core/engine'
import { registerWebMcpTool } from './core/webmcp'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useWorldState } from './hooks/useWorldState'
import { WorldScene } from './world/WorldScene'
import type { WorldMode } from './world/WorldModeSelector'

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function App() {
  const state = useWorldState()
  const [mode, setMode] = useState<WorldMode>('GUIDED')
  const [reducedMotion, setReducedMotion] = useReducedMotion()
  const [rendererMode, setRendererMode] = useState(() => supportsWebGl() ? 'INITIALIZING' : 'STATIC')
  const [notice, setNotice] = useState('')
  const demoStarted = useRef(false)
  const initialReducedMotion = useRef(reducedMotion)
  const webgl = rendererMode !== 'STATIC'

  useEffect(() => {
    const controller = new AbortController()
    let timer = 0

    registerWebMcpTool(governanceEngine, controller.signal)
      .catch((error) => console.warn('WebMCP registration unavailable.', error instanceof Error ? error.message : error))
      .finally(() => {
        if (!demoStarted.current) {
          demoStarted.current = true
          timer = window.setTimeout(() => {
            governanceEngine.submit({
              operation: 'inspect_district',
              actorId: 'hermes.warden',
              actorType: 'agent',
              mandate: 'observe-grid',
              district: 'gateway',
            }, 'guided-demo').catch(() => undefined)
          }, initialReducedMotion.current ? 250 : 900)
        }
      })

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === '1') setMode('GUIDED')
      if (event.key === '2') setMode('EXPLORE')
      if (event.key === '3') setMode('INSPECT')
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const launchScenario = useCallback(async (kind: 'allow' | 'approval' | 'deny') => {
    setNotice('')
    setMode('GUIDED')

    const input = kind === 'allow'
      ? { operation: 'inspect_district', mandate: 'observe-grid', district: 'vault' }
      : kind === 'approval'
        ? { operation: 'energize_trace', mandate: 'operate-grid', district: 'forge' }
        : { operation: 'energize_trace', mandate: 'none', district: 'policy' }

    try {
      await governanceEngine.submit({ ...input, actorId: 'visitor.agent', actorType: 'agent' }, 'visitor')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Request could not enter the corridor.')
    }
  }, [])

  const lastEvent = state.eventLog.at(-1)

  return (
    <main className="app-shell">
      <header className="minimal-hud">
        <div className="brand-lockup">
          <span className="brand-mark">A//</span>
          <div><strong>AGENTROPOLIS</strong><small>GOVERNED WebMCP CORRIDOR</small></div>
        </div>
        <div className="runtime-badges" aria-label="Runtime status">
          <span data-state={state.toolStatus}>{state.toolStatus === 'registered' ? 'WEBMCP LIVE' : state.toolStatus === 'unsupported' ? 'LOCAL MODE' : 'DISCOVERY CHECK'}</span>
          <span>{rendererMode}</span>
          <span>{state.phase}</span>
        </div>
        <div className="hud-controls">
          {(['GUIDED', 'EXPLORE', 'INSPECT'] as WorldMode[]).map((value) => (
            <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value}</button>
          ))}
          <button aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>REDUCED MOTION</button>
        </div>
      </header>

      <section className="world-viewport" aria-label="Interactive 3D governed execution world">
        {webgl ? (
          <SceneBoundary fallback={<StaticWorldFallback state={state} />} onError={() => setRendererMode('STATIC')}>
            <WorldScene
              state={state}
              reducedMotion={reducedMotion}
              mode={mode}
              onModeChange={setMode}
              onExplore={() => setMode('EXPLORE')}
              onScenario={launchScenario}
              onRenderer={setRendererMode}
            />
          </SceneBoundary>
        ) : <StaticWorldFallback state={state} />}
      </section>

      <footer className="event-ticker">
        <span>{state.source === 'guided-demo' ? 'CLEARLY LABELED DEMO' : state.source?.toUpperCase() ?? 'SYSTEM'}</span>
        <p>{lastEvent?.message ?? state.narration}</p>
        <small>{mode === 'GUIDED' ? 'Drag, pinch, or scroll to interrupt guidance.' : 'Keys 1 / 2 / 3 switch world modes.'}</small>
      </footer>
      {notice && <div className="notice" role="alert">{notice}</div>}
      <ol className="sr-only" aria-live="polite" aria-label="Governance event log">
        {state.eventLog.map((event) => <li key={event.id}>{event.phase}: {event.message}</li>)}
      </ol>
    </main>
  )
}
