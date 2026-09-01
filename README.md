# AGENTROPOLIS WebMCP Challenge

> **Discovery is not authority. Connectivity is not permission. Execution requires governance.**

A governed, spatial WebMCP gateway for accountable autonomous agents, built on the AGENTROPOLIS Intelligence Grid for the WebMCP Challenge.

## What we're proving

WebMCP can make websites legible and actionable to agents. AGENTROPOLIS adds the missing control corridor between **discovering a capability** and **being authorized to execute it**.

The challenge also tests two complementary layers:

1. **Agentropolis Intent Protocol (AIP):** gesture, touch, pointer, keyboard, voice, gamepad, XR, and accessibility inputs normalize into one governed intent model. Input expresses intent; it never grants authority.
2. **Context Dynamics:** after authority is established, a resource-aware scheduler decides whether authorized work should execute now, cool/defer, or receive bounded exploration before mutation.

```text
HUMAN INPUT
 gesture | touch | pointer | keyboard | voice | XR
                         |
                         v
             Agentropolis Intent Protocol
                         |
                         v
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

> **One intent. Many interfaces. One governed execution path.**

## Challenge MVP

One repeatable governed WebMCP workflow demonstrating:

- structured WebMCP capability discovery
- spatially discoverable capability objects in the 3D experience
- normalized multimodal intent through AIP
- at least three input modes producing the same canonical intent shape
- mandate and policy evaluation
- allow / deny / require-approval decisions
- explicit Context Envelopes for authorized work
- resource-aware execute / cool / explore scheduling
- optional, clearly labeled quantum-inspired strategy weighting using classical Shannon entropy
- execution only after authority is established
- first-class `stop` semantics with truthful cancellation reporting
- machine-readable execution receipts carrying intent provenance and optional Context Dynamics telemetry
- visible, inspectable ReceiptObjects in the world
- a human-readable Mission Control audit trail
- an accessible conventional control path that does not depend on gestures or 3D interaction

## 3D interaction thesis

The user should not need to ask what a WebMCP-enabled environment can do. Sites expose capabilities as inspectable world objects. Users can select, assign, or manipulate those objects using different input modes, but every consequential action still crosses the same governance corridor.

**Gesture is an adapter, not authority. Spatial spectacle is not proof of execution.**

Start with:

- `docs/AGENTROPOLIS-INTENT-PROTOCOL.md`
- `docs/WEBMCP-3D-INTERACTION-SPEC.md`
- `contracts/intent.schema.json`
- `TERMINAL-HANDOFF-AIP.md`

See `docs/CONTEXT-DYNAMICS.md` for the scheduling model, scientific boundaries, lifecycle events, receipt extension, and graduation path.

## Repository boundary

This is a **challenge application / proving ground**. The canonical `AGENTROPOLIS-UTILITY-GRID` remains separate.

Reusable primitives that survive the challenge can graduate upstream after verification. Hackathon-specific dependencies, shortcuts, and presentation code stay here.

## HERMES // WEBMCP WARDEN

A dedicated Hermes agent owns this build lane so other AGENTROPOLIS work can continue independently.

Core references:

- `agents/hermes-webmcp-warden/SYSTEM.md`
- `agents/hermes-webmcp-warden/CHECKPOINT.md`
- `docs/CHALLENGE-BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTEXT-DYNAMICS.md`
- `docs/AGENTROPOLIS-INTENT-PROTOCOL.md`
- `docs/WEBMCP-3D-INTERACTION-SPEC.md`
- `contracts/intent.schema.json`
- `contracts/receipt.schema.json`
- `TERMINAL-HANDOFF.md`
- `TERMINAL-HANDOFF-AIP.md`

## Verification rule

**Code existing is not proof that the system works.**

Components are labeled verified only after successful execution in their target environment. Mocked, simulated, experimental, and verified behavior must remain distinguishable throughout the submission.

AIP gesture recognition, Context Dynamics, and the quantum-inspired frontier remain **experimental until exercised and measured in the challenge runtime**. No mind-reading, perfect gesture recognition, quantum hardware, quantum advantage, or physical thermodynamic computation is claimed.

## License

Apache-2.0
