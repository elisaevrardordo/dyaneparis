'use client'

import Image from 'next/image'
import EditorialImage from '@/components/editorial/EditorialImage'
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { ChevronIcon, PlayIcon, PauseIcon } from '@/components/icons/EditorialIcons'
import { cloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'
import styles from './ProductLightbox.module.css'

type Photo = { src: string; alt: string }
export type ProductGalleryMedia = Photo & { type: 'image' | 'video' }


function CinematicVideo({ item, english, videoRef }: {
  item: ProductGalleryMedia
  english: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [visible, setVisible] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reveal = useCallback(() => {
    setVisible(true)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setVisible(false), 2400)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => { setPlaying(false); setVisible(true) })
    return () => {
      video.pause()
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [videoRef])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    reveal()
    if (video.paused || video.ended) void video.play().catch(() => { setPlaying(false); setVisible(true) })
    else video.pause()
  }

  return (
    <div className={styles.videoPlayer} onPointerMove={reveal} onPointerDown={reveal} onFocusCapture={reveal}>
      <video
        ref={videoRef}
        className={styles.video}
        src={cloudinaryVideo(item.src, 1600)}
        poster={cloudinaryVideoPoster(item.src, 1600)}
        controls={false}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-label={item.alt}
        onPlay={() => { setPlaying(true); reveal() }}
        onPause={() => { setPlaying(false); setVisible(true) }}
        onEnded={() => { setPlaying(false); setVisible(true) }}
        onError={() => { setPlaying(false); setVisible(true) }}
        onVolumeChange={() => setMuted(videoRef.current?.muted ?? true)}
      />
      <div className={styles.playerControls} data-visible={visible || !playing}>
        <button
          type="button"
          className={`${styles.playerButton} ${styles.playback}`}
          aria-label={playing ? (english ? 'Pause film' : 'Mettre le film en pause') : (english ? 'Play film' : 'Lire le film')}
          aria-pressed={playing}
          onClick={togglePlayback}
        >{playing ? <PauseIcon /> : <PlayIcon />}</button>
        <button
          type="button"
          className={`${styles.playerButton} ${styles.sound}`}
          aria-label={muted ? (english ? 'Enable sound' : 'Activer le son') : (english ? 'Mute sound' : 'Couper le son')}
          aria-pressed={!muted}
          onClick={() => {
            const video = videoRef.current
            if (video) video.muted = !video.muted
            reveal()
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4Z" />
            {muted ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ProductLightbox({ media, photos, initialIndex, locale, onClose }: {
  media?: ProductGalleryMedia[]
  photos?: Photo[]
  initialIndex: number
  locale: 'fr' | 'en'
  onClose: () => void
}) {
  const items = useMemo(() => media ?? (photos ?? []).map(photo => ({ ...photo, type: 'image' as const })), [media, photos])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const [index, setIndex] = useState(initialIndex)
  const english = locale === 'en'
  const FullscreenImage = media ? EditorialImage : Image
  const current = items[index]
  const pauseVideo = () => videoRef.current?.pause()
  const close = () => { pauseVideo(); onClose() }
  const move = (step: number) => {
    pauseVideo()
    setIndex(value => (value + step + items.length) % items.length)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (current?.type !== 'video') return
    const video = videoRef.current
    return () => video?.pause()
  }, [current])

  if (!current) return null

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={english ? 'Full-screen product gallery' : 'Galerie produit plein écran'}
      onCancel={event => { event.preventDefault(); close() }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          move(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
    >
      <button type="button" className={styles.close} aria-label={english ? 'Close gallery' : 'Fermer la galerie'} onClick={close}>×</button>
      <div
        className={`${styles.stage}${current.type === 'video' ? ` ${styles.filmStage}` : ''}`}
        onTouchStart={event => {
          const touch = event.touches[0]
          if (event.target instanceof Element && event.target.closest('button')) return
          touchRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null
        }}
        onTouchEnd={event => {
          const start = touchRef.current
          const touch = event.changedTouches[0]
          if (start && touch) {
            const dx = touch.clientX - start.x
            const dy = touch.clientY - start.y
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
          }
          touchRef.current = null
        }}
      >
        {current.type === 'video' ? (
          <CinematicVideo key={current.src} item={current} english={english} videoRef={videoRef} />
        ) : (
          <FullscreenImage key={current.src} src={current.src} alt={current.alt} fill quality={85} sizes="(max-width: 768px) 100vw, 90vw" className={styles.photo} />
        )}
      </div>
      <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label={media ? (english ? 'Previous media' : 'Média précédent') : (english ? 'Previous photo' : 'Photo précédente')} onClick={() => move(-1)}><ChevronIcon direction="left" /></button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label={media ? (english ? 'Next media' : 'Média suivant') : (english ? 'Next photo' : 'Photo suivante')} onClick={() => move(1)}><ChevronIcon direction="right" /></button>
      <p className={styles.counter} aria-live="polite" aria-atomic="true">{index + 1} / {items.length}</p>
    </dialog>
  )
}
