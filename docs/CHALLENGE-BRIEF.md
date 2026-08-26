# WebMCP Challenge — Execution Brief

Status: DISCOVERING
Internal hard cutoff: **September 3, 2026 at 1:00 PM PT** until official sources reconcile conflicting deadline displays.

## Verified challenge facts

- Hosted by OpenAI with Chromium, Cloudflare, Shopify, Vercel, Render, and Netlify.
- Ten-day build window.
- $35,000 cash prize pool plus sponsor prizes.
- Project must use WebMCP.
- Submission requires a working project, public source repository, project description, and demo evidence according to the official challenge submission flow.

## Deadline discrepancy

OpenAI's challenge page and the Devpost rules page currently display different September 3 closing times. The Warden MUST use the earlier displayed time, **1:00 PM Pacific**, as the internal submission deadline unless the organizers publish a definitive correction.

## AGENTROPOLIS entry thesis

> Discovery is not authority. Connectivity is not permission. Execution requires governance.

Most WebMCP demos can prove that an agent can discover a website capability. AGENTROPOLIS should prove the harder layer: the capability can be discovered without automatically granting authority to execute it.

## Demo corridor

```text
Browser / Agent
      |
      v
WebMCP Tool Discovery
      |
      v
AGENTROPOLIS Gateway
      |
      v
Identity -> Mandate -> Policy -> Permission
      |                       |
      | DENY                  | ALLOW / APPROVAL
      v                       v
Receipt                  Human Gate
                              |
                              v
                           Execute
                              |
                              v
                           Receipt
                              |
                              v
                     Mission Control
```

## MVP acceptance tests

The submission is not ready until all are true:

1. Browser/agent discovers at least one real WebMCP tool.
2. Tool schema is structured and documented.
3. Invocation passes through the governance gateway.
4. An allowed low-risk action executes.
5. A prohibited action is denied before execution.
6. A sensitive/state-changing action can require explicit human approval.
7. Every decision produces a machine-readable receipt.
8. Mission Control makes the decision path understandable to a human.
9. The complete demo can be repeated from a clean session.
10. README and submission materials accurately distinguish verified functionality from mocks or simulations.

## Scope lock

Build one excellent workflow. Do not attempt to expose all of AGENTROPOLIS through WebMCP during the challenge.
