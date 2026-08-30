import { describe, it, expect } from "vitest";
import { AbyssalProvider } from "../src/providers/abyssal/abyssal-provider";
import { AbyssalBridge } from "../src/providers/abyssal/bridge";
import { ProviderRegistry } from "../src/providers/registry";
import type { WorldProvider } from "../src/providers/provider";

describe("AbyssalProvider (contract)", () => {
  it("implements the full WorldProvider contract", async () => {
    const p = new AbyssalProvider();
    await p.connect();
    expect(p.id).toBe("abyssal");
    const caps = await p.capabilities();
    expect(caps).toContain("world.read");
    expect(caps).toContain("weather.set");
    expect(caps).toContain("event.spawn");
    await p.disconnect();
  });

  it("reports a world state with weather, events and render", async () => {
    const p = new AbyssalProvider();
    const s = await p.getState();
    expect(s.provider).toBe("abyssal");
    expect(s.environment.type).toBe("procedural-ocean");
    expect(Array.isArray(s.events)).toBe(true);
    expect(s.render?.renderer).toBe("abyssal");
  });

  it("setWeather reflects in getState", async () => {
    const p = new AbyssalProvider();
    await p.setWeather({ windSpeed: 40, stormIntensity: 1 });
    const s = await p.getState();
    expect(s.weather?.windSpeed).toBe(40);
    expect(s.weather?.stormIntensity).toBe(1);
  });

  it("spawnEvent creates an active event and mutates world consequence", async () => {
    const p = new AbyssalProvider();
    const evt = await p.spawnEvent({ type: "hurricane", position: { x: 0, y: 0, z: -200 }, intensity: 26 });
    expect(evt.type).toBe("hurricane");
    expect(evt.state).toBe("active");
    const s = await p.getState();
    expect(s.events.some((e) => e.id === evt.id)).toBe(true);
    expect(s.weather?.windSpeed).toBeGreaterThanOrEqual(20);
  });

  it("cancelEvent moves the event to cancelled", async () => {
    const p = new AbyssalProvider();
    const evt = await p.spawnEvent({ type: "rogue" });
    await p.cancelEvent(evt.id);
    const s = await p.getState();
    expect(s.events.find((e) => e.id === evt.id)?.state).toBe("cancelled");
  });

  it("reports a render state and honors setQuality", async () => {
    const p = new AbyssalProvider();
    const r = await p.getRenderState();
    expect(r.renderer).toBe("abyssal");
    const high = await p.setQuality("high");
    expect(high.qualityTier).toBe("high");
  });

  it("does not invent event types the bridge cannot verify", async () => {
    const p = new AbyssalProvider();
    await expect(p.spawnEvent({ type: "meteor_strike" })).rejects.toThrow(/no verified spawn/);
  });
});

describe("ProviderRegistry", () => {
  it("registers and resolves the active provider", async () => {
    const reg = new ProviderRegistry();
    const p = new AbyssalProvider();
    reg.register("abyssal", p, { active: true });
    expect(reg.activeId).toBe("abyssal");
    expect(reg.resolve()).toBe(p);
    expect(reg.list()).toEqual(["abyssal"]);
  });

  it("throws on duplicate registration", () => {
    const reg = new ProviderRegistry();
    reg.register("abyssal", new AbyssalProvider());
    expect(() => reg.register("abyssal", new AbyssalProvider())).toThrow(/already registered/);
  });

  it("throws when resolving a provider that is not registered", () => {
    const reg = new ProviderRegistry();
    expect(() => reg.resolve()).toThrow(/No active/);
  });

  it("reports provider capability membership", async () => {
    const reg = new ProviderRegistry();
    reg.register("abyssal", new AbyssalProvider(), { active: true });
    await expect(reg.hasCapability("abyssal", "event.spawn")).resolves.toBe(true);
    await expect(reg.hasCapability("abyssal", "event.cancel")).resolves.toBe(true);
  });
});

describe("provider is a drop-in WorldProvider", () => {
  it("satisfies the WorldProvider structural contract for a mock consumer", async () => {
    const provider: WorldProvider = new AbyssalProvider();
    const caps = await provider.capabilities();
    const state = await provider.getState();
    expect(caps.length).toBeGreaterThan(0);
    expect(state.provider).toBe("abyssal");
  });
});

describe("AbyssalBridge live-host path (verified upstream shapes)", () => {
  it("reads weather from a live host via verified upstream field names", () => {
    const host = {
      weather: {
        state: { windSpeed: 25, cloudCoverage: 0.7, rain: 0.5, fog: 0.3, storm: 0.8, gustiness: 0.6 },
        beaufort: [9, "GALE"],
        set(partial: Record<string, unknown>) {
          Object.assign(this.state, partial);
        },
      },
    };
    const bridge = new AbyssalBridge(host);
    expect(bridge.live).toBe(true);
    const w = bridge.getWeather();
    expect(w.windSpeed).toBe(25);
    expect(w.cloudCover).toBe(0.7);
    expect(w.rainIntensity).toBe(0.5);
    expect(w.preset).toBe("GALE");
    bridge.setWeather({ windSpeed: 40 });
    expect(bridge.getWeather().windSpeed).toBe(40);
  });

  it("maps verified Director spawn methods for live hosts", () => {
    const spawned: string[] = [];
    const host = {
      director: {
        spawnHurricane(x: number, z: number) {
          spawned.push(`hurricane@${x},${z}`);
        },
      },
    };
    const bridge = new AbyssalBridge(host);
    bridge.spawnEvent({ type: "hurricane", position: { x: 10, y: 0, z: -50 }, intensity: 20 });
    expect(spawned).toEqual(["hurricane@10,-50"]);
  });
});
