import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'
import type { SphereImageItem } from './SphereImageGrid'

export interface StellarGalleryProps {
  title?: string
  items: SphereImageItem[]
}

function StellarGalleryBase({ title = 'STELLAR GALLERY', items }: StellarGalleryProps) {
  return (
    <VaultPanel title={title}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} style={{ display: 'grid', gap: 8 }}>
            <img src={item.src} alt={item.alt} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', border: '1px solid var(--av-border)' }} />
            <strong style={{ fontSize: 12 }}>{item.title}</strong>
          </article>
        ))}
      </div>
    </VaultPanel>
  )
}

export function StellarGallery(props: StellarGalleryProps) {
  const Component = resolveVaultAdapter<StellarGalleryProps>('gallery.stellar', StellarGalleryBase)
  return <Component {...props} />
}
