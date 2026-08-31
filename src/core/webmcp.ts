import { TOOL_INPUT_SCHEMA, TOOL_NAME } from './contracts'
import type { GovernanceEngine } from './engine'

export async function registerWebMcpTool(engine: GovernanceEngine, signal: AbortSignal): Promise<'registered' | 'unsupported'> {
  if (!document.modelContext) {
    engine.setToolStatus('unsupported')
    return 'unsupported'
  }

  try {
    await document.modelContext.registerTool({
      name: TOOL_NAME,
      title: 'Govern an AGENTROPOLIS district action',
      description: 'Routes one bounded district action through identity, mandate, deterministic policy, optional human approval, execution, and an inspectable receipt.',
      inputSchema: TOOL_INPUT_SCHEMA,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input) => engine.submit(input, 'webmcp'),
    }, { signal })
    engine.setToolStatus('registered')
    return 'registered'
  } catch (error) {
    if (!signal.aborted) engine.setToolStatus('error')
    throw error
  }
}
