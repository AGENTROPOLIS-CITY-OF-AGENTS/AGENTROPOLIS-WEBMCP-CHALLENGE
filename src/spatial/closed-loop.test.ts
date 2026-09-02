import { describe, expect, it, vi } from 'vitest';
import { applySpatialMutation } from './scene-state';
import { verifyInterviewStudio } from './deterministic-verifier';
import { runInterviewStudioDemo } from '../demo/studio/run-interview-demo';
import { STUDIO_SCENE } from '../demo/studio/studio-scene';
import { captureSceneAsArtifact } from './svg-capture';
import { runClosedLoopConstruction } from './operator-loop';
import { INTERVIEW_PLAN } from '../demo/studio/interview-plan';


describe('Spatial WebMCP closed-loop construction', () => {
  it('denies mutations that exceed object authority', () => {
    expect(() =>
      applySpatialMutation(STUDIO_SCENE, {
        kind: 'material',
        objectId: 'key-light-01',
        material: 'unauthorized',
      }),
    ).toThrow(/CAPABILITY_DENIED/);
  });

  it('does not verify the initial studio as interview-ready', async () => {
    const capture = await captureSceneAsArtifact(STUDIO_SCENE);
    const result = await verifyInterviewStudio(STUDIO_SCENE, capture, 'Reconfigure this studio for an interview.');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('CORRECTION_NEEDED');
  });

  it('rejects a non-studio objective even on a fully configured studio (GAP-D)', async () => {
    const configured = await runInterviewStudioDemo();
    const capture = await captureSceneAsArtifact(configured.graph);
    const result = await verifyInterviewStudio(configured.graph, capture, 'Bake a three-tier wedding cake.');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('FAIL');
    expect(result.notes.some((note) => note.includes('interview/filming studio objective'))).toBe(true);
  });

  it('rejects tampered capture evidence', async () => {
    const capture = await captureSceneAsArtifact(STUDIO_SCENE);
    const tampered = { ...capture, captureRef: `${capture.captureRef}&tampered=true` };
    const result = await verifyInterviewStudio(STUDIO_SCENE, tampered, 'Reconfigure this studio for an interview.');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('FAIL');
  });

  it('fails closed when a nonexistent object is targeted', async () => {
    const captureSpy = vi.fn();
    const verifySpy = vi.fn();

    await expect(runClosedLoopConstruction({
      graph: STUDIO_SCENE,
      plan: {
        ...INTERVIEW_PLAN,
        mutations: [{ kind: 'material', objectId: 'missing-object', material: 'obsidian-fabric' }],
      },
      capture: async (graph) => {
        captureSpy(graph);
        return captureSceneAsArtifact(graph);
      },
      verify: async (graph, capture, objective) => {
        verifySpy(graph, capture, objective);
        return verifyInterviewStudio(graph, capture, objective);
      },
    })).rejects.toThrow(/Spatial object not found: missing-object/);

    expect(captureSpy).not.toHaveBeenCalled();
    expect(verifySpy).not.toHaveBeenCalled();
  });

  it('runs mutation -> capture -> verify -> receipt', async () => {
    const result = await runInterviewStudioDemo();
    expect(result.graph.version).toBeGreaterThan(STUDIO_SCENE.version);
    expect(result.captureRef.startsWith('data:image/svg+xml')).toBe(true);
    expect(result.receipt.verification.passed).toBe(true);
    expect(result.receipt.verification.status).toBe('PASS');
    expect(result.receipt.verification.score).toBeGreaterThanOrEqual(83);
    expect(result.receipt.mutations.length).toBeGreaterThan(0);
    expect(result.receipt.afterVersion).toBe(result.graph.version);
    expect(result.receipt.captureId).toBe(result.receipt.verification.captureId);
    expect(result.receipt.captureHash).toBe(result.receipt.verification.captureHash);
  });

  it('links the exact verification capture into the receipt (capture-bound receipts)', async () => {
    const result = await runInterviewStudioDemo();
    expect(result.receipt.captureRef).toBe(result.captureRef);
    expect(result.receipt.captureId).toBe(result.captureArtifact.captureId);
    expect(result.receipt.captureHash).toBe(result.captureArtifact.captureHash);
    expect(result.receipt.verification.captureId).toBe(result.captureArtifact.captureId);
  });

  it('cannot mint a receipt when verification throws (receipt follows verification)', async () => {
    await expect(runClosedLoopConstruction({
      graph: STUDIO_SCENE,
      plan: INTERVIEW_PLAN,
      capture: async (graph) => captureSceneAsArtifact(graph),
      verify: async () => {
        throw new Error('VERIFIER_DOWN');
      },
    })).rejects.toThrow(/VERIFIER_DOWN/);
  });
});
