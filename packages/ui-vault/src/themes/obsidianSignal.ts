export interface ObsidianSignalTokens {
  surface: string
  surfaceRaised: string
  surfacePanel: string
  surfaceOverlay: string
  border: string
  borderStrong: string
  text: string
  textMuted: string
  cyan: string
  red: string
  white: string
  lime: string
  hotPink: string
  purple: string
  shadowCyan: string
  shadowRed: string
  panelPadding: number
  panelGap: number
  sectionGap: number
  radiusSm: number
  radiusMd: number
  radiusLg: number
}

export const obsidianSignalTokens: ObsidianSignalTokens = {
  surface: '#050709',
  surfaceRaised: '#0d1216',
  surfacePanel: '#12191d',
  surfaceOverlay: 'rgba(5, 7, 9, 0.86)',
  border: 'rgba(0, 229, 255, 0.24)',
  borderStrong: 'rgba(0, 229, 255, 0.48)',
  text: '#f4ffff',
  textMuted: '#97aeb1',
  cyan: '#00e5ff',
  red: '#ff3131',
  white: '#ffffff',
  lime: '#b7ff45',
  hotPink: '#ff58a8',
  purple: '#855dff',
  shadowCyan: '0 0 18px rgba(0, 229, 255, 0.08)',
  shadowRed: '0 0 18px rgba(255, 49, 49, 0.12)',
  panelPadding: 16,
  panelGap: 12,
  sectionGap: 24,
  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 24,
}

export function createObsidianSignalCssVars(tokens: ObsidianSignalTokens = obsidianSignalTokens): Record<string, string> {
  return {
    '--os-surface': tokens.surface,
    '--os-surface-raised': tokens.surfaceRaised,
    '--os-surface-panel': tokens.surfacePanel,
    '--os-surface-overlay': tokens.surfaceOverlay,
    '--os-border': tokens.border,
    '--os-border-strong': tokens.borderStrong,
    '--os-text': tokens.text,
    '--os-text-muted': tokens.textMuted,
    '--os-cyan': tokens.cyan,
    '--os-red': tokens.red,
    '--os-white': tokens.white,
    '--os-lime': tokens.lime,
    '--os-hot-pink': tokens.hotPink,
    '--os-purple': tokens.purple,
    '--av-surface': tokens.surface,
    '--av-surface-raised': tokens.surfaceRaised,
    '--av-border': tokens.border,
    '--av-text': tokens.text,
    '--av-text-muted': tokens.textMuted,
    '--av-cyan': tokens.cyan,
    '--av-red': tokens.red,
    '--av-white': tokens.white,
    '--av-accent-lime': tokens.lime,
    '--av-accent-pink': tokens.hotPink,
    '--av-accent-purple': tokens.purple,
  }
}
