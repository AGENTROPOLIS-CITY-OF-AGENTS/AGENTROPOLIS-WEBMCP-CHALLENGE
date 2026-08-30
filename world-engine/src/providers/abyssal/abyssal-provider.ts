import type { CameraState, RenderState, WeatherState, WorldCapability, WorldEvent, WorldState } from "../../types.js";
import type { WorldProvider, SpawnEventInput, CaptureResult } from "../provider.js";
import { AbyssalBridge, type AbyssalHost } from "./bridge.js";

/**
 * AbyssalProvider — a WORLD ENGINE WorldProvider backed by the verified
 * ABYSSAL bridge. All upstream names stay inside bridge.ts; this class speaks
 * only the neutral contract. In a live browser it is constructed with the
 * running ABYSSAL `App` (as `AbyssalHost`); in headless/deterministic mode it
 * is constructed with no host and the bridge's verified mirror drives state.
 */
export class AbyssalProvider implements WorldProvider {
  readonly id = "abyssal" as const;
  private readonly bridge: AbyssalBridge;
  private _connected = false;

  constructor(host?: AbyssalHost) {
    this.bridge = new AbyssalBridge(host ?? null);
  }

  async connect(): Promise<void> {
    this._connected = true;
  }

  async disconnect(): Promise<void> {
    this._connected = false;
  }

  async capabilities(): Promise<WorldCapability[]> {
    return [
      "world.read",
      "world.inspect",
      "weather.read",
      "weather.set",
      "camera.read",
      "camera.move",
      "camera.frame",
      "event.read",
      "event.spawn",
      "event.cancel",
      "render.read",
      "render.quality",
      "capture.frame",
    ];
  }

  async getState(): Promise<WorldState> {
    return {
      provider: this.id,
      timestamp: new Date().toISOString(),
      environment: { type: "procedural-ocean", seed: 1 },
      weather: this.bridge.getWeather(),
      camera: this.bridge.getCamera(),
      events: this.bridge.listEvents(),
      render: this.bridge.getRenderState(),
    };
  }

  async getWeather(): Promise<WeatherState> {
    return this.bridge.getWeather();
  }

  async setWeather(patch: Partial<WeatherState>): Promise<WeatherState> {
    return this.bridge.setWeather(patch);
  }

  async getCamera(): Promise<CameraState> {
    return this.bridge.getCamera();
  }

  async spawnEvent(event: SpawnEventInput): Promise<WorldEvent> {
    return this.bridge.spawnEvent(event);
  }

  async cancelEvent(id: string): Promise<void> {
    this.bridge.cancelEvent(id);
  }

  async getRenderState(): Promise<RenderState> {
    return this.bridge.getRenderState();
  }

  async setQuality(tier: string): Promise<RenderState> {
    return this.bridge.setQuality(tier);
  }

  async captureFrame(): Promise<CaptureResult> {
    // Deterministic build has no GPU frame to read back; report honestly.
    return {
      mimeType: "application/json",
      metadata: { note: "frame capture not available without a live renderer", provider: this.id },
    };
  }
}
