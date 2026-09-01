import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel, onEnterSpace } from '../shared'

export interface FolderGalleryItem {
  id: string
  name: string
  summary?: string
}

export interface FolderGalleryProps {
  title?: string
  items: FolderGalleryItem[]
  activeId?: string
  onSelect?: (id: string) => void
}

function FolderGalleryBase({ title = 'FOLDER GALLERY', items, activeId, onSelect }: FolderGalleryProps) {
  return (
    <VaultPanel title={title}>
      <div role="list" style={{ display: 'grid', gap: 8 }}>
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
                padding: 12,
                border: `1px solid ${active ? 'var(--av-cyan)' : 'var(--av-border)'}`,
                background: active ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
              }}
            >
              <strong style={{ display: 'block', fontSize: 12 }}>{item.name}</strong>
              {item.summary ? <span style={{ display: 'block', marginTop: 4, color: 'var(--av-text-muted)', fontSize: 12 }}>{item.summary}</span> : null}
            </div>
          )
        })}
      </div>
    </VaultPanel>
  )
}

export function FolderGallery(props: FolderGalleryProps) {
  const Component = resolveVaultAdapter<FolderGalleryProps>('gallery.folder', FolderGalleryBase)
  return <Component {...props} />
}
