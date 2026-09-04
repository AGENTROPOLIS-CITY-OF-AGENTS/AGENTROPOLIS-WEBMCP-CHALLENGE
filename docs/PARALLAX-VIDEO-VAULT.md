# PARALLAX Video Vault

`src/media/parallaxVideoVault.ts` is the semantic index for approved media under `public/assets/parallax/`. Components request a purpose (`hero`, `studio`, `system-view`, `governance`, `receipt`) rather than a filename. Every video has an approved still fallback and reduced-motion fallback.

`AmbientMediaProvider` supplies environment state, a 45-second idle screensaver playlist, explicit exit-on-interaction, and current/next asset metadata. It does not trigger protocol actions or fabricate state. Reduced motion disables screensaver cycling. Production sections may continue to use `ParallaxEnvironment`; the vault is the canonical source for future persistent background composition.

Add media by registering metadata, selecting a purpose, providing a still fallback, and extending the construction gate. Never add an empty/black fallback and never claim SPZ support without a verified loader.
