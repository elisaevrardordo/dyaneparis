'use client'
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import s from './Storefront.module.css'

export default function CampaignVideo({ src, poster, position, locale, label, className = '', ratio, children }: {
  src: string; poster: string; position: string; locale: 'fr' | 'en'; label: string; className?: string; ratio?: string; children?: ReactNode
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const en = locale === 'en'
  useEffect(() => {
    const updateAge = () => setAgeConfirmed(document.documentElement.dataset.ageConfirmed === 'true')
    updateAge()
    window.addEventListener('dyane-age-confirmed', updateAge)
    return () => window.removeEventListener('dyane-age-confirmed', updateAge)
  }, [])
  useEffect(() => {
    const element = video.current
    if (!element || !ageConfirmed || failed) return
    let active = true
    const play = () => {
      if (!active || !element.paused) return
      void element.play().catch(() => { if (active) setPlaying(false) })
    }
    play()
    // A normal page interaction can unlock autoplay when the browser initially blocks it.
    window.addEventListener('pointerdown', play, { passive: true })
    window.addEventListener('keydown', play)
    window.addEventListener('pageshow', play)
    return () => {
      active = false
      window.removeEventListener('pointerdown', play)
      window.removeEventListener('keydown', play)
      window.removeEventListener('pageshow', play)
      element.pause()
    }
  }, [ageConfirmed, failed])
  return <section className={`${s.videoPanel} ${className}`} style={{ '--film-ratio': ratio } as CSSProperties} data-playing={playing} aria-label={label}>
    <Image src={poster} alt={label} fill sizes={ratio ? '100vw' : '(max-width: 600px) 100vw, 33vw'} style={{ objectPosition: position }} />
    <video tabIndex={-1} aria-hidden="true" ref={video} src={ageConfirmed ? src : undefined} poster={poster} autoPlay={ageConfirmed} muted loop playsInline preload="none" controls={false} aria-label={label} style={{ objectPosition: position }} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false) }} />
    {failed && <span className={s.videoUnavailable} role="status">{en ? 'Film unavailable. The campaign photograph remains visible.' : 'Film indisponible. La photographie de campagne reste visible.'}</span>}
    {children}
  </section>
}
