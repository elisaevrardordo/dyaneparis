import Image from 'next/image'
import Link from 'next/link'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import styles from './Home.module.css'

type Products = ReturnType<typeof getHomeContent>['products']

export default function ProductDiptych({ products, locale }: { products: Products; locale: string }) {
  return (
    <section className={styles.diptych} aria-label={locale === 'en' ? 'Dyane collections' : 'Collections Dyane'}>
      {products.map((product) => (
        <article className={styles.productPanel} key={product.title} data-header-theme={product.theme}>
          <Image
            className={styles.mediaImage}
            src={product.src}
            alt={product.alt}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            style={{ objectPosition: product.objectPosition }}
          />
          <Link className={styles.productLink} href={localizedPath(locale, product.href)}>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.smallMeta}>{product.subtitle}</p>
            <span className={styles.cta}>{product.cta}</span>
          </Link>
        </article>
      ))}
    </section>
  )
}
