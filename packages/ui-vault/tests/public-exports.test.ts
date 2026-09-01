import { describe, expect, it } from 'vitest'
import * as publicApi from '../src/index'
import * as quarantineApi from '../src/quarantine'
import { componentSymbolById, type VaultComponentSymbol } from '../src/exports'
import { initialVaultManifests } from '../src/manifests/initial'

describe('ui-vault public export boundary', () => {
  it('does not leak quarantine components through the default entrypoint', () => {
    const quarantinedSymbols = initialVaultManifests
      .filter((manifest) => manifest.classification.maturity === 'quarantine')
      .map((manifest) => componentSymbolById[manifest.id as keyof typeof componentSymbolById])
      .filter((symbol): symbol is VaultComponentSymbol => Boolean(symbol))

    expect(quarantinedSymbols.length).toBeGreaterThan(0)

    for (const symbol of quarantinedSymbols) {
      expect(symbol in publicApi).toBe(false)
      expect(symbol in quarantineApi).toBe(true)
    }
  })

  it('continues to expose reviewed components through the default entrypoint', () => {
    const reviewedSymbols = initialVaultManifests
      .filter((manifest) => manifest.classification.maturity === 'reviewed' || manifest.classification.maturity === 'stable')
      .map((manifest) => componentSymbolById[manifest.id as keyof typeof componentSymbolById])
      .filter((symbol): symbol is VaultComponentSymbol => Boolean(symbol))

    for (const symbol of reviewedSymbols) {
      expect(symbol in publicApi).toBe(true)
    }
  })
})
