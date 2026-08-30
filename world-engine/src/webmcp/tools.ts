export const WORLD_MCP_TOOLS = [
  { name: "world.get_state", description: "Read the current structured procedural world state." },
  { name: "world.get_capabilities", description: "List capabilities exposed by the active world provider." },
  { name: "weather.get", description: "Read current environmental and weather conditions." },
  { name: "weather.set", description: "Set authorized weather parameters." },
  { name: "camera.get", description: "Read the current virtual camera state." },
  { name: "camera.move", description: "Move an authorized virtual-production camera." },
  { name: "event.list", description: "List active procedural world events." },
  { name: "event.spawn", description: "Spawn an authorized environmental event." },
  { name: "event.cancel", description: "Cancel an authorized environmental event." },
  { name: "render.performance", description: "Read renderer, GPU, frame-time and quality telemetry." },
  { name: "render.set_quality", description: "Adjust rendering quality within policy limits." },
  { name: "capture.frame", description: "Capture the currently rendered frame." }
] as const;
