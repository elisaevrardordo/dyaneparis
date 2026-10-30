import type { Metadata } from 'next'
import FabricationPage from '@/components/fabrication/FabricationPage'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo'
import { officialSeoImage } from '@/content/officialImages'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'

  return buildPageMetadata({
    locale,
    path: '/fabrication',
    title: isEnglish ? 'The Making | Dyane Paris' : 'La Fabrication | Dyane Paris',
    description: isEnglish
      ? 'Discover how Dyane Paris works are made, from the creation of the porcelain sculpture to the composition of its cocktails.'
      : 'Découvrez la fabrication des œuvres Dyane Paris, de la création de la sculpture en porcelaine à l’élaboration de ses cocktails.',
    image: officialSeoImage('fabrication', locale),
    absoluteTitle: true,
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const url = localizedUrl(locale, '/fabrication')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: locale === 'en' ? 'The Making — Dyane Paris' : 'La Fabrication — Dyane Paris',
        inLanguage: locale, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORGANIZATION_ID },
        primaryImageOfPage: imageObject(officialSeoImage('fabrication', locale), true) },
      breadcrumbJsonLd(locale, [
        { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
        { name: locale === 'en' ? 'The making' : 'La fabrication', path: '/fabrication' },
      ]),
    ],
  }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    <FabricationPage locale={locale} />
    <DiscoveryLinks locale={locale} />
  </>
}
