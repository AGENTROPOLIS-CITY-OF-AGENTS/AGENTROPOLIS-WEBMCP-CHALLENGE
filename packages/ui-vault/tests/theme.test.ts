import { describe, expect, it } from 'vitest'
import { agentropolisTheme, createAgentropolisCssVars } from '../src/themes/agentropolisTheme'
import { getDistrictThemeContract } from '../src/themes/districtThemes'

describe('agentropolis ui vault theme', () => {
  it('exposes the required primary tokens', () => {
    expect(agentropolisTheme.surface).toBe('#050709')
    expect(agentropolisTheme.cyan).toBe('#00e5ff')
    expect(agentropolisTheme.red).toBe('#ff3131')
    expect(agentropolisTheme.white).toBe('#ffffff')
  })

  it('creates CSS variables for consumers', () => {
    const vars = createAgentropolisCssVars()
    expect(vars['--av-surface']).toBe(agentropolisTheme.surface)
    expect(vars['--av-cyan']).toBe(agentropolisTheme.cyan)
    expect(vars['--os-surface']).toBe(agentropolisTheme.surface)
  })

  it('keeps district themes inheriting the shared core', () => {
    const webmcp = getDistrictThemeContract('webmcp')
    const hermes = getDistrictThemeContract('hermes-city')
    expect(webmcp.inheritsCore).toBe(true)
    expect(hermes.tokens.surface).toBe(agentropolisTheme.surface)
    expect(hermes.accent).toBe(agentropolisTheme.lime)
  })
})
