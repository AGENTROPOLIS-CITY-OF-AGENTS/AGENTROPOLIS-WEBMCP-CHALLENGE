# PARALLAX / WebMCP Challenge completion gates

**Ownership:** AGENTROPOLIS-WEBMCP-CHALLENGE = challenge UX / end-to-end proof; AGENTROPOLIS-PARALLAX-SPATIAL-MCP = reusable runtime and SDK. No competing duplicate implementations.

## Confirmed in repository source
- React/Vite app with accessible static WebGL fallback, 3D world and guarded demo entry points.
- AIP/WebMCP registration, governance engine, deterministic studio verification and receipt paths exist in code.
- Parallax runtime extracted to separate PARALLAX repository with canonical contract.
- Challenge docs already contain SPATIAL_WEBMCP_DEMO_ACCEPTANCE.md, PARALLAX-PRODUCTION-PARITY.md and TEST-MATRIX.md.

## Required to finish
- [ ] Run `npm run quality:submission` and capture commit SHA, commands and results.
- [ ] Verify primary user journey via keyboard, touch and pointer: discover -> select -> request -> policy -> allow/deny/approval -> act -> re-observe -> verify -> receipt.
- [ ] Prove deny leaves state unchanged and missing permissions fail closed; preserve receipt and evidence hashes.
- [ ] Test actual WebMCP browser availability; use honest local governed mode when absent.
- [ ] Ensure UI explains that the deterministic studio verifier is not general-purpose visual reasoning.
- [ ] Confirm all scene assets and media resolve on the GitHub Pages base path on both mobile and desktop.
- [ ] Capture visual parity for hero, simulation, approve/deny, receipt, overlay and close/return states.
- [ ] Audit interaction affordances; no oversized panels obscure the 3D world or nonfunctional buttons.
- [ ] Confirm the separate PARALLAX SDK's `npm run quality` passes and document pinned version/commit.
- [ ] Add explicit cross-links: challenge demo, PARALLAX runtime, AGENTROPOLIS Ontology, AGENT-ENTITY Forge and Design Core (links must not imply delegated authority).
- [ ] Review the CI workflow and Pages deployment; do not merge until tests and accessible parity are signed off.

## Exact claim boundary
Source files and test definitions are **implemented**, but this document is not runtime validation. No claim that native WebMCP works on every browser, that production parity passes, that site is fully complete, or that every receipt is tamper-proof. GitHub Pages is a static demo surface, not an unrestricted agent executor.

## Visual standard
Follow ASDS-54 visual quality: obsidian/cyan/red with lime accent, cinematic environmental imagery, readable overlays, actual navigable scene, 2D parity and no primitive blockouts advertised as final city. PARALLAX challenge is distinct from the wider city and must not hijack the entire ecosystem.
