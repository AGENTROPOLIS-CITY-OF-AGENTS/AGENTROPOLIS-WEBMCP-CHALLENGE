import { getDistrictThemeContract } from '../../themes/districtThemes'

export interface DistrictBadgeProps {
  district: string
  label?: string
}

export function DistrictBadge({ district, label }: DistrictBadgeProps) {
  const theme = getDistrictThemeContract(district)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: `1px solid ${theme.tokens.border}`,
        borderRadius: 999,
        padding: '6px 12px',
        background: `linear-gradient(90deg, ${theme.tokens.surfacePanel} 0%, ${theme.accentSoft} 100%)`,
        color: theme.tokens.text,
        fontSize: 11,
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 12px ${theme.accent}` }} />
      {label ?? theme.label}
    </span>
  )
}
