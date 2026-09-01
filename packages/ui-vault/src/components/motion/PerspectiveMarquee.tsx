import { resolveVaultAdapter } from '../../adapters'

export interface PerspectiveMarqueeProps {
  items: string[]
  reducedMotion?: boolean
}

function PerspectiveMarqueeBase({ items, reducedMotion = false }: PerspectiveMarqueeProps) {
  return (
    <div style={{ overflow: 'hidden', border: '1px solid var(--av-border)', background: 'rgba(255,255,255,0.02)' }}>
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '10px 12px',
          transform: 'perspective(900px) rotateX(18deg)',
          animation: reducedMotion ? 'none' : 'av-marquee 14s linear infinite',
          width: 'max-content',
        }}
      >
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--av-cyan)', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

export function PerspectiveMarquee(props: PerspectiveMarqueeProps) {
  const Component = resolveVaultAdapter<PerspectiveMarqueeProps>('motion.perspective-marquee', PerspectiveMarqueeBase)
  return <Component {...props} />
}
