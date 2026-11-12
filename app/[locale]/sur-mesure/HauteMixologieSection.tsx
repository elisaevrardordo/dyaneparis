import EditorialImage from '@/components/editorial/EditorialImage'
import BespokeDetail from './BespokeDetail'
import styles from './BespokeDetail.module.css'

const mediaPath = '/editorial/sur-mesure'
const photos = [
  { file: 'dyane-paris-infusion-noble.webp', fr: 'Feuilles et bulles dans une infusion dorée', en: 'Leaves and bubbles in a golden infusion' },
  { file: 'dyane-paris-distillerie-cuivre.webp', fr: 'Détail d’une cuve en cuivre à la distillerie', en: 'Detail of a copper vessel at the distillery' },
  { file: 'dyane-paris-infusion-distillerie.webp', fr: 'Ingrédients en infusion dans un liquide ambré', en: 'Ingredients infusing in an amber liquid' },
] as const

const copy = {
  fr: {
    title: 'HAUTE MIXOLOGIE',
    subtitle: "L'art de créer l'inimitable.",
    introduction: "Chez Dyane Paris, chaque création peut devenir une œuvre singulière. De la recherche des accords à l'élaboration d'une recette exclusive, la Maison imagine des cocktails sur mesure, façonnés autour de l'identité, des envies et de l'univers de ses partenaires.",
    statement: 'Parce que le véritable luxe ne se reproduit pas. Il se compose.',
    collaboration: 'DYANE PARIS et MICHEL ROTH',
    collaborationSubtitle: "Quand la haute gastronomie rencontre l'art liquide.",
    projectOpening: "À l'occasion des World Caviar Awards 2026, Dyane Paris s'associe au chef Michel Roth, Meilleur Ouvrier de France et Bocuse d'Or, pour imaginer",
    projectName: "L'Écume",
    projectEnding: ', un cocktail gastronomique créé pour sublimer la dégustation du caviar.',
    projectClosing: "Une rencontre entre précision culinaire, équilibre aromatique et création contemporaine, illustrant l'ambition de la Maison : faire de chaque cocktail une expérience à part entière.",
    cta: 'IMAGINER UNE CRÉATION SUR MESURE',
    film: 'Film de la collaboration Dyane Paris et Michel Roth',
    macro: 'Gros plan sur le cocktail',
    gallery: 'Les matières de la haute mixologie',
  },
  en: {
    title: 'HAUTE MIXOLOGY',
    subtitle: 'The art of creating the inimitable.',
    introduction: 'At Dyane Paris, each creation can become a singular work. From finding the right pairings to developing an exclusive recipe, the House creates bespoke cocktails shaped around the identity, wishes and world of its partners.',
    statement: 'True luxury cannot be replicated. It is composed.',
    collaboration: 'DYANE PARIS AND MICHEL ROTH',
    collaborationSubtitle: 'When haute cuisine meets liquid art.',
    projectOpening: 'For the 2026 World Caviar Awards, Dyane Paris joined forces with chef Michel Roth, Meilleur Ouvrier de France and winner of the Bocuse d’Or, to create',
    projectName: 'L’Écume',
    projectEnding: ', a gastronomic cocktail designed to enhance the experience of tasting caviar.',
    projectClosing: 'Culinary precision, aromatic balance and contemporary creation come together to express the ambition of the House: to make every cocktail an experience in its own right.',
    cta: 'IMAGINE A BESPOKE CREATION',
    film: 'Film of the collaboration between Dyane Paris and Michel Roth',
    macro: 'Cocktail close-up',
    gallery: 'The ingredients and materials of haute mixology',
  },
} as const

export default function HauteMixologieSection({ locale }: { locale: string }) {
  const language = locale === 'en' ? 'en' : 'fr'
  const text = copy[language]

  return (
    <BespokeDetail
      id="haute-mixologie"
      locale={locale}
      title={text.title}
      subtitle={text.subtitle}
      cta={text.cta}
      introduction={<><p>{text.introduction}</p><p><strong>{text.statement}</strong></p></>}
      prelude={
        <section aria-labelledby="michel-roth">
          <video className={styles.film} src={`${mediaPath}/dyane-paris-michel-roth-lecume.mp4`} poster={`${mediaPath}/dyane-paris-michel-roth-lecume-poster.webp`} autoPlay muted loop playsInline preload="none" aria-label={text.film} />
          <div className={styles.story}>
            <h2 id="michel-roth">{text.collaboration}</h2>
            <p className={styles.subtitle}>{text.collaborationSubtitle}</p>
            <p>{text.projectOpening} <strong>{text.projectName}</strong>{text.projectEnding}</p>
            <p>{text.projectClosing}</p>
          </div>
        </section>
      }
    >
      <section className={styles.mediaStrip} aria-label={text.gallery}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the gallery on small screens.
        tabIndex={0}
      >
        <video className={styles.macro} src={`${mediaPath}/dyane-paris-cocktail-macro.mp4`} poster={`${mediaPath}/dyane-paris-cocktail-macro-poster.webp`} autoPlay muted loop playsInline preload="none" aria-label={text.macro} />
        {photos.map(photo => (
          <EditorialImage key={photo.file} src={`${mediaPath}/${photo.file}`} alt={photo[language]} width={1080} height={1350} sizes="(max-width: 760px) 42vw, 240px" className={styles.image} />
        ))}
      </section>
    </BespokeDetail>
  )
}
