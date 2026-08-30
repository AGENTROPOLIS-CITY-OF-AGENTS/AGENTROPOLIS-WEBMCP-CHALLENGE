import type { WorldCapability, WorldProviderId } from "../types.js";
import type { WorldProvider, SpawnEventInput } from "../providers/provider.js";
import type { ProviderRegistry } from "../providers/registry.js";
import { authorize, type AgentMandate } from "./authorization.js";
import { createReceipt, type WorldReceipt } from "../receipts/receipt.js";
import { toolToCapability } from "../webmcp/policy.js";

export type Effect = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

export interface GovernanceDecision {
  requestId: string;
  effect: Effect;
  reasons: string[];
  decidedAt: string;
}

export interface ExecuteRequest {
  requestId: string;
  /** Identity of the calling agent. Must match the mandate's agentId. */
  agentId: string;
  /** The WebMCP tool name (e.g. "event.spawn"). Mapped to a capability. */
  tool: string;
  arguments: Record<string, unknown>;
  mandate: AgentMandate;
  /** Provider id to pin, or undefined to use the registry's active provider. */
  provider?: string;
}

export interface ExecutedResult {
  receipt: WorldReceipt;
  decision: GovernanceDecision;
  state: unknown;
}

/**
 * WorldEngine — the governed executor.
 *
 * Corridor: Identity -> Mandate -> Capability -> Policy -> Provider -> Execution -> Receipt.
 *
 * Authority is derived from Identity + Mandate + Policy (a runtime check), never
 * from prompt wording. A request without a valid ALLOW decision is refused and
 * still emits a receipt, so denial and failure are as auditable as success.
 */
export class WorldEngine {
  constructor(
    private readonly registry: ProviderRegistry,
    private readonly mandates: ReadonlyMap<string, AgentMandate>,
  ) {}

  private mandateFor(agentId: string): AgentMandate | undefined {
    return this.mandates.get(agentId);
  }

  /** Public, read-only access to a registered mandate (used by adapters). */
  mandateOf(agentId: string): AgentMandate | undefined {
    return this.mandates.get(agentId);
  }

  private async resolveProvider(providerId?: string): Promise<WorldProvider> {
    // providerId is a WorldProviderId string; registry.resolve accepts optional id.
    return this.registry.resolve(providerId as Parameters<ProviderRegistry["resolve"]>[0]);
  }

  async execute(req: ExecuteRequest): Promise<ExecutedResult> {
    const started = Date.now();
    const mandate = this.mandateFor(req.agentId);

    // --- Identity + Mandate -------------------------------------------------
    if (!mandate) {
      return this.denied(req, "IDENTITY_UNKNOWN", "No mandate registered for agent", started, req.tool);
    }
    if (mandate.agentId !== req.agentId) {
      return this.denied(req, "IDENTITY_MISMATCH", "Request identity does not match mandate", started, req.tool);
    }

    // --- Tool -> capability -------------------------------------------------
    const capability = toolToCapability(req.tool);
    if (!capability) {
      return this.denied(req, "UNSUPPORTED_TOOL", `Unsupported operation: ${req.tool}`, started, req.tool);
    }

    // --- Capability authorization -------------------------------------------
    const auth = authorize({ agentId: req.agentId, capability }, mandate);
    if (!auth.allowed) {
      return this.denied(req, auth.reason, `Capability ${capability} denied`, started, req.tool);
    }

    // --- Provider resolution -------------------------------------------------
    let provider: WorldProvider;
    try {
      provider = await this.resolveProvider(req.provider);
    } catch (err) {
      return this.failed(req, String((err as Error).message ?? err), started, req.tool, capability);
    }

    // --- Execution -----------------------------------------------------------
    try {
      const output = await this.dispatch(provider, req.tool, capability, req.arguments);
      const receipt = createReceipt({
        agentId: req.agentId,
        district: mandate.district,
        provider: provider.id,
        capability,
        result: "success",
        durationMs: Date.now() - started,
        metadata: { tool: req.tool, requestId: req.requestId },
      });
      return {
        receipt,
        decision: this.decision(req.requestId, "ALLOW", [`capability ${capability} authorized`]),
        state: output,
      };
    } catch (err) {
      return this.failed(req, String((err as Error).message ?? err), started, req.tool, capability, provider.id);
    }
  }

  private decision(requestId: string, effect: Effect, reasons: string[]): GovernanceDecision {
    return { requestId, effect, reasons, decidedAt: new Date().toISOString() };
  }

