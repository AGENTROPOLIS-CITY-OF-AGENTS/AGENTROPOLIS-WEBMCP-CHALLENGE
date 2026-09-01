import { runClosedLoopConstruction } from '../../spatial/operator-loop';
import { captureSceneAsDataUri } from '../../spatial/svg-capture';
import { verifyInterviewStudio } from '../../spatial/deterministic-verifier';
import { STUDIO_SCENE } from './studio-scene';
import { INTERVIEW_PLAN } from './interview-plan';

export async function runInterviewStudioDemo() {
  return runClosedLoopConstruction({
    graph: STUDIO_SCENE,
    plan: INTERVIEW_PLAN,
    capture: captureSceneAsDataUri,
    verify: async (graph, _captureRef, objective) => verifyInterviewStudio(graph, objective),
  });
}
