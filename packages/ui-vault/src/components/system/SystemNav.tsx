import type { MouseEvent } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { getDistrictAccent, getDistrictAccentSoft, onEnterSpace } from '../shared'

export interface SystemNavItem {
  id: string
  label: string
  href?: string
  disabled?: boolean
}

export interface SystemNavProps {
  district?: string
  items: SystemNavItem[]
  activeId?: string
  onSelect?: (id: string) => void
}

export function SystemNav({ district, items, activeId, onSelect }: SystemNavProps) {
  const accent = getDistrictAccent(district)
  const accentSoft = getDistrictAccentSoft(district)

  const handleSelect = (id: string, event?: MouseEvent<HTMLElement>) => {
    if (event) event.preventDefault()
    onSelect?.(id)
  }

  return (
    <nav aria-label="System navigation" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map((item) => {
        const active = item.id === activeId
        const commonStyle = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 999,
          border: `1px solid ${active ? accent : agentropolisTheme.border}`,
          padding: '10px 14px',
          background: active ? `linear-gradient(90deg, ${accentSoft} 0%, ${agentropolisTheme.surfacePanel} 100%)` : agentropolisTheme.surfaceRaised,
          color: item.disabled ? agentropolisTheme.textMuted : agentropolisTheme.text,
          fontSize: 12,
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          textDecoration: 'none',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
        }

        const indicator = <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: active ? accent : agentropolisTheme.textMuted, boxShadow: active ? `0 0 12px ${accent}` : 'none' }} />

        if (item.href && !onSelect) {
          return (
            <a key={item.id} href={item.disabled ? undefined : item.href} style={commonStyle} aria-disabled={item.disabled || undefined}>
              {indicator}
              {item.label}
            </a>
          )
        }

        return (
          <div
            key={item.id}
            role="button"
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled || undefined}
            onClick={item.disabled ? undefined : (event) => handleSelect(item.id, event)}
            onKeyDown={item.disabled ? undefined : onEnterSpace(() => handleSelect(item.id))}
            style={commonStyle}
          >
            {indicator}
            {item.label}
          </div>
        )
      })}
    </nav>
  )
}
