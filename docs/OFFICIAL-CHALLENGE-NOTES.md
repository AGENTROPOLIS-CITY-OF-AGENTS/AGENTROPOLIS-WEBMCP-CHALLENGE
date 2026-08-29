# Official WebMCP Challenge Notes

Status: VERIFIED FROM OFFICIAL SOURCES on 2026-08-28.

## Hard dates
- Submission deadline: September 3, 2026 at 1:00 PM PT.
- Judging: September 4-21, 2026.
- Winners: on or around September 23, 2026.
- Office hours: August 31 at 11:00 AM PT.

## Required submission surface
A competitive entry should be prepared with:
- project description
- working live application
- public code repository
- required demo video
- any additional Devpost-required materials

## Judging criteria
- usefulness
- originality
- execution
- thoughtful use of WebMCP
- quality of the human-agent experience

## Supported testing paths
1. ChatGPT in-app browser, which OpenAI states supports WebMCP.
2. Google Chrome with the WebMCP experimental flag or origin trial.
3. Chrome Model Context Tool Inspector for registered-tool inspection, manual invocation, and JSON Schema verification.

Chrome local testing flag:
`chrome://flags/#enable-webmcp-testing`

## Current API shape
Chrome documentation describes two ways to expose site tools:
- Imperative API: JavaScript-defined tools.
- Declarative API: annotations on standard HTML forms.

For this challenge entry, prefer the Imperative API for the governed action because AGENTROPOLIS needs an explicit policy evaluation and receipt pipeline before state-changing execution.

## Source-of-truth links
- https://openai.com/webmcp-challenge/
- https://webmcp.devpost.com/rules
- https://webmcp.devpost.com/resources
- https://developer.chrome.com/docs/ai/webmcp

If any source conflicts, treat Devpost official rules as controlling for submission eligibility/timing and record the conflict in the project checkpoint.
