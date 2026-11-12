import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { personalizableWorks } from '@/lib/personalization/catalog'
import PersonalizableProduct from '@/components/personalization/PersonalizableProduct'
import { breadcrumbJsonLd, buildPageMetadata, seoImages, serializeJsonLd } from '@/lib/seo'
import { shopMode } from '@/lib/stripe/config'

export function generateStaticParams() { return ['fr', 'en'].flatMap(locale => personalizableWorks.filter(p => p.personalization.enabled).map(p => ({ locale, sku: p.sku }))) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; sku: string }> }): Promise<Metadata> {
  const { locale, sku } = await params
  const product = personalizableWorks.find(p => p.sku === (sku === 'dyane-no2' ? 'dyane-no2-150cl' : sku) && p.personalization.enabled)
  if (!product) return { robots: { index: false, follow: false } }
  return buildPageMetadata({ locale, path: `/personnalisables/${sku}`, title: `${product.name}, ${product.format}`, description: locale === 'en' ? `Personalise your ${product.format} Dyane porcelain sculpture with up to three initials in the finish of your choice. Explore the available finishes.` : `Personnalisez votre sculpture en porcelaine Dyane ${product.format} avec jusqu’à trois initiales dans la finition de votre choix. Découvrez les finitions proposées.`, image: { ...seoImages.pornstarMartini, url: product.personalization.preview.image, alt: `${product.name}, ${product.format}` } })
}
export default async function Page({ params }: { params: Promise<{ locale: string; sku: string }> }) {
  const { locale, sku } = await params
  const product = personalizableWorks.find(p => p.sku === (sku === 'dyane-no2' ? 'dyane-no2-150cl' : sku) && p.personalization.enabled)
  if (!product) notFound()
  if (sku === 'dyane-no2') redirect(`${locale === 'en' ? '/en' : ''}/personnalisables/dyane-no2-150cl`)
  const language = locale === 'en' ? 'en' : 'fr'
  const mode = shopMode()
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', ...breadcrumbJsonLd(language, [{ name: language === 'en' ? 'Home' : 'Accueil', path: '' }, { name: language === 'en' ? 'The Personalisables' : 'Les Personnalisables', path: '/personnalisables' }, { name: `${product.name}, ${product.format}`, path: `/personnalisables/${sku}` }]) }) }} /><PersonalizableProduct product={product} locale={language} sandboxCartEnabled={mode === 'sandbox'} liveCartEnabled={mode === 'live'} /></>
}
