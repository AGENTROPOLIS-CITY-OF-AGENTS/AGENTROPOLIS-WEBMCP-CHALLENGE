import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSpatialWebMcpTool, type SpatialModelContext, type SpatialRegisteredTool, type SpatialRegistrationInput } from './register-spatial-webmcp';
import { STUDIO_SCENE } from '../demo/studio/studio-scene';
import { verifyInterviewStudio } from '../spatial/deterministic-verifier';
import type { WorldGraph } from '../spatial/world-graph';

const INTERVIEW_OBJECTIVE = 'Reconfigure this studio for an interview.';

interface Harness {
  tool: SpatialRegisteredTool;
  state: { graph: WorldGraph };
}

async function registeredTool(): Promise<Harness> {
  let captured: SpatialRegisteredTool | undefined;
  const registerTool = vi.fn(async (tool: SpatialRegisteredTool) => {
    captured = tool;
  });
  const modelContext: SpatialModelContext = { registerTool };
  Reflect.set(globalThis, 'document', { modelContext });
  const state = { graph: structuredClone(STUDIO_SCENE) };
  const result = await registerSpatialWebMcpTool(
    modelContext,
    {
      graph: state.graph,
      setGraph: (next) => {
        state.graph = next;
      },
      verifyScene: (objective, capture) => verifyInterviewStudio(state.graph, capture, objective),
    },
    new AbortController().signal,
  );
  expect(result).toBe('registered');
  if (!captured) throw new Error('Spatial tool was not registered.');
  return { tool: captured, state };
}

