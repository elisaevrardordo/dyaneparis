import type { DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { maisonMedia, maisonGalleries, fabricationFilm, fabricationGalleries } from './editorialMedia'
import { officialEditorialMedia } from './officialImages'
import { editorialMediaDescription } from './editorialMediaCopy'
import { cloudinaryVideo } from '@/lib/cloudinary'

export type EditorialPageSlug = 'la-maison' | 'fabrication' | 'experiences'
type Locale = 'fr' | 'en'
type Text = Record<Locale, string>
export type EditorialLink = { href: string; label: string; variant?: 'button' }
export type EditorialChapter = {
  id: string; title: string; eyebrow?: string; text: string; media: DyaneEditorialMedia[]
  layout: 'sequence' | 'quiet' | 'diptych' | 'gallery' | 'feature'; links?: EditorialLink[]
}
export type EditorialPageContent = {
  slug: EditorialPageSlug; eyebrow: string; title: string; introduction?: string
  hero?: DyaneEditorialMedia; chapters: EditorialChapter[]
  prelude?: EditorialChapter
  closing?: { title: string; text: string | string[]; eyebrow?: string; media?: DyaneEditorialMedia[] }
  links: EditorialLink[]
  seo: { title: string; description: string }
}
const t = (fr: string, en: string): Text => ({ fr, en })
const pick = (value: Text, locale: Locale) => value[locale]
const experiencesTitle = t('Une œuvre à votre image', 'A work in your image')

export function experiencesHeroImage(locale: string) {
  const language = locale === 'en' ? 'en' : 'fr'
  return {
    url: '/images/officielles/hospitality/dyane-paris-haute-mixologie-sur-mesure.webp',
    width: 1080,
    height: 1350,
    alt: pick(t('Une coupe de cocktail, une assiette et la sculpture Dyane au drapé rouge', 'A cocktail coupe, a plated dish and the red-draped Dyane sculpture'), language),
    caption: pick(t('HAUTE MIXOLOGIE SUR-MESURE', 'BESPOKE HAUTE MIXOLOGY'), language),
    description: pick(t('Un accord mets et cocktail présenté avec une sculpture en porcelaine Dyane Paris.', 'A food and cocktail pairing presented with a Dyane Paris porcelain sculpture.'), language),
  }
}

const resolve = (items: DyaneEditorialMedia[], locale: Locale) => items.map(item => {
  const media = officialEditorialMedia(item, locale)
  return { ...media, alt: editorialMediaDescription(item.alt, locale, media.alt) }
})

export function getEditorialPage(slug: EditorialPageSlug, locale: string): EditorialPageContent {
  const language: Locale = locale === 'en' ? 'en' : 'fr'
  const text = (fr: string, en: string) => pick(t(fr, en), language)
  const link = (href: string, fr: string, en: string) => ({ href, label: text(fr, en) })
  const chapter = (id: string, title: Text, body: Text, media: DyaneEditorialMedia[], layout: EditorialChapter['layout'], eyebrow?: Text, links?: EditorialLink[]): EditorialChapter => ({
    id, title: pick(title, language), text: pick(body, language), media: resolve(media, language), layout,
    ...(eyebrow ? { eyebrow: pick(eyebrow, language) } : {}), ...(links ? { links } : {}),
  })

  if (slug === 'la-maison') {
    const { gallery3: a, gallery2: b, gallery6: c, gallery8: d } = maisonGalleries
    return {
      slug, eyebrow: text('LA MAISON', 'THE HOUSE'), title: text('Maison d’Art Liquide', 'House of Liquid Art'),
      introduction: text('Dyane Paris est une Maison française d’Art Liquide. Elle réunit des cocktails d’auteur, élaborés en France, et des sculptures en porcelaine peintes à la main. Des créations à déguster, puis à conserver.', 'Dyane Paris is a French House of Liquid Art. It brings together signature cocktails crafted in France and hand-painted porcelain sculptures. Creations to taste, then keep.'),
      hero: resolve([a[1]], language)[0],
      chapters: [
        chapter('intuition', t('Une intuition', 'An intuition'),
          t('Née à Paris en 2025, Dyane Paris porte une intuition : réunir l’art et le cocktail dans une même création. La forme, la couleur et les arômes participent à une expérience pensée dans son ensemble.', 'Born in Paris in 2025, Dyane Paris follows an intuition: to unite art and cocktails in a single creation. Form, colour and aroma contribute to an experience conceived as a whole.'),
          [a[0], c[4], c[2], c[1], d[0], d[6]], 'sequence'),
        chapter('nom', t('Le nom, Dyane', 'The name, Dyane'),
          t('Le nom Dyane s’inspire de Diane, figure mythologique libre et indépendante. La Maison en retient une idée de la création : suivre une intuition, affirmer une présence et rechercher la justesse.', 'The name Dyane draws on Diana, a free and independent mythological figure. For the House, she suggests an approach to creation: following an intuition, asserting a presence and seeking the right balance.'),
          [b[0]], 'quiet'),
        chapter('silhouette', t('La silhouette Dyane', 'The Dyane silhouette'),
          t('Inspirée librement de la Vénus de Milo, la silhouette Dyane se reconnaît à son visage et à son drapé. La porcelaine donne à cette figure classique une expression contemporaine.', 'Freely inspired by the Venus de Milo, the Dyane silhouette is recognised by its face and drapery. Porcelain gives this classical figure a contemporary expression.'),
          [{ type: 'video', src: cloudinaryVideo(maisonMedia.film, 1600), poster: maisonMedia.filmPoster, alt: text('Film de l’histoire et du savoir-faire Dyane Paris', 'A film of the Dyane Paris story and craftsmanship') }, c[3], d[2], d[5]], 'diptych'),
        chapter('demeure', t('L’œuvre demeure', 'The work remains'),
          t('Après la dégustation, la sculpture conserve sa place. Exposée dans un intérieur ou réunie à d’autres créations, elle prolonge la rencontre entre l’art et le cocktail.', 'After tasting, the sculpture retains its place. Displayed in an interior or brought together with other creations, it extends the encounter between art and cocktails.'),
          [a[2], b[1], c[0], c[5], d[1], d[3], d[4], d[7]], 'gallery'),
      ],
      links: [link('/oeuvres', 'Découvrir les créations', 'Discover the creations'), link('/fabrication', 'Les savoir-faire de la Maison', 'The craftsmanship of the House')],
      seo: {
        title: text('La Maison d’Art Liquide | Dyane Paris', 'The House of Liquid Art | Dyane Paris'),
        description: text('Découvrez Dyane Paris, Maison française d’Art Liquide, où cocktails d’auteur et sculptures en porcelaine peinte à la main composent une même création.', 'Discover Dyane Paris, a French House of Liquid Art, where signature cocktails and hand-painted porcelain sculptures come together in a single creation.'),
      },
    }
  }

  if (slug === 'fabrication') {
    const { gallery3: a, gallery2: b, gallery6: c, gallery8: d } = fabricationGalleries
    return {
      slug, eyebrow: text('LES SAVOIR-FAIRE', 'THE CRAFTSMANSHIP'), title: text('De la matière à l’œuvre', 'From material to work of art'),
      introduction: text('Du dessin de la silhouette à la composition du cocktail, Dyane Paris fait dialoguer deux savoir-faire : le travail de la porcelaine, peinte à la main, et l’élaboration de recettes en France.', 'From drawing the silhouette to composing the cocktail, Dyane Paris brings two forms of craftsmanship into dialogue: hand-painted porcelain and recipes developed in France.'),
      hero: { type: 'video', ...fabricationFilm, alt: text('Film de la fabrication Dyane Paris', 'The making of Dyane Paris') },
      chapters: [
        chapter('dessin', t('Le dessin', 'The drawing'),
          t('Un visage, un drapé, une ligne d’épaule. Le dessin établit les proportions de la silhouette et prépare son passage au volume. Chaque détail participe à la présence de la sculpture.', 'A face, a drape, a shoulder line. Drawing establishes the proportions of the silhouette and prepares its passage into volume. Every detail contributes to the presence of the sculpture.'),
          [c[1], b[0], c[4]], 'sequence'),
        chapter('porcelaine', t('La porcelaine', 'The porcelain'),
          t('La silhouette prend corps dans la porcelaine. Le travail de la matière, les cuissons et les finitions révèlent ses reliefs, sa blancheur et la manière dont elle reçoit la lumière.', 'The silhouette takes shape in porcelain. Working the material, firing and finishing reveal its relief, its whiteness and the way it receives light.'),
          [a[0], c[0], c[2], c[5]], 'gallery'),
        chapter('peinture', t('La peinture à la main', 'Painting by hand'),
          t('La couleur est appliquée à la main. Elle suit le drapé, souligne un volume et donne à la pièce son expression. Le pinceau inscrit le geste dans la surface de la porcelaine.', 'Colour is applied by hand. It follows the drapery, highlights a volume and gives the piece its expression. The brush leaves the gesture in the surface of the porcelain.'),
          [b[1], c[3], d[2]], 'sequence'),
        chapter('cocktail', t('La composition du cocktail', 'Composing the cocktail'),
          t('Élaborés en France, les cocktails Dyane Paris se construisent par la sélection des ingrédients et la recherche d’un équilibre aromatique. Fruits, plantes et épices composent une recette prête à servir, dont chaque note trouve sa place.', 'Crafted in France, Dyane Paris cocktails begin with selecting ingredients and seeking aromatic balance. Fruit, plants and spices form a ready-to-serve recipe in which every note finds its place.'),
          [d[0], d[1], d[3], d[4], d[5], d[6], d[7], d[8]], 'gallery', undefined,
          [link('/distillation', 'La mixologie selon Dyane Paris', 'Mixology according to Dyane Paris')]),
      ],
      closing: {
        title: text('La rencontre', 'The encounter'),
        text: text('La sculpture accueille le cocktail. L’œuvre est complète.', 'The sculpture receives the cocktail. The work is complete.'),
        media: [{
          src: '/editorial/fabrication/dyane-paris-atelier-fabrication-francaise.webp',
          alt: text('Sculpture Dyane Paris sur son support dans un atelier de porcelaine', 'Dyane Paris sculpture on a stand in a porcelain workshop'),
        }],
      },
      links: [link('/oeuvres', 'Découvrir les créations', 'Discover the creations')],
      seo: {
        title: text('Porcelaine et cocktails : les savoir-faire | Dyane Paris', 'Porcelain and cocktails: the craftsmanship | Dyane Paris'),
        description: text('Du dessin de la sculpture à la composition du cocktail, découvrez les matières et les gestes qui donnent forme aux créations de Dyane Paris.', 'From drawing the sculpture to composing the cocktail, discover the materials and gestures that shape Dyane Paris creations.'),
      },
    }
  }

  const openingImage = experiencesHeroImage(language)
  return {
    slug, eyebrow: text('SUR MESURE', 'BESPOKE'), title: pick(experiencesTitle, language),
    prelude: chapter('creation', experiencesTitle,
      t('Dyane Paris imagine des créations sur mesure, pensées pour refléter l’identité et l’univers de chaque Maison. De la composition du cocktail à la personnalisation de la sculpture, chaque collaboration donne naissance à une œuvre singulière, à la rencontre de l’art, de la mixologie et du savoir-faire artisanal. Car le véritable luxe réside dans ce qui ne se crée que pour soi.',
        'Dyane Paris imagines bespoke creations designed to reflect the identity and world of each House. From composing the cocktail to personalising the sculpture, each collaboration gives rise to a singular work at the meeting point of art, mixology and craftsmanship. Because true luxury lies in what is created for you alone.'),
      [
        {
          src: openingImage.url,
          alt: openingImage.alt,
          caption: openingImage.caption,
          href: '#haute-mixologie',
        },
        {
          src: '/images/officielles/hospitality/dyane-paris-personnalisation-pieces.webp',
          alt: text('Un pinceau peint un paysage aux arbres verts', 'A brush paints a landscape with green trees'),
          caption: text('PERSONNALISATION DES PIÈCES', 'BESPOKE SCULPTURES'),
          href: '#personnalisation-des-pieces',
        },
      ], 'feature', t('SUR MESURE', 'BESPOKE'),
      [link('/oeuvre-sur-commande', 'Découvrir les œuvres sur commande', 'Discover commissioned works')]),
    chapters: [],
    closing: {
      eyebrow: text('LA CONCIERGERIE', 'THE CONCIERGE'),
      title: text('IMAGINONS VOTRE PROJET', 'LET’S IMAGINE YOUR PROJECT'),
      text: [
        text("Dyane Paris imagine des cocktails sur mesure et des sculptures en porcelaine personnalisées, à la rencontre de la haute mixologie, de l'art contemporain et du savoir-faire artisanal français.", 'Dyane Paris creates bespoke cocktails and personalised porcelain sculptures at the intersection of haute mixology, contemporary art and French craftsmanship.'),
        text("De la création de recettes exclusives à la personnalisation de pièces peintes à la main, notre Maison d'Art Liquide accompagne les hôtels de luxe, restaurants, Maisons de prestige et particuliers dans la réalisation de projets singuliers.", 'From developing exclusive recipes to personalising hand-painted pieces, our House of Liquid Art works with luxury hotels, restaurants, prestigious Houses and private clients to bring distinctive projects to life.'),
        text("Chaque collaboration donne naissance à une création unique, pensée pour incarner votre identité, sublimer l'art de recevoir et offrir une expérience de dégustation inoubliable.", 'Each collaboration gives rise to a unique creation that embodies your identity, elevates the art of hosting and offers a memorable tasting experience.'),
        text('Car le véritable luxe réside dans ce qui ne se crée que pour vous.', 'Because true luxury lies in what is created for you alone.'),
      ],
    },
    links: [{ ...link('/contact', 'DÉCOUVRIR LE SUR-MESURE', 'EXPLORE BESPOKE CREATIONS'), variant: 'button' }],
    seo: {
      title: text('Cocktails pour hôtels et réceptions | Dyane Paris', 'Cocktails for hotels and receptions | Dyane Paris'),
      description: text('Pour les hôtels et les réceptions privées, Dyane Paris réunit cocktails d’auteur, sculptures en porcelaine et créations sur mesure.', 'For hotels and private receptions, Dyane Paris brings together signature cocktails, porcelain sculptures and bespoke creations.'),
    },
  }
}
