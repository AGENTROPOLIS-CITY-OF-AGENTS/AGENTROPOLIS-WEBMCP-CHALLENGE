import type { WorldGraph } from '../world-graph'
import { INTERVIEW_TEMPORAL_PLAN, type TemporalActionStep } from './temporal-plan'

export interface TemporalPlanResolution { supported: boolean; objective: string; plan: TemporalActionStep[]; reason?: string }
export function objectiveToTemporalPlan(objective: string, _sceneState: WorldGraph): TemporalPlanResolution {
  if (/reconfigure this studio for an interview\.?$/i.test(objective.trim())) return { supported: true, objective, plan: INTERVIEW_TEMPORAL_PLAN }
  return { supported: false, objective, plan: [], reason: 'Unsupported objective: an explicit temporal plan is required.' }
}
