import { describe, expect, it } from 'vitest'
import { getVaultComponent, listStableConsumableVaultComponents, listVaultComponents, listVaultComponentsBySurface } from '../src/registry'
import { uiInstall, uiPreview, uiSearch } from '../src/registry/operations'

describe('ui-vault registry', () => {
  it('registers the expanded manifest set', () => {
    expect(listVaultComponents()).toHaveLength(23)
  })

  it('does not expose quarantine manifests as stable consumables', () => {
    expect(listStableConsumableVaultComponents().every((manifest) => manifest.classification.maturity !== 'quarantine')).toBe(true)
  })

  it('looks up the required receipt tool section', () => {
    expect(getVaultComponent('receipt.tool-calls')?.name).toBe('Tool Calls Section')
  })

  it('blocks install plans for quarantined candidates', () => {
    expect(uiInstall('gallery.stellar', 'Mission Control', 'surface').status).toBe('blocked')
  })

  it('returns local preview anchors', () => {
    expect(uiPreview('agent.credential').catalogAnchor).toBe('#agent.credential')
    expect(uiSearch({ query: 'credential' }).matches[0]?.id).toBe('agent.credential')
  })

  it('supports district and surface filtering for the shell layer', () => {
    expect(uiSearch({ district: 'webmcp', surface: 'receipt', accessibility: 'reduced-motion' }).matches.some((manifest) => manifest.id === 'receipt.execution-receipt')).toBe(true)
    expect(listVaultComponentsBySurface('district-shell').map((manifest) => manifest.id)).toContain('system.universal-district-shell')
  })

  it('exposes GPU cost and status facets', () => {
    expect(uiSearch({ gpuCost: 'high', status: 'quarantine' }).matches.map((manifest) => manifest.id)).toContain('shader.atc')
  })
})
