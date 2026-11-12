'use client'
import { useEffect, useRef, useState } from 'react'
import EditorialImage from './EditorialImage'
import styles from './EditorialFilm.module.css'

export default function EditorialFilm({ src, poster, label, width, height, priority = false }: {
  src: string; poster?: string; label: string; width: number; height: number; priority?: boolean
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)
  const [visible, setVisible] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReduced(preference.matches)
    const age = () => setConfirmed(document.documentElement.dataset.ageConfirmed === 'true')
    motion(); age()
    preference.addEventListener('change', motion)
    window.addEventListener('dyane-age-confirmed', age)
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setLoad(true); setVisible(entry.isIntersecting) }, { rootMargin: '180px 0px', threshold: .01 })
    if (video.current) observer.observe(video.current)
    return () => { observer.disconnect(); preference.removeEventListener('change', motion); window.removeEventListener('dyane-age-confirmed', age) }
  }, [])
  useEffect(() => {
    const element = video.current
    if (!element) return
    let active = true
    const update = () => {
      if (!active || !visible || !confirmed || reduced || document.hidden) { element.pause(); return }
      void element.play().then(() => { if (!active) element.pause() }).catch(() => {})
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => { active = false; element.pause(); document.removeEventListener('visibilitychange', update) }
  }, [load, confirmed, reduced, visible])
  return <div className={styles.frame} style={{ aspectRatio: `${width}/${height}` }}>
    {poster && <EditorialImage src={poster} alt="" fill sizes="(max-width:760px) 90vw, 60vw" priority={priority} className={styles.poster} />}
    <video ref={video} src={load && confirmed ? src : undefined} poster={poster} aria-label={label}
      className={styles.video} muted loop playsInline controls={reduced} autoPlay={confirmed && visible && !reduced}
      preload={load && confirmed ? 'metadata' : 'none'} />
  </div>
}
