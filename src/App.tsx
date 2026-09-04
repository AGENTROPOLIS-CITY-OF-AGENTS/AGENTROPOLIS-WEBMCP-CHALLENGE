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
import { ParallaxExplainer } from './demo/ParallaxExplainer'
import { ParallaxEnvironment } from './demo/ParallaxEnvironment'
import { useReducedMotion } from './hooks/useReducedMotion'
import { parallaxMedia } from './media/parallaxMedia'
import { LoopVideoCarousel } from './media/LoopVideoCarousel'
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
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 })
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

  const openDemoSection = () => {
    document.getElementById('interactive-demo')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <main className="app-shell">
      <section className="parallax-hero" aria-labelledby="parallax-hero-title">
        <ParallaxEnvironment className="hero-environment" videoSrc={parallaxMedia.hero} posterSrc={parallaxMedia.fallbackImage} opacity={.72} dim={.2} reducedMotion={reducedMotion} label="PARALLAX spatial infrastructure world" />
        <div className="parallax-hero-scrim" aria-hidden="true" />
        <div className="parallax-hero-content" style={{ transform: `perspective(900px) rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg)` }} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setHeroTilt({ x: ((event.clientX - rect.left) / rect.width - .5) * 1.2, y: -((event.clientY - rect.top) / rect.height - .5) * 1.2 }) }} onPointerLeave={() => setHeroTilt({ x: 0, y: 0 })}>
          <p className="parallax-eyebrow">AGENTROPOLIS // SPATIAL CONTROL LAYER</p>
          <h1 id="parallax-hero-title" className="parallax-wordmark" aria-label="PARALLAX">
            <span className="parallax-wordmark-layer parallax-wordmark-extrusion" aria-hidden="true">PARALLAX</span>
            <span className="parallax-wordmark-layer parallax-wordmark-cyan" aria-hidden="true">PARALLAX</span>
            <span className="parallax-wordmark-layer parallax-wordmark-red" aria-hidden="true">PARALLAX</span>
            <span className="parallax-wordmark-layer parallax-wordmark-face" aria-hidden="true">PARALLAX</span>
          </h1>
          <p className="parallax-subtitle">Spatial MCP for autonomous agents</p>
          <p className="parallax-lede">Select a 3D object. PARALLAX exposes only the agent capabilities allowed for that object, then verifies the result.</p>
          <p className="parallax-protocol">SELECT <span>→</span> REQUEST <span>→</span> AUTHORIZE <span>→</span> ACT <span>→</span> SEE AGAIN <span>→</span> VERIFY <span>→</span> RECEIPT</p>
          <div className="parallax-hero-actions">
            <button className="parallax-primary-cta" type="button" onClick={openDemoSection}>RUN LIVE DEMO</button>
            <a className="parallax-secondary-cta" href="#the-loop">HOW PARALLAX WORKS</a>
          </div>
        </div>
        <div className="hero-capability-stack" aria-label="PARALLAX capabilities">
          {[['OBSERVE', 'Scan environment'], ['ACT', 'Make authorized changes'], ['SEE AGAIN', 'Re-observe results'], ['VERIFY', 'Check against objective'], ['RECEIPT', 'Immutable audit trail']].map(([title, copy], index) => <div className={`hero-capability hero-capability-${index % 2 ? 'red' : 'cyan'}`} key={title}><strong>{title}</strong><span>{copy}</span></div>)}
        </div>
      </section>

      <section className="runtime-strip" aria-label="Live PARALLAX runtime status">
        <span>WEBMCP STATUS <b>{state.toolStatus === 'registered' ? 'CONNECTED' : 'DISCONNECTED'}</b></span>
        <span>RUNTIME MODE <b>GOVERNED</b></span>
        <span>POLICY <b>{state.decision?.effect ?? 'PENDING'}</b></span>
        <span>LAST RECEIPT <b>{state.activeReceipt?.receiptId ?? 'NONE'}</b></span>
        <a href="#technical-architecture">INSPECT RECEIPTS →</a>
      </section>
      {import.meta.env.DEV ? <aside className="parallax-media-diagnostic" aria-label="Development media diagnostic"><strong>DEV MEDIA</strong><span>CURRENT_SECTION hero</span><span>CURRENT_MEDIA_PURPOSE hero</span><span>CURRENT_ASSET parallax-world-motion-01.mp4</span><span>PLAYING {reducedMotion ? 'NO' : 'AUTO'}</span><span>FALLBACK_ACTIVE {reducedMotion ? 'YES' : 'NO'}</span></aside> : null}

      <section className="capability-strip" aria-label="PARALLAX capabilities overview">
        {[['3D SPATIAL AWARENESS', 'Understand complex environments'], ['GOVERNED ACTIONS', 'Only authorized changes are allowed'], ['VERIFIABLE OUTCOMES', 'Every change is verified and provable'], ['AUDITABLE RECEIPTS', 'Immutable receipts for accountability']].map(([title, copy]) => <div key={title}><strong>{title}</strong><span>{copy}</span></div>)}
      </section>

      <section id="the-loop" className="parallax-loop" aria-labelledby="loop-title">
        <LoopVideoCarousel reducedMotion={reducedMotion} />
        <div className="section-intro"><p className="section-kicker">WHAT PARALLAX DOES</p><h2 id="loop-title">Observe. Act. See again. Prove it.</h2><p>PARALLAX gives autonomous agents governed spatial agency: the ability to observe, change, re-observe, verify, and prove what happened inside a 3D environment.</p><p>AI agents can change worlds. PARALLAX makes those changes bounded, visible, and verifiable.</p></div>
        <div className="loop-steps">
          {[
            ['01', 'OBSERVE', 'Agent reads scene state.'],
            ['02', 'ACT', 'Authorized spatial mutation.'],
            ['03', 'SEE AGAIN', 'Agent re-observes changed state.'],
            ['04', 'VERIFY', 'Result compared against objective.'],
            ['05', 'RECEIPT', 'Auditable proof is issued.'],
          ].map(([number, title, copy]) => <div className="loop-step" key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}
        </div>
        <ParallaxExplainer reducedMotion={reducedMotion} />
        <div className="parallax-live-cta"><button className="parallax-primary-cta" type="button" onClick={openDemoSection}>RUN THE LIVE PARALLAX DEMO</button></div>
      </section>

      <section className="world-viewport" aria-label="Interactive 3D governed execution world">
        <ParallaxEnvironment className="world-environment" videoSrc={parallaxMedia.systemView} posterSrc={parallaxMedia.establishingImage} opacity={.34} blur={1.5} dim={.12} reducedMotion={reducedMotion} />
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

      <section id="technical-architecture" className="technical-corridor-shell" aria-label="Technical architecture">
      <UniversalDistrictShell
        layout="standard"
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
      </section>

      <section id="interactive-demo" className="parallax-demo-section" aria-labelledby="demo-title">
        <div className="section-intro"><p className="section-kicker">INTERACTIVE CONSTRUCTION</p><h2 id="demo-title">RUN THE CLOSED-LOOP DEMO</h2><p>Inspect a studio, authorize a bounded mutation, see the changed scene, and receive deterministic proof.</p></div>
        <SpatialStudioDemo reducedMotion={reducedMotion} />
      </section>

      <section className="parallax-governance" aria-labelledby="governance-title">
        <ParallaxEnvironment videoSrc={parallaxMedia.governance} posterSrc={parallaxMedia.establishingImage} opacity={.24} blur={2} dim={.12} reducedMotion={reducedMotion} />
        <div className="section-intro"><p className="section-kicker">GOVERNANCE CORRIDOR</p><h2 id="governance-title">Authority before execution.</h2></div>
        <div className="governance-grid">
          {[['IDENTITY', 'Who is acting?'], ['MANDATE', 'What is authorized?'], ['POLICY', 'Should it proceed?'], ['RECEIPT', 'What can be proven?']].map(([title, copy]) => <div className="governance-item" key={title}><strong>{title}</strong><p>{copy}</p></div>)}
        </div>
        <a className="technical-link" href="/AGENTROPOLIS-WEBMCP-CHALLENGE/docs/ARCHITECTURE.md">VIEW TECHNICAL DETAILS <span>↗</span></a>
      </section>

      <section className="parallax-proof" aria-labelledby="proof-title">
        <ParallaxEnvironment videoSrc={parallaxMedia.receipt} posterSrc={parallaxMedia.fallbackImage} opacity={.2} blur={1} dim={.12} reducedMotion={reducedMotion} />
        <div className="section-intro"><p className="section-kicker">PROOF, NOT PROMISE</p><h2 id="proof-title">Generated ≠ Verified</h2><p>Every successful path binds mutation, capture, verification, and receipt. Denied paths terminate without execution.</p></div>
        <div className="proof-strip"><span>DETERMINISTIC VERIFIER</span><span>FAIL-CLOSED DENIAL</span><span>CAPTURE-BOUND RECEIPTS</span><span>26 TESTS PASSING</span></div>
      </section>

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
            <SpatialStudioDemo reducedMotion={reducedMotion} />
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
