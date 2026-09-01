import fs from 'node:fs'
import path from 'node:path'
import { listFiles, repoRoot } from './_helpers.mjs'

const targets = [
  path.join(repoRoot, 'packages/ui-vault/src'),
  path.join(repoRoot, 'packages/ui-vault/tests'),
  path.join(repoRoot, 'design-system'),
  path.join(repoRoot, 'districts/creator-construction'),
]

const files = targets.flatMap((target) => listFiles(target, (file) => /\.(ts|tsx|json|md|html|css)$/.test(file)))
const issues = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  if (/\t/.test(content)) issues.push(`${file}: tab characters are not allowed`)
  const trailing = content.split(/\r?\n/).findIndex((line) => /\s+$/.test(line))
  if (trailing >= 0) issues.push(`${file}:${trailing + 1}: trailing whitespace`)
  if (file.endsWith('.json')) {
    try {
      JSON.parse(content)
    } catch (error) {
      issues.push(`${file}: invalid JSON (${error instanceof Error ? error.message : String(error)})`)
    }
  }
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log(`lint ok: ${files.length} files`)
