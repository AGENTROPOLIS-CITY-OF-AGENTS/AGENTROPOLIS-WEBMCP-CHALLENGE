import { obsidianSignalTokens, type ObsidianSignalTokens } from './obsidianSignal'

export type DistrictThemeId =
  | 'core'
  | 'hermes-city'
  | 'asbe'
  | 'webmcp'
  | 'mission-control'
  | 'fiscal-command'
  | '789-studios'
  | 'ntru'
  | 'agentropolis-uni'
  | 'social-systems'

export interface DistrictThemeContract {
  id: DistrictThemeId
  label: string
  inheritsCore: true
  accent: string
  accentSoft: string
  note: string
  tokens: ObsidianSignalTokens
}

function districtTheme(id: DistrictThemeId, label: string, accent: string, accentSoft: string, note: string): DistrictThemeContract {
  return {
    id,
    label,
    inheritsCore: true,
    accent,
    accentSoft,
    note,
    tokens: obsidianSignalTokens,
  }
}

export const districtThemeContracts: Record<DistrictThemeId, DistrictThemeContract> = {
  core: districtTheme('core', 'AGENTROPOLIS Core', obsidianSignalTokens.cyan, 'rgba(0, 229, 255, 0.18)', 'Canonical Obsidian + Cyan + Red base.'),
  'hermes-city': districtTheme('hermes-city', 'Hermes City', obsidianSignalTokens.lime, 'rgba(183, 255, 69, 0.16)', 'Logistics accent only; core surfaces remain shared.'),
  asbe: districtTheme('asbe', 'ASBE', obsidianSignalTokens.hotPink, 'rgba(255, 88, 168, 0.16)', 'Production surface accent only; core surfaces remain shared.'),
  webmcp: districtTheme('webmcp', 'WebMCP', obsidianSignalTokens.cyan, 'rgba(0, 229, 255, 0.18)', 'Governance/control accent only; core surfaces remain shared.'),
  'mission-control': districtTheme('mission-control', 'Mission Control', obsidianSignalTokens.red, 'rgba(255, 49, 49, 0.16)', 'Operational urgency accent only; core surfaces remain shared.'),
  'fiscal-command': districtTheme('fiscal-command', 'Fiscal Command', obsidianSignalTokens.purple, 'rgba(133, 93, 255, 0.16)', 'Fiscal oversight accent only; core surfaces remain shared.'),
  '789-studios': districtTheme('789-studios', '789 Studios', obsidianSignalTokens.hotPink, 'rgba(255, 88, 168, 0.16)', 'Studio accent only; core surfaces remain shared.'),
  ntru: districtTheme('ntru', 'NTRU', obsidianSignalTokens.lime, 'rgba(183, 255, 69, 0.16)', 'Research accent only; core surfaces remain shared.'),
  'agentropolis-uni': districtTheme('agentropolis-uni', 'AGENTROPOLIS UNI', obsidianSignalTokens.purple, 'rgba(133, 93, 255, 0.16)', 'Education accent only; core surfaces remain shared.'),
  'social-systems': districtTheme('social-systems', 'Social Systems', obsidianSignalTokens.hotPink, 'rgba(255, 88, 168, 0.16)', 'Community accent only; core surfaces remain shared.'),
}

export function getDistrictThemeContract(id?: string): DistrictThemeContract {
  if (!id) return districtThemeContracts.core
  return districtThemeContracts[id as DistrictThemeId] ?? districtThemeContracts.core
}
