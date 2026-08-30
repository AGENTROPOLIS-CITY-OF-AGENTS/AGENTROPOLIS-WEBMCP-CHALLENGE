import type { WorldProvider } from "./provider.js";
import type { WorldCapability, WorldProviderId } from "../types.js";

/**
 * ProviderRegistry — the provider-agnostic front door of WORLD ENGINE.
 *
 * Providers are registered by id. Exactly one may be marked active; that is
 * the provider the governed executor resolves for mutations. Core AGENTROPOLIS
 * code never depends directly on a provider's internals — only on the
 * `WorldProvider` contract.
 */
export class ProviderRegistry {
  private readonly _providers = new Map<WorldProviderId, WorldProvider>();
  private _active: WorldProviderId | null = null;

  register(id: WorldProviderId, provider: WorldProvider, opts: { active?: boolean } = {}): this {
    if (this._providers.has(id)) {
      throw new Error(`Provider already registered: ${id}`);
    }
    this._providers.set(id, provider);
    if (opts.active) this._active = id;
    return this;
  }

  resolve(id?: WorldProviderId): WorldProvider {
    const key = id ?? this._active;
    if (!key) throw new Error("No active world provider configured");
    const provider = this._providers.get(key);
    if (!provider) throw new Error(`World provider not found: ${key}`);
    return provider;
  }

  get activeId(): WorldProviderId | null {
    return this._active;
  }

  /** True when the provider claims the capability. Registry does not authorize — it only reports. */
  async hasCapability(id: WorldProviderId, capability: WorldCapability): Promise<boolean> {
    const provider = this._providers.get(id);
    if (!provider) return false;
    const caps = await provider.capabilities();
    return caps.includes(capability);
  }

  list(): WorldProviderId[] {
    return [...this._providers.keys()];
  }
}
