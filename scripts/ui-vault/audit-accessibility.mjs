import fs from 'node:fs'
import path from 'node:path'
import { listFiles, loadRegistry, repoRoot } from './_helpers.mjs'

const manifests = await loadRegistry()
const files = listFiles(path.join(repoRoot, 'packages/ui-vault/src/components'), (file) => /\.(ts|tsx)$/.test(file))
const issues = []

for (const manifest of manifests) {
  if (!manifest.agentropolis.reducedMotionFallback.trim()) issues.push(`${manifest.id}: missing reducedMotionFallback`)
}

for (const file of files.filter((entry) => /ImageGrid|StellarGallery/.test(entry))) {
  const content = fs.readFileSync(file, 'utf8')
  if (!content.includes('alt=')) issues.push(`${path.relative(repoRoot, file)}: image primitive missing alt text usage`)
}

for (const file of files.filter((entry) => /Gallery|Integrations/.test(entry))) {
  const content = fs.readFileSync(file, 'utf8')
  if (content.includes('role="button"') && !content.includes('onKeyDown')) issues.push(`${path.relative(repoRoot, file)}: interactive role missing keyboard handler`)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log('accessibility audit ok')
