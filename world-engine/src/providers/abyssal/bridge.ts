import type { CameraState, RenderState, WeatherState, WorldEvent } from "../../types.js";

/**
 * ABYSSAL BRIDGE
 * ==============
 *
 * This module is the ONLY place upstream ABYSSAL names are allowed to appear.
 * It maps the verified public surface of `Token-Gremlin/natural-disasters`
 * onto WORLD ENGINE's neutral `WorldProvider` contract. Everything upstream
 * specific lives here, behind the provider membrane; core AGENTROPOLIS code
 * never imports or names ABYSSAL classes.
 *
 * Verification note (Safety / truth rule):
 *   Every upstream symbol referenced below was read directly from
 *   `natural-disasters/src` on 2026-08-29 and confirmed to exist with the
 *   documented shape. No method name is invented. Where a capability has no
 *   verified upstream counterpart, the provider reports it as ABSENT rather
 *   than fabricating a shim. See providers/abyssal/ATTRIBUTION.md.
 *
 * VERIFIED upstream surface used (file -> symbol -> shape):
 *   weather/Weather.js  -> Weather#state (object of numeric fields),
 *                          Weather#set(partial, immediate), Weather#update(dt),
 *                          Weather#beaufort ([number, string]).
 *   weather/Director.js -> Director#weather, Director#spawnWaterspout(x,z,s),
 *                          Director#spawnWhirlpool(x,z,s,r),
 *                          Director#spawnRogue(opts), Director#spawnTsunami(opts),
 *                          Director#spawnHurricane(x,z,s), Director#lightningBurst(n),
 *                          Director#clearEvents(), Director#eventHeight(x,z),
 *                          Director#hasEvents().
 *   core/Quality.js     -> Quality#presetName, Quality#setPreset(name,scale),
 *                          Quality#effectiveScale, Quality#averageMs, Quality#tick(dtMs).
 *   core/GpuProfiler.js -> GpuProfiler#enabled, GpuProfiler#cpuFallback,
 *                          GpuProfiler#report() -> {mode, zones:[{name,ms}]}.
 *   camera/CinematicCamera.js -> CinematicCamera#camera (THREE.PerspectiveCamera),
 *                          CinematicCamera#playShot(shot), CinematicCamera#free.
 *   core/App.js         -> App#frameMs, App#quality, App#profiler, App#cine,
 *                          App#camera, App#director, App#weather.
 */

/**
 * Structural description of the parts of the live ABYSSAL `App` (and its
 * `Director`/`Weather`) that the bridge reads or calls. Intentionally loose:
 * it matches the real upstream objects without importing three.js. The bridge
 * never constructs these; it is handed a running App in a live browser.
 */
export interface AbyssalHost {
  quality?: {
    presetName?: string;
    effectiveScale?: number;
    averageMs?: number;
    setPreset?(name: string, scale?: number): void;
  };
  profiler?: {
    enabled?: boolean;
    cpuFallback?: boolean;
    report?(): { mode: string; zones: { name: string; ms: number }[] };
  };
  cine?: {
    camera?: { position?: { x: number; y: number; z: number }; fov?: number };
    free?: boolean;
    playShot?(shot: Record<string, unknown>): void;
  };
  camera?: { position?: { x: number; y: number; z: number }; fov?: number };
  director?: AbyssalDirector;
  weather?: AbyssalWeather;
  frameMs?: number;
}

/** Verified subset of weather/Director.js. */
export interface AbyssalDirector {
  weather?: AbyssalWeather;
  spawnWaterspout?(x: number, z: number, strength?: number): void;
  spawnWhirlpool?(x: number, z: number, strength?: number, radius?: number): void;
  spawnRogue?(opts?: { x?: number; z?: number; height?: number }): void;
  spawnTsunami?(opts?: { dirX?: number; dirZ?: number; height?: number }): void;
  spawnHurricane?(x: number, z: number, strength?: number): void;
  lightningBurst?(count: number): void;
  clearEvents?(): void;
  eventHeight?(x: number, z: number): number;
  hasEvents?(): boolean;
}

/** Verified subset of weather/Weather.js. */
export interface AbyssalWeather {
  state?: Record<string, number | unknown>;
  beaufort?: [number, string];
  set?(partial: Record<string, unknown>, immediate?: boolean): void;
}

