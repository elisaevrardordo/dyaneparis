'use client'

import { useRef, useState } from 'react'
import EditorialImage from '@/components/editorial/EditorialImage'
import { ChevronIcon } from '@/components/icons/EditorialIcons'
import { cloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'
import styles from './ProductGallery.module.css'

type GalleryItem = { type: 'image' | 'video'; src: string; alt: string }

export default function ProductGallery({ items, name, locale, videoCaption }: {
  items: GalleryItem[]
  name: string
  locale: 'fr' | 'en'
  videoCaption: string
}) {
  const [index, setIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const touch = useRef<{ x: number; y: number } | null>(null)
  const english = locale === 'en'
  const item = items[index]
  const select = (next: number, focus = false) => {
    videoRef.current?.pause()
    const value = (next + items.length) % items.length
    setIndex(value)
    if (focus) buttons.current[value]?.focus({ preventScroll: true })
  }

  return (
    <section className={styles.gallery} aria-label={`${name} — ${english ? 'gallery' : 'galerie'}`} data-product-gallery>
      <div className={styles.viewer}>
        <div className={styles.stage} data-gallery-stage
          onTouchStart={event => {
            const point = event.touches[0]
            touch.current = event.touches.length === 1 && point ? { x: point.clientX, y: point.clientY } : null
          }}
          onTouchCancel={() => { touch.current = null }}
          onTouchEnd={event => {
            const start = touch.current
            touch.current = null
            const end = event.changedTouches[0]
            if (!start || !end || item.type === 'video') return
            const dx = end.clientX - start.x
            const dy = end.clientY - start.y
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) select(index + (dx < 0 ? 1 : -1))
          }}>
          {item.type === 'image' ? (
            <EditorialImage key={item.src} src={item.src} alt={item.alt} fill
              sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1440px) 52vw, 900px"
              quality={85} priority={index === 0} loading={index === 0 ? undefined : 'eager'}
              className={`${styles.image}${index !== 0 ? ` ${styles.selectedImage}` : ''}`} />
          ) : <>
            <video key={item.src} ref={videoRef} className={styles.video} autoPlay muted loop playsInline controls
              preload="metadata" poster={cloudinaryVideoPoster(item.src, 900)} aria-label={item.alt}>
              <source src={cloudinaryVideo(item.src, 800)} media="(max-width: 768px)" type="video/mp4" />
              <source src={cloudinaryVideo(item.src, 1440)} type="video/mp4" />
            </video>
            <p className={styles.videoCaption}>{videoCaption}</p>
          </>}
        </div>
        <nav className={styles.navigation} aria-label={english ? 'Gallery navigation' : 'Navigation de la galerie'}>
          <button type="button" onClick={() => select(index - 1)} aria-label={english ? 'Previous media' : 'Média précédent'}><ChevronIcon direction="left" /></button>
          <p aria-live="polite" aria-atomic="true">{index + 1} / {items.length}</p>
          <button type="button" onClick={() => select(index + 1)} aria-label={english ? 'Next media' : 'Média suivant'}><ChevronIcon direction="right" /></button>
        </nav>
      </div>
      <fieldset className={styles.thumbnails} aria-label={english ? 'Choose a view' : 'Choisir une vue'}>
        {items.map((media, i) => (
          <button key={media.src} ref={node => { buttons.current[i] = node }} className={styles.thumbnail}
            type="button" aria-pressed={i === index}
            aria-label={`${english ? 'Show media' : 'Afficher le média'} ${i + 1} — ${media.alt}`}
            onClick={() => select(i)}
            onKeyDown={event => {
              const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? index + 1
                : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? index - 1
                : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null
              if (next === null) return
              event.preventDefault()
              select(next, true)
            }}>
            <EditorialImage src={media.type === 'video' ? cloudinaryVideoPoster(media.src, 160) : media.src}
              alt={media.alt} fill sizes="(max-width: 768px) 52px, 58px" quality={75} loading="lazy" className={styles.thumbnailImage} />
            {media.type === 'video' ? <span className={styles.playMark} aria-hidden="true">▷</span> : null}
          </button>
        ))}
      </fieldset>
    </section>
  )
}
