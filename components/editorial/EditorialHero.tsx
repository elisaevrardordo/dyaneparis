'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import captionStyles from '@/components/home/CampaignCaption.module.css'
import slideStyles from '@/components/home/VerticalCampaignSequence.module.css'
import EditorialImage from './EditorialImage'
import styles from './EditorialHero.module.css'

type EditorialHeroProps = {
  eyebrow?: ReactNode
  title: ReactNode
  video?: { src?: string; poster?: string; label?: string }
}

export default function EditorialHero({ eyebrow, title, video }: EditorialHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [motionAllowed, setMotionAllowed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (!motionAllowed) {
      element.pause()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => undefined)
      else element.pause()
    }, { threshold: 0.01 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [motionAllowed])

  return (
    <section
      className={`${slideStyles.slide} ${slideStyles.mediaSlide} ${styles.hero}`}
      data-page-hero
      data-header-foreground="white"
      aria-labelledby="editorial-hero-title"
    >
      {video?.poster ? (
        <EditorialImage
          src={video.poster}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          className={`${slideStyles.fullMedia} ${styles.media}`}
        />
      ) : null}
      <video
        ref={videoRef}
        className={`${slideStyles.fullMedia} ${styles.media} ${styles.video}`}
        autoPlay={motionAllowed}
        muted
        loop
        playsInline
        preload={motionAllowed ? 'metadata' : 'none'}
        poster={video?.poster}
        aria-label={video?.label}
        aria-hidden="true"
        tabIndex={-1}
      >
        {motionAllowed && video?.src ? <source src={video.src} /> : null}
      </video>
      <div className={`${captionStyles.caption} ${captionStyles.overlay} ${captionStyles.white} ${styles.caption}`}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 id="editorial-hero-title" className={`${captionStyles.title} ${styles.captionTitle}`}>{title}</h1>
      </div>
    </section>
  )
}
