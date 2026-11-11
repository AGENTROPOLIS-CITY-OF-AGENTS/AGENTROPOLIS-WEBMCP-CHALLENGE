# CHAOS INPUT recovery execution record — 2026-11-10

Status: REVIEW ONLY. No merge, deployment, or beta claim.

## Provenance
Source: AGENTROPOLIS-WEBMCP-CHALLENGE PR #26
Base SHA: 7560a520c704b9030eb50730af6da9c10842acd9
Recovery branch: review/chaos-input-recovery-20261110

Read directly:
- src/intent/chaos-input.ts (21-landmark classifier; POINT, AIR_TAP, PALM_STOP)
- src/intent/chaos-input.test.ts (five Vitest tests, not executed by this record)
- contracts/intent.schema.json (AIP v0.1)

## Canonical decisions
- Preserve AIP v0.1 as the only authoritative intent envelope. A browser CustomEvent may transport that envelope unchanged, but must not define another schema.
- Preserve PR #26's classifier math as the initial baseline, pending real-hands measurements.
- v1 recognizer supports POINT, AIR_TAP (thumb/index proximity), PALM_STOP as implemented. Product-facing PINCH may be a UI label for AIR_TAP selection; do not claim AIP PINCH/compress recognition exists until implemented and tested.
- Keep the existing confidence gates (0.85 for ordinary proposals, 0.95 for consequential proposals) as provisional, not empirically calibrated.
- Do not promote SWIPE_RIGHT/LEFT, SPREAD, ROTATE or REVERSE_SWIPE to implemented gesture claims.
- Compare the PR lab 7-frame/350ms debounce with ZIP 550ms hold/950ms cooldown under real-camera conditions before standardizing.
- Keep camera frames local, opt-in; preserve keyboard/pointer/touch fallback. An open-palm stop is an intent request, not proof of runtime cancellation or a reliable emergency stop.
- Any execution requires independent capability authorization, user confirmation where applicable, and verified receipts. Never treat gesture recognition as authority.
- HERMES HANDS is a separate plugin product; share a documented contract, not a runtime dependency.

## Gates to run and record
1. On this exact branch run the five existing Vitest tests, typecheck, lint and build; attach raw output and exit codes.
2. Run PARALLAX src/runtime/runtime.test.ts (four tests) at its independently pinned SHA; attach output.
3. Pin and self-host MediaPipe JS/WASM/model assets after license and supply-chain intake.
4. Test real hands across users, lighting and distances; measure latency, false triggers and stop reliability.
5. Add AIP schema adapter with validation tests; integrate a sandbox PARALLAX consumer only after gate checks.
6. Verify denied actions and executed actions produce distinct evidence; independently review.
7. No merge or deploy without explicit approval.

## Evidence boundary
This file records a review-branch setup and engineering decisions. It does not certify passing tests, real-camera functionality, plugin compatibility or production readiness.
