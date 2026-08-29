# HERMES // WEBMCP WARDEN — CHECKPOINT

**State:** BUILDING (Codex implementation lane handoff prepared)
**Mission:** WebMCP Challenge MVP — autonomous 3D governed world
**Internal cutoff:** September 3, 2026 — 1:00 PM PT
**Last Warden session:** 2026-08-28 (terminal, Warden role split: HERMES=orchestrate/review/verify, Codex=primary engineer)

## Completed
- Dedicated public challenge repository established.
- Warden system contract installed.
- Mission issue opened.
- Challenge brief created.
- Governed WebMCP architecture documented.
- Execution receipt JSON Schema created.
- Core thesis locked: discovery is not authority.
- Autonomous 3D world directive + Figma motherboard translation documented.
- WebMCP API surface re-verified against developer.chrome.com/docs/ai/webmcp (last updated 2026-08-20): imperative `document.modelContext.registerTool / getTools / executeTool / toolchange`, Chrome 149 origin trial, `chrome://flags/#enable-webmcp-testing`, Model Context Tool Inspector extension, cross-origin `allow="tools"`, `annotations.readOnlyHint/untrustedContentHint`.
- `docs/3D-WORLD-SPEC.md` authored (referenced by TERMINAL-HANDOFF.md but previously missing). Stack locked: Vite + React + TS + Three.js/R3F, governance outside render loop, world state derived only from real app events.
- Repo inventory confirmed: docs + contracts only; zero implementation files on any branch; no PRs.

## Next actions (Codex lane unless noted)
1. Codex: scaffold Vite + React + TS + R3F app with the eight world zones as static geometry + labels.
2. Codex: implement deterministic governance modules (ActionRequest -> evaluate() -> Decision -> Receipt) matching contracts/.
3. Codex: register exactly ONE WebMCP imperative tool wired through governance.
4. Warden: browser verification plan below (WM-01..03) once a build exists.
5. Codex: bind live state events to zone consequences (ALLOW/DENY/REQUIRE_APPROVAL distinct visuals).
6. Approval performed in-world; receipts inspectable in-world.
7. Unit tests for policy + receipt schemas before polishing.
8. Deploy + verify deployed build; capture evidence per TEST-MATRIX naming.

## Browser/WebMCP verification plan (Warden)
- V1: dev-server load with inspector extension -> tool listed with correct schema (WM-01/WM-02).
- V2: `getTools()` returns tool; `executeTool()` valid low-risk args -> ALLOW -> EXECUTED + receipt JSON (WM-03).
- V3: policy matrix unit-run: missing mandate DENY; sensitive REQUIRE_APPROVAL; consumed/replayed approval DENY; agent self-approval DENY (GOV-01..05).
- V4: prompt-injection string page content -> decision unchanged (SEC-01); out-of-schema args rejected pre-execution (SEC-02).
- V5: 3D UX gates: first-15-second comprehension; camera reaches active event; Explore interrupts guided; three decisions visually distinct; approval in-world; receipt in-world; reduced-motion still 3D.
- V6: clean-session repeat + ChatGPT in-app browser path (CHATGPT-01) and Chrome flag path (CHROME-01).
Evidence only from actual runs into `evidence/YYYYMMDD-HHMM_<test-id>_<desc>.*`.

## Blockers
- No implementation exists yet — Codex scaffold is the gate for all browser verification.
- Live browser/WebMCP runtime testing requires the Chrome flag/origin-trial environment (available in this terminal session's browser tool; flag path unconfirmed until tested).
- Deployment credentials/provider selection still open (static hosting is sufficient per spec).

## Role discipline
- Warden does not rewrite Codex work; review + verify + checkpoint only.
- Code-only progress is BUILDING, never VERIFIED.

## Evidence standard
Never mark a component VERIFIED until it has actually executed in the target environment. Code-only work is BUILDING, not VERIFIED.
