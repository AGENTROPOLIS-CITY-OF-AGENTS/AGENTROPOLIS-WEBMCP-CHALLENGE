import { resolveVaultAdapter } from '../../adapters'
import { onEnterSpace, VaultPanel } from '../shared'

export interface OrbitIntegrationItem {
  id: string
  label: string
  description?: string
}

export interface OrbitIntegrationsProps {
  title?: string
  items: OrbitIntegrationItem[]
  activeId?: string
  onSelect?: (id: string) => void
}

function OrbitIntegrationsBase({ title = 'ORBIT INTEGRATIONS', items, activeId, onSelect }: OrbitIntegrationsProps) {
  return (
    <VaultPanel title={title}>
      <nav aria-label={title} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => onSelect?.(item.id)}
              onKeyDown={onEnterSpace(() => onSelect?.(item.id))}
              style={{
                minWidth: 120,
                padding: 12,
                cursor: 'pointer',
                border: `1px solid ${active ? 'var(--av-red)' : 'var(--av-border)'}`,
                background: active ? 'rgba(255, 49, 49, 0.12)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <strong style={{ display: 'block', fontSize: 12 }}>{item.label}</strong>
              {item.description ? <span style={{ display: 'block', marginTop: 4, color: 'var(--av-text-muted)', fontSize: 12 }}>{item.description}</span> : null}
            </div>
          )
        })}
      </nav>
    </VaultPanel>
  )
}

export function OrbitIntegrations(props: OrbitIntegrationsProps) {
  const Component = resolveVaultAdapter<OrbitIntegrationsProps>('orbit.integrations', OrbitIntegrationsBase)
  return <Component {...props} />
}
