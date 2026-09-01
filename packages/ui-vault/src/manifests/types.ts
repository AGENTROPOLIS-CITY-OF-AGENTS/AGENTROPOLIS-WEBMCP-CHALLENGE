export type VaultComponentCategory =
  | 'action'
  | 'galleries'
  | 'loaders'
  | 'motion'
  | 'navigation'
  | 'shaders'
  | 'spatial'
  | 'tool-ui'

export type VaultComponentMaturity = 'quarantine' | 'reviewed' | 'stable' | 'deprecated'

export type VaultRuntimeClass = 'DOM' | 'CSS' | 'Canvas' | 'WebGL/WebGL2' | 'Three.js' | 'Remotion'

export type VaultSurfaceKind =
  | 'district-shell'
  | 'navigation'
  | 'header'
  | 'card'
  | 'badge'
  | 'section-title'
  | 'divider'
  | 'footer'
  | 'gallery'
  | 'loader'
  | 'shader-panel'
  | 'spatial-display'
  | 'receipt'
  | 'credential'
  | 'cta'

export type VaultInteractionKind = 'static' | 'activate' | 'navigate' | 'inspect' | 'select' | 'compose'

export type VaultGpuCost = 'none' | 'low' | 'medium' | 'high'

export type VaultAccessibilityCapability = 'keyboard' | 'alt-text' | 'aria-label' | 'aria-live' | 'focus-visible' | 'reduced-motion'

export interface VaultComponentManifest {
  id: string
  name: string
  version: string
  source: {
    provider: string
    sourceUrl: string | null
    retrievedAt: string | null
    originalAuthor: string | null
    license: string | null
  }
  classification: {
    category: VaultComponentCategory
    maturity: VaultComponentMaturity
    clientOnly: boolean
    gpuRequired: boolean
    mobileSafe: boolean
    runtime: VaultRuntimeClass
  }
  dependencies: string[]
  agentropolis: {
    systemWide: boolean
    districts: string[]
    applications: string[]
    reducedMotionFallback: string
  }
  registry: {
    surfaces: VaultSurfaceKind[]
    interactions: VaultInteractionKind[]
    gpuCost: VaultGpuCost
    accessibility: VaultAccessibilityCapability[]
  }
  localModifications: string[]
  agentropolisVersion: string
}

export interface VaultTemplateManifest {
  id: string
  name: string
  description: string
  recommendedComponents: string[]
}

export interface VaultSearchFilters {
  query?: string
  category?: VaultComponentCategory
  maturity?: VaultComponentMaturity
  status?: VaultComponentMaturity
  runtime?: VaultRuntimeClass
  district?: string
  surface?: VaultSurfaceKind
  interaction?: VaultInteractionKind
  gpuCost?: VaultGpuCost
  accessibility?: VaultAccessibilityCapability
  reducedMotion?: boolean
  application?: string
  limit?: number
}
