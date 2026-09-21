'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

type ViewportVideoProps = {
  src: string
  label: string
  className?: string
  style?: CSSProperties
}

export default function ViewportVideo({ src, label, className, style }: ViewportVideoProps) {
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
    }, { rootMargin: '320px 0px', threshold: 0.01 })

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
    <video
      ref={videoRef}
      className={className}
      style={style}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      {shouldLoad ? <source src={src} /> : null}
    </video>
  )
}
