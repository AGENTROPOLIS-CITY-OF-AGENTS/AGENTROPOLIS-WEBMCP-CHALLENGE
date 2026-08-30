import { describe, it, expect } from "vitest";
import { authorize } from "../src/governance/authorization";
import { DIRECTOR_MANDATE, RESEARCH_MANDATE } from "../src/governance/mandates";
import { toolToCapability } from "../src/webmcp/policy";

describe("authorization", () => {
  it("allows the Director to spawn an event", () => {
    const r = authorize({ agentId: DIRECTOR_MANDATE.agentId, capability: "event.spawn" }, DIRECTOR_MANDATE);
    expect(r.allowed).toBe(true);
  });

  it("allows the Director to set weather", () => {
    const r = authorize({ agentId: DIRECTOR_MANDATE.agentId, capability: "weather.set" }, DIRECTOR_MANDATE);
    expect(r.allowed).toBe(true);
  });

  it("DENIES the Researcher event.spawn", () => {
    const r = authorize({ agentId: RESEARCH_MANDATE.agentId, capability: "event.spawn" }, RESEARCH_MANDATE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("CAPABILITY_DENIED");
  });

  it("rejects identity mismatch", () => {
    const r = authorize({ agentId: "impostor", capability: "world.read" }, DIRECTOR_MANDATE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("IDENTITY_MISMATCH");
  });

  it("rejects an expired mandate", () => {
    const expired = { ...RESEARCH_MANDATE, expiresAt: "2000-01-01T00:00:00Z" };
    const r = authorize({ agentId: RESEARCH_MANDATE.agentId, capability: "world.read" }, expired);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("MANDATE_EXPIRED");
  });
});

describe("policy mapping", () => {
  it("maps the first four challenge tools to capabilities", () => {
    expect(toolToCapability("world.get_state")).toBe("world.read");
    expect(toolToCapability("world.get_capabilities")).toBe("world.read");
    expect(toolToCapability("weather.set")).toBe("weather.set");
    expect(toolToCapability("event.spawn")).toBe("event.spawn");
  });

  it("returns null for an unknown tool", () => {
    expect(toolToCapability("not.a.tool")).toBeNull();
  });
});
