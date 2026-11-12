import Image from 'next/image'
import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import { featuredPrice, featuredWorks } from '@/content/storefront'
import { localizedPath } from '@/i18n/paths'
import { formatPrice } from '@/lib/formatPrice'
import styles from './ProductRecommendations.module.css'

export default function ProductRecommendations({ locale, currentSku }: {
  locale: 'fr' | 'en'
  currentSku: string | undefined
}) {
  const english = locale === 'en'
  const works = featuredWorks.filter(work => (work.sku ?? work.enquirySku) !== currentSku)

  return (
    <section className={`${styles.section} ${cartFontVariables}`} aria-labelledby="product-recommendations-title">
      <h2 className={styles.heading} id="product-recommendations-title">
        {english ? 'Explore other creations' : 'Explorez d’autres pistes'}
      </h2>
      <ul className={styles.grid}>
        {works.map(work => {
          const photo = work.images[0]
          const amount = featuredPrice(work)
          const format = english ? work.format?.replace(',', '.') : work.format

          return (
            <li key={work.id}>
              <Link className={styles.card} href={localizedPath(locale, work.href)}>
                <span className={styles.photo}>
                  <Image src={photo.src} alt="" fill sizes="(max-width: 768px) 50vw, 245px" style={{ objectPosition: photo.position }} />
                </span>
                <span className={styles.name}>{work.title}{format && ` · ${format}`}</span>
                <span className={styles.price}>
                  {amount === null ? (english ? 'On request' : 'Sur demande') : formatPrice(amount, locale)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
