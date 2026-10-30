'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, type ReactNode } from 'react'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import CampaignCaption from './CampaignCaption'
import styles from './VerticalCampaignSequence.module.css'
import { cloudinaryVideo } from '@/lib/cloudinary'

export const NEW_HERO_VIDEO = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1789996394/dyane-paris/maison/dyane-paris-maison-art-liquide-hero.mp4'
export const NEW_HERO_VIDEO_MOBILE = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1789996394/dyane-paris/maison/dyane-paris-maison-art-liquide-hero.mp4'
export const NEW_HERO_VIDEO_POSTER = '/home/hero/hero-dyane-website-vdef-poster.jpg'
export const HOME_IMAGE_01 = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788728025/dyane-paris-maison-art-liquide-campagne-noir-blanc.png'
export const HOME_IMAGE_02 = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788784346/dyane-paris-sculpture-rouge-cocktail-signature-bar.png'

const CRAFT_IMAGE = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788691447/dyane-paris-fabrication-sculpture-modelage-main2.png'
const CRAFT_VIDEO = cloudinaryVideo('https://res.cloudinary.com/dazhkrimv/video/upload/v1788697399/dyane-paris-fabrication-sculpture-modelage-main.mp4')
const SERVICE_VIDEO_SOURCE = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1793316375/dyane-paris-personnalisation-oeuvres-hotellerie-luxe.mp4'
const SERVICE_VIDEO = cloudinaryVideo(SERVICE_VIDEO_SOURCE)
const SERVICE_VIDEO_MOBILE = cloudinaryVideo(SERVICE_VIDEO_SOURCE, 800)

type HomeContent = ReturnType<typeof getHomeContent>

function useViewportVideoPlayback() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let inView = false
    const playWhenVisible = () => {
      if (!inView) return
      // The opaque verification gate completely covers the film. Wait until
      // confirmation before downloading it; the film itself is unchanged.
      if (document.querySelector('[data-age-gate]') && document.documentElement.dataset.ageConfirmed !== 'true') return
      video.play().catch(() => undefined)
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (entry.isIntersecting) {
        playWhenVisible()
      } else {
        video.pause()
      }
    }, { rootMargin: '520px 0px', threshold: 0.08 })

    observer.observe(video)
    window.addEventListener('dyane-age-confirmed', playWhenVisible)
    return () => {
      observer.disconnect()
      window.removeEventListener('dyane-age-confirmed', playWhenVisible)
    }
  }, [])

  return videoRef
}

