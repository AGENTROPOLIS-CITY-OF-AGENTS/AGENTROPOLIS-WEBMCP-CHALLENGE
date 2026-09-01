import type { PropsWithChildren } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { resolveStatusColor } from '../shared'
import { HUDDivider } from './HUDDivider'
import { StatusChip } from './StatusChip'

export interface OperationCardProps extends PropsWithChildren {
  district?: string
  title: string
  stage: string
  summary: string
  status: string
  meta?: string[]
}

export function OperationCard({ district, title, stage, summary, status, meta = [], children }: OperationCardProps) {
  const color = resolveStatusColor(status)
  return (
    <article
      style={{
        display: 'grid',
        gap: 14,
        padding: 18,
        borderRadius: agentropolisTheme.radiusMd,
        border: `1px solid ${agentropolisTheme.border}`,
        background: `linear-gradient(180deg, ${agentropolisTheme.surfaceRaised} 0%, ${agentropolisTheme.surface} 100%)`,
        boxShadow: `inset 0 0 0 1px ${color}22`,
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <span style={{ color, fontSize: 11, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{stage}</span>
          <strong style={{ color: agentropolisTheme.text, fontSize: 15, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</strong>
        </div>
        <StatusChip label={status} tone={status.toLowerCase() as 'default'} />
      </header>
      <p style={{ margin: 0, color: agentropolisTheme.textMuted, fontSize: 13, lineHeight: 1.6 }}>{summary}</p>
      {meta.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {meta.map((item) => (
            <span key={item} style={{ border: `1px solid ${agentropolisTheme.border}`, borderRadius: 999, padding: '5px 10px', color: agentropolisTheme.textMuted, fontSize: 11 }}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {children ? <HUDDivider district={district} label="Operator Detail" /> : null}
      {children}
    </article>
  )
}
