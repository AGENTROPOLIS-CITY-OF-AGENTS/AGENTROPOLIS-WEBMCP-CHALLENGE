# WebMCP -> ATG TRANSFORM

WebMCP is a consumer/adapter surface for ATG TRANSFORM semantics.

## Principle

A web interface can expose both human affordances and machine-readable capabilities from one canonical semantic object.

```text
ATG ENTITY / STATE / ACTION / CONSTRAINT
                 ↓
              WebMCP
        ┌────────┴────────┐
        ↓                 ↓
   human surface     agent capability
```

## Example

```text
ENTITY mint_button
human.label = "Mint Your Terp"
agent.capability = collectible.mint.prepare
state.enabled_when = collection.live && user.eligible
effect.dispatch = holofoil.mint.prepare
```

The machine-readable capability is descriptive until authority is resolved. Social/UI context never grants execution permission.

## Inverse reconstruction

ATG.RECON can derive a provisional semantic graph from existing web evidence:

```text
SCREEN
+ DOM
+ CSS
+ ACCESSIBILITY TREE
+ EVENT STREAM
+ NETWORK/STATE OBSERVATION
→ ATG OBSERVE
→ DECOMPOSE
→ INFER
→ CANONICAL EXPERIENCE GRAPH
→ PARALLAX VERIFY
→ WebMCP-capable representation
```

Properties inferred from behavior must remain INFERRED until independently verified.

## Future direction

WebMCP adapters should compile from canonical ATG intent rather than force ATG to encode today's browser/provider syntax. This permits future browser agents, spatial browsers, world-model interfaces, native agent UIs and other interaction substrates to consume the same semantics.
