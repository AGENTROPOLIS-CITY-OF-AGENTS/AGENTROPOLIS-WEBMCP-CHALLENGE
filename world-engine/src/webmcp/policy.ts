import type { WorldCapability } from "../types.js";

/**
 * The semantic WebMCP tool surface maps one-to-one onto WORLD ENGINE
 * capabilities. Exposing intent (a semantic capability) rather than brittle
 * screen coordinates is what WebMCP is for. The tool name is the wire-level
 * handle; the capability is the governed right.
 */
export const TOOL_TO_CAPABILITY: Readonly<Record<string, WorldCapability>> = {
  "world.get_state": "world.read",
  "world.get_capabilities": "world.read",
  "weather.get": "weather.read",
  "weather.set": "weather.set",
  "camera.get": "camera.read",
  "camera.move": "camera.move",
  "camera.frame": "camera.frame",
  "event.list": "event.read",
  "event.spawn": "event.spawn",
  "event.cancel": "event.cancel",
  "render.performance": "render.read",
  "render.set_quality": "render.quality",
  "capture.frame": "capture.frame",
  "capture.sequence": "capture.sequence",
};

/**
 * Map a WebMCP tool name to the governed capability it requires.
 * Returns null for unknown tools so the executor can emit a clean "unsupported
 * operation" receipt instead of guessing.
 */
export function toolToCapability(tool: string): WorldCapability | null {
  return TOOL_TO_CAPABILITY[tool] ?? null;
}
