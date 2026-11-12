# PARALLAX Independent Attestation Protocol

## Status
Normative protocol requirement for the PARALLAX closed-loop spatial construction system.

## Security property

PARALLAX MUST NOT treat its own post-action observation or local verdict as final proof that an objective was satisfied.

The execution loop is:

`Observe -> Mandate -> Act -> Re-observe -> Local Verdict -> Evidence Commitment -> External Verification -> Receipt`

PARALLAX may create evidence and a local verdict. Final attestation MUST be reproducible from committed evidence by a verifier outside the execution authority boundary.

## Evidence boundary

Before external verification, PARALLAX MUST commit the evidence required to evaluate the claim. Once committed, the evidence referenced by the final receipt MUST NOT be silently replaceable by the executing agent.

A success receipt MUST include, directly or by content-addressed reference:

- objective and mandate hash
- pre-state commitment
- dispatched action/tool-call commitment
- post-state commitment
- policy decision
- PARALLAX local verdict
- immutable evidence references
- verifier identity and version
- verifier verdict
- timestamps
- signatures or equivalent integrity commitments
- parent/chain receipt where applicable

An independent implementation MUST be able to inspect those commitments without trusting PARALLAX's local verifier.

## Denial is a positive event

Absence of a scene change MUST NOT be interpreted as proof that an action was denied. No visible change can also mean dispatch failure, executor failure, message loss, or no request at all.

A policy denial therefore MUST emit a first-class `DENIAL_RECEIPT`.

Minimum denial record:

```text
DENIAL_RECEIPT
request_id
request_hash
actor_identity
requested_capability
target
policy_snapshot_hash
decision = DENY
reason_code
decision_timestamp
dispatch_state = NOT_DISPATCHED
denying_authority
signature
audit_commitment
```

## Required invariant

> A denied action MUST produce a signed denial artifact and MUST NOT produce an execution-dispatch artifact.

The audit model MUST distinguish:

| State | Decision | Dispatch | State change |
| --- | --- | --- | --- |
| Allowed and succeeded | ALLOW | YES | YES |
| Allowed and failed | ALLOW | YES | NO |
| Denied | DENY | NO | NO |
| Never attempted | NONE | NO | NO |

A missing state change alone MUST NOT collapse these states.

## Authority separation

PARALLAX owns execution evidence and may issue a local verdict. Independent attestation belongs outside the executing agent boundary. In the Agentropolis architecture this should chain to the audit/verification plane, including Sentinel-6 or the Audit Ledger where available.

## Protocol rule

**No Receipt Without Evidence. No Denial Without a Denial Receipt. No Self-Attestation as Final Authority.**

## Demo acceptance criteria

The WebMCP challenge demo SHOULD demonstrate both paths:

1. A permitted spatial construction action with pre-state, dispatch, post-state, evidence commitment, independent verdict, and success receipt.
2. A prohibited spatial action that emits a denial receipt, emits no execution dispatch, produces no prohibited scene mutation, and remains distinguishable from an undispatched or failed request.

The verifier SHOULD be replaceable so a third party can validate committed evidence without running PARALLAX's verifier implementation.