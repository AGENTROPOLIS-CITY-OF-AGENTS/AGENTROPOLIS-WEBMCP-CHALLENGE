import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface SpatialPoemCubeProps {
  lines: string[]
  reducedMotion?: boolean
}

function SpatialPoemCubeBase({ lines, reducedMotion = false }: SpatialPoemCubeProps) {
  return (
    <VaultPanel title="SPATIAL POEM CUBE">
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: 220,
          border: '1px solid var(--av-border)',
          perspective: 900,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            display: 'grid',
            placeItems: 'center',
            border: '1px solid var(--av-cyan)',
            transform: reducedMotion ? 'rotateX(14deg) rotateY(-16deg)' : 'rotateX(18deg) rotateY(-28deg)',
            boxShadow: '0 0 24px rgba(0, 229, 255, 0.12)',
          }}
        >
          <div style={{ display: 'grid', gap: 6, padding: 12, textAlign: 'center' }}>
            {lines.slice(0, 4).map((line) => (
              <span key={line} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: 'var(--av-text)' }}>{line}</span>
            ))}
          </div>
        </div>
      </div>
    </VaultPanel>
  )
}

export function SpatialPoemCube(props: SpatialPoemCubeProps) {
  const Component = resolveVaultAdapter<SpatialPoemCubeProps>('spatial.poem-cube', SpatialPoemCubeBase)
  return <Component {...props} />
}
