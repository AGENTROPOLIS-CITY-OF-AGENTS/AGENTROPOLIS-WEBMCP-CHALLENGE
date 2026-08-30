import type { WorldCapability } from "../types.js";

export interface AgentMandate {
  agentId: string;
  district: string;
  role: string;
  capabilities: WorldCapability[];
  expiresAt?: string;
}

export interface CapabilityRequest { agentId: string; capability: WorldCapability; }

export function authorize(request: CapabilityRequest, mandate: AgentMandate) {
  if (request.agentId !== mandate.agentId) return { allowed: false as const, reason: "IDENTITY_MISMATCH" };
  if (mandate.expiresAt && Date.now() > new Date(mandate.expiresAt).getTime()) return { allowed: false as const, reason: "MANDATE_EXPIRED" };
  if (!mandate.capabilities.includes(request.capability)) return { allowed: false as const, reason: "CAPABILITY_DENIED" };
  return { allowed: true as const };
}
