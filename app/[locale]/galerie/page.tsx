import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import styles from '@/components/discovery/Discovery.module.css'
import { galleryImages, gallerySeoImage } from '@/content/galleryImages'
import { localizedPath } from '@/i18n/paths'
import { imageRightsFor } from '@/lib/imageRights'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale, path: '/galerie',
    title: locale === 'en' ? 'Official gallery — sculptures, cocktails and savoir-faire' : 'Galerie officielle — sculptures, cocktails et savoir-faire',
    description: locale === 'en'
      ? 'Official Dyane Paris images: No.1 Pornstar Martini, No.2 Basil Smash, Teo for Dyane, porcelain craftsmanship and bespoke experiences.'
      : 'Images officielles Dyane Paris : No.1 Pornstar Martini, No.2 Basil Smash, Teo for Dyane, savoir-faire de la porcelaine et expériences sur mesure.',
    image: gallerySeoImage(galleryImages[0], locale),
  })
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const url = localizedUrl(locale, '/galerie')
  const categories = {
    collections: language === 'en' ? 'The works' : 'Les œuvres',
    maison: language === 'en' ? 'The House of Liquid Art' : 'La Maison d’Art Liquide',
    fabrication: language === 'en' ? 'The making' : 'Les savoir-faire',
    experiences: language === 'en' ? 'Experiences and personalisation' : 'Expériences et personnalisation',
  }
  const images = galleryImages.map((image) => ({
    ...imageObject(gallerySeoImage(image, language)),
    caption: image.caption[language],
    inLanguage: language,
    isPartOf: { '@id': `${url}#gallery` },
    about: { '@id': ORGANIZATION_ID },
  }))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery', '@id': `${url}#gallery`, url,
        name: language === 'en' ? 'Dyane Paris official gallery' : 'Galerie officielle Dyane Paris',
        inLanguage: language, about: { '@id': ORGANIZATION_ID }, isPartOf: { '@id': WEBSITE_ID },
        primaryImageOfPage: { '@id': images[0]['@id'] },
        image: images.map((image) => ({ '@id': image['@id'] })),
      },
      ...images,
      breadcrumbJsonLd(locale, [
        { name: language === 'en' ? 'Home' : 'Accueil', path: '' },
        { name: language === 'en' ? 'Official gallery' : 'Galerie officielle', path: '/galerie' },
      ]),
    ],
  }
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <header className={styles.heading}>
        <EditorialEmblem />
        <p className={styles.eyebrow} data-editorial-label>DYANE PARIS</p>
        <h1>{language === 'en' ? 'Official gallery' : 'Galerie officielle'}</h1>
      </header>
      <div className={styles.intro}><p>{language === 'en'
        ? 'The works, gestures and settings of the House of Liquid Art. This official selection brings together porcelain sculptures, ready-to-serve cocktails and images from the world of Dyane Paris. For press requests and image usage, please contact the Concierge.'
        : 'Les œuvres, les gestes et les lieux de la Maison d’Art Liquide. Cette sélection officielle réunit sculptures en porcelaine, cocktails prêts à servir et images de l’univers Dyane Paris. Pour les demandes presse et les conditions d’utilisation des visuels, contactez la Conciergerie.'}
      </p></div>
      <div className={styles.gallery}>
        {Object.entries(categories).map(([category, title]) => <section className={styles.gallerySection} key={category} aria-labelledby={`gallery-${category}`}>
          <EditorialEmblem />
          <h2 id={`gallery-${category}`}>{title}</h2>
          <div className={styles.galleryGrid}>
            {galleryImages.filter((image) => image.gallerySection === category).map((image) => {
              return <figure key={image.id}>
                <a className={styles.imageFrame} href={image.url} aria-label={language === 'en' ? `View original: ${image.title.en}` : `Voir l’original : ${image.title.fr}`}>
                  <Image src={image.url} alt={image.alt[language]} fill sizes="(max-width: 700px) 100vw, 33vw" />
                </a>
                <figcaption>
                  <h3>{image.title[language].replace(/[–—]/g, '-').toLocaleUpperCase(language)}</h3>
                  <p>{image.caption[language]}</p>
                  {imageRightsFor(image.url)?.status === 'CONFIRMED_DYANE' ? <p>© Dyane Paris</p> : null}
                  <Link href={localizedPath(locale, image.page)}>{language === 'en' ? 'Explore the work and its story' : 'Découvrir l’œuvre et son histoire'}</Link>
                </figcaption>
              </figure>
            })}
          </div>
        </section>)}
      </div>
      <DiscoveryLinks locale={locale} includePress />
    </main>
  )
}
