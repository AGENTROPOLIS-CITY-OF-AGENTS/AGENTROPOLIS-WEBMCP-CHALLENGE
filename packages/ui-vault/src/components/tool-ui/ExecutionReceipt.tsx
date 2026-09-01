import { resolveVaultAdapter } from '../../adapters'
import { VaultPanel } from '../shared'

export interface ExecutionReceiptProps {
  receiptId: string
  decision: string
  status: string
  actor: string
  summary: string
}

function ExecutionReceiptBase({ receiptId, decision, status, actor, summary }: ExecutionReceiptProps) {
  return (
    <VaultPanel title="EXECUTION RECEIPT">
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12 }}>{receiptId}</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ border: '1px solid var(--av-border)', padding: '6px 8px', fontSize: 11 }}>{decision}</span>
          <span style={{ border: '1px solid var(--av-border)', padding: '6px 8px', fontSize: 11 }}>{status}</span>
          <span style={{ border: '1px solid var(--av-border)', padding: '6px 8px', fontSize: 11 }}>{actor}</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>{summary}</p>
      </div>
    </VaultPanel>
  )
}

export function ExecutionReceipt(props: ExecutionReceiptProps) {
  const Component = resolveVaultAdapter<ExecutionReceiptProps>('receipt.execution-receipt', ExecutionReceiptBase)
  return <Component {...props} />
}
