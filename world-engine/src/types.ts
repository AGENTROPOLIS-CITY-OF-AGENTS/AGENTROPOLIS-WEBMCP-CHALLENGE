export type WorldProviderId = "abyssal" | "threejs" | "webgpu" | "remote";

export type WorldCapability =
  | "world.read" | "world.inspect"
  | "weather.read" | "weather.set"
  | "camera.read" | "camera.move" | "camera.frame"
  | "event.read" | "event.spawn" | "event.cancel"
  | "render.read" | "render.quality"
  | "capture.frame" | "capture.sequence";

export interface Vec3 { x: number; y: number; z: number; }
export interface CameraState { position: Vec3; target?: Vec3; fov?: number; }
export interface WeatherState {
  preset?: string;
  windSpeed?: number;
  cloudCover?: number;
  rainIntensity?: number;
  visibility?: number;
  stormIntensity?: number;
}
export interface WorldEvent {
  id: string;
  type: string;
  state: "queued" | "active" | "propagating" | "complete" | "cancelled";
  position?: Vec3;
  intensity?: number;
  metadata?: Record<string, unknown>;
}
export interface RenderState {
  renderer: string;
  qualityTier?: string;
  resolutionScale?: number;
  fps?: number;
  frameTimeMs?: number;
  gpuTimeMs?: number;
}
export interface WorldState {
  provider: WorldProviderId;
  timestamp: string;
  environment: { type: string; seed?: number };
  camera?: CameraState;
  weather?: WeatherState;
  events: WorldEvent[];
  render?: RenderState;
}
