import type { CameraState, RenderState, WeatherState, WorldCapability, WorldProviderId, WorldState, WorldEvent } from "../types.js";

export interface SpawnEventInput {
  type: string;
  position?: { x: number; y: number; z: number };
  intensity?: number;
  metadata?: Record<string, unknown>;
}

export interface CaptureResult {
  mimeType: string;
  uri?: string;
  bytes?: Uint8Array;
  metadata?: Record<string, unknown>;
}

export interface WorldProvider {
  readonly id: WorldProviderId;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  capabilities(): Promise<WorldCapability[]>;
  getState(): Promise<WorldState>;
  getWeather?(): Promise<WeatherState>;
  setWeather?(patch: Partial<WeatherState>): Promise<WeatherState>;
  getCamera?(): Promise<CameraState>;
  setCamera?(camera: Partial<CameraState>): Promise<CameraState>;
  spawnEvent?(event: SpawnEventInput): Promise<WorldEvent>;
  cancelEvent?(id: string): Promise<void>;
  getRenderState?(): Promise<RenderState>;
  setQuality?(tier: string): Promise<RenderState>;
  captureFrame?(): Promise<CaptureResult>;
}
