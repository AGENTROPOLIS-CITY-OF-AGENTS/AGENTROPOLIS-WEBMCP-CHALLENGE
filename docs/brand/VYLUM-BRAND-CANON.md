# VYLUM // SYSTEMS — Brand Canon

The product identity for AGENTROPOLIS's governed spatial WebMCP layer.
VYLUM is original project IP: a coined name, original emblem, original wordmark treatment,
and an AGENTROPOLIS-native visual system. This file is the source of truth for the brand.

> **VYLUM MCP** — governed spatial agency for the web.

## Why VYLUM exists

WebMCP can expose website capabilities to agents. VYLUM extends that idea into interactive
worlds: an agent can inspect a scene, perform a bounded authorized change, capture the
result, verify the outcome, and produce a receipt.

VYLUM is not a claim of unrestricted world control and it is not a visual gimmick layer.
It is the named product surface for the closed-loop spatial construction lane:

```text
INTENT
  -> INSPECT
  -> AUTHORIZED MUTATION
  -> CAPTURE
  -> VERIFY
  -> RECEIPT
```

The rule, in one line:

**see the state; change only what is allowed; see again; prove what changed.**

## Name

`VYLUM` is a coined mark chosen for this project. It evokes view / volume / illumination
without copying an existing product name or real-world spatial platform.

Canonical forms:

- `VYLUM`
- `VYLUM MCP`
- `VYLUM // SYSTEMS`
- `VYLUM by AGENTROPOLIS`

Do not use `Parallax`, `Forge`, `Axiom`, `Vantage`, or other collision-prone working names
for the product identity.

## Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Base | Obsidian | `#05070a` | Backgrounds, world void, ink |
| Tile | Obsidian+ | `#0b1118` | Raised surfaces, HUD panels |
| Signal | Cyan | `#19e6e6` | Primary spatial signal, loop path |
| Verify | Red | `#ff304f` | verification node, warnings, receipt seal |
| Type | Bone | `#f2f0ea` | Wordmark and primary text |
| Meta | Cool Gray | `#8a96a3` | Secondary labels and telemetry |

Cyan + red on obsidian inherits the AGENTROPOLIS Obsidian Signal foundation.
Districts may extend VYLUM with local accent colors, but may not replace the foundation.

## Logo assets

- `vylum-logo.svg` — primary lockup. Default.
- `vylum-icon.svg` — standalone aperture-loop emblem.
- `vylum-favicon.svg` — compact mark optimized for 16–32px.

### Emblem meaning

The emblem is an **aperture loop**:

- cyan outer geometry = observable scene boundary
- broken loop = a bounded operation, not unlimited control
- red node = verification / receipt checkpoint
- center void = the world state being inspected

The mark must read as **observe -> act -> verify**, not as an infinity symbol.

### Clear space

Keep padding >= one red-node diameter around the emblem and >= one cap-height around the
wordmark.

### Never

- do not recolor outside the canonical palette for the master brand
- do not bake glow, blur, gradients, drop shadows, or bloom into the SVG
- do not stretch or skew the wordmark
- do not remove the red verification node from the primary emblem
- do not use a real-world company logo, platform icon, or trademark as part of the mark

Glow belongs to CSS/rendering, not the canonical vector asset.

## Product architecture

| VYLUM surface | Purpose | Status language |
|---|---|---|
| VYLUM MCP | WebMCP capability exposure | available / unavailable |
| VYLUM SCENE | Scene/world graph | observed / changed |
| VYLUM GATE | Object-scoped permission boundary | allowed / denied |
| VYLUM CAPTURE | Rendered evidence artifact | captured / missing |
| VYLUM VERIFY | Objective-specific verifier contract | pass / correction needed / fail |
| VYLUM RECEIPT | Auditable construction receipt | issued only after verification |

These names are product-language aliases. They do not replace canonical code contracts unless
explicitly adopted in a separate implementation change.

## Core behavior canon

VYLUM must preserve these invariants:

1. **Generated != Verified.**
2. Input intent never grants authority.
3. Scene mutations are object-scoped and permission-bound.
4. Denied or forged mutations fail closed.
5. Capture and verification are distinct stages.
6. A successful receipt cannot precede verification.
7. A receipt references the capture used by verification.
8. Unavailable browser-native WebMCP must be labeled unavailable, not inferred as working.
9. A deterministic verifier may prove a narrow demo objective without claiming general visual intelligence.
10. Identity / Mandate / Policy remain AGENTROPOLIS governance responsibilities; VYLUM does not overclaim the full corridor when operating downstream of authorization.

## Challenge positioning

Primary line:

> **VYLUM MCP lets agents inspect, modify, verify, and receipt interactive web worlds through bounded WebMCP capabilities.**

Hero line:

> **See. Act. See again. Prove it.**

Technical description:

> AGENTROPOLIS VYLUM is a governed closed-loop spatial construction layer for WebMCP.

## Brand / IP rule

Every VYLUM brand asset must be original to AGENTROPOLIS. The project may borrow broad
visual vocabulary from CRT systems, command consoles, spatial diagrams, cybernetic HUDs,
and retro-futurist industrial design, but must not trace or reproduce a distinctive third-party
logo or trade dress.

Asset metadata should use:

`original — VYLUM/AGENTROPOLIS`

## Build order

- **Now:** logo lockup, icon, favicon, README/hero naming, submission copy.
- **Before submission freeze:** confirm the deployed demo uses VYLUM consistently where product naming appears.
- **After challenge:** full identity kit, motion logo, 3D emblem, social cards, documentation site, and system-wide Creator / Construction registration.
