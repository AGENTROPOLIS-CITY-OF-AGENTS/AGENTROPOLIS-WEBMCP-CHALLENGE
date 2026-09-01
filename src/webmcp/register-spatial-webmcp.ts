import { captureSceneAsArtifact } from '../spatial/svg-capture';
import type { SpatialCaptureArtifact } from '../spatial/receipt';
import type { WorldGraph } from '../spatial/world-graph';
import { requireSpatialCapability } from './permissions';
import { createSpatialWebMCPTools, type SpatialRuntime } from './tools/spatial-tools';

export interface SpatialRegistrationInput {
  operation: 'inspect' | 'translate' | 'rotate' | 'material' | 'intensity' | 'capture' | 'verify';
  objectId?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  material?: string;
  intensity?: number;
  objective?: string;
  captureId?: string;
  captureHash?: string;
  captureRef?: string;
}

export interface SpatialRegisteredTool {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: SpatialRegistrationInput, client?: { signal?: AbortSignal }) => Promise<unknown> | unknown;
}

export interface SpatialModelContext {
  registerTool(tool: {
    name: string;
    title?: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
    execute: (input: SpatialRegistrationInput, client?: { signal?: AbortSignal }) => Promise<unknown> | unknown;
  }, options?: { signal?: AbortSignal }): Promise<void>;
}

function makeRuntime(graph: WorldGraph, setGraph: (next: WorldGraph) => void, verifyScene: SpatialRuntime['verifyScene']): SpatialRuntime {
  return {
    getGraph: () => graph,
    setGraph: (next) => {
      graph = next;
      setGraph(next);
    },
    captureView: async () => captureSceneAsArtifact(graph),
    verifyScene,
  };
}

export async function registerSpatialWebMcpTool(
  modelContext: SpatialModelContext | undefined,
  options: {
    graph: WorldGraph;
    setGraph: (next: WorldGraph) => void;
    verifyScene: (objective: string, capture: SpatialCaptureArtifact) => Promise<{ status: 'PASS' | 'CORRECTION_NEEDED' | 'FAIL'; passed: boolean; score: number; notes: string[]; captureId: string; captureHash: string }>;
  },
  signal: AbortSignal,
): Promise<'registered' | 'unsupported'> {
  if (!modelContext) return 'unsupported';

  const runtime = makeRuntime(options.graph, options.setGraph, options.verifyScene);
  const tools = createSpatialWebMCPTools(runtime);

  await modelContext.registerTool({
    name: 'agentropolis_spatial_closed_loop',
    title: 'Spatial WebMCP closed-loop hero',
    description: 'Inspect, mutate, capture, and verify the interview studio through a bounded spatial capability surface.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        operation: {
          type: 'string',
          enum: ['inspect', 'translate', 'rotate', 'material', 'intensity', 'capture', 'verify'],
        },
        objectId: { type: 'string' },
        position: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        rotation: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        material: { type: 'string' },
        intensity: { type: 'number' },
        objective: { type: 'string' },
      },
      required: ['operation'],
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute: async (input: SpatialRegistrationInput) => {
      const operation = input.operation;
      if (operation === 'inspect') {
        if (input.objectId) {
          requireSpatialCapability(runtime.getGraph(), input.objectId, 'inspect');
          return tools.getObject(input.objectId);
        }
        return tools.getScene();
      }
      if (operation === 'translate') {
        if (!input.objectId || !input.position) throw new Error('Spatial translate requires objectId and position.');
        requireSpatialCapability(runtime.getGraph(), input.objectId, 'translate');
        return tools.transformObject({ kind: 'translate', objectId: input.objectId, position: input.position });
      }
      if (operation === 'rotate') {
        if (!input.objectId || !input.rotation) throw new Error('Spatial rotate requires objectId and rotation.');
        requireSpatialCapability(runtime.getGraph(), input.objectId, 'rotate');
        return tools.transformObject({ kind: 'rotate', objectId: input.objectId, rotation: input.rotation });
      }
      if (operation === 'material') {
        if (!input.objectId || typeof input.material !== 'string') throw new Error('Spatial material requires objectId and material.');
        requireSpatialCapability(runtime.getGraph(), input.objectId, 'material');
        return tools.setMaterial(input.objectId, input.material);
      }
      if (operation === 'intensity') {
        if (!input.objectId || typeof input.intensity !== 'number') throw new Error('Spatial intensity requires objectId and intensity.');
        requireSpatialCapability(runtime.getGraph(), input.objectId, 'intensity');
        return tools.setLight(input.objectId, input.intensity);
      }
      if (operation === 'capture') {
        return tools.captureView();
      }
      if (operation === 'verify') {
        const hasBoundCapture = Boolean(input.captureId || input.captureHash || input.captureRef);
        if (hasBoundCapture && !(input.captureId && input.captureHash && input.captureRef)) {
          throw new Error('Spatial verify requires captureId, captureHash, and captureRef when binding to evidence.');
        }
        if (input.captureId && input.captureHash && input.captureId !== `sha256:${input.captureHash}`) {
          throw new Error('Spatial verify requires captureId to be derived from the captureHash.');
        }
        const capture = input.captureId && input.captureHash && input.captureRef
          ? {
              captureId: input.captureId,
              captureHash: input.captureHash,
              captureRef: input.captureRef,
              sceneId: runtime.getGraph().sceneId,
              sceneVersion: runtime.getGraph().version,
            }
          : await tools.captureView();
        return tools.verifyScene(input.objective ?? 'Reconfigure this studio for an interview.', capture);
      }
      throw new Error(`Unsupported spatial operation: ${operation}`);
    },
  }, { signal });

  return 'registered';
}
