# Design Harness Runbook

Use this runbook for the final WebMCP visual pass.

## Timebox

- Contract freeze: 15 minutes
- Candidate generation: 45 minutes
- Blind selection: 20 minutes
- Implementation repair: 2 hours
- Accessibility and responsive pass: 60 minutes
- Build, evidence, and approval: 45 minutes

Do not restart visual direction after selection unless the chosen candidate blocks the demo.

## Candidate Scorecard

Score each item 0-2:

| Criterion | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Dominant action | unclear | findable | immediate |
| Corridor comprehension | confusing | needs explanation | self-explanatory |
| Trust | looks simulated | mixed | evidence-linked |
| Accessibility risk | high | repairable | low |
| Mobile | broken | crowded | guided |
| Implementation cost | rewrite | moderate | bounded |

Reject a candidate with a zero for dominant action, trust, or accessibility risk.

## Evidence

Create `evidence/design/<timestamp>-receipt.json` containing:

- contract version;
- commit SHA;
- candidate identifiers or screenshots;
- scorecard;
- selected candidate and rationale;
- accessibility, responsive, performance, test, and build results;
- waivers;
- human approver;
- approval timestamp.

Do not claim OpenDesign's beta evaluation results as independently verified evidence for this submission.
