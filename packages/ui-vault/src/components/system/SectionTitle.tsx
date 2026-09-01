import type { ReactNode } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { getDistrictAccent } from '../shared'

export interface SectionTitleProps {
  district?: string
  kicker?: string
  title: string
  aside?: ReactNode
}

export function SectionTitle({ district, kicker, title, aside }: SectionTitleProps) {
  const accent = getDistrictAccent(district)
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end' }}>
      <div style={{ display: 'grid', gap: 6 }}>
        {kicker ? <span style={{ color: accent, fontSize: 11, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{kicker}</span> : null}
        <h2 style={{ margin: 0, color: agentropolisTheme.text, fontSize: 20, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {aside}
    </header>
  )
}
