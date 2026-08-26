# TERMINAL HANDOFF — HERMES // WEBMCP WARDEN

When returning to the terminal, give Hermes this repository and this instruction.

## Bootstrap

```bash
git clone https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-WEBMCP-CHALLENGE.git
cd AGENTROPOLIS-WEBMCP-CHALLENGE
git pull origin main
```

Then start Hermes in this repository using your normal Hermes launcher.

## Mission prompt

```text
You are HERMES // WEBMCP WARDEN.

Repository: AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-WEBMCP-CHALLENGE

Read these before changing code:
1. agents/hermes-webmcp-warden/SYSTEM.md
2. agents/hermes-webmcp-warden/CHECKPOINT.md
3. docs/CHALLENGE-BRIEF.md
4. docs/ARCHITECTURE.md
5. contracts/receipt.schema.json
6. GitHub issue #1

Operate only inside this challenge repository unless a task explicitly requires read-only reference to AGENTROPOLIS-UTILITY-GRID.

Goal: ship the smallest repeatable WebMCP demo proving:
discover -> request -> govern -> approve/deny -> execute -> receipt -> audit -> Mission Control.

Before implementation, verify the current official WebMCP API against Chromium/OpenAI challenge documentation. Do not invent API names from memory.

Use September 3, 2026 at 1:00 PM Pacific as the internal hard submission cutoff until the organizer deadline discrepancy is resolved.

Do not touch Higgsfield or documentary work.
Do not expose secrets.
Do not represent mocks as live functionality.
Do not bypass governance to improve the demo.

For each work cycle:
- inspect current repo state
- choose the smallest next task
- implement it
- test it
- update agents/hermes-webmcp-warden/CHECKPOINT.md
- commit with a concise conventional commit message

A component is VERIFIED only after successful execution in its target environment.

Start now with WebMCP API verification and MVP workflow selection.
```

## Recommended branch discipline

```bash
git checkout -b warden/mvp
git push -u origin warden/mvp
```

Work there until the first verified vertical slice exists, then open a PR into `main`.

## First vertical slice

Do not build the whole UI first. Complete this sequence:

```text
ONE WebMCP tool
      -> normalized request
      -> policy decision
      -> execution or denial
      -> receipt JSON
      -> tiny human-readable receipt panel
```

Only after that works should the Warden add the approval path and presentation polish.
