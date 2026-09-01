import { useState } from 'react';
import { runInterviewStudioDemo } from './run-interview-demo';
import { STUDIO_SCENE } from './studio-scene';
import { renderSceneSvg } from '../../spatial/svg-capture';
import type { SpatialConstructionReceipt } from '../../spatial/receipt';

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

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
    <section aria-labelledby="spatial-webmcp-title" className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[1.4fr_.8fr]">
      <div className="overflow-hidden rounded-2xl border border-cyan-400/30 bg-black shadow-[0_0_40px_rgba(25,230,230,.12)]">
        <div className="flex items-center justify-between border-b border-cyan-400/20 px-5 py-3 font-mono text-xs tracking-[.18em] text-cyan-300">
          <span>SPATIAL WEBMCP // STUDIO</span>
          <span>{receipt ? `VERIFIED ${receipt.verification.score}` : 'UNVERIFIED'}</span>
        </div>
        <img src={captureRef} alt="Structured interview studio scene capture" className="aspect-video w-full object-cover" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#05070a] p-5 text-white">
        <p className="font-mono text-xs tracking-[.18em] text-cyan-300">CLOSED-LOOP CONSTRUCTION</p>
        <h2 id="spatial-webmcp-title" className="mt-3 text-3xl font-semibold">Reconfigure this studio for an interview.</h2>
        <p className="mt-3 text-sm text-white/60">Inspect → bounded mutation → capture → deterministic verify → receipt.</p>

        <button
          type="button"
          onClick={run}
          disabled={running}
          className="mt-6 w-full rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-4 py-3 font-mono text-sm text-cyan-200 transition hover:bg-cyan-300/20 disabled:opacity-50"
        >
          {running ? 'RUNNING CLOSED LOOP…' : 'RUN AGENT CONSTRUCTION LOOP'}
        </button>

        {receipt ? (
          <div className="mt-5 space-y-3 font-mono text-xs">
            <div className="flex justify-between"><span className="text-white/50">RECEIPT</span><span>{receipt.receiptId}</span></div>
            <div className="flex justify-between"><span className="text-white/50">STATE</span><span className={receipt.verification.passed ? 'text-cyan-300' : 'text-red-400'}>{receipt.verification.passed ? 'PASS' : 'CORRECT'}</span></div>
            <div className="flex justify-between"><span className="text-white/50">VERSION</span><span>{receipt.beforeVersion} → {receipt.afterVersion}</span></div>
            <div className="flex justify-between"><span className="text-white/50">MUTATIONS</span><span>{receipt.mutations.length}</span></div>
          </div>
        ) : (
          <div className="mt-5 border-l-2 border-red-500/70 pl-3 font-mono text-xs text-white/50">Generated ≠ Verified</div>
        )}
      </div>
    </section>
  );
}

export default SpatialStudioDemo;
