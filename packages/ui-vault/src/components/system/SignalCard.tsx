import type { PropsWithChildren, ReactNode } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { getDistrictAccent, getDistrictAccentSoft, resolveStatusColor } from '../shared'
import { StatusChip } from './StatusChip'

export interface SignalCardProps extends PropsWithChildren {
  district?: string
  title: string
  eyebrow?: string
  status?: string
  aside?: ReactNode
}

export function SignalCard({ district, title, eyebrow, status, aside, children }: SignalCardProps) {
  const accent = getDistrictAccent(district)
  const accentSoft = getDistrictAccentSoft(district)
  const statusColor = resolveStatusColor(status)
  return (
    <section
      style={{
        display: 'grid',
        gap: 14,
        padding: 18,
        borderRadius: agentropolisTheme.radiusMd,
        border: `1px solid ${agentropolisTheme.border}`,
        background: `linear-gradient(180deg, ${accentSoft} 0%, ${agentropolisTheme.surfaceRaised} 28%, ${agentropolisTheme.surface} 100%)`,
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {eyebrow ? <span style={{ color: accent, fontSize: 11, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{eyebrow}</span> : null}
          <strong style={{ color: agentropolisTheme.text, fontSize: 15, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</strong>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {status ? <StatusChip label={status} tone={status.toLowerCase() as 'default'} /> : null}
          {aside}
        </div>
      </header>
      <div style={{ display: 'grid', gap: 10, color: agentropolisTheme.textMuted, fontSize: 13, lineHeight: 1.6 }}>{children}</div>
      <div aria-hidden="true" style={{ height: 2, width: '100%', background: `linear-gradient(90deg, ${accent} 0%, ${statusColor} 60%, transparent 100%)` }} />
    </section>
  )
}
