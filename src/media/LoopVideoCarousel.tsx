import { useEffect, useRef, useState } from 'react';
import { parallaxMedia } from './parallaxMedia';

export function LoopVideoCarousel({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null); const activeRef = useRef<HTMLVideoElement>(null); const nextRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0); const [nextReady, setNextReady] = useState(false); const [crossfading, setCrossfading] = useState(false); const [playing, setPlaying] = useState(false); const [failed, setFailed] = useState(false);
  const playlist = parallaxMedia.loopPlaylist; const active = playlist[index]; const next = playlist[(index + 1) % playlist.length];
  useEffect(() => { if (reducedMotion) return; const node = sectionRef.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setPlaying(true); void activeRef.current?.play().catch(() => undefined); } else { setPlaying(false); activeRef.current?.pause(); nextRef.current?.pause(); } }, { rootMargin: '120px' }); observer.observe(node); return () => observer.disconnect(); }, [reducedMotion]);
  const advance = () => { if (!nextReady || crossfading) return; setCrossfading(true); void nextRef.current?.play().catch(() => undefined); window.setTimeout(() => { setIndex((value) => (value + 1) % playlist.length); setCrossfading(false); }, 560); };
  return <div ref={sectionRef} className={`loop-video-carousel ${crossfading ? 'is-crossfading' : ''}`} aria-hidden="true">
    {reducedMotion || failed ? <img src={parallaxMedia.establishingImage} alt="" /> : <><video ref={activeRef} className="loop-video-active" src={active} autoPlay muted playsInline preload="metadata" onTimeUpdate={(event) => { const video = event.currentTarget; if (video.duration && video.currentTime >= video.duration - .7) advance(); }} onEnded={advance} onError={() => setFailed(true)} /><video ref={nextRef} className="loop-video-next" src={next} muted playsInline preload="metadata" onCanPlay={() => setNextReady(true)} onError={() => setNextReady(false)} /></>}
    <div className="loop-video-veil" />
    {import.meta.env.DEV ? <div className="loop-media-diagnostic"><strong>LOOP MEDIA</strong><span>LOOP_ACTIVE_INDEX {index}</span><span>LOOP_ACTIVE_FILE {active.split('/').pop()}</span><span>LOOP_NEXT_FILE {next.split('/').pop()}</span><span>LOOP_ACTIVE_PLAYING {playing ? 'YES' : 'NO'}</span><span>LOOP_NEXT_READY {nextReady ? 'YES' : 'NO'}</span><span>LOOP_CROSSFADE {crossfading ? 'YES' : 'NO'}</span><span>LOOP_SECTION_VISIBLE {playing ? 'YES' : 'NO'}</span></div> : null}
  </div>;
}
