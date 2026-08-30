import type { RenderState } from "../types.js";

export interface GovernorDecision {
  tier: string;
  action: "keep" | "downgrade" | "upgrade";
  reason: string;
  frameTimeMs: number;
}

export const QUALITY_TIERS = ["ultra", "high", "medium", "low", "potato"] as const;
export const TARGET_FRAME_MS = 16.7; // ~60fps
const PANIC_FRAME_MS = TARGET_FRAME_MS * 2.5; // sustained >~42ms -> shed a tier

/**
 * PerformanceGovernor — a deterministic quality gate over render telemetry.
 *
 * It is policy, not a magic autotuner: given a frame-time sample it emits a
 * stable "keep / downgrade / upgrade" decision. The executor only applies it
 * when the calling mandate is authorized for `render.quality`. This keeps the
 * adaptive loop auditable (each adjustment can be a receipt) instead of an
 * opaque side effect inside the renderer.
 */
export class PerformanceGovernor {
  constructor(
    private readonly tiers: readonly string[] = QUALITY_TIERS,
    private readonly targetMs: number = TARGET_FRAME_MS,
  ) {}

  /**
   * Evaluate one frame-time sample against the current tier.
   * Only moves at most one tier per call, so the world never oscillates.
   */
  decide(currentTier: string, frameTimeMs: number): GovernorDecision {
    const idx = this.tiers.indexOf(currentTier);
    const atBottom = idx < 0 || idx >= this.tiers.length - 1;

    if (frameTimeMs > PANIC_FRAME_MS && !atBottom) {
      return {
        tier: this.tiers[idx + 1] ?? currentTier,
        action: "downgrade",
        reason: `frame time ${frameTimeMs.toFixed(1)}ms exceeds panic threshold ${PANIC_FRAME_MS.toFixed(1)}ms`,
        frameTimeMs,
      };
    }
    if (frameTimeMs > this.targetMs * 1.25 && !atBottom) {
      return {
        tier: this.tiers[idx + 1] ?? currentTier,
        action: "downgrade",
        reason: `frame time ${frameTimeMs.toFixed(1)}ms above ${(this.targetMs * 1.25).toFixed(1)}ms target budget`,
        frameTimeMs,
      };
    }
    if (frameTimeMs < this.targetMs * 0.68 && idx > 0) {
      return {
        tier: this.tiers[idx - 1] ?? currentTier,
        action: "upgrade",
        reason: `frame time ${frameTimeMs.toFixed(1)}ms well under budget (${(this.targetMs * 0.68).toFixed(1)}ms); headroom to raise quality`,
        frameTimeMs,
      };
    }
    return {
      tier: currentTier,
      action: "keep",
      reason: `frame time ${frameTimeMs.toFixed(1)}ms within budget; holding tier ${currentTier}`,
      frameTimeMs,
    };
  }

  /** Convenience: recommend a tier from a RenderState read. */
  recommend(render: RenderState): GovernorDecision {
    const current = render.qualityTier ?? "medium";
    const frameMs = render.frameTimeMs ?? this.targetMs;
    return this.decide(current, frameMs);
  }

  get bottomTier(): string {
    return this.tiers[this.tiers.length - 1] ?? "potato";
  }
}
