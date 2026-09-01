import type { SpatialPermission, WorldGraph } from '../spatial/world-graph';
import { getSpatialObject } from '../spatial/world-graph';

export function canUseSpatialCapability(graph: WorldGraph, objectId: string, permission: SpatialPermission): boolean {
  try {
    return getSpatialObject(graph, objectId).permissions.includes(permission);
  } catch {
    return false;
  }
}

export function requireSpatialCapability(graph: WorldGraph, objectId: string, permission: SpatialPermission): void {
  if (!canUseSpatialCapability(graph, objectId, permission)) {
    throw new Error(`CAPABILITY_DENIED:${objectId}:${permission}`);
  }
}
