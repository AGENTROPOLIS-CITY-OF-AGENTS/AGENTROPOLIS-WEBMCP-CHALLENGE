export type ParallaxVideoPurpose = 'hero' | 'city' | 'studio' | 'loop-observe' | 'loop-act' | 'loop-see-again' | 'loop-verify' | 'system-view' | 'governance' | 'receipt' | 'idle-screensaver';

export interface ParallaxVideoAsset {
  id: string; src: string; type: 'video' | 'image'; purpose: ParallaxVideoPurpose; section: string; tags: string[]; priority: number; loop: boolean; fallback: string; reducedMotionFallback: string; mobilePreferred: boolean; duration?: number; enabled: boolean;
}

const base = `${import.meta.env.BASE_URL}assets/parallax/`;
const still = `${base}parallax-world-hero.png`;
const studioStill = `${base}parallax-world-establishing.png`;
const video = (id: string, purpose: ParallaxVideoPurpose, section: string, tags: string[], priority: number, fallback = still): ParallaxVideoAsset => ({ id: `parallax-${id}`, src: `${base}parallax-world-motion-${id}.mp4`, type: 'video', purpose, section, tags, priority, loop: true, fallback, reducedMotionFallback: fallback, mobilePreferred: false, enabled: true });

export const PARALLAX_VIDEO_VAULT: readonly ParallaxVideoAsset[] = [
  video('01', 'hero', 'hero', ['city', 'establishing'], 100), video('02', 'city', 'world', ['city', 'ambient'], 50), video('03', 'city', 'world', ['city', 'ambient'], 40),
  video('05a', 'studio', 'live-demo', ['studio', 'director-chair'], 100, studioStill), video('06a', 'governance', 'corridor', ['governance', 'signal'], 90),
  video('07', 'loop-observe', 'loop', ['observe', 'action'], 80), video('08', 'loop-act', 'loop', ['act', 'action'], 80), video('09', 'loop-see-again', 'loop', ['see-again', 'action'], 80), video('10', 'loop-verify', 'loop', ['verify', 'action'], 80),
  video('11', 'receipt', 'proof', ['receipt', 'audit'], 80), video('05', 'system-view', 'system', ['agents', 'studio'], 70, studioStill),
  { id: 'parallax-hero-still', src: still, type: 'image', purpose: 'idle-screensaver', section: 'ambient', tags: ['fallback', 'reduced-motion'], priority: 20, loop: false, fallback: still, reducedMotionFallback: still, mobilePreferred: true, enabled: true },
];

export function getParallaxMedia(purpose: ParallaxVideoPurpose): ParallaxVideoAsset | undefined {
  return PARALLAX_VIDEO_VAULT.filter((asset) => asset.enabled && asset.purpose === purpose).sort((a, b) => b.priority - a.priority)[0];
}

export const PARALLAX_SCREENSAVER_PLAYLIST = ['city', 'studio', 'loop-act', 'governance', 'receipt'] as const;
