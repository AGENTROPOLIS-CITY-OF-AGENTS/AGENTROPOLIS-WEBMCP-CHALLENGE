# 3D World Specification — Governed WebMCP Corridor

Status: SPEC (derived from TERMINAL-HANDOFF.md + docs/FIGMA-UIUX-TRANSLATION.md + docs/ARCHITECTURE.md).
This file was referenced by the handoff but missing; it is now the canonical world spec.
Design language tokens and component translations live in `docs/FIGMA-UIUX-TRANSLATION.md` and are binding.

## Prime directive

The 3D world IS the interface. Not a dashboard, not cards, not a 3D background behind 2D controls.
A first-time user must understand the product within 15 seconds without a modal, tutorial, or chat prompt.

## Stack (decision locked for Codex)

- Vite + React + TypeScript
- Three.js via @react-three/fiber + @react-three/drei
- Governance engine, policy evaluator, receipt emitter, and WebMCP adapter as plain TS modules OUTSIDE the render loop; the world subscribes to a state store (zustand or equivalent) and renders consequences.
- No GLB assets required for v1. All structures are procedural geometry + emissive materials + text labels (drei `Text`/troika). Add glTF only if it materially improves a zone.
- One deployable static site. No backend needed for MVP: policy + receipts run client-side deterministically; that is sufficient to satisfy the corridor and must be labeled honestly in the README.

## World zones (linear corridor, motherboard-city layout)

```
ARRIVAL PLAZA
   |
WEBMCP GATEWAY  --trace-->  IDENTITY PLAZA  --trace-->  MANDATE CORRIDOR  --trace-->  POLICY GATE
                                                                                 |              \
                                                                          APPROVAL CHAMBER      EXECUTION FORGE
                                                                          (pink, off-axis)      (green, forge glow)
                                                                                                       |
                                                                                                  RECEIPT VAULT
                                                                                                  (overhead, archive spire)
```

- Arrival / Orientation Plaza: spawn point; Warden meets the user here.
- WebMCP Gateway: a chip/port array. Powers on (cyan edge glow + trace ignition) when a tool registers via `document.modelContext.registerTool`.
- Identity Plaza: actor pods (human / agent / service). Resolved identity attaches a marker to the traveling packet.
- Mandate Corridor: a tunnel of mandate plaques. Invalid/missing mandate => corridor physically blocks (barrier + red pulse); packet halts.
- Policy Gate: the dramatic center. A physical gate with three distinct states:
  - ALLOW -> opens, green wash
  - DENY -> stays closed, red rejection pulse propagates backward along the trace, route terminates
  - REQUIRE_APPROVAL -> amber/pink hold, side branch to Approval Chamber lights up
- Human Approval Chamber: pink-accented staging room. Packet parks there; attention beacon pulses. Approval is performed IN THE WORLD (select the packet, confirm at the chamber console), never via a floating modal.
- Execution Forge: green forge glow + machinery animation during real executor run.
- Receipt Vault / Audit Ledger: finished receipts (including DENIED and approval-pending receipts) fly from the Forge/Gate and dock as inspectable artifacts. Clicking an artifact opens an in-world detail panel (Orbitron title, Inter body) showing the full decision path.

## State -> consequence binding (mandatory, live only)

Every mapping below must be driven by REAL application state events. No prerecorded animation may be presented as live governance behavior.

| Real event | Visible 3D consequence |
|---|---|
| tool registered / unregistered (toolchange) | Gateway ports power on/off, cyan trace ignition |
| ActionRequest created | packet spawns at Gateway, enters first trace |
| identity resolved | actor marker attaches to packet |
| mandate invalid/missing | corridor barrier closes, packet blocked |
| decision ALLOW | Policy Gate opens green, packet proceeds |
| decision DENY | gate stays shut, red pulse backward, route terminates, denial receipt to Vault |
| decision REQUIRE_APPROVAL | packet diverts into Approval Chamber, beacon activates |
| human approves (in-world, bound to request hash) | chamber unlocks, packet resumes |
| execution starts/ends | Forge animates; output result attaches to packet |
| receipt emitted | artifact travels trace-to-Vault and docks |

## Autonomous behaviors

1. Opening camera: enters along a cyan trace into the Gateway; Warden appears; one sentence: "An agent found a tool. Follow the request to see who can actually authorize it." A first (clearly-labeled DEMO) packet traverses the ALLOW path in the first 15 seconds.
2. Event camera: on every state transition, camera smoothly reframes to the affected zone. User input interrupts and hands control to Explore mode.
3. Contextual labels: Orbitron zone name + one-line Inter role description fades in on camera approach. Always-on mini-HUD: current world state, mode, event ticker (accessibility: textual event log mirroring every 3D consequence).
4. Warden: embodied guide at a dock station; appears beside relevant events; projects up to 3 contextual actions; never requires chat.

## Modes

- GUIDED (default): autonomous camera + scripted-but-real demo flow
- EXPLORE: free orbit/walk camera, all zones inspectable
- INSPECT: focus on packet/receipt details
Mode selector is a minimal physical world object (Mode Toggle translation), plus keyboard (1/2/3). Reduced-motion mode: camera lerps replaced by cuts, packet movement slowed/simplified, scanline effects off.

## Demo contract (one tool, three outcomes)

Exactly ONE primary WebMCP tool registered first (Phase E rule): e.g. `agentropolis.execute_action` with strict JSON schema, bounded args, structured return. It routes through Identity -> Mandate -> Policy and produces ALLOW (low-risk read), REQUIRE_APPROVAL (state-changing), DENY (prohibited/out-of-mandate). Same world path visualizes all three.

## Browser/test surface

- Chrome 149+ origin trial token OR `chrome://flags/#enable-webmcp-testing` for local dev.
- Model Context Tool Inspector extension for WM-01/WM-02.
- ChatGPT in-app browser path for CHATGPT-01.
- API shape (verified against developer.chrome.com/docs/ai/webmcp, updated 2026-08-20): `document.modelContext.registerTool({name, description, inputSchema, execute})`, `getTools()`, `executeTool(tool, jsonArgs)`, `toolchange` event, AbortSignal cancellation, `annotations.readOnlyHint` / `untrustedContentHint` (use these to seed policy risk class).

## Scope kill switch

One polished district, not a city. Before adding any object ask: does it make WebMCP behavior visible, governance understandable, the 3D experience better, or judging evidence stronger? If no: do not build.

## Anti-patterns (hard no)

2D admin over 3D wallpaper; floating unexplained cards; hover-only critical actions; unreadable tiny 3D text; animation disconnected from real state; long unskippable cinematics; new design language outside the Figma tokens.
