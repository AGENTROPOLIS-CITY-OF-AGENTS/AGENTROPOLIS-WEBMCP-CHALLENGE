# AGENTROPOLIS UI Vault Source Log

Updated: 2026-08-29

This vault currently ships reviewed local implementations with adapter boundaries for future upstream replacement. No upstream code was pulled into this repository during this session because 21st.dev authentication was unavailable and remote provenance could not be verified.

## Current registry status

| id | current implementation | upstream provider intent | retrieved | license | provenance gap |
| --- | --- | --- | --- | --- | --- |
| orbit.integrations | local adapter-backed | none required | 2026-08-29 | Apache-2.0 | none |
| spatial.poem-cube | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| motion.perspective-marquee | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
| shader.atc | local fallback | upstream candidate unknown | not retrieved | unknown | source URL, author, license |
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
