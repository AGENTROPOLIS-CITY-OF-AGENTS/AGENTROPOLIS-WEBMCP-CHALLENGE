# AGENTROPOLIS WEBMCP CHALLENGE

> **Discovery is not authority. Connectivity is not permission. Execution requires governance.**

## Mission
Build a compact, working demonstration of governed agent interaction with the web through WebMCP.

This repository is an isolated challenge proving ground. It consumes or mirrors stable AGENTROPOLIS Intelligence Grid contracts but does not replace the canonical Utility Grid.

## Demonstration corridor

```text
WEB SURFACE
    |
    v
WEBMCP TOOL DISCOVERY
    |
    v
AGENTROPOLIS GATEWAY
    |
    +--> IDENTITY
    +--> MANDATE
    +--> POLICY / RISK
    +--> TOOL PERMISSION
    |
    v
HUMAN APPROVAL (when required)
    |
    v
EXECUTION
    |
    v
RECEIPT -> AUDIT -> MISSION CONTROL
```

## MVP
The challenge MVP needs exactly one convincing workflow.

### Required proof
- Website exposes structured WebMCP capability.
- Agent discovers capability.
- Agent requests execution.
- AGENTROPOLIS evaluates identity, mandate and policy.
- A state-changing or sensitive operation cannot silently bypass its approval requirement.
- Approved operation executes.
- Operation emits a machine-readable receipt.
- Mission Control renders the receipt and decision path.

## Repository boundary

### This repo owns
- WebMCP challenge implementation
- challenge-specific gateway adapter
- demo application
- Mission Control challenge UI
- sample policies
- test fixtures
- verification evidence
- demo script
- submission assets

### Utility Grid owns
- canonical reusable infrastructure concepts
- production governance contracts
- reusable utilities and skills
- long-term AGENTROPOLIS primitives

Reusable work discovered here graduates upstream only after the challenge implementation proves it.

## Build order
1. Verify challenge requirements and WebMCP API surface.
2. Select one demo workflow.
3. Implement WebMCP tool registration/discovery.
4. Implement governance envelope.
5. Implement allow / deny / approval-required decisions.
6. Implement execution receipt schema.
7. Implement Mission Control receipt visualization.
8. Build repeatable tests.
9. Capture evidence.
10. Package submission.

## Anti-scope-creep rule
If a feature does not strengthen **WebMCP**, **governance**, or **the judging demo**, it waits until after submission.

## Agent owner
`HERMES // WEBMCP WARDEN`

Agent contract: `agents/hermes-webmcp-warden/SYSTEM.md`

## Current state
**DISCOVERING**
