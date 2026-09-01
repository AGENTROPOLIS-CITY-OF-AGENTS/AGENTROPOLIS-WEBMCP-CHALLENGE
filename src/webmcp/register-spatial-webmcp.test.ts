import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSpatialWebMcpTool, type SpatialModelContext, type SpatialRegisteredTool, type SpatialRegistrationInput } from './register-spatial-webmcp';
import { STUDIO_SCENE } from '../demo/studio/studio-scene';
import { verifyInterviewStudio } from '../spatial/deterministic-verifier';

describe('registerSpatialWebMcpTool', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'document');
  });

  it('registers the actual spatial capability surface through modelContext', async () => {
    let registeredTool: SpatialRegisteredTool | undefined;
    const registerTool = vi.fn(async (tool: SpatialRegisteredTool) => {
      registeredTool = tool;
    });

    const modelContext: SpatialModelContext = { registerTool };
    Reflect.set(globalThis, 'document', { modelContext });

    const graph = structuredClone(STUDIO_SCENE);
    const runtimeState = { graph };

    const result = await registerSpatialWebMcpTool(
      modelContext,
      {
        graph: runtimeState.graph,
        setGraph: (next) => {
          runtimeState.graph = next;
        },
        verifyScene: (objective, capture) => verifyInterviewStudio(runtimeState.graph, capture, objective),
      },
      new AbortController().signal,
    );

    expect(result).toBe('registered');
    expect(registerTool).toHaveBeenCalledTimes(1);
    if (!registeredTool) throw new Error('Spatial tool was not registered.');
    const tool = registeredTool as unknown as SpatialRegisteredTool;
    expect(tool.name).toBe('agentropolis_spatial_closed_loop');
    const schema = tool.inputSchema as { properties?: { operation?: { enum?: string[] } } };
    expect(schema.properties?.operation?.enum).toContain('capture');

    const captureInput: SpatialRegistrationInput = { operation: 'capture' };
    const capture = await tool.execute(captureInput) as { captureRef: string; captureHash: string };
    expect(capture.captureRef.startsWith('data:image/svg+xml')).toBe(true);
    expect(capture.captureHash).toBeTruthy();

    const inspected = await tool.execute({ operation: 'inspect' }) as { sceneId: string };
    expect(inspected.sceneId).toBe(STUDIO_SCENE.sceneId);

    const verified = await tool.execute({
      operation: 'verify',
      objective: 'Reconfigure this studio for an interview.',
      captureId: `sha256:${capture.captureHash}`,
      captureHash: capture.captureHash,
      captureRef: capture.captureRef,
    }) as { status: string };
    expect(verified.status).toBe('CORRECTION_NEEDED');
  });

  it('rejects unauthorized mutation through the registration surface', async () => {
    let registeredTool: SpatialRegisteredTool | null = null;
    const registerTool = vi.fn(async (tool: SpatialRegisteredTool) => {
      registeredTool = tool;
    });
    const modelContext: SpatialModelContext = { registerTool };
    Reflect.set(globalThis, 'document', { modelContext });

    await registerSpatialWebMcpTool(
      modelContext,
      {
        graph: structuredClone(STUDIO_SCENE),
        setGraph: vi.fn(),
        verifyScene: async () => {
          throw new Error('should not verify');
        },
      },
      new AbortController().signal,
    );

    if (!registeredTool) throw new Error('Spatial tool was not registered.');
    const tool = registeredTool as unknown as SpatialRegisteredTool;
    const unauthorized: SpatialRegistrationInput = { operation: 'material', objectId: 'key-light-01', material: 'unauthorized' };
    await expect(tool.execute(unauthorized)).rejects.toThrow(/CAPABILITY_DENIED/);
  });
});
