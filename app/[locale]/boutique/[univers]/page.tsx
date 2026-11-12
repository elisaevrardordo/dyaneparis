import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import { cartFontVariables } from '@/components/cart/fonts'
import EditorialImage from '@/components/editorial/EditorialImage'
import LuxuryProductCard from '@/components/storefront/LuxuryProductCard'
import styles from '@/components/storefront/Storefront.module.css'
import { sculpturePages, storefront } from '@/content/storefront'
import { buildPageMetadata } from '@/lib/seo'

type BoutiqueProps = {
  params: Promise<{ locale: string; univers: string }>
}

function findPanel(univers: string) {
  return storefront.hero.images.find(photo => photo.href === `/boutique/${univers}`)
}

export function generateStaticParams() {
  return storefront.hero.images.map(({ href }) => ({ univers: href.slice('/boutique/'.length) }))
}

export async function generateMetadata({ params }: BoutiqueProps): Promise<Metadata> {
  const { locale, univers } = await params
  const photo = findPanel(univers)
  if (!photo) notFound()

  const en = locale === 'en'
  const subtitle = en ? photo.subtitleEn : photo.subtitle
  const description = en
    ? `${subtitle} by Dyane Paris. Discover Dyane No.1 and Dyane No.2 in 25 cl and 1.5 L.`
    : `${subtitle} chez Dyane Paris. Découvrez Dyane No.1 et Dyane No.2 en 25 cl et 1,5 L.`
  const alt = en ? photo.boutique.altEn : photo.boutique.alt

  return buildPageMetadata({
    locale,
    path: photo.href,
    title: subtitle,
    description,
    image: { url: photo.boutique.src, alt, caption: subtitle, description },
  })
}

export default async function BoutiquePage({ params }: BoutiqueProps) {
  const { locale, univers } = await params
  const photo = findPanel(univers)
  if (!photo) notFound()

  const en = locale === 'en'

  return (
    <main className={`${styles.boutique} ${cartFontVariables}`}>
      <section className={styles.boutiqueHero} aria-labelledby="boutique-title">
        <div className={styles.boutiqueMedia} data-universe={univers} style={{ '--boutique-image-position': photo.boutique.position } as CSSProperties}>
          <EditorialImage
            src={photo.boutique.src}
            alt={en ? photo.boutique.altEn : photo.boutique.alt}
            fill
            priority
            sizes="(max-width: 768px) calc(100vw - 32px), 65vw"
            className={styles.boutiqueImage}
          />
        </div>
        <header className={styles.boutiqueCopy}>
          <p className={styles.boutiqueLabel}>{en ? 'Shop' : 'Boutique'}</p>
          <h1 className={styles.boutiqueTitle} id="boutique-title">{en ? photo.titleEn : photo.title}</h1>
          <p className={styles.boutiqueSubtitle}>{en ? photo.subtitleEn : photo.subtitle}</p>
        </header>
      </section>
      <section id="boutique-products" className={styles.grid} aria-label={en ? 'Shop the collection' : 'Les œuvres de la boutique'}>
        {sculpturePages.map(work => <LuxuryProductCard key={work.id} work={work} locale={en ? 'en' : 'fr'} />)}
      </section>
    </main>
  )
}
