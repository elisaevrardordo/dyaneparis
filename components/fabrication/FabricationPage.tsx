import Link from 'next/link'
import DyaneEditorialPage, { type DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { localizedPath } from '@/i18n/paths'

export const FABRICATION_VIDEO_URL = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788697399/VIDEO_FABRICATION_d7nezn.mp4'

const galleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: '/editorial/fabrication/DESSIN.png', alt: 'Dessin préparatoire de la sculpture Dyane Paris' },
    { src: '/editorial/fabrication/PORCELAINE%202.png', alt: 'Préparation de la porcelaine Dyane Paris' },
    { src: '/editorial/fabrication/PEINTURE.png', alt: 'Silhouette Dyane révélée par la lumière' },
  ],
  gallery2: [
    { src: '/editorial/fabrication/PORCELAINE.png', alt: 'Modelage du visage de la sculpture Dyane' },
    { src: '/editorial/fabrication/PEINTURE%202.png', alt: 'Peinture manuelle du drapé Dyane' },
  ],
  gallery6: [
    { src: '/editorial/fabrication/PORCELAINE%203.mp4', alt: 'Préparation de la matière en atelier', type: 'video' },
    { src: '/editorial/fabrication/PORCELAINE%206.png', alt: 'Outils de sculpture sur porcelaine' },
    { src: '/editorial/fabrication/PORCELAINE%204.mp4', alt: 'Coulage de la porcelaine Dyane', type: 'video' },
    { src: '/editorial/fabrication/PEINTURE%203.png', alt: 'Pigment rouge de la sculpture Dyane' },
    { src: '/editorial/fabrication/PORCELAINE%205.mp4', alt: 'Gestes de précision sur la porcelaine', type: 'video' },
    { src: '/editorial/fabrication/PORCELAINE%208.png', alt: 'Atelier et outils des artisans Dyane' },
  ],
  gallery8: [
    { src: '/editorial/fabrication/INGREDIENTS.png', alt: 'Framboises sélectionnées pour une composition Dyane' },
    { src: '/editorial/fabrication/INGREDIENTS%202.mp4', alt: 'Sélection des ingrédients au cœur des cultures', type: 'video' },
    { src: '/editorial/fabrication/PEINTURE%202%20.png', alt: 'Pinceaux de finition de la Maison Dyane' },
    { src: '/editorial/fabrication/INGREDIENTS%205.mp4', alt: 'Lavande choisie pour ses qualités aromatiques', type: 'video' },
    { src: '/editorial/fabrication/PORCELAINE%207.png', alt: 'Outils de modelage dans l’atelier Dyane' },
    { src: '/editorial/fabrication/PRODUCTION%201.mp4', alt: 'Contrôle d’une composition liquide Dyane', type: 'video' },
    { src: '/editorial/fabrication/PRODUCTION%202%20.png', alt: 'Fûts de la production française Dyane' },
    { src: '/editorial/fabrication/PRODUCTION%203.mp4', alt: 'Élaboration du liquide Dyane', type: 'video' },
  ],
}

type SectionCopy = { title: string; body: string }

type Copy = {
  definition: string
  opening: [string, string, string]
  statueIntro: string
  liquidIntro: string
  transition: string
  sections: Record<string, SectionCopy>
  meeting: [string, string]
  signature: string
  cta: string
}