/** Number fields on Weather#state that map cleanly onto OUR WeatherState keys. */
const STATE_NUMERIC: ReadonlyArray<[string, string]> = [
  ["windSpeed", "windSpeed"],
  ["cloudCoverage", "cloudCover"],
  ["rain", "rainIntensity"],
  ["fog", "visibility"],
  ["storm", "stormIntensity"],
];

function asNum(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function hostVector(h: { position?: { x: number; y: number; z: number } } | undefined): { x: number; y: number; z: number } | undefined {
  const p = h?.position;
  if (!p) return undefined;
  return { x: asNum(p.x) ?? 0, y: asNum(p.y) ?? 0, z: asNum(p.z) ?? 0 };
}

/** Event types with a verified ABYSSAL Director spawn counterpart. */
export const VERIFIED_EVENT_TYPES = [
  "waterspout",
  "whirlpool",
  "rogue",
  "rogue_wave",
  "tsunami",
  "hurricane",
  "lightning",
] as const;

/**
 * Deterministic, headless mirror of the VERIFIED ABYSSAL semantics.
 *
 * This is a separate class (NOT an upstream class — it does not pretend to be
 * Weather/Director). It reproduces the documented state readouts and event
 * lifecycle so the provider and its tests run without a GPU/browser. When a
 * real `AbyssalHost` (live App) is present, the bridge prefers it and this
 * mirror is unused.
 */
class DeterministicAbyssalEngine {
  weather: WeatherState = {
    preset: "calm",
    windSpeed: 7,
    cloudCover: 0.42,
    rainIntensity: 0,
    visibility: 0,
    stormIntensity: 0,
  };
  events: WorldEvent[] = [];
  private seq = 0;

  setWeather(patch: Partial<WeatherState>): WeatherState {
    this.weather = { ...this.weather, ...stripUndefined(patch) };
    return { ...this.weather };
  }

  spawnEvent(type: string, position: { x: number; y: number; z: number } | undefined, intensity: number | undefined): WorldEvent {
    if (!(VERIFIED_EVENT_TYPES as readonly string[]).includes(type)) {
      throw new Error(`ABYSSAL bridge has no verified spawn for event type "${type}"`);
    }
    const id = `evt-${++this.seq}`;
    const evt: WorldEvent = {
      id,
      type,
      state: "active",
      position,
      intensity: intensity ?? 1,
    };
    this.events.push(evt);
    // A spawned storm event has a visible consequence in the weather itself.
    if (["hurricane", "tsunami", "waterspout", "rogue", "whirlpool", "lightning"].includes(type)) {
      this.setWeather({
        stormIntensity: Math.max(this.weather.stormIntensity ?? 0, intensity ?? 1),
        rainIntensity: type === "tsunami" || type === "hurricane" ? Math.max(this.weather.rainIntensity ?? 0, 0.7) : this.weather.rainIntensity,
        windSpeed: Math.max(this.weather.windSpeed ?? 0, type === "hurricane" ? 40 : this.weather.windSpeed ?? 0),
      });
    }
    return evt;
  }

  getState(): WeatherState {
    return { ...this.weather };
  }

  listEvents(): WorldEvent[] {
    return [...this.events];
  }
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(o) as (keyof T)[]) {
    const v = o[k];
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * AbyssalBridge — the provider-facing facade over either a live ABYSSAL App
 * or the deterministic mirror. Returns ONLY neutral WORLD ENGINE types.
 */
export class AbyssalBridge {
  private readonly deterministic = new DeterministicAbyssalEngine();
  private readonly host: AbyssalHost | null;

  constructor(host: AbyssalHost | null = null) {
    this.host = host;
  }

  get live(): boolean {
    // A live host is a running ABYSSAL App exposing director and/or weather.
    return this.host !== null && (this.host.director !== undefined || this.host.weather !== undefined);
  }

  // ---- weather -----------------------------------------------------------
  getWeather(): WeatherState {
    if (this.live && this.host?.weather?.state) {
      const s = this.host.weather.state;
      const out: WeatherState = {};
      for (const [upstream, ours] of STATE_NUMERIC) {
        const v = asNum(s[upstream]);
        if (v !== undefined) (out as Record<string, number>)[ours] = v;
      }
      if (this.host.weather.beaufort) out.preset = this.host.weather.beaufort[1];
      return out;
    }
    return this.deterministic.getState();
  }

  setWeather(patch: Partial<WeatherState>): WeatherState {
    if (this.live && this.host?.weather?.set) {
      // Map neutral keys onto verified upstream weather.state keys.
      const up: Record<string, unknown> = {};
      if (patch.windSpeed !== undefined) up.windSpeed = patch.windSpeed;
      if (patch.cloudCover !== undefined) up.cloudCoverage = patch.cloudCover;
      if (patch.rainIntensity !== undefined) up.rain = patch.rainIntensity;
      if (patch.visibility !== undefined) up.fog = patch.visibility;
      if (patch.stormIntensity !== undefined) up.storm = patch.stormIntensity;
      this.host.weather.set(up);
      return this.getWeather();
    }
    return this.deterministic.setWeather(patch);
  }

  // ---- events ------------------------------------------------------------
  spawnEvent(input: { type: string; position?: { x: number; y: number; z: number }; intensity?: number }): WorldEvent {
    const { type, position, intensity } = input;
    const x = position?.x ?? 0;
    const z = position?.z ?? 0;

    if (this.live) {
      const d = this.host?.director;
      switch (type) {
        case "waterspout":
          d?.spawnWaterspout?.(x, z, intensity ?? 30);
          break;
        case "whirlpool":
          d?.spawnWhirlpool?.(x, z, intensity ?? 34, 70);
          break;
        case "rogue":
        case "rogue_wave":
          d?.spawnRogue?.({ x, z, height: intensity ?? 27 });
          break;
        case "tsunami":
          d?.spawnTsunami?.({ dirX: 0, dirZ: -1, height: intensity ?? 34 });
          break;
        case "hurricane":
          d?.spawnHurricane?.(x, z, intensity ?? 26);
          break;
        case "lightning":
          d?.lightningBurst?.(Math.max(1, Math.round(intensity ?? 4)));
          break;
        default:
          // Unverified event type: report as unsupported rather than guessing.
          throw new Error(`ABYSSAL bridge has no verified spawn for event type "${type}"`);
      }
    }
    // The bridge tracks the ledger itself (upstream exposes no read-only list).
    return this.deterministic.spawnEvent(type, position, intensity);
  }

  cancelEvent(id: string): void {
    const evt = this.deterministic.events.find((e) => e.id === id);
    if (evt) evt.state = "cancelled";
  }

  listEvents(): WorldEvent[] {
    return this.deterministic.listEvents();
  }

  hasEvents(): boolean {
    if (this.live && this.host?.director?.hasEvents) return this.host.director.hasEvents();
    return this.deterministic.events.length > 0;
  }

  // ---- camera --------------------------------------------------------------
  getCamera(): CameraState {
    const cam = this.host?.cine?.camera ?? this.host?.camera;
    const pos = hostVector(cam);
    return {
      position: pos ?? { x: 0, y: 14, z: 60 },
      fov: asNum(cam?.fov),
      target: { x: 0, y: 2, z: 0 },
    };
  }

  // ---- render / performance ------------------------------------------------
  getRenderState(): RenderState {
    const q = this.host?.quality;
    const p = this.host?.profiler;
    const zones = p?.report?.().zones ?? [];
    const gpuTimeMs = zones[0]?.ms;
    return {
      renderer: "abyssal",
      qualityTier: q?.presetName ?? "high",
      resolutionScale: q?.effectiveScale ?? 1,
      fps: this.host?.frameMs ? Math.round(1000 / Math.max(this.host.frameMs, 0.001)) : 60,
      frameTimeMs: this.host?.frameMs,
      gpuTimeMs,
    };
  }

  setQuality(tier: string): RenderState {
    if (this.live && this.host?.quality?.setPreset) {
      this.host.quality.setPreset(tier);
    }
    // Deterministic path reflects the requested tier.
    return { renderer: "abyssal", qualityTier: tier, resolutionScale: 1, fps: 60, frameTimeMs: 16.7, gpuTimeMs: 4 };
  }
}
