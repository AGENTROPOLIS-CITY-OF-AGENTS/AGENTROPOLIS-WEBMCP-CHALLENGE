# UI Construction MCP Contracts

Owner: Creator / Construction

These contracts describe the governed local operations exposed by the executable UI Vault registry.

## Canon

- GitHub is canonical.
- Figma is optional only.
- Source is not authority.
- Quarantine components are never installed as stable by default.

## Contracts

### `ui.search`

Search registered components and quarantined candidates by text and filters.

Input:

- `query?: string`
- `category?: action | galleries | loaders | motion | navigation | shaders | spatial | tool-ui`
- `maturity?: quarantine | reviewed | stable | deprecated`
- `runtime?: DOM | CSS | Canvas | WebGL/WebGL2 | Three.js | Remotion`
- `district?: string`
- `application?: string`
- `limit?: number`

Output:

- matched manifests
- total count
- blocked quarantined matches

### `ui.inspect`

Inspect one component or template.

Input:

- `id: string`

Output:

- manifest
- provenance summary
- quarantine status
- adapter availability

### `ui.install`

Create a governed install plan for a consumer.

Input:

- `id: string`
- `consumer: string`
- `target: string`

Output:

- status
- blocked reason if quarantined
- manifest
- dependency plan

### `ui.adapt`

Create an adaptation plan between a registered component and a local consumer API.

Input:

- `id: string`
- `adapterName: string`
- `consumer: string`

Output:

- adaptation contract
- runtime boundary
- reduced motion requirement

### `ui.compose`

Create a composition plan for a template and selected components.

Input:

- `templateId: string`
- `componentIds: string[]`

Output:

- compatible components
- missing components
- composition map

### `ui.preview`

Return the local static catalog preview location for a component or template.

Input:

- `id: string`

Output:

- `previewPath`
- `catalogAnchor`

### `ui.audit`

Audit one component or the full registry.

Input:

- `id?: string`

Output:

- provenance gaps
- missing licenses
- iframe dependencies
- external assets
- gpu-heavy flags
- reduced-motion gaps
