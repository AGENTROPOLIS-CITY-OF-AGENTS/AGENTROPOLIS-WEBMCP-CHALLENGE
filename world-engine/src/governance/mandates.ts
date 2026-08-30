import type { AgentMandate } from "./authorization";

export const DIRECTOR_MANDATE: AgentMandate = {
  agentId: "hermes-director",
  district: "ASBE",
  role: "virtual-production-director",
  capabilities: ["world.read", "weather.read", "weather.set", "camera.read", "camera.move", "camera.frame", "event.read", "event.spawn", "event.cancel", "render.read", "render.quality", "capture.frame", "capture.sequence"]
};

export const RESEARCH_MANDATE: AgentMandate = {
  agentId: "world-researcher",
  district: "WORKER",
  role: "environment-researcher",
  capabilities: ["world.read", "world.inspect", "weather.read", "camera.read", "event.read", "render.read"]
};

export const GAMEPLAY_OBSERVER_MANDATE: AgentMandate = {
  agentId: "gameplay-observer",
  district: "GAMING",
  role: "world-observer",
  capabilities: ["world.read", "weather.read", "event.read"]
};
