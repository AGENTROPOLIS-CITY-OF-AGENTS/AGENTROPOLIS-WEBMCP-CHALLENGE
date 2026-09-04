const base = `${import.meta.env.BASE_URL}assets/parallax/`;

export const parallaxMedia = {
  hero: `${base}parallax-world-motion-01.mp4`,
  loopObserve: `${base}parallax-world-motion-07(1).mp4`,
  loopAct: `${base}parallax-world-motion-08(1).mp4`,
  loopSeeAgain: `${base}parallax-world-motion-09(1).mp4`,
  loopVerify: `${base}parallax-world-motion-10(2).mp4`,
  loopExplainer: `${base}parallax-loop-imagine-v1.mp4`,
  studio: `${base}parallax-world-motion-05a.mp4`,
  systemView: `${base}parallax-world-motion-05a.mp4`,
  governance: `${base}parallax-world-motion-06a.mp4`,
  receipt: `${base}parallax-world-motion-11.mp4`,
  fallbackImage: `${base}parallax-world-hero.png`,
  establishingImage: `${base}parallax-world-establishing.png`,
  loopPlaylist: [`${base}parallax-world-motion-07(1).mp4`, `${base}parallax-world-motion-08(1).mp4`, `${base}parallax-world-motion-09(1).mp4`, `${base}parallax-world-motion-10(2).mp4`],
} as const;

export const parallaxMediaMetadata = {
  loopExplainer: {
    purpose: 'LOOP_EXPLAINER',
    classification: 'ILLUSTRATIVE',
    generatedConceptVideo: true,
    runtimeProof: false,
  },
} as const;

export type ParallaxMediaPurpose = keyof typeof parallaxMedia;
