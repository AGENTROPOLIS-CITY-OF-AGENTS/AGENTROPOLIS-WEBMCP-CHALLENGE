# PARALLAX Production Parity

Production parity is a separate gate from build success. Capture the approved local states (hero, loop, ready, act, verify, denial, final summary), then capture the same states from the deployed Pages URL and compare asset resolution, fonts, video, WebGL, opacity, layout, and responsive behavior.

This repository does not claim browser or production visual PASS without screenshots and hashes. Until a deployed target is captured, `PRODUCTION_PARITY` and `BROWSER_VISUAL` remain `DEFERRED_WITH_REASON`.

## Receipt fields

`commitSha`, `build`, `tests`, `designLock`, `motionLock`, `antiSlop`, `responsive`, `localScreenshotHashes`, `productionScreenshotHashes`, `visualDiff`, `assetResolution`, `productionUrl`, and `timestamp`.
