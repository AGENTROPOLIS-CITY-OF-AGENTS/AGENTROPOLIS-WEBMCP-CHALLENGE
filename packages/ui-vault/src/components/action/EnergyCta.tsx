import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel, vaultSurfaceStyle } from '../shared'

export interface EnergyCtaProps {
  eyebrow?: string
  title: string
  detail?: string
  primaryLabel: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
}

function EnergyCtaBase({
  eyebrow = 'ACTION',
  title,
  detail,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: EnergyCtaProps) {
  return (
    <VaultPanel title={eyebrow}>
      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0, fontFamily: 'Orbitron, sans-serif', fontSize: 20 }}>{title}</h3>
        {detail ? <p style={{ margin: 0, color: 'var(--av-text-muted)', lineHeight: 1.5 }}>{detail}</p> : null}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={onPrimary} style={vaultSurfaceStyle({ padding: '10px 14px', color: 'var(--av-white)', background: 'rgba(255, 49, 49, 0.18)', cursor: 'pointer' })}>{primaryLabel}</button>
        {secondaryLabel ? <button type="button" onClick={onSecondary} style={vaultSurfaceStyle({ padding: '10px 14px', cursor: 'pointer' })}>{secondaryLabel}</button> : null}
      </div>
    </VaultPanel>
  )
}

export function EnergyCta(props: EnergyCtaProps) {
  const Component = resolveVaultAdapter<EnergyCtaProps>('action.energy-cta', EnergyCtaBase)
  return <Component {...props} />
}
