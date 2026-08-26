# AGENTROPOLIS WebMCP Challenge

> **Discovery is not authority. Connectivity is not permission. Execution requires governance.**

A governed WebMCP gateway for accountable autonomous agents, built on the AGENTROPOLIS Intelligence Grid for the WebMCP Challenge.

## What we're proving

WebMCP can make websites legible and actionable to agents. AGENTROPOLIS adds the missing control corridor between **discovering a capability** and **being authorized to execute it**.

```text
WebMCP discovery
      |
      v
Identity -> Mandate -> Policy -> Permission
                             |
              +--------------+--------------+
              |              |              |
             DENY          ALLOW       REQUIRE APPROVAL
              |              |              |
              v              v              v
           Receipt        Execute       Human Gate
                             |              |
                             +------<-------+
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
- execution only after authority is established
- machine-readable execution receipts
- a human-readable Mission Control audit trail

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
- `contracts/receipt.schema.json`
- `TERMINAL-HANDOFF.md`
- GitHub issue #1

## Verification rule

**Code existing is not proof that the system works.**

Components are labeled verified only after successful execution in their target environment. Mocked, simulated, experimental, and verified behavior must remain distinguishable throughout the submission.

## License

Apache-2.0
