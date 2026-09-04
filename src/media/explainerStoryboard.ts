import { parallaxMedia } from './parallaxMedia';
export type ExplainerStageId = 'INTRO' | 'OBSERVE' | 'REQUEST' | 'AUTHORIZE' | 'ACT' | 'SEE_AGAIN' | 'VERIFY' | 'RECEIPT' | 'DENIAL' | 'COMPLETE';
export interface ExplainerStoryboardStage { id: ExplainerStageId; media?: string; title: string; copy: string; protocol: string; durationMs: number; }
export const EXPLAINER_STORYBOARD: readonly ExplainerStoryboardStage[] = [
  { id: 'INTRO', title: 'PARALLAX', copy: 'Governed spatial agency for autonomous agents.', protocol: 'SELECT → REQUEST → AUTHORIZE → ACT → SEE AGAIN → VERIFY → RECEIPT', durationMs: 2600 },
  { id: 'OBSERVE', media: parallaxMedia.loopExplainer, title: 'OBSERVE', copy: 'PARALLAX reads the spatial state of the environment.', protocol: 'OBSERVE', durationMs: 4200 },
  { id: 'REQUEST', media: parallaxMedia.loopExplainer, title: 'REQUEST', copy: 'The agent requests only the capability needed for this object.', protocol: 'REQUEST', durationMs: 2600 },
  { id: 'AUTHORIZE', media: parallaxMedia.loopExplainer, title: 'AUTHORIZE', copy: 'Identity, mandate and policy determine whether execution is allowed.', protocol: 'AUTHORIZE', durationMs: 3200 },
  { id: 'ACT', media: parallaxMedia.loopExplainer, title: 'ACT', copy: 'The authorized agent changes the 3D environment.', protocol: 'ACT', durationMs: 4800 },
  { id: 'SEE_AGAIN', media: parallaxMedia.loopExplainer, title: 'SEE AGAIN', copy: 'PARALLAX re-observes the world instead of assuming the action succeeded.', protocol: 'SEE AGAIN', durationMs: 4200 },
  { id: 'VERIFY', media: parallaxMedia.loopExplainer, title: 'VERIFY', copy: 'The observed result is compared with the objective.', protocol: 'VERIFY', durationMs: 3600 },
  { id: 'RECEIPT', media: parallaxMedia.loopExplainer, title: 'RECEIPT', copy: 'A verified outcome produces an auditable receipt.', protocol: 'RECEIPT', durationMs: 3200 },
  { id: 'DENIAL', media: parallaxMedia.loopExplainer, title: 'DENIAL', copy: 'Out-of-scope actions fail closed and leave the world unchanged.', protocol: 'DENIAL', durationMs: 3200 },
  { id: 'COMPLETE', media: parallaxMedia.loopExplainer, title: 'COMPLETE', copy: 'Generated ≠ Verified. Proof follows the governed path.', protocol: 'COMPLETE', durationMs: 2600 },
];