describe('Spatial WebMCP registration surface', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'document');
  });

  it('returns unsupported without document.modelContext (no throw, no exposure)', async () => {
    Reflect.deleteProperty(globalThis, 'document');
    const result = await registerSpatialWebMcpTool(
      undefined,
      {
        graph: structuredClone(STUDIO_SCENE),
        setGraph: vi.fn(),
        verifyScene: async () => {
          throw new Error('should not verify');
        },
      },
      new AbortController().signal,
    );
    expect(result).toBe('unsupported');
  });

  it('registers the spatial capability surface with the expected name and bounded operation enum', async () => {
    let captured: SpatialRegisteredTool | undefined;
    const registerTool = vi.fn(async (tool: SpatialRegisteredTool) => {
      captured = tool;
    });
    const modelContext: SpatialModelContext = { registerTool };
    const state = { graph: structuredClone(STUDIO_SCENE) };
    await registerSpatialWebMcpTool(
      modelContext,
      { graph: state.graph, setGraph: (next) => { state.graph = next; }, verifyScene: (objective, capture) => verifyInterviewStudio(state.graph, capture, objective) },
      new AbortController().signal,
    );
    expect(registerTool).toHaveBeenCalledTimes(1);
    expect(captured?.name).toBe('agentropolis_spatial_closed_loop');
    expect(typeof captured?.execute).toBe('function');
    const schema = captured?.inputSchema as { properties?: { operation?: { enum?: string[] } }; additionalProperties?: boolean };
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties?.operation?.enum).toEqual(['inspect', 'translate', 'rotate', 'material', 'intensity', 'capture', 'verify']);
  });

  it('authorized mutation succeeds through the WebMCP path and advances the version', async () => {
    const { tool, state } = await registeredTool();
    const before = state.graph.version;
    const keyBefore = state.graph.objects.find((o) => o.id === 'key-light-01')?.intensity;
    const result = await tool.execute({ operation: 'intensity', objectId: 'key-light-01', intensity: 72 } as SpatialRegistrationInput);
    expect(keyBefore).toBe(52);
    const updated = result as { id: string; intensity?: number };
    expect(updated.id).toBe('key-light-01');
    expect(updated.intensity).toBe(72);
    expect(state.graph.version).toBe(before + 1);
    expect(state.graph.objects.find((o) => o.id === 'key-light-01')?.intensity).toBe(72);
  });

  it('denied mutation fails closed through the WebMCP path and leaves the scene unchanged', async () => {
    const { tool, state } = await registeredTool();
    const snapshot = JSON.stringify(state.graph);
    await expect(
      tool.execute({ operation: 'material', objectId: 'key-light-01', material: 'unauthorized' } as SpatialRegistrationInput),
    ).rejects.toThrow(/CAPABILITY_DENIED:key-light-01:material/);
    await expect(
      tool.execute({ operation: 'intensity', objectId: 'chair-01', intensity: 5 } as SpatialRegistrationInput),
    ).rejects.toThrow(/CAPABILITY_DENIED:chair-01:intensity/);
    expect(JSON.stringify(state.graph)).toBe(snapshot);
    expect(state.graph.version).toBe(STUDIO_SCENE.version);
  });

  it('rejects forged object input and malformed operation input before touching the graph', async () => {
    const { tool, state } = await registeredTool();
    const snapshot = JSON.stringify(state.graph);
    await expect(tool.execute({ operation: 'translate', objectId: 'ghost-99', position: [0, 0, 0] } as SpatialRegistrationInput))
      .rejects.toThrow(/CAPABILITY_DENIED:ghost-99:translate|Spatial object not found/);
    await expect(tool.execute({ operation: 'translate', objectId: 'chair-01' } as SpatialRegistrationInput))
      .rejects.toThrow(/requires objectId and position/);
    await expect(tool.execute({ operation: 'intensity', objectId: 'key-light-01', intensity: 'bright' } as unknown as SpatialRegistrationInput))
      .rejects.toThrow(/requires objectId and intensity/);
    await expect(tool.execute({ operation: 'delete_scene' } as unknown as SpatialRegistrationInput))
      .rejects.toThrow(/Unsupported spatial operation/);
    await expect(
      tool.execute({ operation: 'verify', objective: 'x', captureHash: 'abc' } as SpatialRegistrationInput),
    ).rejects.toThrow(/captureId, captureHash, and captureRef/);
    expect(JSON.stringify(state.graph)).toBe(snapshot);
  });

  it('keeps Generated != Verified: mutating through WebMCP does not mark the scene verified', async () => {
    const { tool, state } = await registeredTool();
    await tool.execute({ operation: 'intensity', objectId: 'key-light-01', intensity: 72 } as SpatialRegistrationInput);
    await tool.execute({ operation: 'intensity', objectId: 'fill-light-01', intensity: 34 } as SpatialRegistrationInput);
    await tool.execute({ operation: 'translate', objectId: 'camera-01', position: [0, 1.58, -2.8] } as SpatialRegistrationInput);
    await tool.execute({ operation: 'rotate', objectId: 'camera-01', rotation: [-0.04, 0, 0] } as SpatialRegistrationInput);
    await tool.execute({ operation: 'translate', objectId: 'chair-01', position: [0, 0, 0.2] } as SpatialRegistrationInput);
    await tool.execute({ operation: 'translate', objectId: 'mic-01', position: [0.28, 1.2, 0] } as SpatialRegistrationInput);
    expect(state.graph.version).toBe(STUDIO_SCENE.version + 6);
    const capture = await tool.execute({ operation: 'capture' } as SpatialRegistrationInput) as { captureId: string; captureHash: string; captureRef: string };
    const unverified = await tool.execute({ operation: 'verify', objective: 'Bake a wedding cake.', captureId: capture.captureId, captureHash: capture.captureHash, captureRef: capture.captureRef } as SpatialRegistrationInput) as { status: string; passed: boolean };
    expect(unverified.passed).toBe(false);
    expect(unverified.status).toBe('FAIL');
    const verified = await tool.execute({ operation: 'verify', objective: INTERVIEW_OBJECTIVE, captureId: capture.captureId, captureHash: capture.captureHash, captureRef: capture.captureRef } as SpatialRegistrationInput) as { status: string; passed: boolean; captureId: string };
    expect(verified.status).toBe('PASS');
    expect(verified.passed).toBe(true);
    expect(verified.captureId).toBe(capture.captureId);
  });
});
