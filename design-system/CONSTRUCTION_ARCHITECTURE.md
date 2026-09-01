# Creator / Construction Architecture

Owner: Creator / Construction

## Purpose

Creator / Construction governs how UI primitives enter AGENTROPOLIS, who owns them, how they are adapted, and how districts consume them without taking ownership of the canonical primitive.

## Control plane

1. `design-system/` is the authority mirror.
2. `packages/ui-vault/` is the executable component registry.
3. `districts/creator-construction/` is institutional ownership, audit, and distribution policy.
4. Districts and applications consume registered APIs through adapters and manifests.

## Authority boundaries

- Upstream component libraries are sources, not authority.
- GitHub-tracked tokens, manifests, templates, and adapters are authority.
- Creator Core Obsidian Signal is the shared foundation; district themes may extend it but may not replace the core Obsidian + Cyan + Red system.
- Figma variables, if ever generated, must mirror GitHub tokens rather than define them.

## Component entry rules

1. Candidate arrives from source.
2. Candidate enters `packages/ui-vault/quarantine/` with provenance.
3. Candidate is reviewed for:
   - provenance
   - license
   - runtime class
   - accessibility
   - reduced motion behavior
   - external assets
   - iframe dependence
   - GPU cost
4. Candidate is adapted to a local AGENTROPOLIS API.
5. Candidate is registered through a manifest.
6. Candidate can advance to `reviewed`.
7. Candidate never advances directly from `quarantine` to `stable`.

## Registry model

The UI Vault exposes:

- component manifests
- search/filter/inspection operations
- install/adapt/compose/preview/audit operations
- governed adapters
- templates
- machine-readable catalog exports

## Runtime model

- `DOM` and `CSS` components should remain server-safe unless interaction is necessary.
- `Canvas`, `WebGL/WebGL2`, `Three.js`, and `Remotion` components must be called out explicitly.
- GPU-heavy components must be lazy-loadable and must not mount hidden render loops by default.
- Motion components require reduced-motion fallbacks.

## Governance principle

Source is where a primitive came from.
Authority is what AGENTROPOLIS has approved to execute.
