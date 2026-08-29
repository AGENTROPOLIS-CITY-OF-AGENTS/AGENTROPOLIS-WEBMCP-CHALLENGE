# TERMINAL HANDOFF — HERMES // WEBMCP WARDEN

## Mission
Continue the WebMCP Challenge build from this repository without touching Higgsfield or production AGENTROPOLIS infrastructure.

## First commands
```bash
git pull origin main
git status
find . -maxdepth 3 -type f | sort
```

Read in this order:
1. `agents/hermes-webmcp-warden/SYSTEM.md`
2. `docs/OFFICIAL-CHALLENGE-NOTES.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SECURITY.md`
5. `docs/TEST-MATRIX.md`
6. GitHub Issue #1

## Hard cutoff
Treat September 3, 2026 at 1:00 PM Pacific as the submission deadline.

## Warden execution order

### Phase A — Verify runtime
- Record Node/package manager versions.
- Verify current WebMCP API syntax against official Chrome documentation/spec before writing API calls.
- Confirm the selected browser test path.
- Do not rely on stale remembered APIs.

### Phase B — Bootstrap app
Use the smallest web stack that can deploy quickly. Prefer an existing template only if it materially reduces setup time. Avoid framework churn.

Required surfaces:
- WebMCP-enabled demo page
- one registered governed tool
- human approval UI
- Mission Control receipt panel

### Phase C — Implement contracts
Implement types/interfaces matching:
- `contracts/action-request.schema.json`
- `contracts/decision.schema.json`
- `contracts/execution-receipt.schema.json`

Policy API should be deterministic:
```ts
type Effect = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
function evaluate(request: ActionRequest, context: PolicyContext): Decision;
```

Executor must reject any request without a valid ALLOW decision or a consumed human approval bound to the exact request.

### Phase D — WebMCP
Register exactly one primary tool first. Give it:
- precise name
- short description
- strict JSON schema
- bounded arguments
- useful structured return value

Do not register a large tool catalog before the first tool passes the test matrix.

### Phase E — Tests
Implement automated unit tests for policy and receipts before polishing UI.
Run the manual WebMCP tests from `docs/TEST-MATRIX.md`.

### Phase F — Deploy
Deploy live. Verify the deployed build, not only localhost.

### Phase G — Evidence
Capture real evidence for each verified test. Never manufacture output.

### Phase H — Submission
Prepare:
- final README
- live URL
- repository URL
- project description
- architecture image/screenshot if useful
- <=3 minute demo video
- Devpost submission fields

## Default demo contract
If no stronger workflow is discovered during implementation, use a generic governed operation with two modes:
- low-risk action -> ALLOW
- state-changing action -> REQUIRE_APPROVAL

Add a prohibited argument/action path -> DENY.

The point is the governance corridor, not the business-domain complexity.

## Scope kill switch
Before adding anything ask:
1. Does it prove WebMCP works?
2. Does it prove governance/approval/receipts?
3. Does it improve judging evidence?

If no: do not build it.

## Completion declaration
Warden may set `READY_FOR_DEMO` only after the live deployed application passes the required minimum tests. Warden may set `READY_TO_SUBMIT` only after all Devpost-required assets exist and have been manually reviewed.
