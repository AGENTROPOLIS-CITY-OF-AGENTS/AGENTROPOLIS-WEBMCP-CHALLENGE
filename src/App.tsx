import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  AgentCredential,
  DistrictBadge,
  ExecutionReceipt,
  OperationCard,
  SectionTitle,
  SignalCard,
  StatusChip,
  ToolCallsSection,
  UniversalDistrictShell,
} from '../packages/ui-vault/src'
import { SceneBoundary } from './SceneBoundary'
import { StaticWorldFallback } from './StaticWorldFallback'
import { governanceEngine } from './core/engine'
import { registerWebMcpTool } from './core/webmcp'
import { registerSpatialWebMcpTool } from './webmcp/register-spatial-webmcp'
import { STUDIO_SCENE } from './demo/studio/studio-scene'
import { verifyInterviewStudio } from './spatial/deterministic-verifier'
import { SpatialStudioDemo } from './demo/studio/SpatialStudioDemo'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useWorldState } from './hooks/useWorldState'
import type { WorldMode } from './world/WorldModeSelector'

const WorldScene = lazy(() => import('./world/WorldScene').then((module) => ({ default: module.WorldScene })))

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function statusTone(label: string): 'default' | 'active' | 'allow' | 'deny' | 'review' | 'warning' {
  const normalized = label.trim().toLowerCase()
  if (['registered', 'webgl2', 'webgl1', 'discovered', 'identified', 'executing', 'receipted'].includes(normalized)) return 'active'
  if (['allow', 'executed'].includes(normalized)) return 'allow'
  if (['deny', 'denied', 'error'].includes(normalized)) return 'deny'
  if (['awaiting_approval', 'approval', 'review', 'unsupported', 'static', 'policy_decided'].includes(normalized)) return 'review'
  if (['warning'].includes(normalized)) return 'warning'
  return 'default'
}

