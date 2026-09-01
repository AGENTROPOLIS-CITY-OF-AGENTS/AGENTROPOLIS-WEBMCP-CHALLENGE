# Agentropolis Intent Protocol (AIP)

> **One intent. Many interfaces. One governed execution path.**

AIP is the canonical multimodal intent layer for the AGENTROPOLIS WebMCP Challenge. It converts human interaction signals into normalized intent without granting execution authority.

## Non-negotiable rule

**Input is not authority.**

A gesture, voice command, touch event, keyboard binding, pointer action, gamepad event, XR controller movement, or accessibility-device signal only expresses intent. Execution still passes through the AGENTROPOLIS governance corridor.

```text
INPUT ADAPTER
    |
    v
INTENT NORMALIZER
    |
    v
CANONICAL INTENT
    |
    v
SCOPE RESOLVER
    |
    v
MISSION CONTROL ROUTER
    |
    v
IDENTITY -> MANDATE -> POLICY -> PERMISSION
    |
    v
WEBMCP CAPABILITY
    |
    v
EXECUTION
    |
    v
RECEIPT -> AUDIT
```

## Input profiles

AIP is input-agnostic. Initial profiles:

- GIP: Gestural Intent Profile
- TIP: Touch Intent Profile
- PIP: Pointer Intent Profile
- VIP: Voice Intent Profile
- KIP: Keyboard Intent Profile
- GPIP: Gamepad Intent Profile
- XRIP: XR Intent Profile
- A11Y-IP: Accessibility Intent Profile

All profiles MUST normalize into the same canonical intent schema.

## Canonical verbs

Initial verbs:

- inspect
- select
- delegate
- execute
- approve
- reject
- stop
- undo
- expand
- compress
- increase
- decrease
- alternate
- move
- bind

The protocol is intentionally small. Domain-specific semantics belong in capability metadata or skills, not in the input layer.

## Canonical intent

```ts
export type IntentVerb =
  | "inspect"
  | "select"
  | "delegate"
  | "execute"
  | "approve"
  | "reject"
  | "stop"
  | "undo"
  | "expand"
  | "compress"
  | "increase"
  | "decrease"
  | "alternate"
  | "move"
  | "bind";

export interface AgentropolisIntent {
  version: "0.1";
  id: string;
  verb: IntentVerb;
  actor: {
    identity: string;
    inputMode:
      | "gesture"
      | "touch"
      | "pointer"
      | "keyboard"
      | "voice"
      | "gamepad"
      | "xr"
      | "accessibility";
  };
  target: {
    type: "agent" | "website" | "capability" | "object" | "mission" | "content";
    id: string;
  };
  scope?: {
    selection?: string[];
    amount?: number;
    intensity?: number;
    direction?: string;
  };
  authority: {
    requiresConfirmation: boolean;
    riskClass: "low" | "medium" | "high";
  };
  context?: Record<string, unknown>;
}
```

## Gesture profile bindings

Gestures are bindings, not protocol verbs.

```text
POINT            -> inspect
TAP              -> select
DRAG_TO_AGENT    -> delegate
PINCH            -> compress
SPREAD           -> expand
ROTATE           -> alternate
SWIPE_RIGHT      -> approve
SWIPE_LEFT       -> reject
PALM_STOP        -> stop
REVERSE_SWIPE    -> undo
```

Bindings MUST be configurable and MUST have non-gesture equivalents.

## Modality equivalence

```text
INTENT      GESTURE        TOUCH        KEYBOARD      VOICE
inspect     point          tap          focus         "inspect"
approve     swipe right    swipe right  enter         "approve"
reject      swipe left     swipe left   escape        "reject"
expand      spread         pinch out    +             "expand"
compress    pinch          pinch in     -             "shorten"
stop        palm           stop button  ctrl+escape   "stop"
undo        rewind         undo         ctrl+z        "undo"
```

No critical workflow may depend exclusively on hand tracking.

## Capability discovery

WebMCP capabilities should become discoverable objects in the 3D world. A capability object exposes:

- what it does
- provider/site
- required permissions
- requested data
- mutation scope
- risk class
- reversibility
- estimated cost when available
- supported input bindings

Suggested states:

```text
AVAILABLE
LOCKED
NEEDS_CONSENT
ACTIVE
COMPLETE
FAILED
```

## Authority rules

AIP MUST NOT bypass:

1. Identity resolution
2. Mandate validation
3. Policy evaluation
4. Tool/capability permission
5. Confirmation thresholds
6. Context Dynamics scheduling when applicable
7. Receipt generation
8. Audit recording

### High-risk example

Dragging an agent onto a banking transfer capability means:

> "I intend for this agent to interact with this capability."

It does **not** mean:

> "Transfer funds without further authorization."

## Mission preview

Consequential actions SHOULD surface a preview before execution.

```text
MISSION
Agent: Hermes Commerce
Site: Example Provider
Action: Transfer
Amount: $250
Risk: HIGH
Reversible: NO
Permission: REQUIRED

[ APPROVE ] [ CANCEL ]
```

Low-risk actions may execute immediately if policy allows.

## Receipt objects

Receipts are first-class world objects, not hidden logs.

A receipt SHOULD expose:

- intent id
- actor identity
- input mode
- agent
- capability
- provider
- policy decision
- permission decision
- execution result
- timestamp
- cost if available
- changed resources
- provenance
- rollback availability
- Context Dynamics telemetry when used

## Skill Registry relationship

AIP is not a competing plugin system.

```text
INPUT
  -> AIP
  -> MISSION CONTROL
  -> SKILL REGISTRY
  -> DISTRICT SKILL
  -> WEBMCP CAPABILITY
```

Reusable WebMCP operations may graduate into governed skills after verification.

## Acceptance criteria

A challenge implementation of AIP is considered minimally demonstrated when:

- at least three different input modes normalize to the same intent shape
- at least one WebMCP capability is spatially discoverable
- at least one low-risk action executes through the governance corridor
- at least one high-risk or simulated destructive action requires approval or is denied
- `stop` interrupts an active operation or simulated operation
- an execution receipt is visible and inspectable
- mocked/simulated behavior is labeled as such

## Scientific and product boundary

AIP is an interaction and governance abstraction. It does not claim mind reading, autonomous authority inference, perfect gesture recognition, or universal semantic understanding. Recognition confidence, ambiguity, and policy decisions must be surfaced honestly.