# AGENTROPOLIS WebMCP Challenge

> **Discovery is not authority. Connectivity is not permission. Execution requires governance.**

A governed WebMCP gateway for accountable autonomous agents, built on the AGENTROPOLIS Intelligence Grid for the WebMCP Challenge.

## What we're proving

WebMCP can make websites legible and actionable to agents. AGENTROPOLIS adds the missing control corridor between **discovering a capability** and **being authorized to execute it**.

The challenge also tests **Context Dynamics**: after authority is established, a resource-aware scheduler decides whether an authorized action should execute now, cool/defer, or receive bounded exploration before mutation. Scheduling can reduce unnecessary agent and inference sprawl, but it can never override policy.

```text
WebMCP discovery
      |
      v
Identity -> Mandate -> Policy -> Permission
                             |
              +--------------+--------------+
              |                             |
             DENY                    ALLOW / APPROVAL
              |                             |
              v                             v
           Receipt                  Context Envelope
                                            |
                                            v
                                   Context Dynamics
                                   /      |       \
                              EXECUTE    COOL    EXPLORE
                                 |         |         |
                                 +---------+---------+
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

## Challenge MVP

One repeatable governed WebMCP workflow demonstrating:

- structured WebMCP tool discovery
- normalized agent action requests
- mandate and policy evaluation
- allow / deny / require-approval decisions
- explicit Context Envelopes for authorized work
- resource-aware execute / cool / explore scheduling
- optional, clearly labeled quantum-inspired strategy weighting using classical Shannon entropy
- execution only after authority is established
- machine-readable execution receipts with optional Context Dynamics telemetry
- a human-readable Mission Control audit trail

See `docs/CONTEXT-DYNAMICS.md` for the scheduling model, scientific boundaries, lifecycle events, receipt extension, and graduation path.

## Repository boundary

This is a **challenge application / proving ground**. The canonical `AGENTROPOLIS-UTILITY-GRID` remains separate.

Reusable primitives that survive the challenge can graduate upstream after verification. Hackathon-specific dependencies, shortcuts, and presentation code stay here.

## HERMES // WEBMCP WARDEN

A dedicated Hermes agent owns this build lane so other AGENTROPOLIS and Higgsfield work can continue independently.

Start here:

- `agents/hermes-webmcp-warden/SYSTEM.md`
- `agents/hermes-webmcp-warden/CHECKPOINT.md`
- `docs/CHALLENGE-BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTEXT-DYNAMICS.md`
- `contracts/receipt.schema.json`
- `TERMINAL-HANDOFF.md`
- GitHub issue #1

## Verification rule

**Code existing is not proof that the system works.**

Components are labeled verified only after successful execution in their target environment. Mocked, simulated, experimental, and verified behavior must remain distinguishable throughout the submission.

Context Dynamics and the quantum-inspired frontier remain **experimental until exercised and measured in the challenge runtime**. No quantum hardware, quantum advantage, or physical thermodynamic computation is claimed.

## License

Apache-2.0
