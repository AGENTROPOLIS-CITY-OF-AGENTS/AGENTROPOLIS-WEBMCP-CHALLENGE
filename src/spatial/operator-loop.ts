import { applySpatialMutation, type SpatialMutation } from './scene-state';
import { createSpatialReceipt, type SpatialConstructionReceipt, type SpatialVerification } from './receipt';
import type { WorldGraph } from './world-graph';

export interface ClosedLoopPlan {
  objective: string;
  mutations: SpatialMutation[];
}

export async function runClosedLoopConstruction(input: {
  graph: WorldGraph;
  plan: ClosedLoopPlan;
  capture: (graph: WorldGraph) => Promise<string>;
  verify: (graph: WorldGraph, captureRef: string, objective: string) => Promise<SpatialVerification>;
}): Promise<{ graph: WorldGraph; receipt: SpatialConstructionReceipt; captureRef: string }> {
  const beforeVersion = input.graph.version;
  let graph = input.graph;

  for (const mutation of input.plan.mutations) {
    graph = applySpatialMutation(graph, mutation);
  }

  const captureRef = await input.capture(graph);
  const verification = await input.verify(graph, captureRef, input.plan.objective);
  const receipt = createSpatialReceipt({
    sceneId: graph.sceneId,
    objective: input.plan.objective,
    beforeVersion,
    afterVersion: graph.version,
    mutations: input.plan.mutations,
    verification,
  });

  return { graph, receipt, captureRef };
}
