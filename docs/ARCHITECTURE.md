# AGENTROPOLIS WebMCP Challenge Architecture

## Thesis

**Discovery is not authority. Connectivity is not permission. Execution requires governance.**

WebMCP solves a major interface problem: websites can expose structured tools to agents instead of forcing agents to infer intent from pixels and DOM structure.

AGENTROPOLIS demonstrates the next control layer: what happens after a tool is discovered but before a consequential action is allowed to execute.

## Vertical slice

```text
Human + Agent
     |
     v
WebMCP-enabled page
     |
     v
Registered site tool
     |
     v
Normalized Action Request
     |
     v
Identity -> Mandate -> Policy -> Tool Permission
                 |
       +---------+----------+
       |         |          |
      DENY      ALLOW   REQUIRE_APPROVAL
       |         |          |
       |         |      Human confirms
       |         |          |
       +---------+----------+
                 |
                 v
              Executor
                 |
                 v
         Execution Receipt
                 |
                 v
         Mission Control UI
```

## Deliberate scope
The hackathon repo is an application/proving ground, not a replacement for AGENTROPOLIS-UTILITY-GRID.

Do not import the whole city. Implement only the contracts required to prove the corridor:

`Identity -> Mandate -> Plan -> Execute -> Receipt -> Audit`

## Components

### 1. WebMCP adapter
Registers the site tool and converts WebMCP input into a normalized `ActionRequest`.

### 2. Governance gate
Pure deterministic function. Input: actor + mandate + action + policy context. Output: `ALLOW`, `DENY`, or `REQUIRE_APPROVAL` plus reasons.

### 3. Approval gate
Human-visible checkpoint for a sensitive or state-changing action. An agent cannot approve its own request.

### 4. Executor
Performs only actions that carry a valid governance decision. For the hackathon MVP, use one bounded deterministic action with a clearly visible result.

### 5. Receipt emitter
Produces a machine-readable receipt for every attempted action, including denied and approval-required requests.

### 6. Mission Control
Human-readable receipt and decision-path view. It must explain what the agent requested, what policy decided, whether a human approved, what executed, and the final status.

## Security boundary
Page content is untrusted input. Agent instructions derived from page content never become authority. Tool invocation does not bypass policy. Secrets are never included in tool schemas, page-visible logs, receipts, or screenshots.

## Demo story
1. Agent discovers the tool.
2. Agent makes a low-risk request that is allowed and receipted.
3. Agent makes a sensitive request.
4. Governance returns `REQUIRE_APPROVAL`.
5. Human approves it in the shared live page.
6. Execution completes.
7. Mission Control exposes the complete receipt chain.
8. A prohibited request is denied to prove policy is real rather than decorative.
