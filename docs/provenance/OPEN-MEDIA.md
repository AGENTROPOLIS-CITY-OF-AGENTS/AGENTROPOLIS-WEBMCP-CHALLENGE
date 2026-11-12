# Upstream provenance: Open Media / Shot Composer

- Repository: `Anujatk1999/open-media`
- Upstream product name: Shot Composer
- License reported by upstream: MIT
- Integration status: **REFERENCE / EXPERIMENTAL — NOT YET VERIFIED LIVE**
- AGENTROPOLIS lane: PARALLAX // Spatial Composer

## Why it is being evaluated

The upstream project is a browser-based 3D cinematic previsualization tool. Its documented features include articulated mannequin posing, primitive scene objects, camera framing presets, OTS composition, elevation controls, motion/keyframe tracks, reusable scenes/poses/motions, static frame capture, and a local MCP server.

## Provenance boundary

This repository does not claim authorship of the upstream Shot Composer. Any source code or assets copied from upstream must retain the applicable MIT license notice and be recorded in repository provenance before release.

The initial PARALLAX work deliberately adds only an integration contract and bounded capability schema. No upstream source code is copied by these files.

## Authority boundary

The upstream MCP/composer is not an authority source. If integrated, all consequential actions must enter through PARALLAX capability checks and the existing governed execution corridor. The PARALLAX scene graph, verification logic, capture evidence, and receipts remain authoritative for the challenge proof.

## Verification boundary

Do not label the Open Media adapter `LIVE`, `CONNECTED`, or `VERIFIED` until an end-to-end runtime test proves:

1. tool registration,
2. capability enforcement,
3. composer mutation,
4. re-observation,
5. capture binding,
6. deterministic verification,
7. receipt generation, and
8. denied-operation behavior.
