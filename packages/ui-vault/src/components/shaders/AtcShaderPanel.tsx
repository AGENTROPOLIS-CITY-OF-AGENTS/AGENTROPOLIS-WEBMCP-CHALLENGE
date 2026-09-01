import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface AtcShaderPanelProps {
  title?: string
  reducedMotion?: boolean
  fallbackLabel?: string
}

function AtcShaderPanelBase({ title = 'ATC SHADER', reducedMotion = false, fallbackLabel = 'Static fallback' }: AtcShaderPanelProps) {
  return (
    <VaultPanel title={title} aside={<span style={{ color: 'var(--av-text-muted)', fontSize: 11 }}>{reducedMotion ? fallbackLabel : 'GPU optional'}</span>}>
      <div
        style={{
          minHeight: 160,
          border: '1px solid var(--av-border)',
          background: reducedMotion
            ? 'linear-gradient(135deg, rgba(255,49,49,0.14), rgba(0,229,255,0.1))'
            : 'radial-gradient(circle at 20% 20%, rgba(0,229,255,0.22), transparent 32%), radial-gradient(circle at 80% 25%, rgba(255,49,49,0.18), transparent 26%), linear-gradient(135deg, #080c0f, #10161a)',
        }}
      />
    </VaultPanel>
  )
}

export function AtcShaderPanel(props: AtcShaderPanelProps) {
  const Component = resolveVaultAdapter<AtcShaderPanelProps>('shader.atc', AtcShaderPanelBase)
  return <Component {...props} />
}
