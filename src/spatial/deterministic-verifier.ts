import type { SpatialVerification } from './receipt';
import { getSpatialObject, type WorldGraph } from './world-graph';

const near = (value: number, target: number, tolerance: number) => Math.abs(value - target) <= tolerance;

export function verifyInterviewStudio(graph: WorldGraph, objective: string): SpatialVerification {
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

  check((key.intensity ?? 0) >= 60 && (key.intensity ?? 0) <= 85, 'key light intensity is interview-safe (60-85)');
  check((fill.intensity ?? 0) >= 20 && (fill.intensity ?? 0) <= 50, 'fill light intensity is balanced (20-50)');
  check((key.intensity ?? 0) > (fill.intensity ?? 0), 'key light remains stronger than fill light');
  check(near(camera.position[0], 0, 0.6) && camera.position[2] <= -2.2, 'camera remains centered with useful subject distance');
  check(Math.abs(chair.position[0]) <= 0.6 && chair.position[2] >= -0.3 && chair.position[2] <= 0.8, 'chair remains inside interview framing zone');
  check(Math.abs(mic.position[0] - chair.position[0]) <= 0.8 && Math.abs(mic.position[2] - chair.position[2]) <= 0.8, 'microphone remains close to interview chair');

  const score = checks === 0 ? 0 : Math.round((passed / checks) * 100);
  const objectiveAccepted = /interview|filming|studio/i.test(objective);
  if (!objectiveAccepted) notes.unshift('INFO: deterministic verifier is tuned for the interview/filming studio objective.');

  return {
    passed: objectiveAccepted && score >= 83,
    score,
    notes,
  };
}
