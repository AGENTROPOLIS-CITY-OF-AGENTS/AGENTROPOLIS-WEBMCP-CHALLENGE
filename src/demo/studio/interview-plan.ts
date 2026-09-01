import type { ClosedLoopPlan } from '../../spatial/operator-loop';

export const INTERVIEW_OBJECTIVE = 'Reconfigure this studio for an interview.';

export const INTERVIEW_PLAN: ClosedLoopPlan = {
  objective: INTERVIEW_OBJECTIVE,
  mutations: [
    { kind: 'intensity', objectId: 'key-light-01', intensity: 72 },
    { kind: 'intensity', objectId: 'fill-light-01', intensity: 34 },
    { kind: 'translate', objectId: 'camera-01', position: [0, 1.58, -2.8] },
    { kind: 'rotate', objectId: 'camera-01', rotation: [-0.04, 0, 0] },
    { kind: 'translate', objectId: 'chair-01', position: [0, 0, 0.2] },
    { kind: 'translate', objectId: 'mic-01', position: [0.28, 1.2, 0.0] },
  ],
};
