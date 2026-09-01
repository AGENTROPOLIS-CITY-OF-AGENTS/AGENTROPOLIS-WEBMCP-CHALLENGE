import { loadRegistry } from './_helpers.mjs'

const manifests = await loadRegistry()
const gaps = manifests.filter((manifest) => !manifest.agentropolis.reducedMotionFallback.trim()).map((manifest) => manifest.id)

if (gaps.length) {
  console.error(gaps.join('\n'))
  process.exit(1)
}

console.log(`reduced-motion audit ok: ${manifests.length} manifests`)
