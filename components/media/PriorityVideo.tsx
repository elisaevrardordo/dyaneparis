'use client'

import { useEffect, useRef } from 'react'

type PriorityVideoProps = {
  src: string
  poster: string
  className?: string
  label?: string
}

export default function PriorityVideo({ src, poster, className, label }: PriorityVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const play = () => void video.play().catch(() => undefined)
    play()
    video.addEventListener('canplay', play, { once: true })
    window.addEventListener('focus', play)
    document.addEventListener('visibilitychange', play)
    return () => {
      video.removeEventListener('canplay', play)
      window.removeEventListener('focus', play)
      document.removeEventListener('visibilitychange', play)
    }
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-label={label}
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
