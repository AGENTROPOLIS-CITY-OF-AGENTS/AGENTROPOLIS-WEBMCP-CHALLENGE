# WORLD ENGINE — Verification Evidence

This file records what is **verified** versus what is **not yet proven**, per the
repo's verification rule: *Code existing is not proof that the system works.*
Mocked / simulated / experimental / verified behavior stays distinguishable.

## 1. Deterministic lane — runs in CI

The `world-engine` package ships a deterministic, headless verification lane that
runs on every push/PR to `feature/world-engine-abyssal`:

| Command | What it proves |
| --- | --- |
| `npm run typecheck` | Strict TypeScript compiles. |
| `npm run lint` | ESLint clean (src + test). |
| `npm test` | 37 unit/eval tests (authorization, receipts, provider contract, governor, corridor eval). |
| `npm run build` | `tsc` emits `dist/`. |

This lane needs **no browser and no GPU**. It exercises the governed corridor
end to end through the `AbyssalProvider`'s deterministic bridge.

Evidence: CI run on PR #3 is green (`world-engine (typecheck, lint, test, build)` → success).

## 2. Real-browser ABYSSAL integration proof — MANUAL / headed

**Status: PASS in this environment (SwiftShader software WebGL2).**

The actual ABYSSAL procedural-ocean app (`Token-Gremlin/natural-disasters`) was
booted in a real Chromium WebGL2 context via Puppeteer and the compiled WORLD
ENGINE `AbyssalProvider` was wired to the **live running** `window.__app`
(passed as `AbyssalHost`). Governed operations drove the real upstream classes:

- Director `weather.set { windSpeed: 32 }` → real `Weather#set` target moved 7 → 32.
- Director `event.spawn { type: "hurricane" }` → real `Director#spawnHurricane` fired; `_hurricane` present.
- Researcher `event.spawn` → `denied` (CAPABILITY_DENIED).
- Live world rendered frames; screenshot captured.

Command: `npm run demo:live` (requires the ABYSSAL dev server and dist symlink;
see `tools/live-integration.mjs` header).

**Important caveat — do not overclaim.** This ran under **SwiftShader software
rendering** (headless, no physical GPU present in the WSL environment), which the
upstream sim reports as `potato`/`low` tier at ~1 fps. It proves the bridge drives
real ABYSSAL methods and the sim renders in a browser, but it is **not** a
hardware-accelerated GPU validation. That remains an explicit manual gate (below).

### Manual GPU verification gate (NOT yet proven)
Before final release/README-ready claim, run the live integration on a
hardware-accelerated GPU browser (Windows Chrome or Edge headed) and confirm:
- Real GPU renderer string (not SwiftShader) is reported.
- The hurricane is visually identifiable (wind > 30, spray/rain, storm lighting).
- Frame time is interactive (> ~20 fps at a reasonable tier).

This cannot be validated in the current headless WSL environment.

## 3. Deterministic browser / e2e capture

**Status: PASS.**

`node tools/capture-3d.mjs` serves the world-engine package, loads the embedded
3D Mission Control world against the real `mission-control-snapshot.json`
(emitted by the two-agent demo), and captures a deterministic screenshot +
state readback. Confirms a live three.js canvas renders with the governance
corridor and real engine data.

## 4. Embedded 3D Mission Control world

**Status: PASS (deterministic render).**

`assets/mission-control-3d.html` is a self-contained three.js world (vendored
`assets/three.module.min.js`) visualizing the governance corridor:
`Identity → Mandate → Policy Gate → Execution → Receipt`. It consumes the real
`MissionControlSnapshot` and renders:

- 3D corridor zones (cyan identity, grey mandate/policy, gold execution, pink receipt)
- Request packets along the corridor colored by receipt result (green ALLOW / red DENY)
- Live world-state panel (provider, weather, events, authority)
- Receipt log panel

Colors follow the AGENTROPOLIS motherboard design grammar (black substrate,
cyan traces, green allow, red denied, pink receipts).

## Status summary

| Item | Status |
| --- | --- |
| Deterministic CI lane | ✅ Verified (CI green) |
| Real-browser ABYSSAL bridge (software WebGL2) | ✅ Verified |
| Hardware GPU WebGL2 validation | ⚠️ NOT proven — manual gate |
| Deterministic e2e capture | ✅ Verified |
| Embedded 3D Mission Control | ✅ Verified |
