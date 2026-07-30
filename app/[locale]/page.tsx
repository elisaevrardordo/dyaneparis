import ArtisticCustomizationSection from '@/components/home/ArtisticCustomizationSection'
import EditorialDiptych from '@/components/home/EditorialDiptych'
import EditorialVideoSection from '@/components/home/EditorialVideoSection'
import HomeHeroVideo from '@/components/home/HomeHeroVideo'
import LatestPresencesSection from '@/components/home/LatestPresencesSection'
import ProductDiptych from '@/components/home/ProductDiptych'
import styles from '@/components/home/Home.module.css'
import { getHomeContent } from '@/content/home'
import { imageObject, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const content = getHomeContent(locale)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${localizedUrl(locale)}/#webpage`,
    url: localizedUrl(locale),
    name: locale === 'en'
      ? 'Dyane Paris — French Maison of Liquid Art'
      : "Dyane Paris — Maison française d'Art Liquide",
    description: locale === 'en'
      ? 'French ready-to-drink cocktails presented in hand-painted porcelain sculptures.'
      : 'Cocktails français prêts à déguster présentés dans des sculptures en porcelaine peintes à la main.',
    isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
    about: { '@id': 'https://www.dyaneparis.com/#organization' },
    primaryImageOfPage: imageObject(seoImages.home, true),
    inLanguage: locale,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className={styles.home}>
        <HomeHeroVideo hero={content.hero} locale={locale} />
        <ProductDiptych products={content.products} locale={locale} />
        <ArtisticCustomizationSection content={content.customization} locale={locale} />
        <LatestPresencesSection content={content.presences} locale={locale} />
        <EditorialDiptych images={content.editorial} />
        <EditorialVideoSection film={content.film} />
      </main>
    </>
  )
}
