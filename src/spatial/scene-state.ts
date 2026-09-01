import { assertSpatialPermission, getSpatialObject, type Vec3, type WorldGraph } from './world-graph';

export type SpatialMutation =
  | { kind: 'translate'; objectId: string; position: Vec3 }
  | { kind: 'rotate'; objectId: string; rotation: Vec3 }
  | { kind: 'material'; objectId: string; material: string }
  | { kind: 'intensity'; objectId: string; intensity: number };

export function applySpatialMutation(graph: WorldGraph, mutation: SpatialMutation): WorldGraph {
  const object = getSpatialObject(graph, mutation.objectId);
  assertSpatialPermission(object, mutation.kind);

  const objects = graph.objects.map((entry) => {
    if (entry.id !== mutation.objectId) return entry;
    switch (mutation.kind) {
      case 'translate':
        return { ...entry, position: mutation.position };
      case 'rotate':
        return { ...entry, rotation: mutation.rotation };
      case 'material':
        return { ...entry, material: mutation.material };
      case 'intensity':
        return { ...entry, intensity: Math.max(0, Math.min(100, mutation.intensity)) };
    }
  });

  return { ...graph, version: graph.version + 1, objects };
}
