import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface IntegrationNode {
  id: string
  label: string
  status: 'ready' | 'pending' | 'blocked'
}

export interface IntegrationConstellationProps {
  title?: string
  nodes: IntegrationNode[]
}

function tone(status: IntegrationNode['status']): string {
  if (status === 'blocked') return 'var(--av-red)'
  if (status === 'pending') return 'var(--av-accent-purple)'
  return 'var(--av-cyan)'
}

function IntegrationConstellationBase({ title = 'INTEGRATION CONSTELLATION', nodes }: IntegrationConstellationProps) {
  return (
    <VaultPanel title={title}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12 }}>
        {nodes.map((node) => (
          <article key={node.id} style={{ display: 'grid', justifyItems: 'center', gap: 8, padding: 12, border: '1px solid var(--av-border)' }}>
            <span style={{ width: 42, height: 42, borderRadius: 999, display: 'grid', placeItems: 'center', border: `1px solid ${tone(node.status)}`, color: tone(node.status) }}>
              {node.label.slice(0, 2).toUpperCase()}
            </span>
            <strong style={{ fontSize: 12 }}>{node.label}</strong>
            <span style={{ fontSize: 11, color: 'var(--av-text-muted)' }}>{node.status}</span>
          </article>
        ))}
      </div>
    </VaultPanel>
  )
}

export function IntegrationConstellation(props: IntegrationConstellationProps) {
  const Component = resolveVaultAdapter<IntegrationConstellationProps>('integration.constellation', IntegrationConstellationBase)
  return <Component {...props} />
}
