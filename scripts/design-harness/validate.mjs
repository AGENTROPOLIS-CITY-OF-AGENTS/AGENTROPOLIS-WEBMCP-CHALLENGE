import { readFile } from "node:fs/promises";

const path = new URL("../../DESIGN.md", import.meta.url);
const visualPath = new URL("../../design-system/VISUAL_CONSTRUCTION_HARNESS.md", import.meta.url);
const contract = await readFile(path, "utf8");
const visual = await readFile(visualPath, "utf8");

const required = [
  "# AGENTROPOLIS WebMCP Design Contract",
  "## Product Truth",
  "## Information Hierarchy",
  "## Visual Tokens",
  "## Accessibility Gate",
  "## Performance Budget",
  "## Harness Protocol",
  "## Definition of Done",
  "Run governed demo",
  "prefers-reduced-motion",
  "evidence/design/"
];

const missing = required.filter((entry) => !contract.includes(entry));

if (missing.length) {
  console.error("Design contract validation failed.");
  for (const entry of missing) console.error(`- missing: ${entry}`);
  process.exit(1);
}

const visualRequired = [
  "Reference -> Art Direction -> Asset Generation",
  "## DESIGN LOCK",
  "## MOTION LOCK",
  "## ANTI-SLOP LOCK",
  "## PRODUCTION PARITY LOCK",
  "1440x900",
  "1024x768",
  "390x844",
  "evidence/design/",
  "human_approved"
];

const visualMissing = visualRequired.filter((entry) => !visual.includes(entry));
if (visualMissing.length) {
  console.error("Visual construction harness validation failed.");
  for (const entry of visualMissing) console.error(`- missing: ${entry}`);
  process.exit(1);
}

console.log(`Design contract valid: ${required.length} required markers found.`);
console.log(`Visual construction harness valid: ${visualRequired.length} required markers found.`);
