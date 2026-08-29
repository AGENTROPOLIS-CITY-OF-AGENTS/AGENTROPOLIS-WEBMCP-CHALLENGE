# Official WebMCP Challenge Notes

Status: VERIFIED FROM OFFICIAL / HIGH-CONFIDENCE CHALLENGE SOURCES through 2026-08-29.

## Hard dates
- Submission deadline: September 3, 2026 at 1:00 PM PT.
- Judging: September 4-21, 2026.
- Winners: on or around September 23, 2026.
- Office hours: August 31 at 11:00 AM PT.

## Freeze rule
Treat the submission deadline as a hard release freeze.

After September 3, 2026 at 1:00 PM PT, do not edit the submitted project, repository, live site, or demo video unless the challenge organizers explicitly authorize it. Build and verification must therefore finish before the deadline, not at the deadline.

Internal target: freeze the judged release at least 2 hours early so the team has time to verify the deployed build, public repository, demo video, and Devpost fields without changing the artifact after submission.

## Required submission surface
Prepare all of the following before freeze:
- project description
- working live application
- public code repository
- public demo video under 3 minutes
- audio narration explaining what was built and how WebMCP is used
- any additional Devpost-required fields/materials

The demo should show the working product in the first 10-15 seconds rather than spending the opening on slides or background exposition.

## Judging model
Treat the controlling Devpost rules as the scoring source of truth.

Current judging targets:
- WebMCP Leverage
- Execution
- Potential Impact
- Creativity & Ambition

These are equally important for planning purposes. There is also an initial viability/compliance gate before full scoring, so a beautiful 3D experience that does not actually demonstrate functioning WebMCP is not sufficient.

### AGENTROPOLIS judging alignment
- **WebMCP Leverage:** a real site tool is discoverable and invoked through WebMCP; tool state drives the world.
- **Execution:** deployed 3D world works, governance is deterministic, approval/deny paths function, receipts are real, tests pass.
- **Potential Impact:** demonstrates a reusable control layer for accountable agent action on the web.
- **Creativity & Ambition:** autonomous navigable 3D city where WebMCP, authority, policy, execution, and audit are spatially legible.

## Supported testing paths
1. ChatGPT in-app browser with WebMCP support.
2. Google Chrome 149+ with WebMCP testing enabled.
3. Chrome Model Context Tool Inspector for registered-tool inspection, manual invocation, and JSON Schema verification.

Chrome local testing flag:
`chrome://flags/#enable-webmcp-testing`

The WebMCP-specific verification path must use a compatible browser exposing the current WebMCP surface (including `document.modelContext` where applicable). Do not mark browser verification complete based only on Vite/local build success.

## Current API shape
Chrome documentation describes two ways to expose site tools:
- Imperative API: JavaScript-defined tools.
- Declarative API: annotations on standard HTML forms.

For this challenge entry, prefer the Imperative API for the governed action because AGENTROPOLIS needs an explicit policy evaluation and receipt pipeline before state-changing execution.

## Pre-existing project / challenge delta
AGENTROPOLIS contains pre-existing Three.js, governance, and city infrastructure created before the challenge window. The submission must clearly distinguish inherited infrastructure from challenge-specific work completed after August 25, 2026.

Maintain `CHALLENGE-DELTA.md` with dated evidence and references showing:
- what existed before August 25
- what was reused
- what was newly built for the WebMCP Challenge
- which challenge-specific changes demonstrate WebMCP integration

Do not imply that pre-existing AGENTROPOLIS infrastructure was created during the challenge.

## Source-of-truth links
- https://openai.com/webmcp-challenge/
- https://webmcp.devpost.com/rules
- https://webmcp.devpost.com/resources
- https://webmcp.devpost.com/updates/46116-6-days-left-to-build
- https://developer.chrome.com/docs/ai/webmcp

If any source conflicts, treat Devpost official rules as controlling for submission eligibility/timing and record the conflict in the project checkpoint.
