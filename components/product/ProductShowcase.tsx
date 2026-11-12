'use client'

import EditorialImage from '@/components/editorial/EditorialImage'
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import ProductLightbox, { type ProductGalleryMedia } from './ProductLightbox'
import { cartFontVariables } from '@/components/cart/fonts'
import { cloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'
import s from './ProductShowcase.module.css'

function GalleryVideo({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateAge = () => setAgeConfirmed(document.documentElement.dataset.ageConfirmed === 'true')
    updateAge()
    window.addEventListener('dyane-age-confirmed', updateAge)
    const element = video.current
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    if (element) observer.observe(element)
    return () => {
      observer.disconnect()
      window.removeEventListener('dyane-age-confirmed', updateAge)
    }
  }, [])

  useEffect(() => {
    const element = video.current
    if (!element || !ageConfirmed || !visible) return
    let active = true
    const play = () => {
      if (!active || document.hidden) { element.pause(); return }
      void element.play().then(() => { if (!active || document.hidden) element.pause() }).catch(() => {})
    }
    play()
    window.addEventListener('pointerdown', play, { passive: true })
    window.addEventListener('keydown', play)
    document.addEventListener('visibilitychange', play)
    return () => {
      active = false
      element.pause()
      window.removeEventListener('pointerdown', play)
      window.removeEventListener('keydown', play)
      document.removeEventListener('visibilitychange', play)
    }
  }, [ageConfirmed, visible])

  return <video ref={video} className={s.video} src={ageConfirmed ? cloudinaryVideo(src, 1000) : undefined}
    poster={cloudinaryVideoPoster(src)} autoPlay={ageConfirmed && visible} muted loop playsInline
    preload="auto" controls={false} tabIndex={-1} aria-hidden="true" />
}

/** The first photograph stays first, matching the representative SEO image. */
export default function ProductShowcase({ items, locale, title, children }: {
  items: ProductGalleryMedia[]; locale: 'fr' | 'en'; title: string; children: ReactNode
}) {
  const photos = [...items.filter(item => item.type === 'image'), ...items.filter(item => item.type === 'video')]
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)')
    const update = () => setDesktop(query.matches)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const captionId = useId()
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{ pointerId: number; startX: number; startScroll: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const en = locale === 'en'
  const maxIndex = Math.max(0, photos.length - (desktop ? 2 : 1))
  const slideWidth = (element: HTMLDivElement) => element.firstElementChild?.firstElementChild?.getBoundingClientRect().width || 1
  const nearestSlide = (element: HTMLDivElement) => Math.round(element.scrollLeft / slideWidth(element))

  function select(index: number) {
    const element = viewport.current
    if (!element) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = Math.max(0, Math.min(maxIndex, index))
    element.scrollTo({ left: target * slideWidth(element), behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
      moved: false,
    }
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    const offset = event.clientX - gesture.startX
    if (!gesture.moved) {
      if (Math.abs(offset) < 6) return
      gesture.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = 'true'
    }
    event.currentTarget.scrollLeft = gesture.startScroll - offset
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    drag.current = null
    if (!gesture.moved) return
    const element = event.currentTarget
    const width = slideWidth(element)
    const initialIndex = Math.round(gesture.startScroll / width)
    const offset = element.scrollLeft - gesture.startScroll
    let index = nearestSlide(element)
    if (index === initialIndex && Math.abs(offset) >= Math.min(64, width / 4)) {
      index += Math.sign(offset)
    }
    suppressClick.current = true
    select(index)
    delete element.dataset.dragging
  }

  return <section className={`${s.showcase} ${cartFontVariables}`} aria-label={`${en ? 'Discover' : 'Découvrir'} ${title}`}>
    <div className={s.gallery} aria-label={en ? 'Product gallery' : 'Galerie du produit'}>
      <div ref={viewport} className={s.viewport}
        onScroll={event => setActive(Math.max(0, Math.min(photos.length - 1, nearestSlide(event.currentTarget))))}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={event => { if (!drag.current?.moved) endDrag(event) }}
        onDragStart={event => event.preventDefault()}
        onClickCapture={event => {
          if (!suppressClick.current || event.detail === 0) return
          suppressClick.current = false
          event.stopPropagation()
        }}>
        <div className={s.track}>
          {photos.map((item, index) => {
            const caption = item.type === 'video' ? item.caption : undefined
            const id = caption ? `${captionId}-${index}` : undefined
            return <button key={item.src} type="button" className={s.photo}
              onClick={() => setLightbox(index)}
              tabIndex={index === active || (desktop && index === active + 1) ? 0 : -1}
              aria-hidden={index !== active && !(desktop && index === active + 1)}
              aria-describedby={id}
              aria-label={`${en ? 'Enlarge' : 'Agrandir'} : ${item.alt}`}>
              {item.type === 'video' ? <GalleryVideo src={item.src} /> : <EditorialImage draggable={false} src={item.src}
                alt={item.alt} fill priority={index < 2} sizes="(max-width: 900px) 100vw, 34vw" quality={85} />}
              {caption && <span className={s.videoCaption} id={id}>{caption}</span>}
            </button>
          })}
          <div className={s.galleryEnd} aria-hidden="true" />
        </div>
      </div>
      <div className={s.navigation}>
        <div className={s.thumbnails} role="group" aria-label={en ? 'Choose a view' : 'Choisir une vue'}
          onKeyDown={event => {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
            const focused = buttons.indexOf(event.target as HTMLButtonElement)
            const current = focused < 0 ? active : focused
            const index = event.key === 'ArrowRight' ? Math.min(current + 1, photos.length - 1)
              : event.key === 'ArrowLeft' ? Math.max(current - 1, 0) : event.key === 'Home' ? 0 : event.key === 'End' ? photos.length - 1 : null
            if (index === null) return
            event.preventDefault(); select(index)
            buttons[index]?.focus({ preventScroll: true })
          }}>
          {photos.map((item, index) => <button key={item.src} type="button" onClick={() => select(index)}
            aria-label={`${en ? 'View' : 'Vue'} ${index + 1}${item.type === 'video' ? ' - Film' : ''}`}
            aria-pressed={active === index || (desktop && active === maxIndex && index === photos.length - 1)}>
            <EditorialImage src={item.type === 'video' ? cloudinaryVideoPoster(item.src) : item.src} alt="" fill sizes="56px" />
            {item.type === 'video' && <span aria-hidden="true">▷</span>}
          </button>)}
        </div>
      </div>
    </div>
    <div className={s.choiceColumn}>
      <div className={s.card} tabIndex={0} aria-label={en ? 'Product options and details' : 'Choix et détails du produit'}>{children}</div>
    </div>
    {lightbox !== null && <ProductLightbox media={photos} initialIndex={lightbox} locale={locale} onClose={() => setLightbox(null)} />}
  </section>
}
