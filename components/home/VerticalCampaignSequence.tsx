'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import CampaignCaption from './CampaignCaption'
import ProductDiptych from './ProductDiptych'
import styles from './VerticalCampaignSequence.module.css'

export const NEW_HERO_VIDEO = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1789996394/dyane-paris/maison/dyane-paris-maison-art-liquide-hero.mp4'
export const NEW_HERO_VIDEO_MOBILE = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1789996394/dyane-paris/maison/dyane-paris-maison-art-liquide-hero.mp4'
export const NEW_HERO_VIDEO_POSTER = '/home/hero/hero-dyane-website-vdef-poster.jpg'
export const HOME_IMAGE_01 = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788728025/Ajouter_un_titre_1_yk7tmn.png'
export const HOME_IMAGE_02 = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788784346/Ajouter_un_titre_3_ebsgyz.png'

const CRAFT_IMAGE = 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788691447/COCKTAIL_5_jox1dv.png'
const CRAFT_VIDEO = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788697399/VIDEO_FABRICATION_d7nezn.mp4'
const SERVICE_VIDEO = '/home/film/service-dyane.mp4?v=icloud-drive'

type HomeContent = ReturnType<typeof getHomeContent>

function useViewportVideoPlayback() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    }, { threshold: 0.18 })

    observer.observe(video)
    return () => observer.disconnect()
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
        preload="metadata"
        poster={hero.poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={hero.mobileVideo} type="video/mp4" media="(max-width: 700px)" />
        <source src={hero.desktopVideo} type="video/mp4" />
      </video>
      <CampaignCaption
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
  href,
}: {
  src: string
  label: string
  caption: string
  cta: string
  href: string
}) {
  return (
    <section
      className={`${styles.slide} ${styles.futureImageSlide}`}
      data-scroll-section
      data-header-foreground="white"
      aria-label={label}
    >
      {src ? <Image className={styles.fullMedia} src={src} alt={label} fill sizes="100vw" /> : null}
      <CampaignCaption cta={cta} href={href} lines={[caption]} />
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
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={SERVICE_VIDEO} />
      </video>
      <CampaignCaption
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
  products,
}: {
  locale: string
  hero: HomeContent['hero']
  products: HomeContent['products']
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
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={NEW_HERO_VIDEO_POSTER || undefined}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={NEW_HERO_VIDEO_MOBILE} type="video/mp4" media="(max-width: 700px)" />
            <source src={NEW_HERO_VIDEO} type="video/mp4" />
          </video>
        ) : null}
        <CampaignCaption
          cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
          description={isEnglish
            ? 'Dyane Paris is a French premium cocktail House and a House of Liquid Art. It creates ready-to-serve cocktails presented in hand-painted porcelain sculptures. At the meeting point of mixology, fine craft and hospitality, each creation is conceived as both a tasting experience and a collectible object.'
            : 'Dyane Paris est une Maison française de cocktails premium et une Maison d’Art Liquide. Elle crée des cocktails prêts à servir, présentés dans des sculptures en porcelaine peintes à la main. À la rencontre de la mixologie, des métiers d’art et de l’hospitality, chaque création devient une expérience de dégustation et un objet à collectionner.'}
          href={localizedPath(locale, '/la-maison')}
          lines={[
            isEnglish ? 'DYANE PARIS — HOUSE OF LIQUID ART' : 'DYANE PARIS — MAISON D’ART LIQUIDE',
            isEnglish ? 'ART, NOW DRINKABLE.' : 'DÉSORMAIS, L’ART SE BOIT.',
          ]}
          titleElement="h1"
        />
      </section>

      <FutureImageSlide
        src={HOME_IMAGE_01}
        label={isEnglish ? 'Dyane Paris porcelain cocktail sculpture campaign' : 'Campagne Dyane Paris autour des cocktails en sculptures de porcelaine'}
        caption={isEnglish ? 'THE DYANE UNIVERSE' : 'L’UNIVERS DYANE'}
        cta={isEnglish ? 'DISCOVER' : 'DÉCOUVRIR'}
        href={localizedPath(locale, '/le-journal')}
      />

      <ProductDiptych products={products} locale={locale} />

      <section
        className={`${styles.slide} ${styles.craftSlide}`}
        data-scroll-section
        data-header-foreground="black"
        aria-labelledby="home-craft-title"
      >
        <div className={styles.craftContent}>
          <div className={styles.craftMedia}>
            <video
              ref={craftVideoRef}
              className={styles.craftVideo}
              muted
              loop
              playsInline
              preload="metadata"
              poster={CRAFT_IMAGE}
              aria-label={isEnglish ? 'Dyane Paris craftsmanship film' : 'Film du savoir-faire Dyane Paris'}
            >
              <source src={CRAFT_VIDEO} type="video/mp4" />
            </video>
          </div>
        </div>
        <CampaignCaption
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
