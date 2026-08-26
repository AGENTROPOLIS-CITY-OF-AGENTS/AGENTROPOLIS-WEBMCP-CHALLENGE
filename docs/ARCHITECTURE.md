# Governed WebMCP Architecture

## Layer placement

This repository is an **Application / proving ground** consuming AGENTROPOLIS Intelligence Grid primitives. It is not the canonical Utility Grid.

- Infrastructure: identity, mandates, policy, dispatch, receipts, audit
- District / institution: Utility Grid governance contracts
- Application: WebMCP Challenge gateway + Mission Control demo

## Components

### 1. WebMCP Surface
Registers a deliberately small set of structured browser-facing tools.

Responsibilities:
- expose name, description, input schema
- translate invocation into a normalized action request
- never decide its own authority

### 2. Governance Gateway
Receives normalized action requests.

Decision inputs:
- actor identity
- agent identity
- mandate
- requested capability
- resource
- arguments
- risk class
- policy version

Decision outputs:
- ALLOW
- DENY
- REQUIRE_APPROVAL

### 3. Approval Gate
Human control plane for actions whose policy result is REQUIRE_APPROVAL.

Approval is scoped to the exact normalized action and expires after use or timeout. Approval must not become blanket authority.

### 4. Executor
Runs only an action carrying an ALLOW decision or a valid approval artifact.

### 5. Receipt Engine
Emits an immutable-shaped JSON record for every attempted action, including denials.

### 6. Mission Control
Human-readable visualization of:
- discovered tool
- requested action
- actor / agent
- mandate
- policy decision
- approval state
- execution result
- receipt ID

## Trust boundaries

```text
UNTRUSTED / REQUEST             GOVERNED CORE                  EFFECT

Agent intent
    |
WebMCP invocation ---> Normalizer ---> Policy Engine ----X----> denied
                                         |
                                         +--> approval gate
                                         |       |
                                         +-------+--> Executor ---> external effect
                                                        |
                                                        v
                                                     Receipt
```

WebMCP discovery itself grants **zero execution authority**.

## Risk classes

- R0 READ: non-sensitive read-only action; generally allow when mandate matches.
- R1 LOW WRITE: reversible low-impact state change; policy dependent.
- R2 SENSITIVE WRITE: external side effect, publication, purchase, deployment, account change; require approval by default.
- R3 PROHIBITED: outside mandate, secret access, destructive or disallowed action; deny.

## Non-negotiable invariant

No executor may be reachable directly from the WebMCP registration handler. Every invocation must traverse the governance decision path.
