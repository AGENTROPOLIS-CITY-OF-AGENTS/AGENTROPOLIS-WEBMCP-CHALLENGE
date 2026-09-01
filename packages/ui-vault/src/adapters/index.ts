import type { ComponentType } from 'react'

export interface VaultAdapterContext {
  componentId: string
}

export type VaultComponentOverride<Props> = ComponentType<Props>

const overrides = new Map<string, ComponentType<any>>()

export function registerVaultAdapter<Props>(componentId: string, implementation: VaultComponentOverride<Props>): void {
  overrides.set(componentId, implementation as ComponentType<any>)
}

export function resolveVaultAdapter<Props>(componentId: string, fallback: VaultComponentOverride<Props>): VaultComponentOverride<Props> {
  return (overrides.get(componentId) as VaultComponentOverride<Props> | undefined) ?? fallback
}

export function clearVaultAdapters(): void {
  overrides.clear()
}
