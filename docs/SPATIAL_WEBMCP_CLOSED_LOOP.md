# Spatial WebMCP / Closed-Loop Construction

## Thesis

WebMCP should not only let agents use websites. It should let agents understand, modify, and verify interactive worlds exposed by websites.

This implementation is inspired by closed-loop spatial reasoning patterns, without claiming or recreating Lucida itself.

## Demo objective

> Reconfigure this studio for an interview.

## Corridor

```text
USER INTENT
  -> WebMCP capability exposure
  -> inspect scene graph
  -> bounded mutation
  -> render/capture
  -> verification
  -> PASS / CORRECT
  -> construction receipt
```

## Capability surface

Factory primitives in `src/webmcp/tools/spatial-tools.ts` (consumed through the registered tool):

- `getScene()`
- `getObject(id)`
- `transformObject(mutation)`
- `setMaterial(id, material)`
- `setLight(id, intensity)`
- `captureView()`
- `verifyScene(objective, capture)`

Through WebMCP these are exposed as ONE registered tool, `agentropolis_spatial_closed_loop`, whose bounded `operation` enum is `inspect | translate | rotate | material | intensity | capture | verify`. Registration happens via `document.modelContext.registerTool` in `src/webmcp/register-spatial-webmcp.ts`, invoked from the app shell in `src/App.tsx`. When `document.modelContext` is unavailable, registration honestly reports `unsupported` and the visible demo continues in local governed mode; no exposure is claimed.

Capabilities are object-scoped. A structured object exposes explicit permissions rather than inviting brittle DOM or pixel automation. Every mutating operation passes `requireSpatialCapability` (src/webmcp/permissions.ts) before `applySpatialMutation`, and `applySpatialMutation` re-asserts the grant as a second gate. Read-only operations (inspect, scene capture, verify) are not authority-gated: they observe state and cannot change it.

## Hero demo implementation

The first challenge-ready implementation now includes:

- an interview-studio world graph
- an explicit correction plan
- a framework-independent SVG scene capture adapter
- a deterministic interview verifier
- a visible `SpatialStudioDemo` launched from the existing WebMCP HUD
- a construction receipt showing versions, mutation count and verification state
- focused Vitest coverage for permission denial and the full mutation -> capture -> verify -> receipt loop

The deterministic verifier is deliberately narrow. It proves the verification contract without claiming general visual intelligence. A model-backed visual verifier can later replace or augment it behind the same `SpatialVerification` interface.

## Governance

Generated != Verified.

Every mutation must pass through the spatial permission boundary. The result is not considered complete until a capture and verification step produces a receipt.

The browser capture is evidence of scene state, while the deterministic verifier evaluates explicit interview-studio invariants. These are separate steps on purpose.

Spatial WebMCP begins after core authorization. The core governance corridor owns identity, mandate and policy decisions; the spatial subsystem then handles inspect -> mutate -> capture -> verify -> receipt for the authorized capability surface.

## Scope boundary (GAP-E, explicit)

The spatial hero demonstrates the bounded spatial construction lane: WebMCP tool registration, object-scoped capability enforcement, content-addressed capture, deterministic verification, and a capture-bound construction receipt.

It does NOT independently claim the complete AGENTROPOLIS Identity -> Mandate -> Policy -> Execution -> Receipt -> Audit corridor. Spatial tool executions are not yet routed through the core governance engine's identity, mandate, and human-approval stages. That routing is a follow-up, not a present capability, and no part of this demo should be read as proving it.

## Hackathon scope

Keep the first hero demo deliberately small:

- one studio scene
- roughly five to seven safe spatial tools
- one natural-language objective
- one visible correction loop
- one auditable receipt

The protocol should remain generic enough to extend later into Creator, ASBE, 789 Studios, NTRU, Mission Control and other interactive districts.

## Verification status

Code for the visible loop and targeted tests is committed to the feature branch. Browser evidence and repository-wide test/build execution must still be run in the local/CI environment before claiming the hero demo verified.

See `docs/SPATIAL_WEBMCP_DEMO_ACCEPTANCE.md` for the acceptance matrix.