function ClosingHeroVideo({ hero, locale }: { hero: HomeContent['hero']; locale: string }) {
  const isEnglish = locale === 'en'
  const videoRef = useViewportVideoPlayback()

  return (
    <section
      className={`${styles.slide} ${styles.mediaSlide}`}
      data-scroll-section
      data-header-foreground="white"
      aria-label={isEnglish ? 'Dyane Paris concierge' : 'Conciergerie Dyane Paris'}
    >
      <video
        ref={videoRef}
        className={styles.fullMedia}
        muted
        loop
        playsInline
        preload="none"
        poster={hero.poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={hero.mobileVideo} type="video/mp4" media="(max-width: 700px)" />
        <source src={hero.desktopVideo} type="video/mp4" />
      </video>
      <CampaignCaption
        cinematic
        cta={isEnglish ? 'CONTACT THE CONCIERGE' : 'CONTACTER LA CONCIERGERIE'}
        href={localizedPath(locale, '/contact')}
        lines={[isEnglish
          ? 'ALL OUR WORKS ARE AVAILABLE TO ORDER THROUGH OUR CONCIERGE'
          : 'TOUTES NOS ŒUVRES SONT DISPONIBLES SUR COMMANDE AUPRÈS DE NOTRE CONCIERGERIE']}
      />
    </section>
  )
}

function FutureImageSlide({
  src,
  label,
  caption,
  cta,
  description,
  href,
}: {
  src: string
  label: string
  caption: string
  cta: string
  description?: string
  href: string
}) {
  return (
    <section
      className={`${styles.slide} ${styles.futureImageSlide}`}
      data-scroll-section
      data-header-foreground="white"
      aria-label={label}
    >
      {src ? <Image className={styles.fullMedia} src={src} alt={label} fill sizes="100vw" quality={85} /> : null}
      <CampaignCaption cta={cta} description={description} href={href} lines={[caption]} />
    </section>
  )
}

function ServiceVideoSlide({ locale }: { locale: string }) {
  const isEnglish = locale === 'en'
  const videoRef = useViewportVideoPlayback()

  return (
    <section
      className={`${styles.slide} ${styles.mediaSlide}`}
      data-scroll-section
      data-header-foreground="white"
      aria-label={isEnglish ? 'Dyane Paris hospitality film' : 'Film hospitality Dyane Paris'}
    >
      <video
        ref={videoRef}
        className={styles.fullMedia}
        muted
        loop
        playsInline
        preload="none"
        poster={HOME_IMAGE_02}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={SERVICE_VIDEO_MOBILE} type="video/mp4" media="(max-width: 700px)" />
        <source src={SERVICE_VIDEO} type="video/mp4" />
      </video>
      <CampaignCaption
        cinematic
        cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
        href={localizedPath(locale, '/experiences')}
        lines={[isEnglish ? 'THE ART OF ENTERTAINING, REIMAGINED' : 'L’ART DE RECEVOIR AUTREMENT']}
      />
    </section>
  )
}

export default function VerticalCampaignSequence({
  locale,
  hero,
  chapters,
}: {
  locale: string
  hero: HomeContent['hero']
  chapters?: ReactNode
  products?: HomeContent['products']
}) {
  const isEnglish = locale === 'en'
  const openingVideoRef = useViewportVideoPlayback()
  const craftVideoRef = useViewportVideoPlayback()

  return (
    <>
      <section
        className={`${styles.slide} ${styles.mediaSlide}`}
        data-page-hero
        data-scroll-section
        data-header-foreground="white"
        aria-label={isEnglish ? 'Dyane Paris opening film' : 'Film d’ouverture Dyane Paris'}
      >
        {NEW_HERO_VIDEO ? (
          <video
            ref={openingVideoRef}
            className={styles.fullMedia}
            muted
            loop
            playsInline
            preload="none"
            poster={NEW_HERO_VIDEO_POSTER || undefined}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={NEW_HERO_VIDEO_MOBILE} type="video/mp4" media="(max-width: 700px)" />
            <source src={NEW_HERO_VIDEO} type="video/mp4" />
          </video>
        ) : null}
        <CampaignCaption
        cinematic
          cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
          href={localizedPath(locale, '/la-maison')}
          lines={[isEnglish ? 'DYANE PARIS — HOUSE OF LIQUID ART' : 'DYANE PARIS — MAISON D’ART LIQUIDE']}
          titleElement="h1"
        />
      </section>

      <div data-scroll-section data-header-foreground="black">{chapters}</div>

      <FutureImageSlide
        src={HOME_IMAGE_01}
        label={isEnglish ? 'Dyane Paris porcelain cocktail sculpture campaign' : 'Campagne Dyane Paris autour des cocktails en sculptures de porcelaine'}
        caption={isEnglish ? 'THE DYANE UNIVERSE' : 'L’UNIVERS DYANE'}
        cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
        description={isEnglish
          ? 'Dyane Paris is a French House of Liquid Art. It imagines exceptional ready-to-serve cocktails, presented in hand-painted porcelain sculptures. At the meeting point of mixology and fine craft, each creation becomes a tasting experience and a collectible object.'
          : 'Dyane Paris est une Maison française d’Art Liquide. Elle imagine des cocktails d’exception prêts à servir, présentés dans des sculptures en porcelaine peintes à la main. À la rencontre de la mixologie et des métiers d’art, chaque création devient une expérience de dégustation et un objet à collectionner.'}
        href={localizedPath(locale, '/le-journal')}
      />

      <section
        className={`${styles.slide} ${styles.craftSlide}`}
        data-scroll-section
        data-header-foreground="black"
        aria-labelledby="home-craft-title"
      >
        <div className={styles.craftContent}>
          <Link className={styles.craftMedia} href={localizedPath(locale, '/fabrication')} aria-label={isEnglish ? 'Discover French savoir-faire' : 'Découvrir le savoir-faire français'}>
            <video
              ref={craftVideoRef}
              className={styles.craftVideo}
              muted
              loop
              playsInline
              preload="none"
              poster={CRAFT_IMAGE}
              aria-label={isEnglish ? 'Dyane Paris craftsmanship film' : 'Film du savoir-faire Dyane Paris'}
            >
              <source src={CRAFT_VIDEO} type="video/mp4" />
            </video>
          </Link>
        </div>
        <CampaignCaption
        cinematic
          cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
          href={localizedPath(locale, '/fabrication')}
          lines={[isEnglish ? 'FRENCH SAVOIR-FAIRE' : 'UN SAVOIR-FAIRE FRANÇAIS']}
          titleId="home-craft-title"
          tone="black"
        />
      </section>

      <FutureImageSlide
        src={HOME_IMAGE_02}
        label={isEnglish ? 'Dyane Paris art of entertaining campaign' : 'Campagne Dyane Paris autour de l’art de recevoir'}
        caption={isEnglish ? 'THE ART OF ENTERTAINING, REIMAGINED' : 'L’ART DE RECEVOIR AUTREMENT'}
        cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
        href={localizedPath(locale, '/experiences')}
      />

      <ServiceVideoSlide locale={locale} />

      <ClosingHeroVideo hero={hero} locale={locale} />
    </>
  )
}
