import { readFile } from "node:fs/promises";

const path = new URL("../../DESIGN.md", import.meta.url);
const contract = await readFile(path, "utf8");

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

console.log(`Design contract valid: ${required.length} required markers found.`);
