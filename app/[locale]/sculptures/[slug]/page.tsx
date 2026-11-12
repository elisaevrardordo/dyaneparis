import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ShopProduct from '@/components/storefront/ShopProduct'
import { sculpturePages } from '@/content/storefront'
import { breadcrumbJsonLd, buildPageMetadata, localizedUrl, serializeJsonLd } from '@/lib/seo'
import { getPublicOffer, workDetails, workIdentity } from '@/lib/productStructuredData'
import { shopMode } from '@/lib/stripe/config'

export function generateStaticParams() { return sculpturePages.map(work => ({ slug: work.href.slice(work.href.lastIndexOf('/') + 1) })) }
function find(slug: string) { return sculpturePages.find(work => work.href === `/sculptures/${slug}`) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const work = find(slug)
  if (!work) return { robots: { index: false, follow: false } }
  return buildPageMetadata({ locale, path: work.href, title: `${work.title} - ${work.subtitle}`, description: locale === 'en' ? `${work.title}, ${work.format}, hand-painted porcelain sculpture. Discover this size and personalisation by initials.` : `${work.title}, ${work.format}, sculpture en porcelaine peinte à la main. Découvrez ce format et la personnalisation par initiales.`, image: { url: work.images[0].src, alt: work.images[0].alt, width: 1080, height: 1350, caption: work.images[0].alt, description: work.images[0].alt } })
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const work = find(slug)
  if (!work) notFound()
  const language = locale === 'en' ? 'en' : 'fr'
  const url = localizedUrl(language, work.href)
  const offer = getPublicOffer(slug, language)
  const schema = { '@context': 'https://schema.org', '@graph': [
    { ...workIdentity(url, offer), url, name: `${work.title} - ${work.subtitle}`, image: work.images.map(image => new URL(image.src, url).href), ...workDetails(offer, language, 'https://www.dyaneparis.com/#organization') },
    breadcrumbJsonLd(language, [{ name: language === 'en' ? 'Home' : 'Accueil', path: '' }, { name: `${work.title} - ${work.subtitle}`, path: work.href }]),
  ] }
  const mode = shopMode()
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /><ShopProduct work={work} locale={language} sandboxCartEnabled={mode === 'sandbox'} liveCartEnabled={mode === 'live'} /></>
}
