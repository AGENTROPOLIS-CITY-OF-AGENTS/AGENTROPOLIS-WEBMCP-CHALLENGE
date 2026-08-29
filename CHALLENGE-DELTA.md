# WebMCP Challenge Delta

Purpose: clearly distinguish pre-existing AGENTROPOLIS infrastructure from work created specifically for the 2026 OpenAI WebMCP Challenge.

Challenge build window begins August 25, 2026.

## Pre-existing AGENTROPOLIS foundation
The following categories existed before the challenge and may be referenced/reused rather than claimed as challenge-created work:

- AGENTROPOLIS three-layer city architecture: Infrastructure -> Districts -> Applications
- governance corridor concepts: Identity -> Mandate -> Plan/Policy -> Execute -> Receipt -> Audit
- Mission Control / human control-plane concept
- existing Three.js / 3D city experiments and reusable rendering patterns in other AGENTROPOLIS repositories
- existing HERMES agent/runtime concepts
- WIRED CHAOS / AGENTROPOLIS visual language and motherboard design grammar
- receipt/audit/governance concepts used elsewhere in the ecosystem

These are inherited project infrastructure and design language.

## Challenge-specific work
The WebMCP Challenge entry is responsible for the new integration layer and demonstrable product experience created during the challenge window, including:

- WebMCP Challenge repository and dedicated Warden lane
- current WebMCP tool registration/integration
- WebMCP request normalization into governed AGENTROPOLIS actions
- deterministic ALLOW / DENY / REQUIRE_APPROVAL challenge policy implementation
- exact-request human approval flow for sensitive action
- challenge-specific execution receipt schemas and evidence
- autonomous 3D WebMCP world connecting Gateway -> Identity -> Mandate -> Policy -> Approval -> Execution -> Receipt/Audit
- binding real WebMCP/application state transitions to visible 3D world consequences
- challenge-specific browser verification in ChatGPT and/or compatible Chrome
- challenge demo, evidence, README/submission copy, and Devpost assets

## Reuse policy
Reusing pre-existing infrastructure is allowed only with transparent attribution inside this repository. Reuse should accelerate implementation; it must not obscure which WebMCP work was newly completed during the challenge.

For every substantial reused module/pattern, record:
1. source repository/path
2. evidence/date showing it predates August 25, 2026 where available
3. what was reused
4. what was changed for this challenge

## Evidence table

| Component | Pre-existing source/evidence | Challenge-specific delta | Status |
| --- | --- | --- | --- |
| AGENTROPOLIS governance corridor | Existing AGENTROPOLIS architecture | Bind WebMCP requests to deterministic challenge policy + receipts | IN PROGRESS |
| Three.js / 3D city patterns | Existing AGENTROPOLIS 3D repositories/components | Build challenge-specific autonomous WebMCP world | IN PROGRESS |
| WIRED CHAOS motherboard UI language | Existing Figma/UI guide | Translate into spatial 3D world grammar | IN PROGRESS |
| HERMES | Existing agent/runtime | Dedicated WEBMCP WARDEN orchestration/verification role | IN PROGRESS |
| WebMCP | New challenge integration | Register, invoke, govern, visualize, verify | IN PROGRESS |

## Submission rule
Before release freeze, replace generic evidence descriptions above with concrete repository links/commit dates for every reused component that appears materially in the judged artifact.

Never describe inherited AGENTROPOLIS work as if it was created during the challenge window.
