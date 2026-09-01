import fs from 'node:fs'
import path from 'node:path'
import { loadRegistry, loadTemplates, readJson, repoRoot, writeJson } from './_helpers.mjs'

const manifests = await loadRegistry()
const templates = await loadTemplates()
const colors = readJson(path.join(repoRoot, 'design-system/tokens/colors.json'))
const districtThemeJson = readJson(path.join(repoRoot, 'design-system/tokens/districts.json'))
const spacing = readJson(path.join(repoRoot, 'design-system/tokens/spacing.json'))

const catalog = {
  generatedAt: '2026-09-01',
  owner: 'Creator / Construction',
  lifecycle: ['SOURCE', 'QUARANTINE', 'REVIEW', 'ADAPT', 'REGISTER', 'DISTRIBUTE', 'EXECUTE', 'RECEIPT', 'AUDIT'],
  components: manifests,
  templates,
  districtThemes: districtThemeJson.districts,
}

const componentIndex = manifests.map((manifest) => ({
  id: manifest.id,
  name: manifest.name,
  category: manifest.classification.category,
  maturity: manifest.classification.maturity,
  runtime: manifest.classification.runtime,
  gpuRequired: manifest.classification.gpuRequired,
  districts: manifest.agentropolis.districts,
  surfaces: manifest.registry.surfaces,
  interactions: manifest.registry.interactions,
  gpuCost: manifest.registry.gpuCost,
  accessibility: manifest.registry.accessibility,
  reducedMotion: Boolean(manifest.agentropolis.reducedMotionFallback.trim()),
  status: manifest.classification.maturity,
}))

const districts = {}
for (const manifest of manifests) {
  for (const district of manifest.agentropolis.districts) {
    if (!districts[district]) districts[district] = []
    districts[district].push(manifest.id)
  }
}

const districtCapabilities = {
  generatedAt: '2026-09-01',
  owner: 'Creator / Construction',
  districts,
  themes: districtThemeJson.districts,
}

writeJson(path.join(repoRoot, 'design-system/catalog.json'), catalog)
writeJson(path.join(repoRoot, 'design-system/component-index.json'), componentIndex)
writeJson(path.join(repoRoot, 'design-system/district-capabilities.json'), districtCapabilities)

const cards = manifests.map((manifest) => `
    <article id="${manifest.id}" class="card">
      <header>
        <strong>${manifest.name}</strong>
        <span>${manifest.classification.maturity.toUpperCase()}</span>
      </header>
      <p>${manifest.id}</p>
      <dl>
        <dt>Category</dt><dd>${manifest.classification.category}</dd>
        <dt>Runtime</dt><dd>${manifest.classification.runtime}</dd>
        <dt>GPU</dt><dd>${manifest.registry.gpuCost}</dd>
        <dt>Surface</dt><dd>${manifest.registry.surfaces.join(', ')}</dd>
        <dt>Interaction</dt><dd>${manifest.registry.interactions.join(', ')}</dd>
        <dt>Reduced Motion</dt><dd>${manifest.agentropolis.reducedMotionFallback}</dd>
      </dl>
    </article>`).join('\n')

const templateList = templates.map((template) => `
    <article class="card">
      <header>
        <strong>${template.name}</strong>
        <span>TEMPLATE</span>
      </header>
      <p>${template.id}</p>
      <p>${template.description}</p>
    </article>`).join('\n')

const themeList = Object.values(districtThemeJson.districts).map((theme, index) => {
  const [id] = Object.entries(districtThemeJson.districts)[index]
  return `
    <article class="card">
      <header>
        <strong>${id}</strong>
        <span>INHERITS CORE</span>
      </header>
      <p>Accent: ${theme.accent}</p>
    </article>`
}).join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AGENTROPOLIS UI Vault Catalog</title>
  <style>
    :root {
      --surface: ${colors.surfaces.surface};
      --raised: ${colors.surfaces.surfaceRaised};
      --border: ${colors.surfaces.border};
      --text: ${colors.surfaces.text};
      --muted: ${colors.surfaces.textMuted};
      --cyan: ${colors.palette.cyan};
      --red: ${colors.palette.agentropolisRed};
    }
    * { box-sizing: border-box; }
    body { margin: 0; padding: ${spacing.layout.sectionGap}px; background: var(--surface); color: var(--text); font-family: Inter, system-ui, sans-serif; }
    h1, h2, strong, span { font-family: Orbitron, system-ui, sans-serif; letter-spacing: 0.08em; }
    .hero { display: grid; gap: ${spacing.layout.panelGap}px; margin-bottom: ${spacing.layout.sectionGap}px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(${spacing.layout.catalogColumnMin}px, 1fr)); gap: ${spacing.layout.panelGap}px; }
    .card { padding: ${spacing.layout.panelPadding}px; border: 1px solid var(--border); background: var(--raised); box-shadow: 0 0 18px rgba(0,229,255,0.08); }
    .card header { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
    .card p, .card dd { color: var(--muted); margin: 0; }
    .card dl { display: grid; grid-template-columns: 110px 1fr; gap: 6px 8px; margin: 12px 0 0; }
    a { color: var(--cyan); }
  </style>
</head>
<body>
  <section class="hero">
    <h1>AGENTROPOLIS UI Vault</h1>
    <p>GitHub-authoritative component catalog. Figma is optional only.</p>
  </section>
  <section>
    <h2>Components</h2>
    <div class="grid">${cards}</div>
  </section>
  <section>
    <h2>Templates</h2>
    <div class="grid">${templateList}</div>
  </section>
  <section>
    <h2>District Themes</h2>
    <div class="grid">${themeList}</div>
  </section>
</body>
</html>`

const catalogDir = path.join(repoRoot, 'design-system/catalog')
fs.mkdirSync(catalogDir, { recursive: true })
fs.writeFileSync(path.join(catalogDir, 'index.html'), html, 'utf8')

console.log(`catalog generated: ${manifests.length} components, ${templates.length} templates`)
