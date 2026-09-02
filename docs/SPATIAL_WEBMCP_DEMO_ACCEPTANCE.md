# Spatial WebMCP Hero Demo Acceptance

## Objective

Prove that a browser-hosted interactive scene can expose structured spatial capabilities to an agent, enforce bounded authority, render a changed state, verify that state, and emit an auditable receipt.

## Required demo sequence

1. Open the Spatial WebMCP demo from the WebMCP HUD.
2. Show the initial studio capture as UNVERIFIED.
3. Run the closed-loop construction action.
4. Confirm the plan mutates only objects with the required permission.
5. Confirm a post-mutation capture is produced.
6. Confirm the deterministic verifier evaluates the resulting graph.
7. Confirm the receipt reports PASS and contains before/after scene versions plus mutation count.
8. Close the demo and confirm the primary governed 3D world remains intact.

## Expected deterministic result

- key light: 72%
- fill light: 34%
- key remains stronger than fill
- camera remains centered and inside the interview distance envelope
- chair remains inside the framing zone
- microphone remains near the chair
- verifier threshold: >= 83

## Required negative tests

- unauthorized material change on `key-light-01` throws `CAPABILITY_DENIED`
- denied mutation through the registered WebMCP tool leaves the scene byte-identical
- initial scene does not pass interview verification
- unknown/non-studio objective must not be silently reported as verified
- forged object ids and malformed tool input are rejected before scene state changes
- tampered capture evidence fails verification (hash binding)

## Governance assertions

- Generated != Verified
- capture is required before receipt creation in the closed-loop path
- verification is explicit and inspectable
- object authority is encoded in the scene graph
- no mutation bypasses `applySpatialMutation`
- deterministic verifier is a hackathon proof, not a claim of general visual intelligence
- future model-backed verification must be an adapter behind the same verification contract

## Terminal validation

Run the repository's existing app checks plus the targeted spatial test:

```bash
npm test -- --run src/spatial/closed-loop.test.ts
npm run typecheck
npm run lint
npm run build
```

If the repository scripts differ, use the canonical equivalents without weakening checks.

## Browser acceptance

Record evidence for:

- initial UNVERIFIED studio state
- opened Spatial WebMCP dialog
- post-run VERIFIED state and score
- receipt identifier, versions and mutation count
- successful return to the primary 3D governed world

Do not claim browser verification until this evidence exists.