  private denied(req: ExecuteRequest, reason: string, detail: string, started: number, tool: string): ExecutedResult {
    const receipt = createReceipt({
      agentId: req.agentId,
      district: req.mandate.district ?? "UNKNOWN",
      provider: "threejs",
      capability: "world.read",
      result: "denied",
      reason,
      durationMs: Date.now() - started,
      metadata: { tool, requestId: req.requestId, detail },
    });
    return {
      receipt,
      decision: this.decision(req.requestId, "DENY", [detail]),
      state: null,
    };
  }

  private failed(
    req: ExecuteRequest,
    detail: string,
    started: number,
    tool: string,
    capability: WorldCapability,
    providerId: WorldProviderId = "threejs",
  ): ExecutedResult {
    const receipt = createReceipt({
      agentId: req.agentId,
      district: req.mandate.district ?? "UNKNOWN",
      provider: providerId,
      capability,
      result: "failed",
      reason: "EXECUTION_FAILED",
      durationMs: Date.now() - started,
      metadata: { tool, requestId: req.requestId, detail },
    });
    return {
      receipt,
      decision: this.decision(req.requestId, "ALLOW", [`capability ${capability} authorized`]),
      state: null,
    };
  }

  private async dispatch(
    provider: WorldProvider,
    tool: string,
    capability: WorldCapability,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    switch (capability) {
      case "world.read":
        return provider.getState();
      case "weather.read":
        if (!provider.getWeather) throw new Error("provider does not expose getWeather");
        return provider.getWeather();
      case "weather.set":
        if (!provider.setWeather) throw new Error("provider does not expose setWeather");
        return provider.setWeather(sanitizeWeather(args));
      case "camera.read":
        if (!provider.getCamera) throw new Error("provider does not expose getCamera");
        return provider.getCamera();
      case "camera.move":
        if (!provider.setCamera) throw new Error("provider does not expose setCamera");
        return provider.setCamera(sanitizeCamera(args));
      case "event.read":
        return (await provider.getState()).events;
      case "event.spawn":
        if (!provider.spawnEvent) throw new Error("provider does not expose spawnEvent");
        return provider.spawnEvent(sanitizeSpawn(args));
      case "event.cancel":
        if (!provider.cancelEvent) throw new Error("provider does not expose cancelEvent");
        await provider.cancelEvent(String(args.id ?? ""));
        return { cancelled: String(args.id ?? "") };
      case "render.read":
        if (!provider.getRenderState) throw new Error("provider does not expose getRenderState");
        return provider.getRenderState();
      case "render.quality":
        if (!provider.setQuality) throw new Error("provider does not expose setQuality");
        return provider.setQuality(String(args.tier ?? ""));
      case "capture.frame":
      case "capture.sequence":
        if (!provider.captureFrame) throw new Error("provider does not expose captureFrame");
        return provider.captureFrame();
      default:
        throw new Error(`unsupported capability: ${capability}`);
    }
  }
}

/** Keep only known weather keys, so untrusted argument objects never leak junk in. */
function sanitizeWeather(args: Record<string, unknown>): Record<string, number> {
  const KEYS = ["windSpeed", "cloudCover", "rainIntensity", "visibility", "stormIntensity", "preset"] as const;
  const out: Record<string, number> = {};
  for (const k of KEYS) {
    if (typeof args[k] === "number") out[k] = args[k] as number;
  }
  if (typeof args["preset"] === "string") out["preset"] = args["preset"] as never;
  return out;
}

function sanitizeCamera(args: Record<string, unknown>): { position?: { x: number; y: number; z: number } } {
  const p = args.position as { x?: number; y?: number; z?: number } | undefined;
  if (!p) return {};
  return { position: { x: Number(p.x ?? 0), y: Number(p.y ?? 0), z: Number(p.z ?? 0) } };
}

function sanitizeSpawn(args: Record<string, unknown>): SpawnEventInput {
  const pos = args.position as { x?: number; y?: number; z?: number } | undefined;
  return {
    type: String(args.type ?? "rogue"),
    position: pos ? { x: Number(pos.x ?? 0), y: Number(pos.y ?? 0), z: Number(pos.z ?? 0) } : undefined,
    intensity: typeof args.intensity === "number" ? args.intensity : undefined,
    metadata: (args.metadata as Record<string, unknown> | undefined) ?? {},
  };
}