export function App() {
  const state = useWorldState()
  const [mode, setMode] = useState<WorldMode>('GUIDED')
  const [reducedMotion, setReducedMotion] = useReducedMotion()
  const [rendererMode, setRendererMode] = useState(() => supportsWebGl() ? 'INITIALIZING' : 'STATIC')
  const [notice, setNotice] = useState('')
  const [spatialDemoOpen, setSpatialDemoOpen] = useState(false)
  const demoStarted = useRef(false)
  const initialReducedMotion = useRef(reducedMotion)
  const spatialGraphRef = useRef(STUDIO_SCENE)
  const webgl = rendererMode !== 'STATIC'

  useEffect(() => {
    const controller = new AbortController()
    let timer = 0

    Promise.all([
      registerWebMcpTool(governanceEngine, controller.signal),
      registerSpatialWebMcpTool(document.modelContext, {
        graph: spatialGraphRef.current,
        setGraph: (next) => {
          spatialGraphRef.current = next
        },
        verifyScene: async (objective, capture) => verifyInterviewStudio(spatialGraphRef.current, capture, objective),
      }, controller.signal),
    ]).catch((error) => console.warn('WebMCP registration unavailable.', error instanceof Error ? error.message : error))
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
      if (event.key === 'Escape') setSpatialDemoOpen(false)
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
  const runtimeLabel = state.toolStatus === 'registered' ? 'WEBMCP LIVE' : state.toolStatus === 'unsupported' ? 'LOCAL GOVERNED MODE' : state.toolStatus === 'error' ? 'DISCOVERY ERROR' : 'DISCOVERY CHECK'
  const phaseLabel = state.phase.replaceAll('_', ' ')
  const headerStatus = state.decision?.effect ?? state.toolStatus
  const receipt = state.activeReceipt
  const requestMeta = state.request
    ? [
        `tool:${state.request.tool}`,
        `district:${String(state.request.arguments.district)}`,
        `source:${state.source ?? 'system'}`,
      ]
    : ['awaiting governed request']
  const toolCalls = state.eventLog.slice(-3).reverse().map((event) => ({
    id: event.id,
    tool: runtimeLabel,
    phase: event.phase,
    status: event.phase,
    summary: event.message,
  }))

  return (
    <main className="app-shell">
      <section className="world-viewport" aria-label="Interactive 3D governed execution world">
        {webgl ? (
          <SceneBoundary fallback={<StaticWorldFallback state={state} />} onError={() => setRendererMode('STATIC')}>
            <Suspense fallback={<StaticWorldFallback state={state} />}>
              <WorldScene
                state={state}
                reducedMotion={reducedMotion}
                mode={mode}
                onModeChange={setMode}
                onExplore={() => setMode('EXPLORE')}
                onScenario={launchScenario}
                onRenderer={setRendererMode}
              />
            </Suspense>
          </SceneBoundary>
        ) : <StaticWorldFallback state={state} />}
      </section>

      <UniversalDistrictShell
        layout="overlay"
        district="webmcp"
        header={{
          district: 'webmcp',
          eyebrow: 'AGENTROPOLIS // OBSIDIAN SIGNAL SYSTEM',
          title: 'Governed WebMCP Corridor',
          subtitle: state.narration,
          status: headerStatus,
          actions: (
            <div className="hud-status-stack" aria-label="Runtime status">
              <StatusChip label={runtimeLabel} tone={statusTone(state.toolStatus)} />
              <StatusChip label={rendererMode} tone={statusTone(rendererMode)} />
              <StatusChip label={phaseLabel} tone={statusTone(state.phase)} />
            </div>
          ),
        }}
        nav={(['GUIDED', 'EXPLORE', 'INSPECT'] as WorldMode[]).map((value) => ({
          id: value,
          label: value,
        }))}
        activeNavId={mode}
        onSelectNav={(value) => setMode(value as WorldMode)}
        footer={{
          district: 'webmcp',
          summary: lastEvent?.message ?? state.narration,
          status: receipt?.status ?? headerStatus,
          meta: [
            state.source === 'guided-demo' ? 'guided-demo' : state.source ?? 'system',
            `receipts:${state.receipts.length}`,
            reducedMotion ? 'motion:reduced' : 'motion:full',
            mode === 'GUIDED' ? 'guidance:interruptible' : 'manual-exploration',
          ],
        }}
        rail={
          <div className="hud-rail">
            <SectionTitle district="webmcp" kicker="Consumer Integration" title="Spatial Operations" aside={<DistrictBadge district="webmcp" label="WebMCP" />} />
            <SignalCard district="webmcp" eyebrow="Runtime Boundary" title="3D World Remains Primary" status={runtimeLabel}>
              <p className="hud-copy">The shell is consuming Creator / Construction contracts as operational chrome around the corridor. The autonomous world remains the interface.</p>
              <div className="hud-action-row">
                <button className="hud-action-button" aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>
                  {reducedMotion ? 'Reduced Motion On' : 'Reduce Motion'}
                </button>
                <button className="hud-action-button" aria-haspopup="dialog" onClick={() => setSpatialDemoOpen(true)}>
                  Run Spatial WebMCP Demo
                </button>
              </div>
            </SignalCard>
            <OperationCard
              district="webmcp"
              stage={phaseLabel}
              title={state.request ? state.request.action.replaceAll('_', ' ') : 'Awaiting Request'}
              summary={state.request ? state.narration : 'Autonomous guidance will inject or accept a governed request at the Gateway.'}
              status={receipt?.status ?? state.decision?.effect ?? state.phase}
              meta={requestMeta}
            >
              {state.request ? (
                <AgentCredential
                  actorId={state.request.actor.id}
                  actorType={state.request.actor.type}
                  mandate={state.request.mandate ?? 'none'}
                  trustLabel={state.decision?.effect ?? 'pending'}
                />
              ) : (
                <div className="hud-empty-state">
                  <StatusChip label="Awaiting Request" tone="review" />
                </div>
              )}
            </OperationCard>
            {receipt ? (
              <ExecutionReceipt
                receiptId={receipt.receiptId}
                decision={receipt.decision}
                status={receipt.status}
                actor={state.request?.actor.id ?? receipt.approvedBy ?? 'system'}
                summary={receipt.policyReasons[0] ?? 'Receipted outcome recorded.'}
              />
            ) : null}
            <ToolCallsSection title="Latest Corridor Events" calls={toolCalls} />
          </div>
        }
      >
        <div className="hud-viewport-spacer" aria-hidden="true" />
      </UniversalDistrictShell>

      {spatialDemoOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spatial WebMCP interview studio demo"
          style={{ position: 'fixed', inset: 0, zIndex: 120, overflow: 'auto', background: 'rgba(2,3,4,.92)', backdropFilter: 'blur(12px)', padding: 'clamp(18px,4vw,48px)' }}
        >
          <div style={{ margin: '0 auto', maxWidth: 1180 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="hud-action-button" onClick={() => setSpatialDemoOpen(false)}>Close Spatial Demo</button>
            </div>
            <SpatialStudioDemo />
          </div>
        </div>
      ) : null}

      {notice && <div className="notice" role="alert">{notice}</div>}
      <ol className="sr-only" aria-live="polite" aria-label="Governance event log">
        {state.eventLog.map((event) => <li key={event.id}>{event.phase}: {event.message}</li>)}
      </ol>
    </main>
  )
}
