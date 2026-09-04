import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getParallaxMedia, PARALLAX_SCREENSAVER_PLAYLIST, type ParallaxVideoAsset, type ParallaxVideoPurpose } from './parallaxVideoVault';

interface AmbientMediaContextValue { currentAsset?: ParallaxVideoAsset; nextAsset?: ParallaxVideoAsset; environment: ParallaxVideoPurpose; screensaverActive: boolean; fallbackActive: boolean; setEnvironment: (purpose: ParallaxVideoPurpose) => void; enterScreensaver: () => void; exitScreensaver: () => void; }
const AmbientMediaContext = createContext<AmbientMediaContextValue | null>(null);

export function AmbientMediaProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironmentState] = useState<ParallaxVideoPurpose>('hero');
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [fallbackActive] = useState(false);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const currentAsset = getParallaxMedia(screensaverActive ? PARALLAX_SCREENSAVER_PLAYLIST[playlistIndex] : environment);
  const nextAsset = getParallaxMedia(PARALLAX_SCREENSAVER_PLAYLIST[(playlistIndex + 1) % PARALLAX_SCREENSAVER_PLAYLIST.length]);
  const exitScreensaver = useCallback(() => setScreensaverActive(false), []);
  const setEnvironment = useCallback((purpose: ParallaxVideoPurpose) => { setScreensaverActive(false); setEnvironmentState(purpose); }, []);
  useEffect(() => { let timer: number | undefined; const reset = () => { window.clearTimeout(timer); exitScreensaver(); timer = window.setTimeout(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setScreensaverActive(true); }, 45000); }; reset(); window.addEventListener('pointerdown', reset); window.addEventListener('keydown', reset); return () => { window.clearTimeout(timer); window.removeEventListener('pointerdown', reset); window.removeEventListener('keydown', reset); }; }, [exitScreensaver]);
  useEffect(() => { if (!screensaverActive) return; const timer = window.setInterval(() => setPlaylistIndex((index) => (index + 1) % PARALLAX_SCREENSAVER_PLAYLIST.length), 12000); return () => window.clearInterval(timer); }, [screensaverActive]);
  const value = useMemo(() => ({ currentAsset, nextAsset, environment, screensaverActive, fallbackActive, setEnvironment, enterScreensaver: () => setScreensaverActive(true), exitScreensaver }), [currentAsset, nextAsset, environment, screensaverActive, fallbackActive, setEnvironment, exitScreensaver]);
  return <AmbientMediaContext.Provider value={value}>{children}</AmbientMediaContext.Provider>;
}

export function useParallaxEnvironment() { const value = useContext(AmbientMediaContext); if (!value) throw new Error('useParallaxEnvironment must be used inside AmbientMediaProvider'); return value; }
