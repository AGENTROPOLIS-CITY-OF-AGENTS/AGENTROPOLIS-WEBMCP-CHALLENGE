# PARALLAX // SPATIAL COMPOSER

Status: **EXPERIMENTAL INTEGRATION CONTRACT**

Upstream reference: `Anujatk1999/open-media` (MIT)

## Purpose

Open Media / Shot Composer is a candidate local-first 3D previsualization surface beneath PARALLAX. It is **not** a new authority layer and it does not replace the governed PARALLAX scene graph.

PARALLAX remains authoritative for capability discovery, Identity -> Mandate -> Policy -> Permission, bounded execution, re-observation, verification, and capture-bound receipts.

Open Media contributes articulated characters, objects, cameras, shot presets, posing, composition, motion keyframes, static capture, and reusable scene/pose/motion state.

```text
HUMAN / AGENT INTENT
        |
        v
PARALLAX WebMCP
        |
Identity -> Mandate -> Policy -> Permission
        |
        v
SPATIAL COMPOSER ADAPTER
        |
        v
OPEN MEDIA / SHOT COMPOSER
character | pose | camera | composition | motion
        |
        v
RE-OBSERVE -> VERIFY -> RECEIPT
```

## Challenge thesis

PARALLAX can expose a structured, governed capability surface for a live 3D cinematic environment rather than limiting the proof to ordinary DOM controls.

Representative instruction:

> Make this shot a low-angle medium close-up. Put the second actor behind the hero's right shoulder, apply a defensive pose, and add a three-second camera push-in.

The governed loop remains:

1. OBSERVE the scene, camera, actors, transforms, pose state, and motion tracks.
2. AUTHORIZE requested capabilities against the scene graph.
3. ACT through bounded spatial tools.
4. SEE AGAIN by reading post-action state and/or capturing the frame.
5. VERIFY the requested objective against resulting evidence.
6. RECEIPT tool calls, before/after state, capture hash, verification, and policy decision.

**Generated is not verified.**

## Upstream capability map

The upstream project documents:

- characters and primitive objects
- articulated character posing and saved poses
- Wide / Full / Medium / MCU / Close-Up shot sizes
- Front / 3-4 / Profile / Back / Over-the-Shoulder camera angles
- Eye Level / High / Low elevation
- center / thirds / negative-space composition
- camera, object, and character transform keyframes
- motion duration, preview, scrub, and reusable motion tracks
- static frame capture
- reusable scenes, poses, and motions
- a local MCP server driving composer actions

## Target bounded tool vocabulary

```text
scene.inspect
scene.get_object
scene.add_character
scene.add_object
transform.translate
transform.rotate
transform.scale
pose.apply
pose.adjust_joint
camera.set_shot_size
camera.set_angle
camera.set_elevation
camera.set_composition
camera.move
motion.set_duration
motion.add_keyframe
motion.preview
scene.capture
scene.save
parallax.verify_scene
parallax.emit_receipt
```

Each mutating operation MUST be capability-checked before reaching the composer.

PARALLAX currently registers bounded spatial operations for inspect, translate, rotate, material, intensity, capture, and verify. Composer operations must either map to an existing governed primitive or introduce a new explicit permission before registration.

Never add unrestricted `edit_scene`, `run_script`, `eval`, shell, or arbitrary command capabilities.

## Evidence contract

Every consequential composition mutation SHOULD bind scene identity/version, objective, operations, content-addressed capture evidence, verification status/score, and the governing policy decision into the execution receipt.

Visual spectacle alone is not proof.

## Agentropolis 3D humanoid rule

Anything represented **as an Agentropolis agent inside a spatial scene must be a true articulated 3D humanoid agent**.

Do not use flat cards, emoji, floating circles/orbs, billboards, or wireframe boxes as the final agent representation. Upstream mannequins may be used as an articulation scaffold, but Agentropolis presentation assets must resolve to humanoid 3D bodies with inspectable scene identity.

A conventional 2D control path remains valid for accessibility and fallback. It does not replace the spatial agent representation.

## Placement

```text
AGENTROPOLIS INTELLIGENCE GRID
          |
       PARALLAX
  governed Spatial WebMCP
          |
   VYLUM / EXPERIENCE GRID
          |
 PARALLAX SPATIAL COMPOSER
          |
    OPEN MEDIA ADAPTER
          |
   3D PREVIS / SHOT STATE
```

## Challenge demo

1. Start with two humanoid actors and a camera.
2. PARALLAX inspects the scene.
3. User requests an OTS / MCU / low-angle composition plus a defensive hero pose.
4. PARALLAX performs only authorized changes.
5. Capture the resulting frame.
6. Deterministically verify expected spatial state.
7. Display a capture-bound receipt in Mission Control.
8. Separately demonstrate a denied mutation to prove capability boundaries remain active.

## Boundary

This document defines the integration contract and challenge direction. It does **not** claim Open Media is already wired into the deployed PARALLAX runtime. Keep the integration labeled experimental until exercised end-to-end.
