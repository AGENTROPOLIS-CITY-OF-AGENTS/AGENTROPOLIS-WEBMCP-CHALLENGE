import { describe, expect, it } from 'vitest'
import { ApprovalStore } from './approval'
import type { ActionRequest } from './contracts'

const baseRequest: ActionRequest = {
  requestId: 'request_approval',
  actor: { id: 'agent.hermes', type: 'agent' },
  tool: 'agentropolis_govern_district_action',
  action: 'energize_trace',
  arguments: { district: 'forge' },
  mandate: 'operate-grid',
  createdAt: new Date(0).toISOString(),
}

describe('approval binding', () => {
  it('rejects self approval', () => {
    expect(() => new ApprovalStore().issue(baseRequest, 'agent.hermes')).toThrow(/cannot approve/i)
  })

  it('rejects a consumed approval', () => {
    const store = new ApprovalStore()
    store.issue(baseRequest, 'human.operator')
    store.consume(baseRequest)
    expect(() => store.consume(baseRequest)).toThrow(/already been consumed/i)
  })

  it('rejects a token after the request payload changes', () => {
    const store = new ApprovalStore()
    store.issue(baseRequest, 'human.operator')
    const changed = { ...baseRequest, arguments: { district: 'vault' } }
    expect(() => store.consume(changed)).toThrow(/exact request/i)
  })
})
