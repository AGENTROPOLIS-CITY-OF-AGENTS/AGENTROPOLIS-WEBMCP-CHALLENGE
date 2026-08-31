import { useSyncExternalStore } from 'react'
import { governanceEngine } from '../core/engine'

export function useWorldState() {
  return useSyncExternalStore(governanceEngine.subscribe, governanceEngine.getSnapshot, governanceEngine.getServerSnapshot)
}
