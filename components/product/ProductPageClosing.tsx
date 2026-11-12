import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import EditorialPhotoStrip from '@/components/editorial/EditorialPhotoStrip'
import story from '@/components/editorial/EditorialStory.module.css'
import { productEditorial } from '@/content/productEditorial'
import { featuredWorks } from '@/content/storefront'
import { localizedPath } from '@/i18n/paths'
import ProductRecommendations from './ProductRecommendations'
import styles from './ProductPageClosing.module.css'

export default function ProductPageClosing({ locale, currentSku }: {
  locale: 'fr' | 'en'
  currentSku: string | undefined
}) {
  const english = locale === 'en'
  const work = featuredWorks.find(item => (item.sku ?? item.enquirySku) === currentSku)
  const editorial = work && productEditorial[work.collection ?? work.id]
  const commissionHref = localizedPath(locale, '/commission-a-sculpture')

  return (
    <>
      {editorial && (
        <section className={`${story.story} ${cartFontVariables}`} aria-labelledby="product-definition-title">
          <div className={story.copy}>
            <h2 className={story.title} id="product-definition-title">{editorial.title}</h2>
            {editorial.copy[locale].paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <EditorialPhotoStrip
            label={english ? 'Photographs of this work' : 'Photographies de cette œuvre'}
            photos={editorial.photos.map(({ src, alt }) => ({ src, alt: alt[locale] }))}
          />
          <nav className={styles.storyLinks} aria-label={english ? 'Learn more about this work' : 'En savoir plus sur cette œuvre'}>
            <Link href={localizedPath(locale, editorial.articleHref)}>{editorial.copy[locale].articleLabel}</Link>
            <Link href={localizedPath(locale, '/fabrication')}>{english ? 'DISCOVER THE MAKING' : 'DÉCOUVRIR LA FABRICATION'}</Link>
            <Link href={localizedPath(locale, '/distillation')}>{english ? 'EXPLORE DYANE MIXOLOGY' : 'EXPLORER LA MIXOLOGIE DYANE'}</Link>
            <Link href={commissionHref}>{english ? 'COMMISSION A SCULPTURE' : 'COMMANDER UNE SCULPTURE'}</Link>
          </nav>
        </section>
      )}
      <aside className={styles.commissionInvitation} aria-labelledby="sculpture-invitation-title">
        <EditorialEmblem />
        <h2 id="sculpture-invitation-title">{english ? 'A WORK IN YOUR IMAGE' : 'UNE ŒUVRE À VOTRE IMAGE'}</h2>
        <p>{english
          ? 'Discover the individual creations and sculptures commissioned from the House of Dyane Paris.'
          : 'Découvrez les créations particulières et les sculptures réalisées sur commande par la Maison Dyane Paris.'}</p>
        <Link href={commissionHref}>{english ? 'DISCOVER SCULPTURE COMMISSIONS' : 'DÉCOUVRIR LES COMMANDES DE SCULPTURES'}</Link>
      </aside>
      <ProductRecommendations locale={locale} currentSku={currentSku} />
    </>
  )
}
