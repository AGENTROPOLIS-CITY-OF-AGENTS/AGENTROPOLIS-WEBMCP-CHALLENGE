import fs from 'node:fs'
import path from 'node:path'
import { listFiles, repoRoot } from './_helpers.mjs'

const files = listFiles(path.join(repoRoot, 'packages/ui-vault'), (file) => /\.(ts|tsx|md|json|html|css)$/.test(file))
const findings = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  if (/https?:\/\//.test(content)) findings.push(path.relative(repoRoot, file))
}

console.log(JSON.stringify({ filesWithRemoteReferences: findings }, null, 2))
