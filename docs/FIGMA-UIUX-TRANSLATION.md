# Figma UI/UX Translation — Motherboard Guide to Autonomous 3D World

## Source design language
This document adapts the uploaded WIRED CHAOS Motherboard Figma guide into the AGENTROPOLIS WebMCP Challenge 3D world.

The source guide establishes:
- Base Black `#000000`
- Neon Cyan `#00FFFF`
- Glitch Red `#FF3131`
- Electric Green `#39FF14`
- Accent Pink `#FF00FF`
- Orbitron Bold 32px heading language
- Inter Regular 16px body language
- Cyan Glow
- Red Pulse
- CRT Scanline overlay
- motherboard / chip / trace-line metaphor
- reusable Chip Card, Trace Button, Agent Dock, Quest Widget, Mode Toggle

The challenge experience must preserve this grammar while translating it from a 2D board into a spatial 3D environment.

## Core UI/UX rule
Do not flatten the experience into panels floating over a 3D scene.

The 3D world is the interface.

HUD elements exist only for orientation, current state, and accessibility. Core understanding must come from world geometry, animated traces, embodied agents, spatial labels, and cause/effect.

## Token translation

### Base Black -> World substrate
Use `#000000` as the base void/infrastructure material family. The world should feel like a live motherboard city at night.

### Neon Cyan -> Active system traces
Use `#00FFFF` for:
- active data rails
- discovered WebMCP paths
- selected interactive objects
- active chip/port outlines
- camera-guidance traces

### Glitch Red -> blocked / denied / critical
Use `#FF3131` for:
- DENY outcomes
- prohibited boundaries
- policy rejection pulses
- execution faults

### Electric Green -> allowed / healthy / completed
Use `#39FF14` for:
- ALLOW outcomes
- successful execution
- verified states
- healthy live infrastructure

### Accent Pink -> human attention / agency
Use `#FF00FF` sparingly for:
- human approval chamber
- manual override affordances
- currently selected human-controlled object

## Typography

### Orbitron
Use for environmental headings, district names, gate labels, and large spatial markers.

Examples:
- WEBMCP GATEWAY
- IDENTITY PLAZA
- MANDATE CORRIDOR
- POLICY GATE
- EXECUTION FORGE
- RECEIPT VAULT

### Inter
Use for readable body copy:
- Warden narration
- receipt details
- contextual tooltips
- approval rationale
- accessibility overlays

## Effects translated into 3D

### Cyan Glow
Becomes emissive edge lighting on active paths and structures.

### Red Pulse
Becomes an animated rejection pulse that propagates backward from a denied policy boundary.

### CRT Scanline Overlay
Do not cover the whole viewport heavily. Use it selectively on holographic labels, terminal surfaces, and Warden projections.

## 2D component -> 3D equivalent

### Chip Card -> District Node
A physical chip-like building/node in the world.

Properties:
- emissive outline
- status LED
- readable label
- selectable by raycast/tap
- can expose contextual details when approached

### Trace Button -> Trace Path / Interaction Rail
Instead of a flat pill button, use a lit path, gate, rail, or hotspot that visibly communicates where an action leads.

### Agent Dock -> Warden Dock / Embodied Guide
The source Agent Dock becomes a physical station and embodied HERMES Warden presence.

Warden can:
- appear beside relevant system events
- project 3 contextual actions
- guide the camera
- explain state without forcing chat interaction

### Quest Widget -> Mission Ring
Translate the progress ring into a spatial mission/status ring around the active request or Warden beacon.

Suggested states:
- DISCOVERED
- IDENTIFIED
- MANDATE CHECKED
- POLICY DECIDED
- APPROVED (if required)
- EXECUTED
- RECEIPTED

### Mode Toggle -> World Mode Selector
Keep a minimal physical selector for modes such as:
- GUIDED
- EXPLORE
- INSPECT

Do not use Web2 | Hybrid | Web3 unless the actual challenge workflow requires those modes.

## World layout derived from motherboard map
The source guide places a central Chaos Core with chips connected by traces. The 3D translation keeps the same logic:

```text
               RECEIPT VAULT
                    |
                    |
WEBMCP GATE -> IDENTITY -> MANDATE -> POLICY -> EXECUTION
                                 |
                           APPROVAL CHAMBER
```

Each connection is a luminous trace rail that physically carries request packets.

The user can read the architecture by looking at the world.

## Zero-confusion UX
A first-time visitor should never land in an inert scene.

### First 15 seconds
1. Camera enters along a cyan trace.
2. WEBMCP GATEWAY powers on.
3. Warden appears.
4. One sentence explains the purpose:
   `An agent found a tool. Follow the request to see who can actually authorize it.`
5. A request packet starts moving.
6. Camera tracks it through the corridor.

No onboarding modal.
No wall of text.
No "click here to begin" unless autoplay is blocked.

## Spatial labels
Every major structure gets:
- large Orbitron world label
- one-line role definition
- visible live state

Example:

`POLICY GATE`
`Evaluates whether this action is allowed, denied, or requires you.`

The role line should appear automatically as the camera approaches.

## Interaction priority
1. Automatic world choreography
2. Direct object selection
3. Proximity/context interaction
4. Minimal HUD
5. Chat/text command only as optional power-user input

The experience must not depend on the user asking what to do.

## Figma file organization for this project
When a dedicated Figma design file is created, use this structure:

- `00 — Tokens & Styles`
- `01 — 3D World Map`
- `02 — World Zones`
- `03 — HUD & Components`
- `04 — Autonomous Camera Flows`
- `05 — Governance States`
- `06 — Responsive / Performance States`
- `07 — Prototype & Demo Sequence`

## Figma component library
Create reusable components/variants for:
- District Node
- World Label
- Status LED
- Warden Dock
- Warden Speech Projection
- Mission Ring
- Approval Beacon
- Receipt Artifact
- Minimal HUD
- Guided / Explore / Inspect selector
- ALLOW / DENY / REQUIRE_APPROVAL state treatments

## Prototype flows
The Figma prototype should demonstrate the complete autonomous experience, not only screen navigation.

### Flow 1 — Arrival
Arrival -> Gateway -> request packet begins

### Flow 2 — ALLOW
Gateway -> Identity -> Mandate -> Policy ALLOW -> Execution -> Receipt

### Flow 3 — REQUIRE_APPROVAL
Gateway -> Policy -> Approval Chamber -> human approval -> Execution -> Receipt

### Flow 4 — DENY
Gateway -> Policy -> boundary closes -> denial receipt

## Accessibility
- high contrast labels
- reduced-motion option
- keyboard/tap alternatives to free-camera navigation
- no essential information encoded by color alone
- optional textual event log for assistive technology
- readable typography even when 3D effects are reduced

## Anti-patterns
Do not build:
- a 2D admin dashboard over a decorative 3D background
- unexplained floating sci-fi cards
- hover-only critical interactions
- tiny unreadable text in 3D space
- animation disconnected from actual application state
- cinematic sequences that lock out user control for long periods

## Definition of UI/UX success
A user should understand the product by watching and moving through it.

They should be able to answer, without asking a chatbot:
- what entered the system
- who requested it
- whether it was authorized
- whether a human had to approve it
- whether it executed
- where the receipt went

The experience should feel like entering the AGENTROPOLIS Intelligence Grid, not opening a software dashboard.
