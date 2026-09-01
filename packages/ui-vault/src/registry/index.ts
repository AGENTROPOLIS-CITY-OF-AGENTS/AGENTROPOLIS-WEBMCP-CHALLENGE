import { initialVaultManifests } from '../manifests/initial'
import type { VaultComponentCategory, VaultComponentManifest, VaultComponentMaturity, VaultGpuCost, VaultInteractionKind, VaultSurfaceKind } from '../manifests/types'

const registry = new Map(initialVaultManifests.map((manifest) => [manifest.id, manifest] as const))

export function listVaultComponents(): VaultComponentManifest[] {
  return [...registry.values()]
}

export function getVaultComponent(id: string): VaultComponentManifest | undefined {
  return registry.get(id)
}

export function listVaultComponentsByCategory(category: VaultComponentCategory): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.classification.category === category)
}

export function listVaultComponentsByMaturity(maturity: VaultComponentMaturity): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.classification.maturity === maturity)
}

export function listVaultComponentsBySurface(surface: VaultSurfaceKind): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.registry.surfaces.includes(surface))
}

export function listVaultComponentsByInteraction(interaction: VaultInteractionKind): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.registry.interactions.includes(interaction))
}

export function listVaultComponentsByGpuCost(gpuCost: VaultGpuCost): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.registry.gpuCost === gpuCost)
}

export function listStableConsumableVaultComponents(): VaultComponentManifest[] {
  return listVaultComponents().filter((manifest) => manifest.classification.maturity !== 'quarantine' && manifest.classification.maturity !== 'deprecated')
}

export function searchVaultComponents(query: string): VaultComponentManifest[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return listVaultComponents()
  return listVaultComponents().filter((manifest) => `${manifest.id} ${manifest.name}`.toLowerCase().includes(normalized))
}
