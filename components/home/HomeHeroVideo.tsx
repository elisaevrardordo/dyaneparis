'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import type { getHomeContent } from '@/content/home'
import styles from './Home.module.css'

type Hero = ReturnType<typeof getHomeContent>['hero']

export default function HomeHeroVideo({ hero, locale }: { hero: Hero; locale: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!motionAllowed || !videoRef.current) return
    videoRef.current.play().catch(() => setVideoFailed(true))
  }, [motionAllowed])

  if (!hero.enabled) return null

  return (
    <section className={styles.hero} data-header-theme={hero.theme} aria-labelledby="home-hero-title">
      {motionAllowed && !videoFailed ? (
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={hero.poster}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        >
          <source src={hero.mobileVideo} type="video/mp4" media="(max-width: 700px)" />
          <source src={hero.desktopVideo} type="video/mp4" />
        </video>
      ) : (
        <Image
          className={styles.poster}
          src={hero.poster}
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
        />
      )}

      <div className={styles.heroCopy}>
        <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>{hero.eyebrow}</p>
        <h1 id="home-hero-title" className={styles.heroTitle}>{hero.title}</h1>
        <Link className={styles.cta} href={localizedPath(locale, hero.href)}>
          {hero.cta}
        </Link>
      </div>
    </section>
  )
}
