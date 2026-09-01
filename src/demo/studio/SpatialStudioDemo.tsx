import { useState } from 'react';
import { runInterviewStudioDemo } from './run-interview-demo';
import { STUDIO_SCENE } from './studio-scene';
import { renderSceneSvg } from '../../spatial/svg-capture';
import type { SpatialConstructionReceipt } from '../../spatial/receipt';

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const panelStyle = {
  border: '1px solid rgba(25,230,230,.24)',
  borderRadius: 16,
  background: '#05070a',
  boxShadow: '0 0 40px rgba(25,230,230,.10)',
} as const;

export function SpatialStudioDemo() {
  const [captureRef, setCaptureRef] = useState(svgDataUri(renderSceneSvg(STUDIO_SCENE)));
  const [receipt, setReceipt] = useState<SpatialConstructionReceipt | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      const result = await runInterviewStudioDemo();
      setCaptureRef(result.captureRef);
      setReceipt(result.receipt);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section
      aria-labelledby="spatial-webmcp-title"
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,.8fr)', gap: 20, width: '100%' }}
    >
      <div style={{ ...panelStyle, overflow: 'hidden', background: '#020304' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 16px', borderBottom: '1px solid rgba(25,230,230,.18)', color: '#19e6e6', font: '12px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '.14em' }}>
          <span>SPATIAL WEBMCP // STUDIO</span>
          <span>{receipt ? `VERIFIED ${receipt.verification.score}` : 'UNVERIFIED'}</span>
        </div>
        <img src={captureRef} alt="Structured interview studio scene capture" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
      </div>

      <div style={{ ...panelStyle, padding: 20, color: '#eef7f8' }}>
        <p style={{ margin: 0, color: '#19e6e6', font: '11px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '.16em' }}>CLOSED-LOOP CONSTRUCTION</p>
        <h2 id="spatial-webmcp-title" style={{ margin: '12px 0 0', fontSize: 28, lineHeight: 1.08 }}>Reconfigure this studio for an interview.</h2>
        <p style={{ margin: '12px 0 0', color: '#8b969e', fontSize: 14, lineHeight: 1.5 }}>Inspect → bounded mutation → capture → deterministic verify → receipt.</p>

        <button
          type="button"
          onClick={run}
          disabled={running}
          style={{ width: '100%', marginTop: 20, padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(25,230,230,.45)', background: 'rgba(25,230,230,.08)', color: '#bafefe', font: '12px ui-monospace, SFMono-Regular, Menlo, monospace', cursor: running ? 'wait' : 'pointer', opacity: running ? .6 : 1 }}
        >
          {running ? 'RUNNING CLOSED LOOP…' : 'RUN AGENT CONSTRUCTION LOOP'}
        </button>

        {receipt ? (
          <div style={{ marginTop: 18, display: 'grid', gap: 10, font: '11px ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: '#6f7c84' }}>RECEIPT</span><span>{receipt.receiptId}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: '#6f7c84' }}>STATE</span><span style={{ color: receipt.verification.passed ? '#19e6e6' : '#ff2a48' }}>{receipt.verification.passed ? 'PASS' : 'CORRECT'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: '#6f7c84' }}>VERSION</span><span>{receipt.beforeVersion} → {receipt.afterVersion}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: '#6f7c84' }}>MUTATIONS</span><span>{receipt.mutations.length}</span></div>
          </div>
        ) : (
          <div style={{ marginTop: 18, paddingLeft: 10, borderLeft: '2px solid rgba(255,42,72,.7)', color: '#8b969e', font: '11px ui-monospace, SFMono-Regular, Menlo, monospace' }}>Generated ≠ Verified</div>
        )}
      </div>
    </section>
  );
}

export default SpatialStudioDemo;
