import { applySpatialMutation, type SpatialMutation } from '../../spatial/scene-state';
import { getSpatialObject, type WorldGraph } from '../../spatial/world-graph';

export interface SpatialRuntime {
  getGraph(): WorldGraph;
  setGraph(next: WorldGraph): void;
  captureView?(): Promise<string>;
  verifyScene?(objective: string): Promise<{ passed: boolean; score: number; notes: string[] }>;
}

export function createSpatialWebMCPTools(runtime: SpatialRuntime) {
  return {
    getScene: async () => runtime.getGraph(),
    getObject: async (objectId: string) => getSpatialObject(runtime.getGraph(), objectId),
    transformObject: async (mutation: Extract<SpatialMutation, { kind: 'translate' | 'rotate' }>) => {
      const next = applySpatialMutation(runtime.getGraph(), mutation);
      runtime.setGraph(next);
      return getSpatialObject(next, mutation.objectId);
    },
    setMaterial: async (objectId: string, material: string) => {
      const next = applySpatialMutation(runtime.getGraph(), { kind: 'material', objectId, material });
      runtime.setGraph(next);
      return getSpatialObject(next, objectId);
    },
    setLight: async (objectId: string, intensity: number) => {
      const next = applySpatialMutation(runtime.getGraph(), { kind: 'intensity', objectId, intensity });
      runtime.setGraph(next);
      return getSpatialObject(next, objectId);
    },
    captureView: async () => {
      if (!runtime.captureView) throw new Error('CAPABILITY_UNAVAILABLE:captureView');
      return runtime.captureView();
    },
    verifyScene: async (objective: string) => {
      if (!runtime.verifyScene) throw new Error('CAPABILITY_UNAVAILABLE:verifyScene');
      return runtime.verifyScene(objective);
    },
  };
}
