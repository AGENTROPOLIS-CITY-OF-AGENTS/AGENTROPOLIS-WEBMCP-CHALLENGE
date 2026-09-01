import type { WorldGraph } from '../../spatial/world-graph';

export const STUDIO_SCENE: WorldGraph = {
  sceneId: 'studio-interview-demo',
  version: 1,
  objects: [
    { id: 'camera-01', type: 'camera', label: 'Camera', position: [0, 1.6, -3.2], rotation: [0, 0, 0], permissions: ['inspect', 'translate', 'rotate', 'capture'] },
    { id: 'key-light-01', type: 'light', label: 'Key Light', position: [1.4, 2.1, -0.5], rotation: [0, -0.6, 0], intensity: 52, permissions: ['inspect', 'translate', 'rotate', 'intensity'] },
    { id: 'fill-light-01', type: 'light', label: 'Fill Light', position: [-1.5, 1.8, -0.2], rotation: [0, 0.6, 0], intensity: 28, permissions: ['inspect', 'translate', 'rotate', 'intensity'] },
    { id: 'chair-01', type: 'chair', label: 'Interview Chair', position: [0, 0, 0.3], rotation: [0, 0, 0], material: 'obsidian-fabric', permissions: ['inspect', 'translate', 'rotate', 'material'] },
    { id: 'display-01', type: 'display', label: 'Display', position: [0, 1.4, 1.8], rotation: [0, 3.14, 0], material: 'cyan-signal', permissions: ['inspect', 'translate', 'rotate', 'material'] },
    { id: 'mic-01', type: 'microphone', label: 'Microphone', position: [0.35, 1.25, -0.1], rotation: [0, 0, 0], permissions: ['inspect', 'translate', 'rotate'] },
  ],
};
