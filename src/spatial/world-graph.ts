export type Vec3 = [number, number, number];

export type SpatialPermission =
  | 'inspect'
  | 'translate'
  | 'rotate'
  | 'material'
  | 'intensity'
  | 'capture';

export interface SpatialObject {
  id: string;
  type: 'camera' | 'light' | 'chair' | 'display' | 'microphone' | 'desk' | 'prop';
  label: string;
  position: Vec3;
  rotation: Vec3;
  material?: string;
  intensity?: number;
  permissions: SpatialPermission[];
}

export interface WorldGraph {
  sceneId: string;
  version: number;
  objects: SpatialObject[];
}

export function getSpatialObject(graph: WorldGraph, id: string): SpatialObject {
  const object = graph.objects.find((entry) => entry.id === id);
  if (!object) throw new Error(`Spatial object not found: ${id}`);
  return object;
}

export function assertSpatialPermission(object: SpatialObject, permission: SpatialPermission): void {
  if (!object.permissions.includes(permission)) {
    throw new Error(`CAPABILITY_DENIED:${object.id}:${permission}`);
  }
}