const copies: Record<'fr' | 'en', Copy> = {
  fr: {
    definition: 'Les flacons Dyane Paris naissent d’une silhouette sculptée puis transposée en porcelaine. Dessin, modelage, cuisson et finitions façonnent un objet destiné à recevoir un cocktail élaboré en France. La fabrication réunit ainsi sculpture, métiers d’art et mixologie dans une même œuvre à servir, déguster puis conserver.',
    opening: [
      'Une œuvre Dyane naît de la rencontre de deux savoir-faire.',
      'Celui de la matière, façonnée jusqu’à devenir sculpture.',
      'Celui du liquide, composé jusqu’à devenir émotion.',
    ],
    statueIntro: 'Avant de contenir un cocktail, Dyane est une sculpture. Une silhouette dessinée, façonnée et travaillée jusqu’à ce que la porcelaine devienne œuvre.',
    liquidIntro: 'À l’intérieur de chaque sculpture, une composition est imaginée avec la même exigence. Fruits, plantes, épices, acidité, texture et alcool sont travaillés comme les éléments d’une palette.',
    transition: 'Deux savoir-faire. Une seule œuvre.',
    sections: {
      drawing: { title: 'LE DESSIN', body: 'Tout commence par une silhouette. Des proportions, un mouvement, une attitude. La forme Dyane est pensée comme une sculpture avant d’être pensée comme un flacon.' },
      sculpture: { title: 'LA SCULPTURE', body: 'La matière donne corps au dessin. Les volumes apparaissent progressivement : le visage, le drapé, la posture et chaque détail qui composent la silhouette de Dyane.' },
      porcelain: { title: 'LA PORCELAINE', body: 'La sculpture devient porcelaine. Une matière choisie pour sa blancheur, sa finesse et sa capacité à révéler les détails de la forme.' },
      fire: { title: 'LE FEU', body: 'La cuisson fixe la matière et révèle définitivement la sculpture.' },
      hand: { title: 'LA MAIN', body: 'Chaque finition transforme une pièce technique en objet d’art. Les détails sont travaillés avec précision pour conserver la force du dessin original.' },
      work: { title: 'L’ŒUVRE', body: 'Après les dernières vérifications, la sculpture est prête à accueillir sa seconde matière : le liquide.' },
      selection: { title: 'LA SÉLECTION', body: 'Tout commence par la matière première. Chaque ingrédient est choisi pour ce qu’il apporte à l’équilibre final : une tension, une fraîcheur, une profondeur, un parfum.' },
      extraction: { title: 'L’EXTRACTION', body: 'Infusions, jus, purées et notes aromatiques permettent de révéler différentes expressions d’un même ingrédient et de construire progressivement la profondeur du cocktail.' },
      assembly: { title: 'L’ASSEMBLAGE', body: 'Les différentes matières sont ensuite assemblées jusqu’à atteindre l’équilibre recherché. La recette se construit dans le dialogue entre puissance, fraîcheur, texture et longueur.' },
      composition: { title: 'LA COMPOSITION', body: 'La recette se révèle comme une composition : chaque note conserve sa présence tout en participant à un ensemble précis.' },
      precision: { title: 'LA PRÉCISION', body: 'Une recette n’est retenue que lorsque chaque composant trouve sa juste place. L’équilibre final est contrôlé avant la mise en œuvre de la production.' },
    },
    meeting: ['Le liquide rejoint finalement la sculpture.', 'L’objet devient alors ce pour quoi il a été imaginé : une œuvre à regarder, à servir et à déguster.'],
    signature: 'DÉSORMAIS, L’ART SE BOIT.',
    cta: 'DÉCOUVRIR LES ŒUVRES',
  },
  en: {
    definition: 'Dyane Paris vessels begin as a sculpted silhouette before being translated into porcelain. Drawing, modelling, firing and finishing shape an object designed to hold a cocktail crafted in France. The making process brings together sculpture, fine craft and mixology in one work to serve, taste and then keep.',
    opening: [
      'A Dyane work is born from the meeting of two forms of savoir-faire.',
      'Matter, shaped until it becomes sculpture.',
      'Liquid, composed until it becomes emotion.',
    ],
    statueIntro: 'Before it holds a cocktail, Dyane is a sculpture. A silhouette drawn, shaped and refined until porcelain becomes a work of art.',
    liquidIntro: 'Within each sculpture, a composition is imagined with the same exacting care. Fruit, plants, spices, acidity, texture and spirit are worked like the elements of a palette.',
    transition: 'Two forms of savoir-faire. One work of art.',
    sections: {
      drawing: { title: 'THE DRAWING', body: 'Everything begins with a silhouette. Proportions, movement, attitude. The Dyane form is conceived as a sculpture before it is conceived as a vessel.' },
      sculpture: { title: 'THE SCULPTURE', body: 'Matter gives body to the drawing. Its volumes gradually appear: the face, the drape, the posture and every detail composing the Dyane silhouette.' },
      porcelain: { title: 'THE PORCELAIN', body: 'The sculpture becomes porcelain. A material chosen for its whiteness, delicacy and ability to reveal every detail of the form.' },
      fire: { title: 'THE FIRE', body: 'Firing fixes the material and finally reveals the sculpture.' },
      hand: { title: 'THE HAND', body: 'Each finishing gesture transforms a technical piece into an art object. Details are worked with precision to preserve the strength of the original drawing.' },
      work: { title: 'THE WORK', body: 'After its final checks, the sculpture is ready to receive its second material: the liquid.' },
      selection: { title: 'THE SELECTION', body: 'Everything begins with raw material. Each ingredient is chosen for what it brings to the final balance: tension, freshness, depth or fragrance.' },
      extraction: { title: 'THE EXTRACTION', body: 'Infusions, juices, purées and aromatic notes reveal different expressions of a single ingredient and gradually build the cocktail’s depth.' },
      assembly: { title: 'THE BLENDING', body: 'The different elements are then brought together until the desired balance is reached. The recipe emerges through a dialogue of strength, freshness, texture and length.' },
      composition: { title: 'THE COMPOSITION', body: 'The recipe is revealed as a composition: each note keeps its presence while contributing to a precise whole.' },
      precision: { title: 'THE PRECISION', body: 'A recipe is retained only when every component finds its rightful place. The final balance is checked before production begins.' },
    },
    meeting: ['The liquid finally joins the sculpture.', 'The object becomes what it was imagined to be: a work to behold, serve and taste.'],
    signature: 'ART, NOW DRINKABLE.',
    cta: 'DISCOVER THE WORKS',
  },
}

