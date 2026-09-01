import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface ToolCallRecord {
  id: string
  tool: string
  phase: string
  status: string
  summary: string
}

export interface ToolCallsSectionProps {
  title?: string
  calls: ToolCallRecord[]
}

function ToolCallsSectionBase({ title = 'TOOL CALLS', calls }: ToolCallsSectionProps) {
  return (
    <VaultPanel title={title}>
      <div style={{ display: 'grid', gap: 8 }}>
        {calls.map((call) => (
          <article key={call.id} style={{ display: 'grid', gap: 6, padding: 12, border: '1px solid var(--av-border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: 12 }}>{call.tool}</strong>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: 'var(--av-cyan)' }}>{call.status}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--av-text-muted)' }}>{call.phase}</span>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>{call.summary}</p>
          </article>
        ))}
      </div>
    </VaultPanel>
  )
}

export function ToolCallsSection(props: ToolCallsSectionProps) {
  const Component = resolveVaultAdapter<ToolCallsSectionProps>('receipt.tool-calls', ToolCallsSectionBase)
  return <Component {...props} />
}
