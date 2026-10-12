# CHAOS INPUT: Governed Spatial Hand Control (experimental)

## Ownership and scope
- **AIP / GIP contract:** `docs/AGENTROPOLIS-INTENT-PROTOCOL.md` and `contracts/intent.schema.json` in this challenge proving ground.
- **Shared city graduation:** occurs only after independent runtime evidence and governed review. Do not claim this challenge prototype is live in Creator, PARALLAX, desktop OS, or AR glasses.
- **First consumer:** the opt-in `GestureControlLab` in the WebMCP demo app.
- **Future adapters:** local MediaPipe bundle, WebXR hands, smart glasses, Creator / Kinetic Canvas, and a separately authorized local OS bridge. Device-specific sensing and permissions vary.

## Concrete prototype
The opt-in local camera lab uses the pinned MediaPipe Tasks Vision 0.10.17 browser distribution and hand landmark model v1. Hand coordinates are used to aim a *local demo cursor*, an air-tap selects one of three spatial targets, and an open palm requests **stop** for the demo. Buttons offer keyboard/pointer alternatives. This module never executes WebMCP, triggers payments, cancels real agents, or injects global system clicks.

External module / WASM and model downloads mean the camera lab is **not fully offline**; media frames are processed inside the browser after assets load. Never assert that the browser sends zero network traffic. A verified self-hosted/pinned build is a separate hardening task.

## Privacy and neurodivergent inclusion
- Explicit Start Camera consent; Stop Camera releases media tracks.
- No video recording, upload, gesture-derived emotion scoring, or biometric identity matching in the feature code.
- No assumptions that lack of eye contact, motion, or specific hand posture indicates an emotion or intent.
- Camera is optional. Conventional input remains usable; gesture thresholds and calibration need a configurable accessibility review before graduation.
- No camera permission until human invocation. HTTPS/localhost required by browser.
- Raw landmarks are ephemeral; only intent metadata is displayed to the user. Nothing is persisted by the lab.
- Third-party package/model fetches must pass 54T intake and be mirrored to approved origin before production.

## Architecture
```text
camera / XR / smart glasses / pointer / keyboard
   -> CHAOS INPUT sensor or deterministic adapter
   -> explicit gesture classification (confidence + debouncing)
   -> AIP v0.1: verb + identity supplied by host + target + provenance
   -> scope resolution
   -> AEGIS identity/mandate/policy/permission/approval gate (NOT IMPLEMENTED IN LAB)
   -> governed execution adapter (NOT IMPLEMENTED IN LAB)
   -> observed verification + receipt + audit (NOT IMPLEMENTED IN LAB)
```

## Non-negotiable separation
Observation != inferred emotion != deliberate intent != permission != verified execution.
The lab emits **intent proposals only**. In particular: an air-tap cannot authorize commerce, swipe-right cannot approve a consequential transaction, palm-stop does not prove a remote mission was cancelled.

## Verification
- `npm run test -- src/intent/chaos-input.test.ts` proves deterministic AIP normalization and safety boundary.
- `npm run typecheck` and `npm run build` are required CI gates.
- Real device evidence remains pending: webcam permission lifecycle, browser compatibility, left/right hand variation, lighting, motion stabilization, low confidence, reduced motion, and keyboard access.
- No deployment or OS-global control is implied.
