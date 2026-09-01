import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface SphereImageItem {
  id: string
  src: string
  alt: string
  title: string
}

export interface SphereImageGridProps {
  title?: string
  items: SphereImageItem[]
}

function SphereImageGridBase({ title = 'SPHERE GRID', items }: SphereImageGridProps) {
  return (
    <VaultPanel title={title}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        {items.map((item) => (
          <figure key={item.id} style={{ margin: 0, display: 'grid', gap: 8 }}>
            <img src={item.src} alt={item.alt} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '999px', border: '1px solid var(--av-border)' }} />
            <figcaption style={{ fontSize: 12 }}>{item.title}</figcaption>
          </figure>
        ))}
      </div>
    </VaultPanel>
  )
}

export function SphereImageGrid(props: SphereImageGridProps) {
  const Component = resolveVaultAdapter<SphereImageGridProps>('gallery.sphere', SphereImageGridBase)
  return <Component {...props} />
}
