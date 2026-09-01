import fs from 'node:fs'
import path from 'node:path'
import { listFiles, repoRoot } from './_helpers.mjs'

const files = listFiles(path.join(repoRoot, 'packages/ui-vault'), (file) => /\.(ts|tsx|html|md|json)$/.test(file))
const findings = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  if (/<iframe|iframe/i.test(content)) findings.push(path.relative(repoRoot, file))
}

console.log(JSON.stringify({ iframeDependencies: findings }, null, 2))
