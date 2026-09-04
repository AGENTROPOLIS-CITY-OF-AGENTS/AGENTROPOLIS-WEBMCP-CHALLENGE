# AGENTROPOLIS Design System Authority

Owner: Creator / Construction

This `design-system/` directory is the local authority mirror for AGENTROPOLIS Creator / Construction work inside `AGENTROPOLIS-WEBMCP-CHALLENGE`.

GitHub is canonical.
Figma is optional only and is never authority.

## Canon

- `SOURCE != AUTHORITY`
- Source can inspire, seed, or supply candidate material.
- Authority is the governed local record of tokens, manifests, components, templates, and distribution rules.
- Architecture limits exposure.
- Governance limits failure.
- Authority is not a prompt. It is a runtime constraint.

## Lifecycle

`SOURCE -> QUARANTINE -> REVIEW -> ADAPT -> REGISTER -> DISTRIBUTE -> EXECUTE -> RECEIPT -> AUDIT`

Meaning:

- `SOURCE`: an upstream component, library, pattern, screenshot, or reference
- `QUARANTINE`: candidate isolated with provenance before adoption
- `REVIEW`: technical, accessibility, and license review
- `ADAPT`: local API hardening for AGENTROPOLIS
- `REGISTER`: manifest accepted into the executable registry
- `DISTRIBUTE`: exposed to districts/applications
- `EXECUTE`: consumed in runtime surfaces
- `RECEIPT`: every governed construction action can be receipted
- `AUDIT`: provenance, duplication, motion, accessibility, and asset exposure remain inspectable

## Canonical local files

- `tokens/colors.json`
- `tokens/spacing.json`
- `manifests/ui-vault.schema.json`
- `mcp/ui-construction-contracts.md`
- `templates/master-template.json`

## Consumers

- Hermes City
- ASBE
- Mission Control
- Command Atrium
- WebMCP
- Fiscal Command
- 789 Studios
- NTRU
- future districts

## Outputs

Machine-readable outputs generated from the registry:

- `design-system/catalog.json`
- `design-system/component-index.json`
- `design-system/district-capabilities.json`

Static catalog:

- `design-system/catalog/index.html`

The catalog must work without Figma.
