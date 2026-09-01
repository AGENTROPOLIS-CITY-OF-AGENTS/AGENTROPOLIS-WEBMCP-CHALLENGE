import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { resolveStatusColor } from '../shared'

export interface StatusChipProps {
  label: string
  tone?: 'default' | 'active' | 'allow' | 'deny' | 'review' | 'warning'
}

export function StatusChip({ label, tone = 'default' }: StatusChipProps) {
  const color = tone === 'default' ? agentropolisTheme.cyan : resolveStatusColor(tone)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: '6px 10px',
        color,
        background: `${color}18`,
        fontSize: 11,
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}` }} />
      {label}
    </span>
  )
}
