# Spatial WebMCP / Closed-Loop Construction

## Thesis

WebMCP should not only let agents use websites. It should let agents understand, modify, and verify interactive worlds exposed by websites.

This implementation is inspired by closed-loop spatial reasoning patterns, without claiming or recreating Lucida itself.

## Demo objective

> Reconfigure this studio for an interview.

## Corridor

```text
USER INTENT
  -> WebMCP capability exposure
  -> inspect scene graph
  -> bounded mutation
  -> render/capture
  -> visual verification
  -> PASS / CORRECT
  -> construction receipt
```

## Initial capability surface

- `getScene()`
- `getObject(id)`
- `transformObject(mutation)`
- `setMaterial(id, material)`
- `setLight(id, intensity)`
- `captureView()`
- `verifyScene(objective)`

Capabilities are object-scoped. A structured object exposes explicit permissions rather than inviting brittle DOM or pixel automation.

## Governance

Generated != Verified.

Every mutation must pass through the spatial permission boundary. The result is not considered complete until a capture and verification step produces a receipt.

## Hackathon scope

Keep the first hero demo deliberately small:

- one studio scene
- roughly five to seven safe spatial tools
- one natural-language objective
- one visible correction loop
- one auditable receipt

The protocol should remain generic enough to extend later into Creator, ASBE, 789 Studios, NTRU, Mission Control and other interactive districts.
