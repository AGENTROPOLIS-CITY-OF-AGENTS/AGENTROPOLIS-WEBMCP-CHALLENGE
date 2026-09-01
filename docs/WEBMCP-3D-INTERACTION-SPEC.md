# WebMCP 3D Interaction Spec

## Thesis

**Make WebMCP capabilities spatially discoverable and multimodally executable while preserving identity, authority, policy, consent, and auditability.**

The challenge experience should not require the visitor to first ask, "What can I do here?" Capability and state are represented by the environment itself.

## World primitives

- `AgentObject` - governed agent identity in-world
- `SiteObject` - WebMCP-enabled provider/site
- `CapabilityObject` - discoverable action surface
- `MissionObject` - proposed or active governed work
- `ReceiptObject` - inspectable proof of execution/denial
- `PolicyBarrier` - visible policy restriction
- `PermissionGate` - consent/authorization checkpoint
- `ExecutionTether` - visible temporary relationship between agent and capability
- `DispatchPortal` - cross-zone/district routing affordance

## Capability state language

- AVAILABLE: discoverable and eligible for evaluation
- LOCKED: visible, blocked by identity/mandate/policy/permission
- NEEDS_CONSENT: eligible but explicit approval is required
- ACTIVE: execution is underway
- COMPLETE: execution finished and receipt exists
- FAILED: execution failed; recovery/inspection is available

Visual styling must not be the only state carrier; text/icon/accessibility metadata must expose the same state.

## Core interaction loop

```text
approach SiteObject
  -> discover CapabilityObjects
  -> inspect capability
  -> select / drag / voice / keyboard-bind capability
  -> normalize AIP intent
  -> resolve target + scope
  -> evaluate governance corridor
  -> if authorized: Context Dynamics scheduling (when enabled)
  -> execute / cool / explore
  -> validate
  -> materialize ReceiptObject
```

## Demonstration gestures

- point at site/capability: inspect
- grab capability and move to agent: request delegation/binding
- pinch: compress scope
- spread: expand scope
- rotate: request alternatives
- swipe right: approve where approval is allowed
- swipe left: reject
- palm stop: emergency stop intent
- rewind: request undo/rollback where supported

These are replaceable bindings. Every critical operation needs an equivalent non-gesture path.

## Capability card

Inspection should reveal at minimum:

```text
CAPABILITY
Name
Provider
Description
Inputs
Data requested
Mutation scope
Permissions
Risk
Reversible: YES/NO
Estimated cost: value/unknown
Status
```

Never imply reversibility, cost, permission, or verification when unknown.

## Capability-to-agent binding

Dragging/assigning a capability to an agent creates a **request**, not authority.

```text
CapabilityObject
      |
      | intent: bind/delegate
      v
AgentObject
      |
      v
Mission Control
      |
      v
Identity -> Mandate -> Policy -> Permission
```

If allowed, an `ExecutionTether` may appear. Its lifecycle scope must be explicit:

- mission-scoped
- session-scoped
- persistent
- prohibited

Default challenge behavior should prefer mission-scoped authority.

## Agent-to-agent interaction

Moving Agent A toward Agent B means `request collaboration`, never unrestricted delegation. Mission Control resolves role, mandate, skills, district boundary, and policy before dispatch.

## Consequential actions

High-risk or irreversible actions must not use ambiguous gestures as final authorization. Surface an explicit mission preview and require a policy-approved confirmation mechanism.

## Stop semantics

`stop` is a first-class safety intent. The runtime should:

1. receive stop intent
2. identify active mission(s) within scope
3. request cancellation/interruption
4. report whether interruption succeeded
5. issue a receipt

Never claim an operation stopped until the underlying runtime confirms it.

## Receipt interaction

A ReceiptObject should expose:

```text
intent
identity
agent
capability/provider
policy decision
permission decision
scheduler decision
execution result
time
cost when known
changes
provenance
rollback availability
verification status
```

## Accessibility

The 3D world is an enhancement, not an accessibility dependency. Required alternatives include keyboard navigation and a conventional semantic control surface. Voice, touch, gamepad, XR, and gesture modes are optional adapters to the same AIP intent model.

## 60-90 second judge demo

1. Enter world; no prompt box is required.
2. Approach a WebMCP-enabled SiteObject.
3. CapabilityObjects reveal themselves.
4. Inspect one and expose permission/risk metadata.
5. Assign a low-risk capability to an agent.
6. Mission Control evaluates authority.
7. Execute a real or explicitly simulated WebMCP operation.
8. Materialize and inspect its receipt.
9. Attempt a higher-risk capability and show approval/deny behavior.
10. Trigger `stop` on an active or explicitly simulated long-running mission.
11. Repeat one intent through a second input mode to prove modality independence.
12. End on the thesis: one intent, many interfaces, one governed execution path.

## Verification boundary

The demo must visibly distinguish `MOCKED`, `SIMULATED`, `EXPERIMENTAL`, and `VERIFIED`. Spatial spectacle is not evidence that a WebMCP call, policy decision, interruption, or receipt was real.