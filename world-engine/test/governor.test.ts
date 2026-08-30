import { describe, it, expect } from "vitest";
import { PerformanceGovernor, QUALITY_TIERS, TARGET_FRAME_MS } from "../src/performance/governor";

const g = new PerformanceGovernor();

describe("PerformanceGovernor", () => {
  it("holds tier when frame time is within budget", () => {
    const d = g.decide("high", TARGET_FRAME_MS);
    expect(d.action).toBe("keep");
    expect(d.tier).toBe("high");
  });

  it("downgrades when frame time exceeds the target budget", () => {
    const d = g.decide("high", 24);
    expect(d.action).toBe("downgrade");
    expect(d.tier).toBe("medium");
  });

  it("downgrades when frame time panics (multiple tiers not skipped at once)", () => {
    const d = g.decide("ultra", 200);
    expect(d.action).toBe("downgrade");
    expect(d.tier).toBe("high");
  });

  it("stays at the bottom tier even under extreme load", () => {
    const d = g.decide("potato", 500);
    expect(d.action).toBe("keep");
    expect(d.tier).toBe("potato");
  });

  it("upgrades when there is headroom", () => {
    const d = g.decide("low", 6);
    expect(d.action).toBe("upgrade");
    expect(d.tier).toBe("medium");
  });

  it("never upgrades above ultra", () => {
    const d = g.decide("ultra", 1);
    expect(d.action).toBe("keep");
    expect(d.tier).toBe("ultra");
  });

  it("recommends from a RenderState", () => {
    const d = g.recommend({ renderer: "abyssal", qualityTier: "high", frameTimeMs: 30 });
    expect(d.action).toBe("downgrade");
  });

  it("exposes ordered tiers", () => {
    expect(QUALITY_TIERS).toEqual(["ultra", "high", "medium", "low", "potato"]);
  });
});
