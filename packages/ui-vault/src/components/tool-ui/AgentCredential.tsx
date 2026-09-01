import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface AgentCredentialProps {
  actorId: string
  actorType: string
  mandate: string
  trustLabel?: string
}

function AgentCredentialBase({ actorId, actorType, mandate, trustLabel = 'Credentialed' }: AgentCredentialProps) {
  return (
    <VaultPanel title="AGENT CREDENTIAL">
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 14 }}>{actorId}</strong>
        <span style={{ color: 'var(--av-text-muted)', fontSize: 12 }}>{actorType}</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 8px', border: '1px solid var(--av-border)' }}>{mandate}</span>
          <span style={{ padding: '6px 8px', border: '1px solid rgba(255,49,49,0.32)' }}>{trustLabel}</span>
        </div>
      </div>
    </VaultPanel>
  )
}

export function AgentCredential(props: AgentCredentialProps) {
  const Component = resolveVaultAdapter<AgentCredentialProps>('agent.credential', AgentCredentialBase)
  return <Component {...props} />
}
