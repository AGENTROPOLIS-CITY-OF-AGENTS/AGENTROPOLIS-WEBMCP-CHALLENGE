# AGENTROPOLIS WORLD ENGINE v0.1

> Infrastructure becomes the terrain others must build on.

WORLD ENGINE is an experimental Layer 1 Intelligence Grid service for environments autonomous agents can perceive, manipulate, inhabit, and audit.

It is provider-agnostic. ABYSSAL (`Token-Gremlin/natural-disasters`) is the first proving-ground provider, not the definition of WORLD ENGINE.

## Corridor

`Identity -> Mandate -> Capability -> Policy -> Provider -> Execution -> Receipt -> Audit`

The existence of a browser capability does not grant an agent authority to invoke it.

## Initial semantic surface

- `world.get_state`
- `world.get_capabilities`
- `weather.get`
- `weather.set`
- `camera.get`
- `camera.move`
- `event.list`
- `event.spawn`
- `event.cancel`
- `render.performance`
- `render.set_quality`
- `capture.frame`

WebMCP should expose intent, not brittle screen coordinates.

## Provider boundary

All simulation-specific operations live behind a provider contract. Core AGENTROPOLIS code MUST NOT depend directly on ABYSSAL class names, DOM controls, Three.js objects, or WebGL2 implementation details.

Planned providers:

1. ABYSSAL
2. Three.js generic
3. WebGPU
4. Remote renderer
5. Future XR / spatial engines

## Challenge proof

The minimum challenge scenario demonstrates:

1. Hermes Director reads shared world state.
2. Director is authorized to change weather and spawn an environmental event.
3. A Research agent reads the same state.
4. Research attempts `event.spawn` and is denied by runtime policy.
5. Both successful and denied actions produce WORLD RECEIPTS.
6. Mission Control displays state, authority, provider, performance, and receipts.

The proof is not "AI clicks a hurricane button." The proof is an authorized browser agent operating a live procedural world through semantic capabilities with auditable consequences.

## Consumers

WORLD ENGINE is infrastructure consumed by districts and applications, including CREATOR/Construction, Hermes Director, ASBE, 789 Studios, NTRU entertainment/game systems, research workers, and the WebMCP Challenge application.

## Scope guard

Do not block v0.1 on blockchain anchoring, full mobile rendering, WebGPU migration, or generalized game-economy causality. Ship the semantic bridge, capability gate, receipts, and visible world first.

## Build & verify

```bash
cd world-engine
npm install
npm run typecheck   # TypeScript strict
npm run lint        # ESLint
npm test            # Vitest (37 tests: authorization, receipts, provider contract, governor, corridor eval)
npm run build       # tsc -> dist/
npm run demo        # Two-agent proof: Director WRITE vs Researcher READ + Mission Control HTML
```

The demo writes `mission-control.html` (self-contained, open in a browser) proving the corridor:
Identity -> Mandate -> Capability -> Policy -> Provider -> Execution -> Receipt.

### Provider note
`AbyssalProvider` runs headless/deterministic out of the box (no GPU/browser needed for tests). When constructed with a live ABYSSAL `App` (`AbyssalHost`), the `AbyssalBridge` drives the real verified upstream classes. All upstream names stay inside `providers/abyssal/`.
