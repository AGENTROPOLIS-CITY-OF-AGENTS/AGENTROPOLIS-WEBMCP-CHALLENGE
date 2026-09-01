import { describe, expect, it } from 'vitest';
import { applySpatialMutation } from './scene-state';
import { verifyInterviewStudio } from './deterministic-verifier';
import { runInterviewStudioDemo } from '../demo/studio/run-interview-demo';
import { STUDIO_SCENE } from '../demo/studio/studio-scene';


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

  it('does not verify the initial studio as interview-ready', () => {
    const result = verifyInterviewStudio(STUDIO_SCENE, 'Reconfigure this studio for an interview.');
    expect(result.passed).toBe(false);
  });

  it('runs mutation -> capture -> verify -> receipt', async () => {
    const result = await runInterviewStudioDemo();
    expect(result.graph.version).toBeGreaterThan(STUDIO_SCENE.version);
    expect(result.captureRef.startsWith('data:image/svg+xml')).toBe(true);
    expect(result.receipt.verification.passed).toBe(true);
    expect(result.receipt.verification.score).toBeGreaterThanOrEqual(83);
    expect(result.receipt.mutations.length).toBeGreaterThan(0);
    expect(result.receipt.afterVersion).toBe(result.graph.version);
  });
});
