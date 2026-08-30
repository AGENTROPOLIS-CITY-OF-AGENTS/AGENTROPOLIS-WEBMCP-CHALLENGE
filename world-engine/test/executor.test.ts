import { describe, it, expect } from "vitest";
import { createReceipt, type WorldReceipt } from "../src/receipts/receipt";
import { ProviderRegistry } from "../src/providers/registry";
import { AbyssalProvider } from "../src/providers/abyssal/abyssal-provider";
import { WorldEngine } from "../src/governance/executor";
import { DIRECTOR_MANDATE, RESEARCH_MANDATE } from "../src/governance/mandates";
import { handleToolCall, type WebMCPToolCall } from "../src/webmcp/handlers";

function buildEngine() {
  const registry = new ProviderRegistry();
  const provider = new AbyssalProvider();
  registry.register("abyssal", provider, { active: true });
  const mandates = new Map([
    [DIRECTOR_MANDATE.agentId, DIRECTOR_MANDATE],
    [RESEARCH_MANDATE.agentId, RESEARCH_MANDATE],
  ]);
  const engine = new WorldEngine(registry, mandates);
  return { registry, provider, engine };
}

const rid = () => `req-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

describe("WorldEngine receipts", () => {
  it("emits a success receipt when the Director spawns an event", async () => {
    const { engine } = buildEngine();
    const r = await engine.execute({
      requestId: rid(),
      agentId: DIRECTOR_MANDATE.agentId,
      tool: "event.spawn",
      arguments: { type: "hurricane" },
      mandate: DIRECTOR_MANDATE,
    });
    expect(r.receipt.result).toBe("success");
    expect(r.receipt.capability).toBe("event.spawn");
    expect(r.receipt.provider).toBe("abyssal");
    expect(r.receipt.receiptId).toBeTruthy();
    expect(r.receipt.timestamp).toBeTruthy();
    expect((r.state as { id?: string }).id).toBeTruthy();
  });

  it("emits a denied receipt when the Researcher tries to spawn", async () => {
    const { engine } = buildEngine();
    const r = await engine.execute({
      requestId: rid(),
      agentId: RESEARCH_MANDATE.agentId,
      tool: "event.spawn",
      arguments: { type: "tsunami" },
      mandate: RESEARCH_MANDATE,
    });
    expect(r.receipt.result).toBe("denied");
    expect(r.receipt.reason).toBe("CAPABILITY_DENIED");
    expect(r.decision.effect).toBe("DENY");
  });

  it("emits a denied receipt for an unknown agent", async () => {
    const { engine } = buildEngine();
    const r = await engine.execute({
      requestId: rid(),
      agentId: "ghost",
      tool: "world.get_state",
      arguments: {},
      mandate: DIRECTOR_MANDATE,
    });
    expect(r.receipt.result).toBe("denied");
    expect(r.receipt.reason).toBe("IDENTITY_UNKNOWN");
  });

  it("emits a denied receipt for an unsupported tool", async () => {
    const { engine } = buildEngine();
    const r = await engine.execute({
      requestId: rid(),
      agentId: DIRECTOR_MANDATE.agentId,
      tool: "nope.do_thing",
      arguments: {},
      mandate: DIRECTOR_MANDATE,
    });
    expect(r.receipt.result).toBe("denied");
    expect(r.receipt.reason).toBe("UNSUPPORTED_TOOL");
  });

  it("shares state: a Director write is visible to a Researcher read", async () => {
    const { engine } = buildEngine();
    await engine.execute({
      requestId: rid(),
      agentId: DIRECTOR_MANDATE.agentId,
      tool: "event.spawn",
      arguments: { type: "waterspout", position: { x: 40, z: -80 } },
      mandate: DIRECTOR_MANDATE,
    });
    const read = await engine.execute({
      requestId: rid(),
      agentId: RESEARCH_MANDATE.agentId,
      tool: "world.get_state",
      arguments: {},
      mandate: RESEARCH_MANDATE,
    });
    const events = (read.state as { events: unknown[] }).events;
    expect(events.length).toBe(1);
    expect((events[0] as { type: string }).type).toBe("waterspout");
  });

  it("wires the four required tools through the WebMCP handler", async () => {
    const { engine, provider } = buildEngine();
    const tools: WebMCPToolCall[] = [
      { requestId: rid(), tool: "world.get_state", arguments: {} },
      { requestId: rid(), tool: "world.get_capabilities", arguments: {} },
      { requestId: rid(), tool: "weather.set", arguments: { windSpeed: 30, stormIntensity: 1 } },
      { requestId: rid(), tool: "event.spawn", arguments: { type: "rogue" } },
    ];
    for (const call of tools) {
      const res = await handleToolCall(engine, call, { agentId: DIRECTOR_MANDATE.agentId });
      expect(res.receipt.result).toBe("success");
      expect(res.receipt.provider).toBe("abyssal");
    }
    // Researcher weather.set is read-only blocked.
    const denied = await handleToolCall(engine, tools[2]!, { agentId: RESEARCH_MANDATE.agentId });
    expect(denied.receipt.result).toBe("denied");
    await expect(provider.capabilities()).resolves.toContain("event.spawn");
  });
});

describe("receipt factory", () => {
  it("creates a well-formed receipt", () => {
    const r: WorldReceipt = createReceipt({
      agentId: "a",
      district: "D",
      provider: "abyssal",
      capability: "world.read",
      result: "success",
    });
    expect(r.receiptId).toBeTruthy();
    expect(r.timestamp).toBeTruthy();
    expect(r.district).toBe("D");
  });
});
