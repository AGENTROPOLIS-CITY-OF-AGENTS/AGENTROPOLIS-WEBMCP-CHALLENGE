import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { getDistrictAccent } from '../shared'

export interface HUDDividerProps {
  district?: string
  label?: string
}

export function HUDDivider({ district, label }: HUDDividerProps) {
  const accent = getDistrictAccent(district)
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {label ? <span style={{ color: agentropolisTheme.textMuted, fontSize: 10, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span> : null}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          width: '100%',
          background: `linear-gradient(90deg, ${agentropolisTheme.border} 0%, ${accent} 50%, transparent 100%)`,
        }}
      />
    </div>
  )
}
