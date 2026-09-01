import type { VaultTemplateManifest } from '../manifests/types'

export const vaultTemplates: VaultTemplateManifest[] = [
  {
    id: 'template.hermes-city-construction-mode',
    name: 'Hermes City Construction Mode',
    description: 'Construction surface for Hermes City with governed integration visibility.',
    recommendedComponents: ['system.universal-district-shell', 'system.command-header', 'navigation.system-nav', 'integration.constellation', 'agent.credential', 'receipt.execution-receipt'],
  },
  {
    id: 'template.asbe-production-surfaces',
    name: 'ASBE Production Surfaces',
    description: 'Production-ready operator surfaces for ASBE applications.',
    recommendedComponents: ['system.universal-district-shell', 'system.signal-card', 'system.operation-card', 'action.energy-cta', 'receipt.execution-receipt'],
  },
  {
    id: 'template.mission-control',
    name: 'Mission Control',
    description: 'Operational audit and system state composition.',
    recommendedComponents: ['system.command-header', 'system.status-chip', 'system.signal-card', 'receipt.execution-receipt', 'receipt.tool-calls', 'integration.constellation'],
  },
  {
    id: 'template.universal-district-shell',
    name: 'Universal District Shell',
    description: 'Base shell for future districts consuming UI Vault primitives.',
    recommendedComponents: ['system.universal-district-shell', 'navigation.system-nav', 'system.section-title', 'system.hud-divider', 'system.system-footer'],
  },
]
