# Terminal Handoff - AIP / Multimodal WebMCP

Branch: `feat/multimodal-intent-protocol`

## Already landed on branch

- `docs/AGENTROPOLIS-INTENT-PROTOCOL.md`
- `docs/WEBMCP-3D-INTERACTION-SPEC.md`
- `contracts/intent.schema.json`

## Implementation order

Do not build camera gesture recognition first. Prove the canonical intent path with deterministic adapters, then add recognition.

### P0 - protocol/runtime

Create:

```text
src/intent/types.ts
src/intent/normalize.ts
src/intent/resolve.ts
src/intent/registry.ts
src/adapters/pointer.ts
src/adapters/keyboard.ts
src/adapters/touch.ts
src/governance/intent-gate.ts
src/receipts/interaction-receipt.ts
```

Requirements:

1. all adapters emit the same `AgentropolisIntent`
2. validate against `contracts/intent.schema.json`
3. no adapter invokes WebMCP directly
4. every invocation goes through existing mandate/policy/permission path
5. propagate intent id into the execution receipt

### P0 - world objects

Implement minimal representations for:

```text
SiteObject
CapabilityObject
AgentObject
MissionObject
ReceiptObject
PermissionGate
ExecutionTether
```

Do not spend time on cinematic polish until the governance loop works.

### P0 - demo path

Implement one deterministic workflow:

```text
SiteObject
 -> discover WebMCP capability
 -> inspect
 -> assign to AgentObject
 -> AIP intent
 -> governance
 -> execute/simulate with explicit status
 -> ReceiptObject
```

### P1 - safety demo

Add a second capability whose policy produces either `REQUIRE_APPROVAL` or `DENY`.

Add `stop` semantics and prove the receipt reports whether cancellation actually succeeded.

### P1 - modality equivalence

Demonstrate the same operation through at least:

- pointer
- keyboard
- touch OR voice

### P2 - gesture recognition

Only after P0/P1 are working, implement `src/adapters/gesture.ts`.

Suggested gesture vocabulary:

```text
POINT -> inspect
PINCH -> compress
SPREAD -> expand
ROTATE -> alternate
SWIPE_RIGHT -> approve
SWIPE_LEFT -> reject
PALM_STOP -> stop
REVERSE_SWIPE -> undo
```

Recognition must include confidence and ambiguity handling. Low-confidence consequential intents must not auto-execute.

### P2 - XR/gamepad

Add adapters only if challenge time remains. They should emit AIP intents, not special-case WebMCP calls.

## Suggested types

```ts
export type VerificationStatus =
  | "mocked"
  | "simulated"
  | "experimental"
  | "verified";

export interface NormalizedInput<T = unknown> {
  mode: "gesture" | "touch" | "pointer" | "keyboard" | "voice" | "gamepad" | "xr" | "accessibility";
  signal: T;
  confidence?: number;
  timestamp: string;
}
```

## Tests to add

```text
intent-schema.test
adapter-equivalence.test
intent-cannot-bypass-policy.test
high-risk-requires-approval.test
stop-receipt.test
receipt-intent-provenance.test
unknown-capability-denied.test
low-confidence-consequential-intent.test
```

Critical assertions:

- gesture/pointer/keyboard adapters cannot directly execute tools
- an unauthorized intent cannot become authorized because of input modality
- unknown risk/reversibility is displayed as unknown, never guessed
- failed stop is reported as failed stop
- receipt links back to the originating intent id

## Demo acceptance checklist

```text
[ ] capability spatially discoverable
[ ] capability metadata inspectable
[ ] pointer emits canonical intent
[ ] keyboard emits equivalent canonical intent
[ ] third adapter emits equivalent intent
[ ] low-risk governed execution works
[ ] approval/deny path works
[ ] stop path works
[ ] receipt visible
[ ] receipt provenance inspectable
[ ] verification labels visible
[ ] no direct adapter -> tool bypass
[ ] conventional accessible control surface available
```

## Pitch line

> AGENTROPOLIS makes WebMCP capabilities spatially discoverable and multimodally executable while preserving identity, authority, policy, consent, and auditability.

## Build discipline

The Challenge repository is a proving ground. Do not push AIP into the canonical Utility Grid until challenge evidence shows which primitives deserve graduation.