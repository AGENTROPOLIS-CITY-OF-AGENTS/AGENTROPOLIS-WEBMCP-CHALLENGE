import type { SpatialCaptureArtifact, SpatialVerification } from './receipt';
import { getSpatialObject, type WorldGraph } from './world-graph';

const near = (value: number, target: number, tolerance: number) => Math.abs(value - target) <= tolerance;
const encoder = new TextEncoder();

async function hashCaptureRef(captureRef: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(captureRef));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyInterviewStudio(graph: WorldGraph, capture: SpatialCaptureArtifact, objective: string): Promise<SpatialVerification> {
  const notes: string[] = [];
  let checks = 0;
  let passed = 0;

  const key = getSpatialObject(graph, 'key-light-01');
  const fill = getSpatialObject(graph, 'fill-light-01');
  const camera = getSpatialObject(graph, 'camera-01');
  const chair = getSpatialObject(graph, 'chair-01');
  const mic = getSpatialObject(graph, 'mic-01');

  const check = (condition: boolean, note: string) => {
    checks += 1;
    if (condition) passed += 1;
    notes.push(`${condition ? 'PASS' : 'FAIL'}: ${note}`);
  };

  const expectedHash = await hashCaptureRef(capture.captureRef);
  const captureBound = expectedHash === capture.captureHash;
  check(captureBound, 'capture hash matches the captured SVG data URI');
  check(capture.captureId === `sha256:${capture.captureHash}`, 'capture ID is content-addressed to the capture hash');

  check((key.intensity ?? 0) >= 60 && (key.intensity ?? 0) <= 85, 'key light intensity is interview-safe (60-85)');
  check((fill.intensity ?? 0) >= 20 && (fill.intensity ?? 0) <= 50, 'fill light intensity is balanced (20-50)');
  check((key.intensity ?? 0) > (fill.intensity ?? 0), 'key light remains stronger than fill light');
  check(near(camera.position[0], 0, 0.6) && camera.position[2] <= -2.2, 'camera remains centered with useful subject distance');
  check(Math.abs(chair.position[0]) <= 0.6 && chair.position[2] >= -0.3 && chair.position[2] <= 0.8, 'chair remains inside interview framing zone');
  check(Math.abs(mic.position[0] - chair.position[0]) <= 0.8 && Math.abs(mic.position[2] - chair.position[2]) <= 0.8, 'microphone remains close to interview chair');

  const score = checks === 0 ? 0 : Math.round((passed / checks) * 100);
  const objectiveAccepted = /interview|filming|studio/i.test(objective);
  if (!objectiveAccepted) notes.unshift('INFO: deterministic verifier is tuned for the interview/filming studio objective.');

  const status = !objectiveAccepted || !captureBound
    ? 'FAIL'
    : score >= 83
      ? 'PASS'
      : 'CORRECTION_NEEDED';

  return {
    status,
    passed: status === 'PASS',
    score,
    notes,
    captureId: capture.captureId,
    captureHash: capture.captureHash,
  };
}
