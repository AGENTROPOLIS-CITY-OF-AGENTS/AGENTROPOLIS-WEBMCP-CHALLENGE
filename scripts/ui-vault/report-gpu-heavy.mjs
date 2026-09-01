import { loadRegistry } from './_helpers.mjs'

const manifests = await loadRegistry()
const heavy = manifests.filter((manifest) => manifest.classification.gpuRequired || manifest.classification.runtime === 'WebGL/WebGL2' || manifest.classification.runtime === 'Three.js').map((manifest) => ({
  id: manifest.id,
  runtime: manifest.classification.runtime,
  maturity: manifest.classification.maturity,
}))

console.log(JSON.stringify({ gpuHeavyComponents: heavy }, null, 2))
