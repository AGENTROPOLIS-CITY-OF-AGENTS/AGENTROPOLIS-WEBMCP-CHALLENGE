import { useState } from 'react';
import { ParallaxEnvironment } from '../ParallaxEnvironment';
import { runInterviewStudioDemo } from './run-interview-demo';
import { STUDIO_SCENE } from './studio-scene';
import { StudioScene3D, type DemoPhase } from './StudioScene3D';
import { applySpatialMutation } from '../../spatial/scene-state';
import type { SpatialConstructionReceipt } from '../../spatial/receipt';
import type { WorldGraph } from '../../spatial/world-graph';
import { cameraModeForPhase } from '../../spatial/temporal/camera-director';
import { INTERVIEW_TEMPORAL_PLAN, type TemporalPhase } from '../../spatial/temporal/temporal-plan';
import { parallaxMedia } from '../../media/parallaxMedia';

const phaseCopy: Record<DemoPhase, string> = { IDLE: 'Ready to inspect the studio.', OBSERVE: 'Reading spatial state', ACT: 'Applying authorized changes', 'SEE AGAIN': 'Re-observing changed state', VERIFY: 'Evaluating objective', RECEIPT: 'Verified outcome recorded', DENIED: 'Authority boundary enforced' };
const corridorStages = ['REQUEST', 'IDENTITY', 'MANDATE', 'POLICY', 'AUTHORIZATION', 'EXECUTION', 'RECEIPT'];

