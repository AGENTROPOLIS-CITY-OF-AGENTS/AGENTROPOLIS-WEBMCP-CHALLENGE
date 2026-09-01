import { runClosedLoopConstruction } from '../../spatial/operator-loop';
import { captureSceneAsArtifact } from '../../spatial/svg-capture';
import { verifyInterviewStudio } from '../../spatial/deterministic-verifier';
import { STUDIO_SCENE } from './studio-scene';
import { INTERVIEW_PLAN } from './interview-plan';

export async function runInterviewStudioDemo() {
  return runClosedLoopConstruction({
    graph: STUDIO_SCENE,
    plan: INTERVIEW_PLAN,
    capture: captureSceneAsArtifact,
    verify: verifyInterviewStudio,
  });
}
