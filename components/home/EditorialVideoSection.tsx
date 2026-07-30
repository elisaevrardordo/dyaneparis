'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { getHomeContent } from '@/content/home'
import styles from './Home.module.css'

type Film = ReturnType<typeof getHomeContent>['film']

export default function EditorialVideoSection({ film }: { film: Film }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadVideo, setLoadVideo] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: '350px 0px' },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      media.removeEventListener('change', syncMotion)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!loadVideo || reducedMotion || !videoRef.current) return
    videoRef.current.play().catch(() => setVideoFailed(true))
  }, [loadVideo, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className={styles.film}
      data-header-theme={film.theme}
      aria-labelledby="editorial-film-title"
    >
      {loadVideo && !reducedMotion && !videoFailed ? (
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={film.poster}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        >
          <source src={film.mobileVideo} type="video/mp4" media="(max-width: 700px)" />
          <source src={film.desktopVideo} type="video/mp4" />
        </video>
      ) : (
        <Image
          className={styles.poster}
          src={film.poster}
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
      )}
      <div className={styles.filmCopy}>
        <h2 id="editorial-film-title" className={styles.filmTitle}>{film.title}</h2>
      </div>
    </section>
  )
}
