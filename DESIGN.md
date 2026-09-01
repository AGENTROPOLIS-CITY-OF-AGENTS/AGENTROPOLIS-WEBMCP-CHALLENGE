# AGENTROPOLIS WebMCP Design Contract

Status: **submission-blocking**  
Surface: **Mission Control for the governed WebMCP proof**  
Audience: judges, developers, operators, and non-technical observers.

## Product Truth

The interface demonstrates one idea:

> A website can expose agent capabilities without granting uncontrolled authority.

The visible corridor is:

```text
Discover -> Identity -> Mandate -> Policy -> Permission -> Execute -> Receipt -> Audit
```

The dominant action is **Run governed demo**. Secondary actions may inspect the request, policy decision, receipt, and evidence.

Experimental, simulated, and verified states must remain visibly distinct.

## Information Hierarchy

1. one-sentence proof;
2. run/reset demo controls;
3. current corridor step and decision;
4. human-readable explanation;
5. technical evidence and receipt;
6. architecture and supporting material.

Dense implementation detail belongs behind disclosure controls, tabs, or drill-down panels.

## Visual Tokens

- Canvas: near-black obsidian, not pure black.
- Primary text: warm white.
- Muted text: cool gray with WCAG-compliant contrast.
- Authority/deny: red, always paired with text or icon.
- Discovery/active data: cyan.
- Verified/success: restrained lime.
- Experimental: purple.
- Focus: high-contrast cyan outline with offset.
- Typography: Inter for UI; Orbitron only for short display labels.
- Spacing: 4/8px system.
- Radius: restrained; avoid a wall of floating cards.
- Elevation: borders and local contrast before blur or glow.

## Layout Rules

- One dominant action per viewport.
- Mobile starts as a single-column guided proof.
- Desktop may show the corridor and evidence side by side.
- Do not require a 3D scene to operate the proof.
- 3D may orient or dramatize state but must have an equivalent DOM representation.
- Keep primary copy readable over effects.
- Never hide decisions behind hover-only interactions.

## Motion

Motion explains state transitions and consequences.

- 120-220ms for controls and local state.
- 240-420ms for corridor transitions.
- No looping motion near evidence text.
- Honor `prefers-reduced-motion`.
- Reduced-motion mode must preserve every state change without animation.

## Component Sources

Priority order:

1. existing verified repository components;
2. governed local UI vault in `packages/ui-vault`;
3. provenance-recorded 21st.dev components;
4. new local component with tests and provenance.

Never import an unknown component directly into the submission path.

## Forbidden Patterns

- generic purple-blue AI gradients;
- decorative glassmorphism across every panel;
- fake metrics, users, executions, or receipts;
- excessive cards;
- tiny all-caps paragraphs;
- status communicated by color alone;
- auto-playing decorative motion;
- ornamental 3D blocking the workflow;
- unexplained agent jargon on the first screen.

## Accessibility Gate

Required before submission:

- keyboard-complete demo;
- visible focus;
- semantic landmarks and headings;
- accessible names for controls;
- status announcements that do not steal focus;
- contrast checks;
- zoom to 200%;
- reduced-motion path;
- mobile touch targets;
- no essential hover-only content.

## Performance Budget

Targets for the submission route:

- initial JavaScript: keep below 250 KB gzip where practical;
- avoid loading Three.js until the optional 3D surface is requested;
- no unexpected layout shift;
- responsive input during the governed demo;
- external assets must be enumerated by the UI-vault reports.

Any missed target must be documented as a known exception.

## Harness Protocol

OpenDesign Design Harness is an optional beta candidate generator and comparator.

1. Enable it in **Settings -> Open Design Labs -> Design Harness**.
2. Use this file unchanged for every candidate.
3. Generate two or three candidates only.
4. Compare without model/provider labels.
5. Score task clarity, hierarchy, trust, accessibility risk, responsiveness, and implementation cost.
6. Select one candidate.
7. Run repository validation, tests, build, accessibility checks, and performance checks.
8. Require human approval.
9. Save the evaluation receipt under `evidence/design/`.

Harness output cannot override the governance corridor or fabricate proof.

## Definition of Done

- the dominant action is obvious within five seconds;
- a non-technical user can explain the allow/deny/approval result;
- the receipt visibly matches the demonstrated action;
- all required repository checks pass;
- experimental claims are labeled;
- one human approves the final candidate;
- the deployed build matches the approved commit.
