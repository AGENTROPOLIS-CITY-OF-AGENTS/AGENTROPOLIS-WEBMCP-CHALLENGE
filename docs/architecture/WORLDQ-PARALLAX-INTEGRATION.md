# WORLDQ × PARALLAX Integration

Deadline target: 2026-09-03 13:00 America/Los_Angeles

## Purpose

The WebMCP Challenge is the first proving ground for a clean separation between two reusable AGENTROPOLIS primitives:

- **WORLDQ** handles quantized world packaging, progressive transport, deterministic reconstruction metadata, and fidelity receipts.
- **PARALLAX Spatial MCP** handles governed spatial inspection, bounded mutation, capture, verification, and audit receipts.

The challenge app orchestrates both without collapsing them into one codebase.

## Closed-loop path

```text
USER INTENT
  -> WebMCP capability discovery
  -> PARALLAX inspect
  -> WORLDQ encode/quantize package
  -> WORLDQ progressive stream/decode
  -> PARALLAX enter/modify
  -> PARALLAX capture
  -> WORLDQ reconstruction verification
  -> PARALLAX outcome verification
  -> commit
  -> combined receipt
```

## Challenge tool contract

The challenge should expose the following conceptual capabilities through its adapter layer:

```text
world.inspect
world.encode
world.quantize
world.stream
world.decode
world.enter
world.modify
world.commit
world.verify
```

These are capability names, not claims that every browser already provides a native implementation.

## Authority boundary

WORLDQ never grants mutation authority. A decoded or reconstructed world is data. PARALLAX remains responsible for checking the mandate and capability envelope before any operation is applied.

```text
Identity -> Mandate -> Policy -> Capability -> Operation -> Capture -> Verify -> Receipt
```

## Progressive fidelity

```text
Q0  world manifest / token
Q1  districts or regions
Q2  structures
Q3  rooms or cells
Q4  objects or entities
Q5  local high-fidelity assets
```

The runtime should request only the fidelity needed by the current task or observer.

## Deterministic reconstruction

A WORLDQ package may contain semantic parameters and procedural seeds, but deterministic claims require pinned generator versions plus integrity metadata. Residual correction data may be added when exact reconstruction cannot be achieved procedurally.

A valid reconstruction receipt should identify at least:

- package/version identifier
- codec profile
- generator identifier and version when applicable
- seed when applicable
- scene graph/content hashes
- requested fidelity level
- decoded result hash or evidence reference
- verification status

## Demo acceptance path

For the deadline build, the safest high-signal hero flow is:

1. Inspect the current PARALLAX scene.
2. Produce a compact WORLDQ-style manifest from the scene graph.
3. Show quantized transform values and an estimated byte delta without making fabricated compression claims.
4. Reconstruct the scene state from the manifest.
5. Apply one bounded PARALLAX mutation.
6. Capture before/after state.
7. Verify reconstruction plus mutation result.
8. Emit a combined receipt.

## Repository boundaries

- `AGENTROPOLIS-WORLDQ`: codec, package format, quantization, streaming and reconstruction contracts.
- `AGENTROPOLIS-PARALLAX-SPATIAL-MCP`: governed spatial runtime and verification/receipt system.
- `AGENTROPOLIS-WEBMCP-CHALLENGE`: challenge UI, orchestration, demo adapters and submission evidence.

Do not move challenge-specific UI into WORLDQ or PARALLAX before the deadline. Reusable components can be extracted after the challenge is stable.
