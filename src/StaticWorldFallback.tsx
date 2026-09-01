import { OperationCard, SignalCard, UniversalDistrictShell } from '../packages/ui-vault/src'
import type { WorldState } from './core/engine'

export function StaticWorldFallback({ state }: { state: WorldState }) {
  const zones = ['WEBMCP GATEWAY', 'IDENTITY PLAZA', 'MANDATE CORRIDOR', 'POLICY GATE', 'APPROVAL CHAMBER', 'EXECUTION FORGE', 'RECEIPT VAULT']
  return (
    <main className="static-fallback" role="img" aria-label="Static map of the AGENTROPOLIS governed execution corridor">
      <UniversalDistrictShell
        district="webmcp"
        header={{
          district: 'webmcp',
          eyebrow: 'Static Accessibility Fallback',
          title: 'The 3D world could not start',
          subtitle: 'The governance corridor remains mapped below. No WebGL verification claim is made for this environment.',
          status: 'STATIC',
        }}
        nav={zones.map((zone) => ({ id: zone, label: zone.replace(' ', ' ') }))}
        footer={{
          district: 'webmcp',
          summary: `Current application state: ${state.phase}`,
          status: state.phase,
          meta: [`receipts:${state.receipts.length}`, `tool:${state.toolStatus}`],
        }}
        rail={
          <SignalCard district="webmcp" eyebrow="Runtime Boundary" title="Fallback Surface" status={state.toolStatus}>
            <p className="hud-copy">This fallback preserves the same consumer visual canon while the 3D runtime is unavailable.</p>
          </SignalCard>
        }
      >
        <OperationCard
          district="webmcp"
          stage="Corridor Map"
          title="Governance District Sequence"
          summary="Gateway to Receipt Vault remains inspectable as a deterministic execution path."
          status={state.phase}
          meta={zones}
        />
      </UniversalDistrictShell>
    </main>
  )
}
