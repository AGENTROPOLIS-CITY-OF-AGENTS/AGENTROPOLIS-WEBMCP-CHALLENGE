import type { CSSProperties, KeyboardEvent, PropsWithChildren, ReactNode } from 'react'
import { agentropolisTheme, createAgentropolisCssVars } from '../themes/agentropolisTheme'
import { getDistrictThemeContract } from '../themes/districtThemes'

const vars = createAgentropolisCssVars()

export function vaultSurfaceStyle(extra: CSSProperties = {}): CSSProperties {
  return {
    ...vars,
    color: agentropolisTheme.text,
    background: agentropolisTheme.surface,
    border: `1px solid ${agentropolisTheme.border}`,
    boxShadow: agentropolisTheme.shadowCyan,
    borderRadius: agentropolisTheme.radiusMd,
    ...extra,
  }
}

export function VaultPanel({ children, title, aside }: PropsWithChildren<{ title?: string; aside?: ReactNode }>) {
  return (
    <section style={vaultSurfaceStyle({ padding: agentropolisTheme.panelPadding, display: 'grid', gap: agentropolisTheme.panelGap, background: `linear-gradient(180deg, ${agentropolisTheme.surfaceRaised} 0%, ${agentropolisTheme.surface} 100%)` })}>
      {(title || aside) && (
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          {title ? <strong style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.12em', fontSize: 12 }}>{title}</strong> : <span />}
          {aside}
        </header>
      )}
      {children}
    </section>
  )
}

export function onEnterSpace(handler: () => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handler()
    }
  }
}

export function getDistrictAccent(district?: string): string {
  return getDistrictThemeContract(district).accent
}

export function getDistrictAccentSoft(district?: string): string {
  return getDistrictThemeContract(district).accentSoft
}

export function resolveStatusColor(status?: string): string {
  const normalized = status?.trim().toLowerCase()
  if (!normalized) return agentropolisTheme.cyan
  if (['allow', 'active', 'verified', 'ready', 'stable', 'executed'].includes(normalized)) return agentropolisTheme.cyan
  if (['deny', 'error', 'blocked', 'deprecated'].includes(normalized)) return agentropolisTheme.red
  if (['review', 'approval', 'pending', 'quarantine'].includes(normalized)) return agentropolisTheme.purple
  if (['warning'].includes(normalized)) return agentropolisTheme.hotPink
  return agentropolisTheme.cyan
}
