'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import CampaignCaption from './CampaignCaption'
import styles from './Home.module.css'
import { cloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'

type Products = ReturnType<typeof getHomeContent>['products']
type Product = Products[number]

function ProductCard({ product, locale, priority }: { product: Product; locale: string; priority: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playPreview = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) return
    video.currentTime = 0
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }

  const stopPreview = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
    setIsPlaying(false)
  }

  const togglePreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail > 0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (isPlaying) stopPreview()
    else playPreview()
  }

  return (
    <article className={styles.productPanel}>
      <button
        className={`${styles.productMedia}${isPlaying ? ` ${styles.productMediaActive}` : ''}`}
        type="button"
        onClick={togglePreview}
        onMouseEnter={playPreview}
        onMouseLeave={stopPreview}
        aria-label={isPlaying
          ? `${product.title} — ${locale === 'en' ? 'show product image' : 'afficher la photo du produit'}`
          : `${product.title} — ${locale === 'en' ? 'play film' : 'lancer le film'}`}
        aria-pressed={isPlaying}
      >
        <Image
          className={styles.productImage}
          src={product.src}
          alt={product.alt}
          fill
          quality={85}
          priority={priority}
          sizes="(max-width: 700px) calc(100vw - 40px), 40vw"
        />
        <video
          ref={videoRef}
          className={styles.productVideo}
          muted
          loop
          playsInline
          preload="none"
          poster={cloudinaryVideoPoster(product.hoverVideo, 900) || product.src}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={cloudinaryVideo(product.hoverVideo, 900)} type="video/mp4" />
        </video>
      </button>
      <Link
        className={styles.productLink}
        href={localizedPath(locale, product.href)}
      >
        <div className={styles.productDetails}>
          <div>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.smallMeta}>{product.subtitle}</p>
          </div>
          <span className={`${styles.cta} ${styles.productCta}`}>{product.cta}</span>
        </div>
      </Link>
    </article>
  )
}

export default function ProductDiptych({ products, locale, priority = false }: { products: Products; locale: string; priority?: boolean }) {
  return (
    <section
      className={styles.productSection}
      data-scroll-section
      data-header-foreground="black"
      aria-label={locale === 'en' ? 'Dyane collections' : 'Collections Dyane'}
    >
      <div className={styles.productInner}>
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <ProductCard product={product} locale={locale} priority={priority && index === 0} key={product.title} />
          ))}
        </div>
        <div className={styles.productStatement}>
          <CampaignCaption
            lines={locale === 'en'
              ? ['EXCEPTIONAL COCKTAILS IN PORCELAIN SCULPTURES']
              : ['COCKTAILS D’EXCEPTION EN SCULPTURES DE PORCELAINE']}
            position="flow"
            singleLine
            titleElement="h2"
            tone="black"
          />
        </div>
      </div>
    </section>
  )
}
