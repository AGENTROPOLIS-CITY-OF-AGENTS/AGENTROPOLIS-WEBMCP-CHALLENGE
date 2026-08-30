import { describe, it, expect } from "vitest";
import { ProviderRegistry } from "../src/providers/registry";
import { AbyssalProvider } from "../src/providers/abyssal/abyssal-provider";
import { WorldEngine } from "../src/governance/executor";
import { DIRECTOR_MANDATE, RESEARCH_MANDATE } from "../src/governance/mandates";
import { MissionControl } from "../src/mission-control/mission-control";

/**
 * Deterministic eval — the full challenge corridor run as a fixed scenario.
 * Asserts only stable invariants (result types, capability mappings, denial
 * reasons, shared state) so the run is byte-for-byte repeatable.
 */
describe("deterministic world-engine eval (challenge corridor)", () => {
  it("runs the two-agent proof with stable outcomes", async () => {
    const registry = new ProviderRegistry();
    const provider = new AbyssalProvider();
    await provider.connect();
    registry.register("abyssal", provider, { active: true });

    const mandates = new Map([
      [DIRECTOR_MANDATE.agentId, DIRECTOR_MANDATE],
      [RESEARCH_MANDATE.agentId, RESEARCH_MANDATE],
    ]);
    const engine = new WorldEngine(registry, mandates);
    const control = new MissionControl(registry, mandates);

    const rid = (p: string) => `${p}-eval-${Date.now()}`;

    // 1. Director reads shared state (ALLOW, success).
    const dirRead = await engine.execute({
      requestId: rid("d1"), agentId: DIRECTOR_MANDATE.agentId, tool: "world.get_state", arguments: {}, mandate: DIRECTOR_MANDATE,
    });
    control.record(dirRead.receipt);
    expect(dirRead.receipt.result).toBe("success");

    // 2. Director changes weather (WRITE, allowed).
    const dirWeather = await engine.execute({
      requestId: rid("d2"), agentId: DIRECTOR_MANDATE.agentId, tool: "weather.set", arguments: { windSpeed: 32, stormIntensity: 0.9 }, mandate: DIRECTOR_MANDATE,
    });
    control.record(dirWeather.receipt);
    expect(dirWeather.receipt.result).toBe("success");
    expect((dirWeather.state as { windSpeed?: number }).windSpeed).toBe(32);

    // 3. Director spawns an event (WRITE, allowed).
    const dirSpawn = await engine.execute({
      requestId: rid("d3"), agentId: DIRECTOR_MANDATE.agentId, tool: "event.spawn", arguments: { type: "hurricane", position: { x: 0, z: -260 } }, mandate: DIRECTOR_MANDATE,
    });
    control.record(dirSpawn.receipt);
    expect(dirSpawn.receipt.result).toBe("success");
    expect((dirSpawn.state as { type?: string }).type).toBe("hurricane");

    // 4. Researcher reads the SAME state and sees the event.
    const resRead = await engine.execute({
      requestId: rid("r1"), agentId: RESEARCH_MANDATE.agentId, tool: "world.get_state", arguments: {}, mandate: RESEARCH_MANDATE,
    });
    control.record(resRead.receipt);
    expect(resRead.receipt.result).toBe("success");
    expect((resRead.state as { events: { type: string }[] }).events.map((e) => e.type)).toContain("hurricane");

    // 5. Researcher attempts event.spawn -> DENIED by runtime policy.
    const resSpawn = await engine.execute({
      requestId: rid("r2"), agentId: RESEARCH_MANDATE.agentId, tool: "event.spawn", arguments: { type: "tsunami" }, mandate: RESEARCH_MANDATE,
    });
    control.record(resSpawn.receipt);
    expect(resSpawn.receipt.result).toBe("denied");
    expect(resSpawn.receipt.reason).toBe("CAPABILITY_DENIED");

    // 6. Mission Control reflects provider, authority, events, receipts.
    const snap = await control.snapshot();
    expect(snap.provider.id).toBe("abyssal");
    expect(snap.provider.connected).toBe(true);
    const directorRow = snap.authority.find((a) => a.agentId === DIRECTOR_MANDATE.agentId);
    const researcherRow = snap.authority.find((a) => a.agentId === RESEARCH_MANDATE.agentId);
    expect(directorRow?.readOnly).toBe(false);
    expect(researcherRow?.readOnly).toBe(true);
    expect(snap.activeEvents.some((e) => e.type === "hurricane")).toBe(true);
    expect(snap.receiptLog.length).toBe(5);
    expect(snap.lastReceipt?.result).toBe("denied");

    // 7. The visible procedural-world consequence exists (weather mutated).
    expect((snap.worldState?.weather?.windSpeed ?? 0)).toBeGreaterThanOrEqual(20);
  });
});
