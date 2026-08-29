# TERMINAL HANDOFF — HERMES // WEBMCP WARDEN

## Mission
Continue the WebMCP Challenge build from this repository without touching Higgsfield or production AGENTROPOLIS infrastructure.

## Non-negotiable product direction
This is **not a 2D dashboard and not a 3D background behind 2D controls**.

The product is a complete autonomous 3D world. The 3D world itself must explain and visualize:

`WebMCP Discovery -> Identity -> Mandate -> Policy -> Human Approval when required -> Execution -> Receipt -> Audit`

A first-time user should not need to ask what the product does. Camera choreography, embodied Warden guidance, environmental labels, moving request packets, policy gates, approval staging, execution effects, and receipt artifacts must make the system legible by itself.

Read `docs/3D-WORLD-SPEC.md` and `docs/FIGMA-UIUX-TRANSLATION.md` before implementation.

## First commands
```bash
git pull origin main
git status
find . -maxdepth 3 -type f | sort
```

Read in this order:
1. `agents/hermes-webmcp-warden/SYSTEM.md`
2. `docs/OFFICIAL-CHALLENGE-NOTES.md`
3. `docs/3D-WORLD-SPEC.md`
4. `docs/FIGMA-UIUX-TRANSLATION.md`
5. `docs/ARCHITECTURE.md`
6. `docs/SECURITY.md`
7. `docs/TEST-MATRIX.md`
8. GitHub Issue #1

## Hard cutoff
Treat September 3, 2026 at 1:00 PM Pacific as the submission deadline.

## Warden execution order

### Phase A — Verify runtime
- Record Node/package manager versions.
- Verify current WebMCP API syntax against official Chrome documentation/spec before writing API calls.
- Confirm the selected browser test path.
- Do not rely on stale remembered APIs.

### Phase B — Bootstrap the 3D world
Use the smallest web stack that can deliver a polished 3D environment quickly.

Preferred direction:
- React + TypeScript if it speeds delivery
- React Three Fiber or Three.js for the world
- deterministic governance/WebMCP modules outside the render loop
- GLB/glTF only where assets materially improve the scene

Required world zones:
- Arrival / Orientation Plaza
- WebMCP Gateway
- Identity Plaza
- Mandate Corridor
- Policy Gate
- Human Approval Chamber
- Execution Forge
- Receipt Vault / Audit Ledger

Required autonomous behaviors:
- guided opening camera sequence
- embodied HERMES // WEBMCP WARDEN
- live request packet traversal
- world state derived from real backend/application state
- contextual labels that appear automatically
- manual Explore mode
- reduced-motion mode

The first 15 seconds must make the product understandable without a tutorial modal or chat prompt.

### Phase C — Implement contracts
Implement types/interfaces matching:
- `contracts/action-request.schema.json`
- `contracts/decision.schema.json`
- `contracts/execution-receipt.schema.json`

Policy API should be deterministic:
```ts
type Effect = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
function evaluate(request: ActionRequest, context: PolicyContext): Decision;
```

Executor must reject any request without a valid ALLOW decision or a consumed human approval bound to the exact request.

### Phase D — Bind real state to the world
Every application transition gets a visible consequence:
- tool discovered -> Gateway powers on
- request created -> packet spawns
- identity resolved -> actor marker attaches
- invalid mandate -> corridor blocks
- ALLOW -> Policy Gate opens green
- DENY -> gate blocks and emits red rejection pulse
- REQUIRE_APPROVAL -> packet enters holding chamber and human attention beacon activates
- human approval -> chamber unlocks
- execution -> Execution Forge animates
- receipt -> artifact travels to Receipt Vault

No prerecorded animation may be presented as live governance behavior.

### Phase E — WebMCP
Register exactly one primary tool first. Give it:
- precise name
- short description
- strict JSON schema
- bounded arguments
- useful structured return value

Do not register a large tool catalog before the first tool passes the test matrix.

### Phase F — Figma UI/UX discipline
Use the uploaded motherboard design language as defined in `docs/FIGMA-UIUX-TRANSLATION.md`:
- black substrate
- cyan active traces
- red denied/critical states
- electric green allow/success states
- pink human-agency/approval accents
- Orbitron environmental headings
- Inter readable body text
- chip/node architecture
- trace-based movement and interaction
- Agent Dock -> embodied Warden
- Quest Ring -> spatial mission/status ring

Do not invent a separate generic sci-fi design system.

### Phase G — Tests
Implement automated unit tests for policy and receipts before polishing effects.
Run the manual WebMCP tests from `docs/TEST-MATRIX.md`.

Add 3D UX verification:
- first-time user can identify purpose without asking
- autonomous camera reaches the active event
- manual controls can interrupt guided mode
- all three governance decisions have distinct spatial/visual states
- approval is performed in-world
- receipt can be inspected in-world
- mobile/low-power mode remains 3D

### Phase H — Deploy
Deploy live. Verify the deployed build, not only localhost.

### Phase I — Evidence
Capture real evidence for each verified test. Never manufacture output.

### Phase J — Submission
Prepare:
- final README
- live URL
- repository URL
- project description
- 3D world screenshots
- architecture/world map image if useful
- <=3 minute demo video
- Devpost submission fields

## Default demo contract
If no stronger workflow is discovered during implementation, use one governed WebMCP operation with three policy outcomes:
- low-risk action -> ALLOW
- state-changing action -> REQUIRE_APPROVAL
- prohibited/out-of-mandate action -> DENY

The same world path must visualize all three outcomes.

## Scope kill switch
A complete 3D world does **not** mean a giant unfinished city.

Build one polished district-scale environment. Before adding anything ask:
1. Does it make WebMCP behavior visible?
2. Does it make governance/approval/receipts understandable?
3. Does it improve the autonomous 3D experience?
4. Does it improve judging evidence?

If no: do not build it.

## Completion declaration
Warden may set `READY_FOR_DEMO` only after the live deployed 3D application passes the required WebMCP/governance tests and a first-time user can understand the core flow without typing a question.

Warden may set `READY_TO_SUBMIT` only after all Devpost-required assets exist and have been manually reviewed.
