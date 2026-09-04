import { useEffect, useRef, useState, type CSSProperties } from 'react'

export interface ParallaxEnvironmentProps {
  videoSrc?: string
  posterSrc: string
  opacity?: number
  blur?: number
  dim?: number
  position?: string
  reducedMotion: boolean
  label?: string
  className?: string
}

export function ParallaxEnvironment({ videoSrc, posterSrc, opacity = .3, blur = 0, dim = .35, position = 'center', reducedMotion, label = '', className = '' }: ParallaxEnvironmentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mobile, setMobile] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  if (import.meta.env.DEV && !posterSrc) throw new Error(`PARALLAX environment requires an approved fallback: ${label}`)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 720px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const staticMode = reducedMotion || mobile || videoFailed

  useEffect(() => {
    const video = videoRef.current
    if (!video || staticMode || !videoSrc) return
    const pause = () => { video.pause() }
    const play = () => { void video.play().catch(() => undefined) }
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? play() : pause(), { rootMargin: '180px 0px' })
    observer.observe(video)
    return () => {
      observer.disconnect()
      pause()
    }
  }, [staticMode, videoSrc])

  const style = { opacity, filter: blur ? `blur(${blur}px)` : undefined, objectPosition: position } as const
  return (
    <div className={`parallax-environment ${className}`} aria-hidden="true" style={{ '--parallax-opacity': opacity, '--parallax-dim': dim } as CSSProperties}>
      {staticMode || !videoSrc ? <img src={posterSrc} alt={label} style={style} /> : <video ref={videoRef} src={videoSrc} poster={posterSrc} muted loop playsInline preload="metadata" onError={() => setVideoFailed(true)} style={style} />}
      <div className="parallax-environment-veil" />
    </div>
  )
}
