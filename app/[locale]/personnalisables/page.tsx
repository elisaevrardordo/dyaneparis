import type { Metadata } from 'next'
import PersonalizableCollection from '@/components/personalization/PersonalizableCollection'
import { cartProducts } from '@/components/cart/catalog'
import { breadcrumbJsonLd, buildPageMetadata, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'
import { shopMode } from '@/lib/stripe/config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({ locale, path: '/personnalisables', title: locale === 'en' ? 'The Personalisables | Dyane Paris' : 'Les Personnalisables | Dyane Paris', description: locale === 'en' ? 'A work to give. A mark to leave. Discover Dyane porcelain sculptures with your initials in gold or black.' : 'Une œuvre à offrir. Une empreinte à laisser. Découvrez les sculptures en porcelaine Dyane personnalisables avec vos initiales, en doré ou en noir.', image: seoImages.pornstarMartini })
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const mode = shopMode()
  const url = localizedUrl(language, '/personnalisables')
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: language === 'en' ? 'The Personalisables' : 'Les Personnalisables', inLanguage: language, mainEntity: { '@type': 'ItemList', itemListElement: cartProducts.filter(p => p.personalization.enabled).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: `${p.name}, ${p.format}`, url: localizedUrl(language, `/personnalisables/${p.sku}`) })) } },
    breadcrumbJsonLd(language, [{ name: language === 'en' ? 'Home' : 'Accueil', path: '' }, { name: language === 'en' ? 'The Personalisables' : 'Les Personnalisables', path: '/personnalisables' }]),
  ] }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} /><PersonalizableCollection locale={language} sandboxCartEnabled={mode === 'sandbox'} liveCartEnabled={mode === 'live'} /></>
}
