import type { WorldState } from './core/engine'

export function StaticWorldFallback({ state }: { state: WorldState }) {
  const zones = ['WEBMCP GATEWAY', 'IDENTITY PLAZA', 'MANDATE CORRIDOR', 'POLICY GATE', 'APPROVAL CHAMBER', 'EXECUTION FORGE', 'RECEIPT VAULT']
  return (
    <main className="static-fallback" role="img" aria-label="Static map of the AGENTROPOLIS governed execution corridor">
      <p className="eyebrow">STATIC ACCESSIBILITY FALLBACK</p>
      <h1>The 3D world could not start.</h1>
      <p>The governance corridor remains mapped below. No WebGL verification claim is made for this environment.</p>
      <ol>{zones.map((zone) => <li key={zone}>{zone}</li>)}</ol>
      <p>Current application state: <strong>{state.phase}</strong></p>
    </main>
  )
}
