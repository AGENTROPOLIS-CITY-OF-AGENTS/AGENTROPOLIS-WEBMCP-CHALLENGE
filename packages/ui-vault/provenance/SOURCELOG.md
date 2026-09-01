# AGENTROPOLIS UI Vault Source Log

Updated: 2026-09-01

This vault currently ships reviewed local implementations with adapter boundaries for future upstream replacement. Live 21st.dev authentication is optional; when unavailable, user-supplied recipes can be captured in `quarantine/` with unresolved provenance explicitly recorded.

## Current registry status

| id | current implementation | upstream provider intent | retrieved | license | provenance gap |
| --- | --- | --- | --- | --- | --- |
| orbit.integrations | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| spatial.poem-cube | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| motion.perspective-marquee | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| shader.atc | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| shader.cybernetic-grid | quarantined user-supplied recipe | 21st.dev-style candidate | 2026-09-01 | unknown | source URL, original author, license, reduced-motion production fallback |
| shader.infinite-plane | quarantined user-supplied recipe | 21st.dev-style candidate | 2026-09-01 | unknown | source URL, original author, license, reduced-motion fallback, GPU/mobile validation |
| shader.neon-crystal-city | quarantined user-supplied recipe | 21st.dev-style candidate | 2026-09-01 | unknown | source URL, original author, license, reduced-motion fallback, WebGL2 compatibility review |
| surface.dotted-wave | quarantined user-supplied recipe | 21st.dev-style candidate | 2026-09-01 | unknown | source URL, original author, license, reduced-motion fallback, dependency normalization |
| shader.liquid-crystal | quarantined user-supplied recipe | 21st.dev-style candidate | 2026-09-01 | unknown | source URL, original author, license, reduced-motion/accessibility fallback, typing cleanup |
| action.energy-cta | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| loader.assembly-cube | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| receipt.tool-calls | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| gallery.stellar | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| gallery.folder | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| gallery.sphere | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| receipt.execution-receipt | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| agent.credential | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| integration.constellation | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |

## Policy

- Do not copy upstream code into `src/` without adding its source and license details first.
- Put unreconciled imports into `quarantine/` before review.
- Promote components to `stable` only after provenance, accessibility, and runtime classification are confirmed.
- Successful quarantine review advances to `reviewed`, not directly to `stable`.
