import type { Metadata } from 'next'
import BespokeGift from '@/components/personalization/BespokeGift'
import { breadcrumbJsonLd, buildPageMetadata, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({ locale, path: '/votre-cadeau-de-noel-reve',
    title: locale === 'en' ? 'Your dream Christmas gift' : 'Votre cadeau de Noël rêvé',
    description: locale === 'en' ? 'Imagine a bespoke Dyane Paris porcelain work: colours, personal details and mixology. Entrust your project to the Concierge, without an immediate purchase.' : 'Imaginez une œuvre Dyane Paris sur mesure : couleurs, détails personnels et mixologie. Confiez votre projet à la Conciergerie, sans achat immédiat.', image: seoImages.maison })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const en = locale === 'en'
  const path = '/votre-cadeau-de-noel-reve'
  const name = en ? 'Your dream Christmas gift' : 'Votre cadeau de Noël rêvé'
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${localizedUrl(locale, path)}#webpage`, url: localizedUrl(locale, path), name, inLanguage: locale },
    breadcrumbJsonLd(locale, [{ name: en ? 'Home' : 'Accueil', path: '' }, { name: en ? 'Personalisable works' : 'Les personnalisables', path: '/personnalisables' }, { name, path }]),
  ] }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} /><BespokeGift locale={en ? 'en' : 'fr'} /></>
}
