import path from 'node:path'
import { loadRegistry, readJson, repoRoot } from './_helpers.mjs'

const schema = readJson(path.join(repoRoot, 'design-system/manifests/ui-vault.schema.json'))
const manifests = await loadRegistry()
const issues = []

const categorySet = new Set(schema.properties.classification.properties.category.enum)
const maturitySet = new Set(schema.properties.classification.properties.maturity.enum)
const runtimeSet = new Set(schema.properties.classification.properties.runtime.enum)
const surfaceSet = new Set(schema.properties.registry.properties.surfaces.items.enum)
const interactionSet = new Set(schema.properties.registry.properties.interactions.items.enum)
const gpuCostSet = new Set(schema.properties.registry.properties.gpuCost.enum)
const accessibilitySet = new Set(schema.properties.registry.properties.accessibility.items.enum)

for (const manifest of manifests) {
  for (const key of schema.required) {
    if (!(key in manifest)) issues.push(`${manifest.id}: missing ${key}`)
  }
  if (!categorySet.has(manifest.classification.category)) issues.push(`${manifest.id}: invalid category`)
  if (!maturitySet.has(manifest.classification.maturity)) issues.push(`${manifest.id}: invalid maturity`)
  if (!runtimeSet.has(manifest.classification.runtime)) issues.push(`${manifest.id}: invalid runtime`)
  if (!gpuCostSet.has(manifest.registry.gpuCost)) issues.push(`${manifest.id}: invalid gpuCost`)
  if (!Array.isArray(manifest.registry.surfaces) || manifest.registry.surfaces.some((entry) => !surfaceSet.has(entry))) issues.push(`${manifest.id}: invalid surfaces`)
  if (!Array.isArray(manifest.registry.interactions) || manifest.registry.interactions.some((entry) => !interactionSet.has(entry))) issues.push(`${manifest.id}: invalid interactions`)
  if (!Array.isArray(manifest.registry.accessibility) || manifest.registry.accessibility.some((entry) => !accessibilitySet.has(entry))) issues.push(`${manifest.id}: invalid accessibility`)
  if (!Array.isArray(manifest.dependencies)) issues.push(`${manifest.id}: dependencies must be array`)
  if (!Array.isArray(manifest.localModifications)) issues.push(`${manifest.id}: localModifications must be array`)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log(`manifest validation ok: ${manifests.length} manifests`)
