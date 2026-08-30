import type { WorldCapability, WorldProviderId } from "../types";

export interface WorldReceipt {
  receiptId: string;
  timestamp: string;
  agentId: string;
  district: string;
  provider: WorldProviderId;
  capability: WorldCapability;
  result: "success" | "denied" | "failed";
  reason?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export function createReceipt(data: Omit<WorldReceipt, "receiptId" | "timestamp">): WorldReceipt {
  return { receiptId: crypto.randomUUID(), timestamp: new Date().toISOString(), ...data };
}
