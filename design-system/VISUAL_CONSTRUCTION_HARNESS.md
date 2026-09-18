# AGENTROPOLIS Visual Construction Harness

Status: submission-blocking for public production surfaces

## Principle

A successful build is not a successful deployment. A deployment passes only when the rendered production surface preserves the approved composition, behavior, accessibility, and evidence state.

## Construction corridor

Reference -> Art Direction -> Asset Generation -> Section Construction -> Motion Pass -> Continuity Pass -> Responsive Pass -> Visual Diff -> Deployment -> Deployment Capture -> Acceptance Receipt

## Model policy

The harness is model-agnostic. Fable, Claude, Codex, Gemini, local models, or other builders may propose or implement candidates. No provider is authority. Repository contracts, tests, visual evidence, and human approval are authority.

## Reference-first protocol

1. Capture references and record provenance.
2. Extract layout, typography, spacing, motion, and asset intent rather than blindly copying a source.
3. Lock art direction before generating whole-page candidates.
4. Build and review sections incrementally.
5. Generate cinematic media separately from core UI when practical.
6. Run a removal pass for duplication, filler, generic AI patterns, and unnecessary overlays.
7. Validate desktop, tablet, mobile, reduced-motion, and 200% zoom.
8. Capture approved local and deployed production surfaces.
9. Emit an acceptance receipt.

## DESIGN LOCK

Required:
- Obsidian foundation with cyan and red authority accents.
- Warm readable foreground text.
- Intentional typography and spacing.
- Depth must serve hierarchy.
- One dominant action per viewport where applicable.

Reject:
- generic SaaS card walls;
- uncontrolled purple-blue AI gradients;
- decorative glass everywhere;
- fake metrics or proof;
- repeated sections that communicate the same thing.

## MOTION LOCK

Motion must explain hierarchy, state, navigation, or spatial behavior.

- Scroll-driven or pinned media requires a static/reduced-motion equivalent.
- Decorative autoplay must not compete with evidence or controls.
- GPU-heavy surfaces must be lazy-loadable.
- Mobile may simplify motion without losing meaning.
- The proof must remain operable with animation disabled.

## ANTI-SLOP LOCK

Review for:
- repeated card grids and section templates;
- placeholder/filler copy;
- fabricated metrics, testimonials, receipts, or status;
- excessive gradients, glow, blur, badges, icons, and decorative chrome;
- vague AI jargon above the fold;
- duplicated CTAs;
- visual effects that reduce legibility;
- assets without provenance.

A human reviewer may reject a candidate even when automated checks pass.

## PRODUCTION PARITY LOCK

For every release candidate, compare approved local output with the deployed target at:
- desktop: 1440x900;
- tablet: 1024x768;
- mobile: 390x844.

Capture:
- commit SHA;
- build/run identifier;
- viewport;
- local reference capture;
- deployed capture;
- diff artifact when automation is available;
- known intentional differences;
- human approval.

A deployment is not accepted merely because HTTP, build, or Pages checks are green.

## Acceptance receipt

Store receipts under `evidence/design/`. A receipt should record:

```json
{
  "commit": "<sha>",
  "surface": "<route-or-url>",
  "design_lock": "pass|fail",
  "motion_lock": "pass|fail",
  "anti_slop_lock": "pass|fail",
  "production_parity_lock": "pass|fail",
  "viewports": ["1440x900", "1024x768", "390x844"],
  "reduced_motion_verified": true,
  "human_approved": false,
  "exceptions": []
}
```

## Authority

Source material inspires candidates. Models construct candidates. GitHub-tracked design contracts, governed components, evidence, and human acceptance determine what ships.
