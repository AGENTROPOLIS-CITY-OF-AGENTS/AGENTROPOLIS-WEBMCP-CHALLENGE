import type { WorldEngine } from "../governance/executor.js";
import type { WorldReceipt } from "../receipts/receipt.js";
import type { WorldCapability } from "../types.js";

export interface WebMCPToolCall {
  requestId: string;
  tool: string;
  arguments: Record<string, unknown>;
}

export interface WebMCPContext {
  agentId: string;
  provider?: string;
}

/**
 * The structured return of a governed WebMCP invocation. Intent (the semantic
 * capability) plus a machine-readable WORLD RECEIPT for every outcome —
 * success, denial, and failure are all auditable.
 */
export interface WebMCPResult {
  requestId: string;
  tool: string;
  capability: WorldCapability | null;
  receipt: WorldReceipt;
  decision: "ALLOW" | "DENY" | "FAILED";
  data: unknown;
}

/**
 * Handles a WebMCP tool call by normalizing it into a governed execution and
 * emitting a receipt for the outcome. This is the single entry point the
 * challenge's WebMCP adapter binds to.
 */
export async function handleToolCall(engine: WorldEngine, call: WebMCPToolCall, ctx: WebMCPContext): Promise<WebMCPResult> {
  const { receipt, decision, state } = await engine.execute({
    requestId: call.requestId,
    agentId: ctx.agentId,
    tool: call.tool,
    arguments: call.arguments,
    mandate: engine.mandateOf(ctx.agentId) ?? { agentId: ctx.agentId, district: "UNKNOWN", role: "unknown", capabilities: [] },
    provider: ctx.provider,
  });

  return {
    requestId: call.requestId,
    tool: call.tool,
    capability: receipt.capability,
    receipt,
    decision: decision.effect === "DENY" ? "DENY" : receipt.result === "failed" ? "FAILED" : "ALLOW",
    data: state,
  };
}
