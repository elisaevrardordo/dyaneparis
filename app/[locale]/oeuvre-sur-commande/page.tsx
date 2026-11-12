import type { Metadata } from 'next'
import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import BespokeEnquiry from '@/components/personalization/BespokeEnquiry'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import EditorialImage from '@/components/editorial/EditorialImage'
import { officialSeoImage } from '@/content/officialImages'
import { localizedPath } from '@/i18n/paths'
import { breadcrumbJsonLd, buildPageMetadata, localizedUrl, serializeJsonLd } from '@/lib/seo'
import styles from './Bespoke.module.css'

const openingPhotograph = '/editorial/sur-mesure/dyane-paris-sculpture-hotellerie.webp'
const enquiryPhotograph = '/images/officielles/hospitality/dyane-paris-personnalisation-pieces.webp'
const copy = {
  fr: {
    title: 'Œuvre sur commande',
    description: 'Imaginez une œuvre Dyane Paris avec la Conciergerie : couleurs, détails peints à la main et composition de mixologie. Un service sur mesure, toute l’année.',
    introduction: 'Une personne. Une histoire. Une œuvre à imaginer ensemble.',
    body: 'De la simple inscription à une création artistique singulière, la Maison vous accompagne dans un projet pensé pour vous. Les couleurs, le drapé, les détails peints à la main et la composition de mixologie ouvrent le dialogue.',
    processTitle: 'LE DIALOGUE AVEC LA MAISON',
    process: 'Partagez votre inspiration, votre budget et la date souhaitée. La Conciergerie étudie les possibilités de réalisation avant de vous proposer un projet et un devis personnalisés. Les finitions et les délais sont confirmés au cours de cet échange.',
    contact: 'CONTACTER LA CONCIERGERIE',
    initialsTitle: 'UNE EMPREINTE PERSONNELLE',
    initials: 'Pour une attention plus discrète, découvrez les sculptures personnalisables avec vos initiales, en finition dorée ou noire.',
    collection: 'DÉCOUVRIR LES PERSONNALISABLES',
    christmasTitle: 'VOTRE CADEAU DE NOËL RÊVÉ',
    christmas: 'À l’approche des fêtes, confiez-nous les couleurs, les détails et les inspirations d’une œuvre imaginée pour quelqu’un.',
    christmasLink: 'IMAGINER MON CADEAU DE NOËL',
    home: 'Accueil',
  },
  en: {
    title: 'Bespoke works',
    description: 'Imagine a Dyane Paris work with the Concierge: colours, hand-painted details and a mixology composition. A bespoke service available throughout the year.',
    introduction: 'A person. A story. A work to imagine together.',
    body: 'From a simple inscription to a singular artistic creation, the House accompanies a project conceived for you. Colours, drapery, hand-painted details and the mixology composition begin the conversation.',
    processTitle: 'A DIALOGUE WITH THE HOUSE',
    process: 'Share your inspiration, budget and preferred date. The Concierge studies what can be made before presenting a personal proposal and quotation. Finishes and timing are confirmed during this conversation.',
    contact: 'CONTACT THE CONCIERGE',
    initialsTitle: 'A PERSONAL IMPRESSION',
    initials: 'For a more discreet gesture, discover the sculptures that can be personalised with your initials, in a gold or black finish.',
    collection: 'DISCOVER THE PERSONALISABLES',
    christmasTitle: 'YOUR DREAM CHRISTMAS GIFT',
    christmas: 'As the festive season approaches, share the colours, details and inspirations for a work imagined for someone.',
    christmasLink: 'IMAGINE MY CHRISTMAS GIFT',
    home: 'Home',
  },
} as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const text = copy[locale === 'en' ? 'en' : 'fr']
  return buildPageMetadata({ locale, path: '/oeuvre-sur-commande', title: text.title,
    description: text.description, image: officialSeoImage('personnalisation', locale === 'en' ? 'en' : 'fr') })
}

export default async function BespokePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const en = locale === 'en'
  const text = copy[en ? 'en' : 'fr']
  const url = localizedUrl(locale, '/oeuvre-sur-commande')
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: text.title, description: text.description,
      inLanguage: en ? 'en' : 'fr', isPartOf: { '@id': 'https://www.dyaneparis.com/#website' } },
    breadcrumbJsonLd(locale, [{ name: text.home, path: '' }, { name: text.title, path: '/oeuvre-sur-commande' }]),
  ] }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <main className={`${styles.page} ${cartFontVariables}`}>
      <section className={styles.opening} data-page-hero data-header-foreground="black" aria-labelledby="bespoke-title">
        <figure className={styles.photograph}>
          <EditorialImage
            src={openingPhotograph}
            alt={en ? 'Dyane porcelain sculpture with a hand-painted landscape' : 'Sculpture Dyane en porcelaine ornée d’un paysage peint à la main'}
            width={1080}
            height={1350}
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </figure>
        <div className={styles.introduction}>
          <EditorialEmblem />
          <p className={styles.eyebrow}>DYANE PARIS</p>
          <h1 id="bespoke-title">{text.title}</h1>
          <p className={styles.lead}>{text.introduction}</p>
          <p>{text.body}</p>
          <a className={styles.button} href="mailto:conciergerie@dyaneparis.com">{text.contact}</a>
        </div>
      </section>
      <section className={styles.process} aria-labelledby="bespoke-process-title">
        <h2 id="bespoke-process-title">{text.processTitle}</h2>
        <p>{text.process}</p>
      </section>
      <div className={styles.enquiry}>
        <figure className={styles.enquiryPhotograph}>
          <EditorialImage
            src={enquiryPhotograph}
            alt={en ? 'A brush painting the trees of a landscape on porcelain' : 'Un pinceau peint les arbres d’un paysage sur la porcelaine'}
            width={1120}
            height={1405}
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 46vw, 570px"
          />
        </figure>
        <BespokeEnquiry locale={en ? 'en' : 'fr'} className={styles.enquiryForm} />
      </div>
      <div className={styles.invitations}>
        <section aria-labelledby="bespoke-initials-title">
          <h2 id="bespoke-initials-title">{text.initialsTitle}</h2>
          <p>{text.initials}</p>
          <Link className={styles.link} href={localizedPath(locale, '/personnalisables')}>{text.collection}</Link>
        </section>
        <section aria-labelledby="bespoke-christmas-title">
          <h2 id="bespoke-christmas-title">{text.christmasTitle}</h2>
          <p>{text.christmas}</p>
          <Link className={styles.link} href={localizedPath(locale, '/votre-cadeau-de-noel-reve')}>{text.christmasLink}</Link>
        </section>
      </div>
    </main>
  </>
}
