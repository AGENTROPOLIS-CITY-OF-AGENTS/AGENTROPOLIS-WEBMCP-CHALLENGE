import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { DistrictBadge } from './DistrictBadge'
import { StatusChip } from './StatusChip'

export interface SystemFooterProps {
  district?: string
  summary: string
  status?: string
  meta?: string[]
}

export function SystemFooter({ district = 'core', summary, status, meta = [] }: SystemFooterProps) {
  return (
    <footer style={{ display: 'grid', gap: 12, paddingTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <DistrictBadge district={district} />
        {status ? <StatusChip label={status} tone={status.toLowerCase() as 'default'} /> : null}
      </div>
      <p style={{ margin: 0, color: agentropolisTheme.textMuted, fontSize: 12, lineHeight: 1.6 }}>{summary}</p>
      {meta.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {meta.map((item) => (
            <span key={item} style={{ color: agentropolisTheme.textMuted, fontSize: 11, border: `1px solid ${agentropolisTheme.border}`, borderRadius: 999, padding: '5px 10px' }}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </footer>
  )
}
