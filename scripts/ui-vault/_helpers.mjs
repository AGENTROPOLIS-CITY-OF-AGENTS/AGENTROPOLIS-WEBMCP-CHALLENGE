import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const repoRoot = path.resolve(__dirname, '..', '..')

export async function loadRegistry() {
  const mod = await import(pathToFileUrl(path.join(repoRoot, 'packages/ui-vault/dist/manifests/initial.js')))
  return mod.initialVaultManifests
}

export async function loadTemplates() {
  const mod = await import(pathToFileUrl(path.join(repoRoot, 'packages/ui-vault/dist/templates/index.js')))
  return mod.vaultTemplates
}

export function pathToFileUrl(filePath) {
  return new URL(`file:///${filePath.replace(/\\/g, '/')}`)
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function listFiles(dir, predicate = () => true, results = []) {
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) listFiles(full, predicate, results)
    else if (predicate(full)) results.push(full)
  }
  return results
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
