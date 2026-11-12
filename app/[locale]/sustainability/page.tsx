import type { Metadata } from 'next'
import { Fragment } from 'react'
import EditorialImage from '@/components/editorial/EditorialImage'
import { cartFontVariables } from '@/components/cart/fonts'
import french from '@/content/sustainability.fr.json'
import english from '@/content/sustainability.en.json'
import { buildPageMetadata, breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo'
import { officialSeoImage } from '@/content/officialImages'
import styles from './Sustainability.module.css'

type Section = Pick<typeof french.vision, 'paragraphs'>
type Photo = { file: string; alt: [string, string]; position?: string }
const painting: Photo = { file: 'fabrication/dyane-paris-peinture-main-drape-porcelaine.png', alt: ['Peinture à la main du drapé rouge d’une sculpture Dyane Paris', 'Hand painting the red drapery of a Dyane Paris sculpture'], position: '50% 25%' }
const drawing: Photo = { file: 'fabrication/dyane-paris-dessin-sculpture-porcelaine.png', alt: ['Dessins préparatoires de la sculpture Dyane Paris', 'Preparatory drawings of the Dyane Paris sculpture'] }
const porcelain: Photo = { file: 'fabrication/dyane-paris-preparation-porcelaine.png', alt: ['Préparation de la porcelaine dans l’atelier', 'Preparing porcelain in the workshop'] }
const ingredients: Photo = { file: 'fabrication/dyane-paris-ingredients-cocktails-framboises.png', alt: ['Framboises, visuel des ingrédients de la Maison', 'Raspberries from the House’s ingredient imagery'] }
const sculpture: Photo = { file: 'maison/dyane-paris-sculpture-lumiere-naturelle.png', alt: ['Sculpture Dyane Paris en porcelaine à la lumière naturelle', 'Dyane Paris porcelain sculpture in natural light'] }
const no1: Photo = { file: 'collections/dyane-no1-pornstar-martini-sculpture-porcelaine.png', alt: ['Dyane No.1, détail de la sculpture en porcelaine', 'Dyane No.1 porcelain sculpture'] }
const service: Photo = { file: 'maison/dyane-paris-cocktail-service-art-liquide.png', alt: ['Composition de mixologie de la Maison Dyane Paris', 'A mixology composition from the House of Dyane Paris'], position: '50% 72%' }
const art: Photo = { file: 'collaborations/dyane-paris-dessin-personnalisation-artistique.png', alt: ['Recherche artistique sur la silhouette Dyane Paris', 'Artistic exploration of the Dyane Paris silhouette'] }
const teo: Photo = { file: 'collections/dyane-paris-teo-kaykay-detail-edition-artistique.jpg', alt: ['Détail peint de l’édition artistique Teo for Dyane', 'Painted detail of the Teo for Dyane artistic edition'] }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale, path: '/sustainability',
    title: locale === 'en' ? 'Our commitments' : 'Nos engagements',
    description: locale === 'en'
      ? 'Dyane Paris’s vision: French craftsmanship, local production, precision in mixology and creations designed to last.'
      : 'La vision de Dyane Paris : savoir-faire français, productions de proximité, mixologie de précision et créations pensées pour demeurer.',
    image: officialSeoImage('maison', locale),
  })
}

function Paragraphs({ section }: { section: Section }) {
  return <>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph.emphasis ? <strong>{paragraph.text}</strong> : paragraph.text}</p>)}</>
}

function Gallery({ photos, layout, en, priority = false }: { photos: Photo[]; layout: 'wide' | 'pair' | 'three'; en: boolean; priority?: boolean }) {
  return <div className={`${styles.gallery} ${styles[layout]}`}>
    {photos.map((photo, index) => <figure className={styles.picture} key={photo.file}>
      <EditorialImage src={`/images/officielles/${photo.file}`} alt={photo.alt[en ? 1 : 0]} fill
        sizes={layout === 'wide' ? '(max-width: 760px) calc(100vw - 48px), (max-width: 1650px) 80vw, 1320px' : layout === 'three' ? '(max-width: 760px) calc(100vw - 48px), (max-width: 1650px) 27vw, 440px' : '(max-width: 760px) calc(50vw - 28px), (max-width: 1650px) 40vw, 660px'}
        priority={priority && index === 0} quality={85} style={{ objectPosition: photo.position || '50% 50%' }} />
    </figure>)}
  </div>
}

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const en = locale === 'en'
  const copy = en ? english : french
  const galleries: Array<{ photos: Photo[]; layout: 'wide' | 'pair' }> = [
    { photos: [no1, sculpture], layout: 'pair' },
    { photos: [service], layout: 'wide' },
    { photos: [art, teo], layout: 'pair' },
  ]
  return <main className={`${styles.page} ${cartFontVariables}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(locale, [
      { name: en ? 'Home' : 'Accueil', path: '' },
      { name: en ? 'Our commitments' : 'Nos engagements', path: '/sustainability' },
    ])) }} />
    <header className={styles.opening}><h1>{copy.title}</h1></header>
    <section className={styles.copy} aria-labelledby="commitments-vision">
      <h2 id="commitments-vision">{copy.vision.title}</h2>
      <Paragraphs section={copy.vision} />
    </section>
    <Gallery photos={[painting]} layout="wide" en={en} priority />
    <section className={styles.copy} aria-labelledby="commitments-approach">
      <h2 id="commitments-approach" className={styles.approachTitle}>{copy.approach.title}</h2>
      <span className={styles.subtitle}>{copy.approach.subtitle}</span>
      <Paragraphs section={copy.approach} />
    </section>
    <Gallery photos={[drawing, porcelain, ingredients]} layout="three" en={en} />
    <section className={styles.chapters} aria-labelledby="commitments-pillars">
      <h2 id="commitments-pillars">{copy.pillarsTitle}</h2>
      {copy.pillars.map((pillar, index) => <Fragment key={pillar.title}>
        <section className={styles.chapter} aria-labelledby={`commitment-${index + 1}`}>
          <div className={styles.copy}>
            <h3 id={`commitment-${index + 1}`}>{pillar.title}</h3>
            <Paragraphs section={pillar} />
          </div>
        </section>
        {galleries[index] ? <Gallery {...galleries[index]} en={en} /> : null}
      </Fragment>)}
    </section>
    <section className={`${styles.copy} ${styles.closing}`} aria-labelledby="commitments-rayonnement">
      <h2 id="commitments-rayonnement">{copy.closing.title}</h2>
      <span className={styles.subtitle}>{copy.closing.subtitle}</span>
      <Paragraphs section={copy.closing} />
    </section>
  </main>
}
