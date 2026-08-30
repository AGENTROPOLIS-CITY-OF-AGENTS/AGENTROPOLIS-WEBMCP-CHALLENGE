# WORLD ENGINE v0.1 — Terminal Handoff

Branch: `feature/world-engine-abyssal`

## Already established

- Provider-neutral WorldState types
- WorldProvider contract
- Capability-based authorization
- Role-separated Director / Research / Gameplay mandates
- WORLD RECEIPT contract
- Semantic WebMCP tool catalog
- Canonical WorldState JSON Schema
- ABYSSAL attribution and provider-boundary rules

## Next terminal actions — in order

1. Inspect repository package/workspace conventions and relocate `world-engine` only if required by the existing build layout.
2. Add a `ProviderRegistry` and `WorldEngine` executor around the committed contracts.
3. Add unit tests proving Director `event.spawn` succeeds and Research `event.spawn` is denied.
4. Clone/fork `Token-Gremlin/natural-disasters` separately. Do NOT vendor the entire upstream repo into this challenge repository.
5. Inspect verified ABYSSAL internals, especially `src/core/Quality.js`, `src/core/GpuProfiler.js`, `src/core/SharedUniforms.js`, `src/camera/CinematicCamera.js`, weather/director/event code, and ocean modules.
6. Implement a minimal ABYSSAL bridge using only verified upstream methods/state.
7. Implement `AbyssalProvider` against that bridge. Keep all upstream names inside the adapter.
8. Wire the first four challenge operations: `world.get_state`, `world.get_capabilities`, `weather.set`, `event.spawn`.
9. Return a WORLD RECEIPT for success, denial, and failure.
10. Add a Mission Control panel showing provider, current world state, agent authority, active events, performance, and last receipt.
11. Build the two-agent proof: Hermes Director WRITE vs Research READ.
12. Add deterministic browser/e2e capture only after the semantic proof works.
13. Run lint/typecheck/tests/build. Fix all failures before opening PR.
14. Open PR into `main`; do not auto-merge until CI and the live demo pass.

## Scope lock

Challenge minimum:

- WORLD ENGINE contract
- ABYSSAL adapter
- shared structured world state
- governed weather mutation
- governed event spawn
- one successful mutation receipt
- one denied mutation receipt
- visible procedural-world consequence
- Mission Control evidence

Defer WebGPU provider, remote rendering, ledger anchoring, broad game-economy causality, and mobile optimization until the minimum proof ships.

## Safety / truth rule

Never create fake ABYSSAL method names merely to make the adapter compile. Unsupported operations must report capability absence. Runtime authority is derived from Identity + Mandate + Policy, never from prompt wording.
