import Link from 'next/link'
import Image from 'next/image'
import { giftingPages, type GiftingSlug } from '@/content/gifting'
import { officialImage, officialImagePath, officialSeoImage } from '@/content/officialImages'
import imageFiles from '@/content/officialImageFiles.json'
import { localizedPath } from '@/i18n/paths'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo'
import DiscoveryLinks from './DiscoveryLinks'
import styles from './Discovery.module.css'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'

export async function giftingMetadata(slug: GiftingSlug, params: Promise<{ locale: string }>) {
  const { locale } = await params
  const page = giftingPages[slug]
  const copy = page[locale === 'en' ? 'en' : 'fr']
  return buildPageMetadata({ locale, path: `/${slug}`, title: copy.title, description: copy.description, image: officialSeoImage(page.image, locale) })
}

export default async function GiftingPage({ slug, params }: { slug: GiftingSlug; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const page = giftingPages[slug]
  const copy = page[language]
  const image = officialImage(page.image)
  const size = imageFiles[page.image as keyof typeof imageFiles]
  const url = localizedUrl(locale, `/${slug}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: copy.title, description: copy.description,
        inLanguage: language, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORGANIZATION_ID },
        primaryImageOfPage: imageObject(officialSeoImage(page.image, locale), true) },
      breadcrumbJsonLd(locale, [
        { name: language === 'en' ? 'Home' : 'Accueil', path: '' },
        { name: copy.title, path: `/${slug}` },
      ]),
    ],
  }
  const links = [
    ['/oeuvres/dyane-no1-pornstar-martini', 'Dyane No.1 — Pornstar Martini'],
    ['/oeuvres/dyane-no2-basil-smash', 'Dyane No.2 — Basil Smash'],
    ['/la-maison', language === 'en' ? 'The Maison' : 'La Maison'],
    ['/fabrication', language === 'en' ? 'The making' : 'La fabrication'],
    ['/experiences', language === 'en' ? 'Experiences' : 'Expériences'],
    ['/galerie', language === 'en' ? 'Official gallery' : 'Galerie officielle'],
  ]
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <header className={styles.heading}>
        <EditorialEmblem />
        <p className={styles.eyebrow} data-editorial-label>{copy.eyebrow}</p>
        <h1>{copy.heading}</h1>
      </header>
      <Image className={styles.leadImage} src={officialImagePath(image)} alt={image.alt[language]} width={size.width} height={size.height} sizes="(max-width: 700px) 100vw, 1200px" priority />
      <div className={styles.intro}><EditorialEmblem /><p>{copy.intro}</p></div>
      <article className={styles.article}>
        {copy.sections.map((section) => <section key={section.title}>
          <EditorialEmblem />
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
        <Link className={styles.cta} href={localizedPath(locale, '/contact')}>{copy.concierge}</Link>
      </article>
      <nav className={styles.related} aria-label={language === 'en' ? 'Discover the House and its works' : 'Découvrir la Maison et ses œuvres'}>
        {links.map(([href, label]) => <Link key={href} href={localizedPath(locale, href)}>{label}</Link>)}
      </nav>
      <DiscoveryLinks locale={locale} />
    </main>
  )
}
