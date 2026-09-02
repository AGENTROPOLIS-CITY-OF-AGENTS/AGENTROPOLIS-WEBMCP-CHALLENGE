# GitHub Pages preview lane

This repository keeps production Pages deployment on the existing `main` workflow lane.

The preview lane is separate:

- Triggered on pull requests for in-repo branches
- Builds the same Vite app with the same `/AGENTROPOLIS-WEBMCP-CHALLENGE/` base path
- Uploads a PR-scoped preview artifact for download
- Posts deterministic browser-target instructions back to the PR
- Uses artifact retention instead of mutating production Pages

Rules:

- Production Pages settings remain unchanged
- Preview artifacts do not require repository secrets
- Forked PRs are not granted preview write authority
- Browser verification must still be captured as evidence before any merge

Operational note:

The deterministic browser target is `http://127.0.0.1:4173` after serving the extracted artifact with `npm run preview -- --host 127.0.0.1 --port 4173` or an equivalent static server. It is not evidence by itself.