function MiniSection({ index, copy }: { index: string; copy: SectionCopy }) {
  return (
    <section data-mini-section>
      <span data-mini-index>{index}</span>
      <h3>{copy.title}</h3>
      <p>{copy.body}</p>
    </section>
  )
}

export default function FabricationPage({ locale }: { locale: string }) {
  const language: 'fr' | 'en' = locale === 'en' ? 'en' : 'fr'
  const c = copies[language]
  const isFrench = language === 'fr'

  return (
    <DyaneEditorialPage
      eyebrow={isFrench ? 'FABRICATION' : 'THE MAKING'}
      title={isFrench ? 'LE SAVOIR-FAIRE DYANE' : 'DYANE SAVOIR-FAIRE'}
      video={{
        src: FABRICATION_VIDEO_URL,
        label: isFrench ? 'Film de la fabrication Dyane Paris' : 'The making of Dyane Paris',
      }}
      textBlocks={[
        {
          eyebrow: isFrench ? 'FABRICATION' : 'THE MAKING',
          title: isFrench ? 'DE LA SCULPTURE AU FLACON DE PORCELAINE' : 'FROM SCULPTURE TO PORCELAIN VESSEL',
          body: (
            <>
              <p>{c.definition}</p>
              {c.opening.map((line) => <p key={line}>{line}</p>)}
            </>
          ),
        },
        {
          eyebrow: isFrench ? 'I · LA MATIÈRE PREND FORME' : 'I · MATTER TAKES FORM',
          title: isFrench ? 'LA STATUE' : 'THE SCULPTURE',
          body: (
            <>
              <p>{c.statueIntro}</p>
              <MiniSection index="01" copy={c.sections.drawing} />
              <MiniSection index="02" copy={c.sections.sculpture} />
            </>
          ),
        },
        {
          body: (
            <>
              <MiniSection index="03" copy={c.sections.porcelain} />
              <MiniSection index="04" copy={c.sections.fire} />
              <MiniSection index="05" copy={c.sections.hand} />
              <MiniSection index="06" copy={c.sections.work} />
            </>
          ),
        },
        {
          eyebrow: `II · ${c.transition}`,
          title: isFrench ? 'LE LIQUIDE' : 'THE LIQUID',
          body: (
            <>
              <p>{c.liquidIntro}</p>
              <MiniSection index="07" copy={c.sections.selection} />
              <MiniSection index="08" copy={c.sections.extraction} />
              <MiniSection index="09" copy={c.sections.assembly} />
              <MiniSection index="10" copy={c.sections.composition} />
              <MiniSection index="11" copy={c.sections.precision} />
            </>
          ),
        },
        {
          eyebrow: 'DYANE PARIS',
          title: isFrench ? 'LA RENCONTRE' : 'THE MEETING',
          body: (
            <>
              {c.meeting.map((line) => <p key={line}>{line}</p>)}
              <p>{c.signature}</p>
              <Link href={localizedPath(locale, '/oeuvres')}>{c.cta}</Link>
              {' · '}
              <Link href={localizedPath(locale, '/distillation')}>{isFrench ? 'DÉCOUVRIR LA MIXOLOGIE DYANE' : 'DISCOVER DYANE MIXOLOGY'}</Link>
              {' · '}
              <Link href={localizedPath(locale, '/le-journal/art-de-la-porcelaine')}>{isFrench ? 'LIRE : L’ART DE LA PORCELAINE' : 'READ: THE ART OF PORCELAIN'}</Link>
            </>
          ),
        },
      ]}
      gallery3={galleries.gallery3}
      gallery2={galleries.gallery2}
      gallery6={galleries.gallery6}
      gallery8={galleries.gallery8}
    />
  )
}
