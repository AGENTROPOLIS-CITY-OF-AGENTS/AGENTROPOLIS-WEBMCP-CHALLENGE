import type { ReactNode } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { DistrictBadge } from './DistrictBadge'
import { StatusChip } from './StatusChip'

export interface CommandHeaderProps {
  district?: string
  eyebrow?: string
  title: string
  subtitle?: string
  status?: string
  actions?: ReactNode
}

export function CommandHeader({ district = 'core', eyebrow, title, subtitle, status, actions }: CommandHeaderProps) {
  return (
    <header
      style={{
        display: 'grid',
        gap: 14,
        padding: 20,
        borderRadius: agentropolisTheme.radiusLg,
        border: `1px solid ${agentropolisTheme.border}`,
        background: `linear-gradient(135deg, ${agentropolisTheme.surfacePanel} 0%, ${agentropolisTheme.surfaceRaised} 70%, ${agentropolisTheme.surface} 100%)`,
        boxShadow: agentropolisTheme.shadowCyan,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {eyebrow ? <span style={{ color: agentropolisTheme.textMuted, fontSize: 11, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{eyebrow}</span> : null}
          <div style={{ display: 'grid', gap: 8 }}>
            <h1 style={{ margin: 0, color: agentropolisTheme.text, fontSize: 28, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</h1>
            {subtitle ? <p style={{ margin: 0, maxWidth: 720, color: agentropolisTheme.textMuted, fontSize: 14, lineHeight: 1.6 }}>{subtitle}</p> : null}
          </div>
        </div>
        {actions}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <DistrictBadge district={district} />
        {status ? <StatusChip label={status} tone={status.toLowerCase() as 'default'} /> : null}
      </div>
    </header>
  )
}
