import StorefrontHome from '@/components/storefront/StorefrontHome'
import { imageObject, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${localizedUrl(locale)}/#webpage`,
    url: localizedUrl(locale),
    name: locale === 'en'
      ? 'Dyane Paris - French Maison of Liquid Art'
      : "Dyane Paris - Maison française d'Art Liquide",
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
      <StorefrontHome locale={locale === 'en' ? 'en' : 'fr'} />
    </>
  )
}
