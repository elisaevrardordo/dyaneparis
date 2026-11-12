'use client'
import { formatPrice } from '@/lib/formatPrice'
import { useState } from 'react'
import Link from 'next/link'
import EditorialImage from '@/components/editorial/EditorialImage'
import { featuredPrice, type FeaturedWork } from '@/content/storefront'
import { localizedPath } from '@/i18n/paths'
import s from './Storefront.module.css'

const cocktailNames = { no1: 'Pornstar Martini', no2: 'Basil Smash' }

export default function LuxuryProductCard({ work, locale }: { work: FeaturedWork; locale: 'fr' | 'en' }) {
  const [index, setIndex] = useState(0)
  const activePhoto = work.images[index]
  const en = locale === 'en'
  const amount = featuredPrice(work)
  const price = amount === null ? (en ? 'On request' : 'Sur demande') : formatPrice(amount, locale)
  const productLabel = `${work.title} - ${work.subtitle}`
  const cocktail = work.collection ? cocktailNames[work.collection] : undefined
  const change = (step: number) => setIndex(previous => (previous + step + work.images.length) % work.images.length)

  return <article className={s.card} data-product-card={work.id}>
    <Link className={s.cardLink} href={localizedPath(locale, work.href)} aria-label={`${productLabel} - ${price}`}>
      {work.images.map((photo, photoIndex) => <EditorialImage key={photo.src} className={s.cardImage} src={photo.src} alt={photoIndex === index ? photo.alt : ''} aria-hidden={photoIndex !== index} fill sizes="(max-width: 350px) 100vw, (max-width: 1050px) 50vw, 25vw" style={{ objectPosition: photo.position, opacity: photoIndex === index ? 1 : 0 }} />)}
      <span className={s.cardLabels} data-tone={activePhoto?.labelTone}>
        <span>{work.badges.includes('personalizable') && (en ? 'Personalisable' : 'Personnalisable')}</span>
        {cocktail && <span className={s.cardCocktail}>{cocktail}</span>}
      </span>
      <span className={s.cardInfo} data-tone={activePhoto?.infoTone}>
        <span>{work.title}</span>
        <span className={s.cardPrice}>{price}</span>
      </span>
    </Link>
    {work.images.length > 1 && <>
      <button type="button" className={`${s.arrow} ${s.previous}`} onClick={() => change(-1)} aria-label={`${en ? 'Previous photo' : 'Photo précédente'} - ${productLabel}`}>
        <svg viewBox="0 0 16 24" aria-hidden="true"><path d="m11 3-8 9 8 9" /></svg>
      </button>
      <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => change(1)} aria-label={`${en ? 'Next photo' : 'Photo suivante'} - ${productLabel}`}>
        <svg viewBox="0 0 16 24" aria-hidden="true"><path d="m5 3 8 9-8 9" /></svg>
      </button>
      <span className={s.srOnly} aria-live="polite" aria-atomic="true">{index + 1} / {work.images.length}</span>
    </>}
  </article>
}
