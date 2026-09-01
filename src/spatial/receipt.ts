import type { SpatialMutation } from './scene-state';

export interface SpatialVerification {
  passed: boolean;
  score: number;
  notes: string[];
}

export interface SpatialConstructionReceipt {
  receiptId: string;
  sceneId: string;
  objective: string;
  beforeVersion: number;
  afterVersion: number;
  mutations: SpatialMutation[];
  verification: SpatialVerification;
  generatedAt: string;
}

export function createSpatialReceipt(input: Omit<SpatialConstructionReceipt, 'receiptId' | 'generatedAt'>): SpatialConstructionReceipt {
  const receiptId = `spatial-${input.sceneId}-${input.afterVersion}`;
  return { ...input, receiptId, generatedAt: new Date().toISOString() };
}
