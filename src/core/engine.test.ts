import { describe, expect, it } from 'vitest'
import { GovernanceEngine } from './engine'

const inspect = { operation: 'inspect_district', actorId: 'agent.hermes', actorType: 'agent', mandate: 'observe-grid', district: 'gateway' } as const
const energize = { operation: 'energize_trace', actorId: 'agent.hermes', actorType: 'agent', mandate: 'operate-grid', district: 'forge' } as const

describe('governance engine lifecycle', () => {
  it('executes ALLOW and archives a complete receipt', async () => {
    const engine = new GovernanceEngine({ transitionDelay: 0 })
    const result = await engine.submit(inspect, 'visitor')
    expect(result).toMatchObject({ decision: 'ALLOW', status: 'EXECUTED' })
    expect(engine.getSnapshot().phase).toBe('RECEIPTED')
    expect(engine.getSnapshot().receipts.at(-1)?.output).toMatchObject({ changed: false })
  })

  it('pauses approval-required execution until a different human approves', async () => {
    const engine = new GovernanceEngine({ transitionDelay: 0 })
    const pending = await engine.submit(energize, 'webmcp')
    expect(pending.status).toBe('AWAITING_APPROVAL')
    expect(engine.getSnapshot().phase).toBe('AWAITING_APPROVAL')
    const executed = await engine.approve('human.operator')
    expect(executed.status).toBe('EXECUTED')
    expect(engine.getSnapshot().receipts.at(-1)?.approvedBy).toBe('human.operator')
  })

  it('rejects additional tool arguments before creating a request', async () => {
    const engine = new GovernanceEngine({ transitionDelay: 0 })
    await expect(engine.submit({ ...inspect, bypass: true }, 'webmcp')).rejects.toThrow(/unsupported properties/i)
    expect(engine.getSnapshot().request).toBeNull()
  })
})
