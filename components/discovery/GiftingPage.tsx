import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import EditorialPhotoStrip from '@/components/editorial/EditorialPhotoStrip'
import story from '@/components/editorial/EditorialStory.module.css'
import { giftingImages, giftingPages, type GiftingSlug } from '@/content/gifting'
import { officialSeoImage } from '@/content/officialImages'
import { localizedPath } from '@/i18n/paths'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo'
import DiscoveryLinks from './DiscoveryLinks'
import styles from './Discovery.module.css'

export async function giftingMetadata(slug: GiftingSlug, params: Promise<{ locale: string }>) {
  const { locale } = await params
  const page = giftingPages[slug]
  const copy = page[locale === 'en' ? 'en' : 'fr']
  const [primary] = giftingImages(slug)
  const image = { ...officialSeoImage(primary.id, locale), url: primary.url }
  return buildPageMetadata({ locale, path: `/${slug}`, title: copy.title, description: copy.description, image })
}

export default async function GiftingPage({ slug, params }: { slug: GiftingSlug; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const page = giftingPages[slug]
  const copy = page[language]
  const images = giftingImages(slug)
  const [primary] = images
  const image = { ...officialSeoImage(primary.id, locale), url: primary.url }
  const url = localizedUrl(locale, `/${slug}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: copy.title, description: copy.description,
        inLanguage: language, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORGANIZATION_ID },
        primaryImageOfPage: imageObject(image, true) },
      breadcrumbJsonLd(locale, [
        { name: language === 'en' ? 'Home' : 'Accueil', path: '' },
        { name: copy.title, path: `/${slug}` },
      ]),
    ],
  }
  const links = [
    ['/oeuvres/dyane-no1-pornstar-martini', 'Dyane No.1 - Pornstar Martini'],
    ['/oeuvres/dyane-no2-basil-smash', 'Dyane No.2 - Basil Smash'],
    ['/la-maison', language === 'en' ? 'The Maison' : 'La Maison'],
    ['/fabrication', language === 'en' ? 'The making' : 'La fabrication'],
    ['/experiences', language === 'en' ? 'Experiences' : 'Expériences'],
    ['/galerie', language === 'en' ? 'Official gallery' : 'Galerie officielle'],
  ]
  return (
    <main className={`${styles.giftingPage} ${story.story} ${cartFontVariables}`} aria-labelledby="gifting-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <article className={story.copy}>
        <header>
          <span className={styles.giftingEyebrow}>{copy.eyebrow}</span>
          <h1 className={story.title} id="gifting-title">{copy.heading}</h1>
        </header>
        <p>{copy.intro}</p>
        {copy.sections.map((section) => <section key={section.title} className={styles.giftingSection}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
      </article>
      <EditorialPhotoStrip
        label={language === 'en' ? 'Dyane Paris photographs' : 'Photographies Dyane Paris'}
        photos={images.map(({ url: src, alt }) => ({ src, alt: alt[language] }))}
      />
      <Link className={styles.cta} href={localizedPath(locale, '/contact')}>{copy.concierge}</Link>
      <nav className={styles.related} aria-label={language === 'en' ? 'Discover the House and its works' : 'Découvrir la Maison et ses œuvres'}>
        {links.map(([href, label]) => <Link key={href} href={localizedPath(locale, href)}>{label}</Link>)}
      </nav>
      <DiscoveryLinks locale={locale} />
    </main>
  )
}
