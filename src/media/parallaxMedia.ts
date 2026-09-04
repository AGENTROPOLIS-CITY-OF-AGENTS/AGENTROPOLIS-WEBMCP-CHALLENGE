const base = `${import.meta.env.BASE_URL}assets/`;

export const parallaxMedia = {
  // Primary PARALLAX demo
  hero: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,

  // Until individual verified runtime loops are wired,
  // use the canonical synced demo rather than missing media files.
  loopObserve: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,
  loopAct: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,
  loopSeeAgain: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,
  loopVerify: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,
  loopExplainer: `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,

  // Story / environment art
  studio: `${base}parallax/directors chair parallax.png`,
  systemView: `${base}parallax/agentropolis.png`,
  governance: `${base}parallax/PARALLAX x article image.png`,
  receipt: `${base}parallax/x article banner PARallax mcp.jpg`,

  // Fallback imagery
  fallbackImage: `${base}parallax-world-hero.png`,
  establishingImage: `${base}parallax-world-establishing.png`,

  // Builder / documentary imagery
  builderWorkspace: `${base}parallax/desktop model parallax.png`,
  builderPortrait: `${base}parallax/neuro avatar parallax.png`,

  loopPlaylist: [
    `${base}parallax/PARALLAX_demo_WebMCP_Challenge_FINAL_SYNCED.mp4`,
  ],
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