export function SpatialStudioDemo({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [graph, setGraph] = useState<WorldGraph>(STUDIO_SCENE);
  const [before, setBefore] = useState<WorldGraph | null>(null);
  const [receipt, setReceipt] = useState<SpatialConstructionReceipt | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('IDLE');
  const [running, setRunning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [systemView, setSystemView] = useState(false);
  const [beforeHold, setBeforeHold] = useState(false);
  const [afterHold, setAfterHold] = useState(false);
  const currentTarget = phase === 'ACT' ? 'KEY LIGHT' : phase === 'OBSERVE' ? 'CAMERA · KEY LIGHT · MICROPHONE' : phase === 'DENIED' ? 'RESTRICTED OBJECT' : '—';
  const action = phase === 'ACT' ? 'Move + rotate' : phase === 'DENIED' ? 'Unauthorized material change' : '—';
  const selectedObject = selectedId === 'restricted-object' ? null : graph.objects.find((object) => object.id === selectedId);
  const capabilities = selectedObject?.permissions.filter((permission) => permission !== 'inspect' && permission !== 'capture') ?? [];
  const temporalPhase = (phase === 'SEE AGAIN' ? 'SEE_AGAIN' : phase) as TemporalPhase;
  const temporalStep = INTERVIEW_TEMPORAL_PLAN.find((step) => step.phase === temporalPhase);
  const corridorIndex = phase === 'IDLE' ? -1 : phase === 'OBSERVE' ? 3 : phase === 'ACT' ? 5 : phase === 'SEE AGAIN' || phase === 'VERIFY' ? 5 : phase === 'RECEIPT' ? 6 : 3;

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? Math.min(ms, 80) : ms));

  const run = async () => {
    if (running) return;
    setRunning(true); setCompleted(false); setReceipt(null); setBefore(graph); setBeforeHold(true); setAfterHold(false); setPhase('IDLE');
    await wait(2000); setBeforeHold(false); setPhase('OBSERVE');
    for (const target of ['chair-01', 'camera-01', 'key-light-01', 'mic-01']) {
      setSelectedId(target);
      await wait(520);
    }
    setSystemView(true); setPhase('ACT');
    const result = await runInterviewStudioDemo();
    setGraph(result.graph);
    setSelectedId('key-light-01');
    await wait(5200); setAfterHold(true);
    await wait(1400); setAfterHold(false);
    setSystemView(false); setPhase('SEE AGAIN');
    await wait(1000);
    setPhase('VERIFY');
    await wait(900);
    setReceipt(result.receipt); setSystemView(true); setPhase('RECEIPT');
    await wait(900);
    setSelectedId('restricted-object'); setSystemView(false); setPhase('OBSERVE');
    await wait(650);
    try { applySpatialMutation(result.graph, { kind: 'material', objectId: 'mic-01', material: 'restricted-finish' }); } catch { setPhase('DENIED'); }
    setSystemView(true); setCompleted(true); setRunning(false);
  };

  const deny = async () => {
    if (running) return;
    setRunning(true); setReceipt(null); setBefore(graph); setPhase('OBSERVE');
    await wait(650);
    try { applySpatialMutation(graph, { kind: 'material', objectId: 'mic-01', material: 'restricted-finish' }); } catch { setPhase('DENIED'); }
    setRunning(false);
  };

  return (
    <section className="spatial-demo" aria-labelledby="spatial-demo-title">
      <div className="spatial-demo-stage">
        <ParallaxEnvironment videoSrc={parallaxMedia.studio} posterSrc={parallaxMedia.establishingImage} opacity={.72} blur={.5} dim={.08} reducedMotion={reducedMotion} />
        <StudioScene3D graph={graph} before={before} phase={phase} reducedMotion={reducedMotion} selectedId={selectedId} onSelect={setSelectedId} systemView={systemView} />
        <div className="spatial-scene-overlay"><span>{beforeHold ? 'BEFORE' : afterHold ? 'AFTER' : phase}</span><strong>{beforeHold ? 'OBJECTIVE · PREPARE STUDIO FOR INTERVIEW' : afterHold ? 'OBJECTIVE SATISFIED · INSPECT THE RESULT' : phaseCopy[phase]}</strong></div>
        {beforeHold ? <div className="before-state-legend"><strong>BEFORE</strong><span>CHAIR · OFF TARGET</span><span>CAMERA · NOT AIMED</span><span>KEY LIGHT · MISALIGNED</span><span>MICROPHONE · TOO FAR</span></div> : null}
        {afterHold ? <div className="after-state-legend"><strong>AFTER</strong><span>CHAIR · ON INTERVIEW MARK</span><span>CAMERA · AIMED AT CHAIR</span><span>KEY LIGHT · ALIGNED</span><span>MICROPHONE · IN POSITION</span><small>CYAN GHOST = BEFORE · SOLID = AFTER</small></div> : null}
        {(['SEE AGAIN', 'VERIFY', 'RECEIPT'].includes(phase)) && before ? <div className="before-after-compare" aria-label="Before and after comparison"><div><strong>BEFORE</strong><span>Chair off mark · Camera away</span><span>Light misaligned · Mic too far</span></div><div><strong>AFTER</strong><span>Chair on mark · Camera aimed</span><span>Light aligned · Mic in position</span></div></div> : null}
        {phase === 'DENIED' ? <div className="denial-proof"><strong>DENIAL PROOF</strong><span>BEFORE == AFTER</span><span>NO WORLD MUTATION</span><span>DENIAL VERIFIED</span></div> : null}
        {phase !== 'IDLE' ? <div className="inline-corridor" aria-label="Governed WebMCP corridor progress"><p>PARALLAX CONTROL LAYER</p><div className="inline-corridor-rail">{corridorStages.map((stage, index) => <span key={stage} className={index === corridorIndex ? 'is-active' : index < corridorIndex ? 'is-complete' : ''}>{stage}</span>)}</div><small>{phase === 'DENIED' ? 'OUT OF SCOPE · REQUEST BLOCKED' : phase === 'ACT' ? 'CAPABILITY RELEASED · EXECUTION' : phase === 'RECEIPT' ? 'VERIFIED OUTCOME · RECEIPT VAULT' : 'REQUEST → IDENTITY → MANDATE → POLICY'}</small></div> : null}
      </div>
      <aside className="spatial-demo-panel">
        <p className="section-kicker">PARALLAX // LIVE CONSTRUCTION</p>
        <h2 id="spatial-demo-title">See the agent work.</h2>
        <dl className="spatial-demo-status">
          <div><dt>OBJECTIVE</dt><dd>Prepare the studio for a seated interview.</dd></div>
          <div><dt>SELECTED OBJECT</dt><dd>{selectedId ? selectedObject?.label ?? 'RESTRICTED OBJECT' : 'Select an object in the scene.'}</dd></div>
          <div><dt>DISCOVERED CAPABILITIES</dt><dd>{selectedId ? (capabilities.length ? capabilities.join(' · ') : 'NONE') : '—'}</dd></div>
          <div><dt>CURRENT STEP</dt><dd>{phase === 'IDLE' ? 'READY' : phase === 'RECEIPT' ? 'COMPLETE' : phase}</dd></div>
          <div><dt>CURRENT TARGET</dt><dd>{currentTarget}</dd></div>
          <div><dt>ACTION</dt><dd>{action}</dd></div>
          <div><dt>VERIFICATION</dt><dd>{receipt?.verification.status ?? (phase === 'IDLE' || phase === 'DENIED' ? 'NOT RUN' : 'PENDING')}</dd></div>
          <div><dt>RECEIPT</dt><dd>{receipt ? receipt.receiptId : 'NONE'}</dd></div>
          {temporalStep ? <><div><dt>AGENT</dt><dd>{temporalStep.agentInstruction}</dd></div><div><dt>CAMERA</dt><dd>{temporalStep.cameraInstruction} · {cameraModeForPhase(temporalPhase)}</dd></div></> : null}
        </dl>
        <div className="temporal-timeline" aria-label="Temporal protocol timeline">{INTERVIEW_TEMPORAL_PLAN.map((step) => <span key={step.id} className={step.phase === temporalPhase ? 'is-active' : ''}>{step.phase.replace('_', ' ')}</span>)}</div>
        <div className="spatial-demo-actions">
          {selectedId === 'restricted-object' ? <button type="button" className="parallax-secondary-cta" onClick={deny} disabled={running}>TEST DENIAL</button> : <button type="button" className="parallax-primary-cta" onClick={run} disabled={running}>{running ? 'RUNNING…' : 'RUN LIVE DEMO'}</button>}
          <button type="button" className="parallax-secondary-cta" onClick={() => { setSelectedId(null); setCompleted(false); setPhase('IDLE') }} disabled={running}>RESET VIEW</button>
          <button type="button" className="parallax-secondary-cta" onClick={() => setSystemView((value) => !value)}>{systemView ? 'WORLD VIEW' : 'SYSTEM VIEW'}</button>
        </div>
        <p className="spatial-truth">Generated ≠ Verified</p>
        <p className="spatial-guide-proof">{beforeHold ? "Here's the studio before the agent acts. The chair, camera, light and microphone are not in their interview positions." : phase === 'ACT' ? 'The authorized spatial operator is changing the actual scene state.' : phase === 'SEE AGAIN' ? "PARALLAX doesn't trust the command result. It observes the world again." : phase === 'VERIFY' ? 'The new observed state is compared with the original objective.' : phase === 'RECEIPT' ? 'Only after verification do we issue the execution receipt.' : phase === 'DENIED' ? 'This action was not authorized. Notice the restricted object never moves.' : null}</p>
        {receipt ? <div className="spatial-receipt"><strong>VERIFIED</strong><span>{receipt.mutations.length} mutations · {receipt.receiptId}</span></div> : null}
        {completed ? <div className="spatial-demo-complete"><strong>PARALLAX DEMO COMPLETE</strong><span>AFTER · CHAIR ON MARK · CAMERA AIMED</span><span>KEY LIGHT ALIGNED · MICROPHONE IN POSITION</span><span>AUTHORIZED ACTION · EXECUTED + VERIFIED</span><span>UNAUTHORIZED ACTION · DENIED + UNCHANGED</span><span>RECEIPTS · RECORDED</span></div> : null}
      </aside>
    </section>
  );
}

export default SpatialStudioDemo;
