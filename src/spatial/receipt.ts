import type { SpatialMutation } from './scene-state';

export interface SpatialCaptureArtifact {
  captureId: string;
  captureHash: string;
  captureRef: string;
  sceneId: string;
  sceneVersion: number;
}

export type SpatialVerificationStatus = 'PASS' | 'CORRECTION_NEEDED' | 'FAIL';

export interface SpatialVerification {
  status: SpatialVerificationStatus;
  passed: boolean;
  score: number;
  notes: string[];
  captureId: string;
  captureHash: string;
}

export interface SpatialConstructionReceipt {
  receiptId: string;
  sceneId: string;
  objective: string;
  beforeVersion: number;
  afterVersion: number;
  captureId: string;
  captureHash: string;
  captureRef: string;
  mutations: SpatialMutation[];
  verification: SpatialVerification;
  generatedAt: string;
}

export function createSpatialReceipt(input: Omit<SpatialConstructionReceipt, 'receiptId' | 'generatedAt'>): SpatialConstructionReceipt {
  const receiptId = `spatial-${input.sceneId}-${input.afterVersion}`;
  return { ...input, receiptId, generatedAt: new Date().toISOString() };
}
