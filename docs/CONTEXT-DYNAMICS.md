# WebMCP Context Dynamics

> Discovery creates possibilities. Authority constrains actions. Context Dynamics decides which authorized possibilities deserve compute.

## Purpose

This challenge uses a WebMCP-specific adaptation of Hermes Context Dynamics (HCD) as an execution governor between policy authorization and tool execution.

It is deliberately small enough to demonstrate during the challenge while exposing a path toward a reusable Hermes-native runtime primitive.

## Challenge corridor

```text
WebMCP Discovery
      |
      v
Identity -> Mandate -> Policy -> Permission
                              |
                    +---------+---------+
                    |                   |
                  DENY          ALLOW / APPROVAL
                    |                   |
                    v                   v
                 Receipt        Context Envelope
                                        |
                                        v
                               Dynamics Scheduler
                              /        |         \
                         EXECUTE     COOL      EXPLORE
                            |          |           |
                            |       Receipt     bounded fork
                            |                      |
                            +----------+-----------+
                                       |
                                       v
                                    Validate
                                       |
                                       v
                                    Receipt
                                       |
                                       v
                                Mission Control
```

## Context Envelope

Every authorized candidate action can be wrapped in a portable envelope:

```json
{
  "parent_session_id": "session-91",
  "task_id": "webmcp-42",
  "snapshot_id": "snap-a91",
  "objective": "complete authorized checkout step",
  "capability_scope": ["webmcp:cart.read", "webmcp:cart.write"],
  "mutation_policy": "validated-write",
  "token_budget": 12000,
  "wall_time_budget_ms": 30000,
  "priority": 0.82
}
```

Context inheritance does not imply capability inheritance. Capability scope is derived from the governance decision and must never be widened by a fork.

## Context Thermodynamics

Thermodynamics is an engineering metaphor for bounded resource pressure, not a claim about physical thermodynamic computation.

For candidate action `i`, the challenge implementation may compute a normalized pressure score:

```text
P_i =
  w_u * urgency
+ w_g * expected_information_gain
+ w_d * dependency_value
- w_c * cost_pressure
- w_x * context_pressure
- w_l * latency_pressure
- w_s * staleness
```

The scheduler can choose among three challenge-visible states:

- **EXECUTE** — authorized and worth immediate resources.
- **COOL** — authorized but low-value or over-budget; defer, summarize, expire, or return a non-execution receipt.
- **EXPLORE** — uncertainty justifies a bounded read-only or explicitly scoped fork before mutation.

No pressure score may override policy. A denied capability remains denied regardless of expected value.

## Quantum-inspired frontier

The optional experimental layer is **quantum-inspired**, implemented on classical hardware, and makes no quantum speedup claim.

When multiple authorized strategies remain plausible, assign normalized weights `p_i` and measure classical Shannon entropy:

```text
H = -sum(p_i * log2(p_i))
```

High entropy indicates unresolved alternatives and can justify bounded parallel exploration. Low entropy indicates convergence and can trigger early collapse to the leading strategy.

For the challenge, this is useful as an explainable anti-sprawl mechanism: parallel agents are not spawned merely because they can be.

## Lifecycle events

The runtime should expose a minimal event stream:

```text
context.created
context.authorized
context.scheduled
context.cooled
context.forked
context.executed
context.validated
context.rejected
context.completed
```

These events feed Mission Control and the receipt chain.

## Receipt extension

Execution receipts should be able to include an optional `context_dynamics` block:

```json
{
  "context_dynamics": {
    "task_id": "webmcp-42",
    "parent_session_id": "session-91",
    "snapshot_id": "snap-a91",
    "decision": "execute",
    "pressure": 0.71,
    "entropy": 0.38,
    "budget": {
      "token_limit": 12000,
      "wall_time_ms": 30000
    },
    "forks_created": 0,
    "validation": "passed"
  }
}
```

The block is additive so the challenge's existing receipt contract can remain backward compatible.

## WebMCP demonstration

The demo should make the distinction between these questions visible:

1. **What tools did the website expose?** — WebMCP discovery.
2. **What is this agent allowed to do?** — Identity, mandate, policy and permission.
3. **What should run now?** — Context Dynamics scheduling.
4. **What actually happened?** — execution receipt.
5. **Can a human reconstruct why?** — Mission Control audit trail.

This turns the submission from a governed tool gateway into a governed, resource-aware agent execution loop.

## Scientific and product boundaries

- No quantum hardware is required.
- No quantum advantage or speedup is claimed.
- Shannon entropy is a classical heuristic.
- Thermodynamic terminology describes resource-pressure accounting.
- Context Dynamics cannot grant authority.
- Forks cannot silently expand capability scope.
- Experimental scheduling must be feature-gated and distinguishable from verified challenge behavior.

## Graduation path

Challenge-specific code stays in this repository. Reusable abstractions can graduate independently:

```text
WebMCP Challenge proving ground
          |
          +--> Hermes Context Dynamics upstream proposal
          |
          +--> AGENTROPOLIS runtime/governance adapters
```

The desired upstream unit is not AGENTROPOLIS branding. It is a provider-agnostic primitive for lineage, budgets, scheduling pressure, bounded exploration, validation, and receipts.
