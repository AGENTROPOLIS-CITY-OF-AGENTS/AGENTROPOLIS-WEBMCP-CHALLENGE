import type { WorldPhase } from '../core/engine'

export const ZONES = {
  arrival: [-15, 0, 0],
  gateway: [-11, 0, 0],
  identity: [-7, 0, 0],
  mandate: [-3, 0, 0],
  policy: [1, 0, 0],
  approval: [2, 0, 5],
  forge: [6, 0, 0],
  vault: [11, 0, 0],
} as const

export const PHASE_TARGET: Record<WorldPhase, readonly [number, number, number]> = {
  ORIENTING: ZONES.arrival,
  DISCOVERED: ZONES.gateway,
  REQUESTED: ZONES.gateway,
  IDENTIFIED: ZONES.identity,
  MANDATE_CHECKED: ZONES.mandate,
  POLICY_DECIDED: ZONES.policy,
  AWAITING_APPROVAL: ZONES.approval,
  EXECUTING: ZONES.forge,
  RECEIPTED: ZONES.vault,
}

export const CAMERA_POSITIONS: Record<WorldPhase, readonly [number, number, number]> = {
  ORIENTING: [-19, 8.5, 14],
  DISCOVERED: [-14.2, 5.6, 7.8],
  REQUESTED: [-13.1, 3.5, 5.1],
  IDENTIFIED: [-8.8, 3.7, 5.8],
  MANDATE_CHECKED: [-4.2, 3.2, 5.4],
  POLICY_DECIDED: [0.4, 3.9, 6],
  AWAITING_APPROVAL: [0.4, 4.5, 10.8],
  EXECUTING: [5.1, 3.7, 5.8],
  RECEIPTED: [9.2, 4.3, 6.6],
}
