import path from 'node:path'
import { loadRegistry, listFiles, readJson, repoRoot } from './_helpers.mjs'

const manifests = await loadRegistry()
const quarantineFiles = listFiles(path.join(repoRoot, 'packages/ui-vault/quarantine/candidates'), (file) => file.endsWith('.json'))
const quarantine = quarantineFiles.map(readJson)
const issues = []

const seenIds = new Set()
for (const manifest of manifests) {
  if (seenIds.has(manifest.id)) issues.push(`duplicate manifest id: ${manifest.id}`)
  seenIds.add(manifest.id)
}

const dedupeKeys = new Map()
for (const record of quarantine) {
  if (!record.dedupeKey) continue
  const existing = dedupeKeys.get(record.dedupeKey)
  if (existing) issues.push(`duplicate candidate dedupeKey: ${record.dedupeKey} (${existing}, ${record.id})`)
  dedupeKeys.set(record.dedupeKey, record.id)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log(`duplicate detection ok: ${manifests.length} manifests, ${quarantine.length} quarantine records`)
