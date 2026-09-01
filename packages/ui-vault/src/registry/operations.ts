import { getVaultComponent, listStableConsumableVaultComponents, listVaultComponents } from './index'
import { vaultTemplates } from '../templates'
import type { VaultComponentManifest, VaultSearchFilters, VaultTemplateManifest } from '../manifests/types'

export interface UiSearchResult {
  matches: VaultComponentManifest[]
  total: number
  blocked: string[]
}

export interface UiInspectResult {
  manifest?: VaultComponentManifest
  template?: VaultTemplateManifest
  quarantine: boolean
  adapterAvailable: boolean
}

export interface UiInstallResult {
  status: 'installable' | 'blocked'
  reason: string | null
  manifest?: VaultComponentManifest
  dependencies: string[]
}

export interface UiAdaptResult {
  id: string
  adapterName: string
  consumer: string
  runtimeBoundary: string
  reducedMotionFallback: string
}

export interface UiComposeResult {
  template: VaultTemplateManifest | undefined
  compatible: VaultComponentManifest[]
  missing: string[]
}

export interface UiPreviewResult {
  id: string
  previewPath: string
  catalogAnchor: string
}

export interface UiAuditResult {
  ids: string[]
  missingLicenses: string[]
  gpuHeavy: string[]
  reducedMotionGaps: string[]
}

export function uiSearch(filters: VaultSearchFilters = {}): UiSearchResult {
  const query = filters.query?.trim().toLowerCase()
  const filtered = listVaultComponents().filter((manifest) => {
    if (filters.category && manifest.classification.category !== filters.category) return false
    if (filters.maturity && manifest.classification.maturity !== filters.maturity) return false
    if (filters.status && manifest.classification.maturity !== filters.status) return false
    if (filters.runtime && manifest.classification.runtime !== filters.runtime) return false
    if (filters.district && !manifest.agentropolis.districts.includes(filters.district) && !manifest.agentropolis.districts.includes('all')) return false
    if (filters.surface && !manifest.registry.surfaces.includes(filters.surface)) return false
    if (filters.interaction && !manifest.registry.interactions.includes(filters.interaction)) return false
    if (filters.gpuCost && manifest.registry.gpuCost !== filters.gpuCost) return false
    if (filters.accessibility && !manifest.registry.accessibility.includes(filters.accessibility)) return false
    if (typeof filters.reducedMotion === 'boolean') {
      const hasReducedMotion = manifest.registry.accessibility.includes('reduced-motion') && manifest.agentropolis.reducedMotionFallback.trim().length > 0
      if (filters.reducedMotion !== hasReducedMotion) return false
    }
    if (filters.application && !manifest.agentropolis.applications.includes(filters.application) && !manifest.agentropolis.applications.includes('all')) return false
    if (!query) return true
    return `${manifest.id} ${manifest.name} ${manifest.classification.category} ${manifest.registry.surfaces.join(' ')} ${manifest.agentropolis.districts.join(' ')}`.toLowerCase().includes(query)
  })
  const limited = typeof filters.limit === 'number' ? filtered.slice(0, filters.limit) : filtered
  return {
    matches: limited,
    total: filtered.length,
    blocked: filtered.filter((manifest) => manifest.classification.maturity === 'quarantine').map((manifest) => manifest.id),
  }
}

export function uiInspect(id: string): UiInspectResult {
  const manifest = getVaultComponent(id)
  const template = vaultTemplates.find((entry) => entry.id === id)
  return {
    manifest,
    template,
    quarantine: manifest?.classification.maturity === 'quarantine',
    adapterAvailable: Boolean(manifest),
  }
}

export function uiInstall(id: string, consumer: string, target: string): UiInstallResult {
  const manifest = getVaultComponent(id)
  if (!manifest) return { status: 'blocked', reason: `Unknown component ${id}.`, dependencies: [] }
  if (manifest.classification.maturity === 'quarantine') {
    return { status: 'blocked', reason: `${id} remains quarantined and cannot be distributed to ${consumer} at ${target}.`, manifest, dependencies: manifest.dependencies }
  }
  return { status: 'installable', reason: null, manifest, dependencies: manifest.dependencies }
}

export function uiAdapt(id: string, adapterName: string, consumer: string): UiAdaptResult {
  const manifest = getVaultComponent(id)
  if (!manifest) throw new Error(`Unknown component ${id}.`)
  return {
    id,
    adapterName,
    consumer,
    runtimeBoundary: manifest.classification.runtime,
    reducedMotionFallback: manifest.agentropolis.reducedMotionFallback,
  }
}

export function uiCompose(templateId: string, componentIds: string[]): UiComposeResult {
  const template = vaultTemplates.find((entry) => entry.id === templateId)
  const components = componentIds.map((id) => getVaultComponent(id)).filter((entry): entry is VaultComponentManifest => Boolean(entry))
  const missing = componentIds.filter((id) => !getVaultComponent(id))
  return { template, compatible: components, missing }
}

export function uiPreview(id: string): UiPreviewResult {
  return {
    id,
    previewPath: 'design-system/catalog/index.html',
    catalogAnchor: `#${id}`,
  }
}

export function uiAudit(id?: string): UiAuditResult {
  const manifests = id ? [getVaultComponent(id)].filter((entry): entry is VaultComponentManifest => Boolean(entry)) : listVaultComponents()
  return {
    ids: manifests.map((manifest) => manifest.id),
    missingLicenses: manifests.filter((manifest) => manifest.source.license == null).map((manifest) => manifest.id),
    gpuHeavy: manifests.filter((manifest) => manifest.classification.gpuRequired).map((manifest) => manifest.id),
    reducedMotionGaps: manifests.filter((manifest) => !manifest.agentropolis.reducedMotionFallback.trim()).map((manifest) => manifest.id),
  }
}

export function listReviewedInstallables(): VaultComponentManifest[] {
  return listStableConsumableVaultComponents().filter((manifest) => manifest.classification.maturity === 'reviewed' || manifest.classification.maturity === 'stable')
}
