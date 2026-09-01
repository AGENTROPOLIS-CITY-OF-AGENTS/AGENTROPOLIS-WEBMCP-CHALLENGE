import type { PropsWithChildren, ReactNode } from 'react'
import { agentropolisTheme } from '../../themes/agentropolisTheme'
import { vaultSurfaceStyle } from '../shared'
import { CommandHeader, type CommandHeaderProps } from './CommandHeader'
import { HUDDivider } from './HUDDivider'
import { SystemFooter, type SystemFooterProps } from './SystemFooter'
import { SystemNav, type SystemNavItem } from './SystemNav'

export interface UniversalDistrictShellProps extends PropsWithChildren {
  district?: string
  layout?: 'standard' | 'overlay'
  header: CommandHeaderProps
  nav: SystemNavItem[]
  activeNavId?: string
  onSelectNav?: (id: string) => void
  footer: SystemFooterProps
  rail?: ReactNode
}

export function UniversalDistrictShell({
  district,
  layout = 'standard',
  header,
  nav,
  activeNavId,
  onSelectNav,
  footer,
  rail,
  children,
}: UniversalDistrictShellProps) {
  const overlay = layout === 'overlay'

  return (
    <section
      style={vaultSurfaceStyle({
        position: overlay ? 'absolute' : 'relative',
        inset: overlay ? 0 : undefined,
        display: 'grid',
        gap: agentropolisTheme.sectionGap,
        padding: overlay ? 18 : 24,
        height: overlay ? '100%' : undefined,
        border: overlay ? 'none' : `1px solid ${agentropolisTheme.border}`,
        borderRadius: overlay ? 0 : agentropolisTheme.radiusLg,
        background: overlay
          ? 'transparent'
          : `radial-gradient(circle at top left, rgba(0, 229, 255, 0.08), transparent 32%), linear-gradient(180deg, ${agentropolisTheme.surfacePanel} 0%, ${agentropolisTheme.surfaceRaised} 35%, ${agentropolisTheme.surface} 100%)`,
        boxShadow: overlay ? 'none' : agentropolisTheme.shadowCyan,
        pointerEvents: overlay ? 'none' : undefined,
      })}
    >
      <div style={{ display: 'grid', gridTemplateRows: overlay ? 'auto auto auto 1fr auto auto' : undefined, gap: agentropolisTheme.sectionGap, minHeight: 0, height: overlay ? '100%' : undefined }}>
        <div style={{ pointerEvents: 'auto' }}>
          <CommandHeader {...header} district={district ?? header.district} />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <SystemNav district={district} items={nav} activeId={activeNavId} onSelect={onSelectNav} />
        </div>
        <div style={{ pointerEvents: 'none' }}>
          <HUDDivider district={district} label="District Surface" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: rail ? 'minmax(0, 1fr) minmax(240px, 320px)' : 'minmax(0, 1fr)', gap: 20, minHeight: 0, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 20, minHeight: 0 }}>{children}</div>
          {rail ? <aside style={{ display: 'grid', alignContent: 'start', gap: 16, pointerEvents: 'auto' }}>{rail}</aside> : null}
        </div>
        <div style={{ pointerEvents: 'none', alignSelf: 'end' }}>
          <HUDDivider district={district} label="Receipt Boundary" />
        </div>
        <div style={{ pointerEvents: overlay ? 'none' : 'auto' }}>
          <SystemFooter {...footer} district={district ?? footer.district} />
        </div>
      </div>
    </section>
  )
}
