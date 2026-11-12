'use client'

import EditorialImage from './EditorialImage'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

type ViewportVideoProps = {
  src: string
  poster?: string
  label: string
  className?: string
  style?: CSSProperties
  sizes?: string
}

export default function ViewportVideo({ src, poster, label, className, style, sizes = '50vw' }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shouldPlayRef = useRef(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(([entry]) => {
      shouldPlayRef.current = entry.isIntersecting

      if (entry.isIntersecting) {
        setShouldLoad(true)
        video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    }, { rootMargin: '640px 0px', threshold: 0.01 })

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return

    video.load()
    if (shouldPlayRef.current) video.play().catch(() => undefined)
  }, [shouldLoad])

  return (
    <>
    {poster ? <EditorialImage src={poster} alt="" fill sizes={sizes} quality={85} loading="lazy" className={className} style={style} /> : null}
    <video
      ref={videoRef}
      className={className}
      style={{ ...style, position: 'relative' }}
      muted
      loop
      playsInline
      preload={shouldLoad ? 'metadata' : 'none'}
      aria-label={label}
    >
      {shouldLoad ? <source src={src} /> : null}
    </video>
    </>
  )
}
