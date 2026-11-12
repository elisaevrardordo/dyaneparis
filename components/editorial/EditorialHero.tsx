'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { editorialCase } from '@/lib/editorialCase'
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
    <>
    <header className={styles.opening}>
      {eyebrow ? <p className={styles.eyebrow}>{typeof eyebrow === 'string' ? editorialCase(eyebrow) : eyebrow}</p> : null}
      <h1 id="editorial-hero-title">{typeof title === 'string' ? editorialCase(title) : title}</h1>
    </header>
    <section
      className={styles.hero}
      data-page-hero
      data-header-foreground="black"
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
          sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1650px) 80vw, 1320px"
          className={styles.media}
        />
      ) : null}
      <video
        ref={videoRef}
        className={`${styles.media} ${styles.video}`}
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
    </section>
    </>
  )
}
