import { resolveVaultAdapter } from '../../adapters'

export interface AssemblyCubeLoaderProps {
  label?: string
  reducedMotion?: boolean
}

function AssemblyCubeLoaderBase({ label = 'ASSEMBLING', reducedMotion = false }: AssemblyCubeLoaderProps) {
  const frames = reducedMotion ? [1] : [1, 0.75, 0.5]
  return (
    <div aria-label={label} style={{ display: 'inline-grid', gap: 8, justifyItems: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {frames.map((opacity, index) => (
          <span
            key={index}
            style={{
              width: 12,
              height: 12,
              display: 'inline-block',
              border: '1px solid var(--av-cyan)',
              background: `rgba(0, 229, 255, ${opacity * 0.24})`,
              animation: reducedMotion ? 'none' : `av-pulse 1.2s ${index * 0.12}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <span style={{ color: 'var(--av-text-muted)', fontFamily: 'Orbitron, sans-serif', fontSize: 10 }}>{label}</span>
    </div>
  )
}

export function AssemblyCubeLoader(props: AssemblyCubeLoaderProps) {
  const Component = resolveVaultAdapter<AssemblyCubeLoaderProps>('loader.assembly-cube', AssemblyCubeLoaderBase)
  return <Component {...props} />
}
