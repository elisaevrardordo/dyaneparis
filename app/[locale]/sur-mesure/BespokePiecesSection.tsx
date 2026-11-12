import EditorialImage from '@/components/editorial/EditorialImage'
import BespokeDetail from './BespokeDetail'
import styles from './BespokeDetail.module.css'

const mediaPath = '/editorial/sur-mesure'
const photos = [
  { file: 'dyane-paris-peinture-hotel.webp', fr: 'Pinceau sur un décor de porcelaine aux motifs bleus et aux citrons', en: 'Brush on a porcelain design with blue motifs and lemons' },
  { file: 'dyane-paris-artisanat-porcelaine.webp', fr: 'Éponges et outils de modelage dans l’atelier de porcelaine', en: 'Sponges and shaping tools in the porcelain workshop' },
  { file: 'dyane-paris-sculpture-hotellerie.webp', fr: 'Sculpture Dyane ornée d’un paysage peint à la main', en: 'Dyane sculpture decorated with a hand-painted landscape' },
] as const

const image = {
  src: '/images/officielles/hospitality/dyane-paris-personnalisation-pieces.webp',
  width: 1120,
  height: 1405,
}

const copy = {
  fr: {
    title: 'PERSONNALISATION DES PIÈCES',
    subtitle: "L'art de créer une œuvre à votre image.",
    introduction: "Dyane Paris imagine des sculptures en porcelaine peintes à la main, conçues pour incarner l'identité et l'univers de chaque Maison. Au sein de notre cabinet d'artistes parisiens, chaque projet fait l'objet d'une recherche artistique singulière, où les couleurs, les motifs et les finitions deviennent l'expression d'une signature.",
    sections: [
      {
        title: 'UNE SIGNATURE POUR CHAQUE MAISON',
        paragraphs: [
          "Pensées pour l'hôtellerie de prestige, les palaces, les restaurants gastronomiques et les Maisons de luxe, nos créations sur mesure s'inspirent de l'architecture, de l'histoire et des codes esthétiques de chaque établissement.",
          "De la première esquisse aux derniers détails peints à la main, chaque sculpture est imaginée comme une œuvre exclusive, destinée à enrichir l'art de recevoir et à prolonger l'expérience bien au-delà de la dégustation.",
        ],
      },
      {
        title: "L'ART DU DÉTAIL",
        paragraphs: [
          "Chaque création naît d'un dialogue entre nos artistes et les Maisons qui nous confient leur univers. Décors exclusifs, palettes de couleurs, motifs signatures ou collaborations artistiques : la porcelaine devient une toile d'expression où se rencontrent artisanat d'art et création contemporaine.",
          'Une pièce unique, une identité, une histoire à raconter.',
        ],
      },
    ],
    alt: 'Un pinceau peint un paysage aux arbres verts',
    gallery: 'Les gestes de la personnalisation',
    painting: 'Film de peinture personnalisée sur porcelaine',
    film: 'Film de personnalisation Frivole et Dyane Paris',
  },
  en: {
    title: 'BESPOKE SCULPTURES',
    subtitle: 'The art of creating a work that reflects you.',
    introduction: 'Dyane Paris creates hand-painted porcelain sculptures that embody the identity and world of each House. In our Parisian artists’ studio, each project begins with its own artistic exploration, where colours, motifs and finishes come together to express a signature.',
    sections: [
      {
        title: 'A SIGNATURE FOR EVERY HOUSE',
        paragraphs: [
          'Created for luxury hotels, palaces, fine-dining restaurants and luxury houses, our bespoke pieces draw on the architecture, history and aesthetic of each establishment.',
          'From the first sketch to the final hand-painted details, each sculpture is conceived as an exclusive work that enriches the art of hosting and extends the experience long after the tasting.',
        ],
      },
      {
        title: 'THE ART OF DETAIL',
        paragraphs: [
          'Every creation begins with a conversation between our artists and the Houses that share their world with us. Exclusive designs, colour palettes, signature motifs and artistic collaborations make porcelain a canvas where fine craftsmanship meets contemporary art.',
          'A unique piece, an identity, a story to tell.',
        ],
      },
    ],
    alt: 'A brush paints a landscape with green trees',
    gallery: 'The craft behind bespoke sculptures',
    painting: 'Film of bespoke painting on porcelain',
    film: 'Film of the bespoke collaboration between Frivole and Dyane Paris',
  },
} as const

export default function BespokePiecesSection({ locale }: { locale: string }) {
  const language = locale === 'en' ? 'en' : 'fr'
  const text = copy[language]

  return (
    <BespokeDetail
      id="personnalisation-des-pieces"
      locale={locale}
      title={text.title}
      subtitle={text.subtitle}
      image={{ ...image, alt: text.alt }}
      introduction={<p>{text.introduction}</p>}
    >
      <section className={`${styles.mediaStrip} ${styles.paintingStrip}`} aria-label={text.gallery}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the gallery on small screens.
        tabIndex={0}
      >
        <video className={styles.paintingVideo} src={`${mediaPath}/dyane-paris-peinture-personnalisee.mp4`} poster={`${mediaPath}/dyane-paris-peinture-personnalisee-poster.webp`} autoPlay muted loop playsInline preload="none" aria-label={text.painting} />
        {photos.map(photo => (
          <EditorialImage key={photo.file} src={`${mediaPath}/${photo.file}`} alt={photo[language]} width={1080} height={1350} sizes="(max-width: 760px) 48vw, 260px" className={styles.image} />
        ))}
      </section>
      {text.sections.map(section => (
        <section className={styles.story} key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
      <video className={`${styles.film} ${styles.followingFilm}`} src={`${mediaPath}/dyane-paris-personnalisation-frivole.mp4`} poster={`${mediaPath}/dyane-paris-personnalisation-frivole-poster.webp`} autoPlay muted loop playsInline preload="none" aria-label={text.film}>
        <track kind="captions" src={`${mediaPath}/dyane-paris-personnalisation-frivole.en.vtt`} srcLang="en" label="English" />
      </video>
    </BespokeDetail>
  )
}
