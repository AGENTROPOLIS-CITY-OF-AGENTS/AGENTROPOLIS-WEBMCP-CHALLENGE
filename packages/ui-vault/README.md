# AGENTROPOLIS UI Vault

`@agentropolis/ui-vault` is the local governed component vault for AGENTROPOLIS applications, districts, Hermes surfaces, and agents.

It does not depend on 21st.dev authentication, remote CLI state, or upstream runtime availability. Upstream libraries are treated as provenance sources and future replacement targets, not hard runtime requirements.

Its canonical local authority lives in `design-system/`.

## Lifecycle

- `quarantine`: imported or reconstructed candidate, not for production exports
- `reviewed`: reviewed for provenance and API fit, eligible for local consumption
- `stable`: approved for broad AGENTROPOLIS reuse
- `deprecated`: retained for compatibility only

No component should ship directly from `quarantine/`.

## Structure

- `src/components/`: reusable primitives grouped by domain
- `src/adapters/`: adapter interfaces and override registry
- `src/manifests/`: manifest schema and component records
- `src/registry/`: lookup and consumption helpers
- `src/templates/`: district composition templates
- `src/themes/`: Obsidian Signal core adapters and district inheritance contracts
- `provenance/`: source log and license tracking
- `quarantine/`: holding area for unreviewed upstream imports
- `tests/`: registry and theme verification

## Usage

```ts
import {
  UniversalDistrictShell,
  SystemNav,
  CommandHeader,
  SignalCard,
  OperationCard,
  StatusChip,
} from "@agentropolis/ui-vault"
```

## Current policy

As of 2026-09-01, the vault includes the first Obsidian Signal-aligned production shell layer. Core visual canon remains Obsidian + Cyan + Red; district accents are extensions only. Some quarantined manifests intentionally retain provenance gaps where upstream retrieval was not possible in this environment. Those gaps are recorded instead of being guessed.
