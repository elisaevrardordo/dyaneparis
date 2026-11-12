import { getEditorialPage } from '@/content/editorialPages'
import type { Metadata } from 'next'
import FabricationPage from '@/components/fabrication/FabricationPage'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo'
import { officialSeoImage } from '@/content/officialImages'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { seo } = getEditorialPage('fabrication', locale)

  return buildPageMetadata({
    locale,
    path: '/fabrication',
    title: seo.title,
    description: seo.description,
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
        name: getEditorialPage('fabrication', locale).title,
        description: getEditorialPage('fabrication', locale).seo.description,
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
