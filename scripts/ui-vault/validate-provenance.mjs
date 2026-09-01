import path from 'node:path'
import { loadRegistry, listFiles, readJson, repoRoot } from './_helpers.mjs'

const manifests = await loadRegistry()
const quarantineFiles = listFiles(path.join(repoRoot, 'packages/ui-vault/quarantine/candidates'), (file) => file.endsWith('.json'))
const quarantineById = new Map(quarantineFiles.map((file) => {
  const record = readJson(file)
  return [record.id, record]
}))

const issues = []
const missingLicenses = []

for (const manifest of manifests) {
  if (!manifest.source.provider) issues.push(`${manifest.id}: missing source.provider`)
  if (manifest.classification.maturity === 'quarantine' && !quarantineById.has(manifest.id)) issues.push(`${manifest.id}: quarantined manifest missing quarantine record`)
  if (manifest.source.license == null) missingLicenses.push(manifest.id)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log(JSON.stringify({ manifests: manifests.length, quarantineRecords: quarantineById.size, missingLicenses }, null, 2))
