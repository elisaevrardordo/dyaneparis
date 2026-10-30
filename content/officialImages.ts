import imageFiles from './officialImageFiles.json' with { type: 'json' }
import cloudinaryImages from './officialCloudinaryImages.json' with { type: 'json' }

export type ImageLocale = 'fr' | 'en'
type Text = Record<ImageLocale, string>

type CuratedImage = {
  id: string
  source: string
  file: string
  page: string
  category: 'collections' | 'maison' | 'fabrication' | 'experiences'
  title: Text
  alt: Text
  caption: Text
}

export type OfficialImageCategory = 'MAISON' | 'COLLECTION' | 'NO1' | 'NO2' | 'COCKTAILS' | 'FABRICATION' | 'SAVOIR_FAIRE' | 'HOSPITALITY' | 'ARTISTES' | 'GIFTING' | 'PRESSE'
export type OfficialImage = Omit<CuratedImage, 'category'> & {
  gallerySection: CuratedImage['category']
  category: OfficialImageCategory
  publicId: string | null
  url: string
  altFr: string
  altEn: string
  product: 'Dyane No.1' | 'Dyane No.2 Basil Smash' | 'Teo for Dyane Paris' | null
  priority: 1 | 2
  width: number
  height: number
}

const t = (fr: string, en: string): Text => ({ fr, en })
const no1 = '/oeuvres/dyane-no1-pornstar-martini'
const no2 = '/oeuvres/dyane-no2-basil-smash'
const teo = '/oeuvres/bouteille-signee-teokaykay'

// Cloudinary URLs below were verified against the current account inventory.
// Local originals without a proven Cloudinary equivalent remain unchanged.
// No Cloudinary asset is renamed or overwritten by this registry.
const curatedImages: CuratedImage[] = [
  {
    id: 'no1-catalogue', category: 'collections', page: no1,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/dyane-paris-sculpture-argent-voile-rouge-portrait.png',
    file: 'collections/dyane-no1-pornstar-martini-flacon-porcelaine.png',
    title: t('Dyane No.1 — la collection', 'Dyane No.1 — the collection'),
    alt: t('Flacon en porcelaine Dyane No.1 pour le cocktail Pornstar Martini', 'Dyane No.1 porcelain vessel for the Pornstar Martini cocktail'),
    caption: t('Dyane No.1, une interprétation du Pornstar Martini dans un flacon sculptural.', 'Dyane No.1, an interpretation of the Pornstar Martini in a sculptural vessel.'),
  },
  {
    id: 'no2-catalogue', category: 'collections', page: no2,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365385/dyane-paris-sculpture-argent-voile-vert-portrait.png',
    file: 'collections/dyane-no2-basil-smash-flacon-porcelaine.png',
    title: t('Dyane No.2 — la collection', 'Dyane No.2 — the collection'),
    alt: t('Flacon en porcelaine Dyane No.2 pour le cocktail Basil Smash', 'Dyane No.2 porcelain vessel for the Basil Smash cocktail'),
    caption: t('Dyane No.2, l’expression Basil Smash de la Maison d’Art Liquide.', 'Dyane No.2, the Basil Smash expression of the House of Liquid Art.'),
  },
  {
    id: 'no1', category: 'collections', page: no1,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/dyane-paris-sculpture-porcelaine-voile-rouge-interieur.png',
    file: 'collections/dyane-no1-pornstar-martini-sculpture-porcelaine.png',
    title: t('Dyane No.1 — Pornstar Martini', 'Dyane No.1 — Pornstar Martini'),
    alt: t('Composition de Dyane No.1, sculpture en porcelaine et cocktail Pornstar Martini', 'Dyane No.1 composition, porcelain sculpture and Pornstar Martini cocktail'),
    caption: t('Dyane No.1 réunit le Pornstar Martini et la silhouette sculpturale de la Maison.', 'Dyane No.1 brings together the Pornstar Martini and the House’s sculptural silhouette.'),
  },
  {
    id: 'no1-portrait', category: 'collections', page: no1,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-rouge.png',
    file: 'collections/dyane-no1-pornstar-martini-portrait-officiel.png',
    title: t('Dyane No.1 — portrait', 'Dyane No.1 — portrait'),
    alt: t('Portrait officiel de Dyane No.1, flacon sculptural pour Pornstar Martini', 'Official portrait of Dyane No.1, a sculptural vessel for Pornstar Martini'),
    caption: t('Le flacon de Dyane No.1, conçu pour être servi puis conservé.', 'The Dyane No.1 vessel, designed to be served and then kept.'),
  },
  {
    id: 'no2', category: 'collections', page: no2,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/dyane-paris-sculpture-porcelaine-voile-vert-interieur.png',
    file: 'collections/dyane-no2-basil-smash-sculpture-porcelaine.png',
    title: t('Dyane No.2 — Basil Smash', 'Dyane No.2 — Basil Smash'),
    alt: t('Composition de Dyane No.2, sculpture en porcelaine et cocktail Basil Smash', 'Dyane No.2 composition, porcelain sculpture and Basil Smash cocktail'),
    caption: t('Dyane No.2 accueille le Basil Smash : gin, basilic et yuzu, sureau sauvage et sour maison.', 'Dyane No.2 holds the Basil Smash: gin, basil and yuzu, wild elderflower and house-made sour.'),
  },
  {
    id: 'no2-portrait', category: 'collections', page: no2,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-vert.png',
    file: 'collections/dyane-no2-basil-smash-portrait-officiel.png',
    title: t('Dyane No.2 — portrait', 'Dyane No.2 — portrait'),
    alt: t('Portrait officiel de Dyane No.2, flacon sculptural pour Basil Smash', 'Official portrait of Dyane No.2, a sculptural vessel for Basil Smash'),
    caption: t('Une création de la Maison d’Art Liquide, à déguster puis à collectionner.', 'A creation by the House of Liquid Art, to taste and then collect.'),
  },
  {
    id: 'teo', category: 'collections', page: teo,
    source: '/dyane-teo.webp', file: 'collections/dyane-paris-teo-kaykay-sculpture-porcelaine.webp',
    title: t('Teo for Dyane Paris', 'Teo for Dyane Paris'),
    alt: t('Sculpture en porcelaine Teo for Dyane Paris peinte à la main', 'Hand-painted Teo for Dyane Paris porcelain sculpture'),
    caption: t('Teo KayKay signe une édition artistique de la sculpture Dyane Paris.', 'Teo KayKay creates an artistic edition of the Dyane Paris sculpture.'),
  },
  {
    id: 'no2-service', category: 'collections', page: no2,
    source: '/journal/dyane-paris-moscow-mule.webp',
    file: 'collections/dyane-no2-basil-smash-sculpture-verre-degustation.webp',
    title: t('Dyane No.2 — la dégustation', 'Dyane No.2 — the tasting'),
    alt: t('Dyane No.2 au drapé vert avec un verre de dégustation', 'Dyane No.2 with green drapery and a tasting glass'),
    caption: t('La sculpture de Dyane No.2, aujourd’hui associée au Basil Smash, accompagne le rituel de dégustation.', 'The Dyane No.2 sculpture, now associated with the Basil Smash, accompanies the tasting ritual.'),
  },
  {
    id: 'teo-detail', category: 'collections', page: teo,
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
    file: 'collections/dyane-paris-teo-kaykay-detail-edition-artistique.jpg',
    title: t('Teo for Dyane — le geste de l’artiste', 'Teo for Dyane — the artist at work'),
    alt: t('Teo KayKay peignant une sculpture de l’édition Teo for Dyane Paris', 'Teo KayKay painting a sculpture from the Teo for Dyane Paris edition'),
    caption: t('Teo KayKay intervient à la main sur la silhouette de Dyane.', 'Teo KayKay works by hand on the Dyane silhouette.'),
  },
  {
    id: 'maison', category: 'maison', page: '/la-maison',
    source: '/editorial/la-maison/STATUE%202.png', file: 'maison/dyane-paris-maison-art-liquide-portrait-sculpture.png',
    title: t('Dyane Paris — Maison d’Art Liquide', 'Dyane Paris — House of Liquid Art'),
    alt: t('Portrait sculptural dans l’univers de la Maison Dyane Paris', 'Sculptural portrait in the world of the Dyane Paris House'),
    caption: t('La sculpture est au cœur du langage visuel de la Maison d’Art Liquide.', 'Sculpture is at the heart of the House of Liquid Art’s visual language.'),
  },
  {
    id: 'maison-art', category: 'maison', page: '/la-maison',
    source: '/editorial/la-maison/ART%201.png', file: 'maison/dyane-paris-recherche-artistique-silhouette.png',
    title: t('La silhouette et l’art', 'The silhouette and art'),
    alt: t('Recherche artistique autour de la silhouette Dyane Paris', 'Artistic study around the Dyane Paris silhouette'),
    caption: t('La recherche artistique qui accompagne l’identité sculpturale de Dyane.', 'The artistic research accompanying Dyane’s sculptural identity.'),
  },
  {
    id: 'maison-sculpture', category: 'maison', page: '/la-maison',
    source: '/editorial/la-maison/STATUE%201.png', file: 'maison/dyane-paris-sculpture-lumiere-naturelle.png',
    title: t('La sculpture et la lumière', 'Sculpture and light'),
    alt: t('Étude sculpturale dans la lumière, univers de Dyane Paris', 'Sculptural study in light, the world of Dyane Paris'),
    caption: t('Volumes et lumière composent l’univers de la Maison.', 'Volumes and light shape the world of the House.'),
  },
  {
    id: 'maison-service', category: 'maison', page: '/la-maison',
    source: '/editorial/la-maison/COCKTAIL%201%20.png', file: 'maison/dyane-paris-cocktail-service-art-liquide.png',
    title: t('L’Art Liquide au service', 'Liquid Art, served'),
    alt: t('Cocktail doré dans l’univers de service Dyane Paris', 'Golden cocktail in the Dyane Paris serving universe'),
    caption: t('Le cocktail prolonge l’expérience de la sculpture.', 'The cocktail extends the experience of the sculpture.'),
  },
  {
    id: 'fabrication', category: 'fabrication', page: '/fabrication',
    source: '/editorial/fabrication/DESSIN.png', file: 'fabrication/dyane-paris-dessin-sculpture-porcelaine.png',
    title: t('Le dessin de la sculpture', 'Drawing the sculpture'),
    alt: t('Dessin préparatoire de la sculpture en porcelaine Dyane Paris', 'Preparatory drawing for the Dyane Paris porcelain sculpture'),
    caption: t('Le dessin précède le modelage et la mise en forme de la sculpture.', 'Drawing precedes modelling and shaping the sculpture.'),
  },
  {
    id: 'porcelaine', category: 'fabrication', page: '/fabrication',
    source: '/editorial/fabrication/PORCELAINE%202.png', file: 'fabrication/dyane-paris-preparation-porcelaine.png',
    title: t('La matière porcelaine', 'The porcelain material'),
    alt: t('Préparation de la porcelaine dans le récit de fabrication Dyane Paris', 'Porcelain preparation in the Dyane Paris making story'),
    caption: t('La matière donne corps à la silhouette imaginée par la Maison.', 'The material gives body to the silhouette imagined by the House.'),
  },
  {
    id: 'peinture', category: 'fabrication', page: '/fabrication',
    source: '/editorial/fabrication/PEINTURE%202.png', file: 'fabrication/dyane-paris-peinture-main-drape-porcelaine.png',
    title: t('La peinture à la main', 'Hand painting'),
    alt: t('Peinture manuelle du drapé de la sculpture en porcelaine Dyane', 'Hand painting the drape of the Dyane porcelain sculpture'),
    caption: t('Les finitions peintes à la main participent à la présence de chaque œuvre.', 'Hand-painted finishes contribute to the presence of each work.'),
  },
  {
    id: 'ingredients', category: 'fabrication', page: '/fabrication',
    source: '/editorial/fabrication/INGREDIENTS.png', file: 'fabrication/dyane-paris-ingredients-cocktails-framboises.png',
    title: t('La matière du cocktail', 'The material of the cocktail'),
    alt: t('Framboises dans le récit des ingrédients des cocktails Dyane Paris', 'Raspberries in the story of Dyane Paris cocktail ingredients'),
    caption: t('Le fruit, les plantes et les équilibres aromatiques nourrissent la composition liquide.', 'Fruit, plants and aromatic balance inform the liquid composition.'),
  },
  {
    id: 'experiences', category: 'experiences', page: '/experiences',
    source: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg',
    file: 'hospitality/dyane-paris-cocktail-experience-sur-mesure.jpg',
    title: t('Les expériences Dyane Paris', 'Dyane Paris experiences'),
    alt: t('Création Dyane Paris présentée lors d’une expérience sur mesure', 'Dyane Paris creation presented during a bespoke experience'),
    caption: t('Un univers de dégustation et de présentation imaginé par la Maison.', 'A world of tasting and presentation imagined by the House.'),
  },
  {
    id: 'bar', category: 'experiences', page: '/experiences',
    source: '/editorial/experiences/BAR%201.png', file: 'hospitality/dyane-paris-sculpture-cocktail-bar.png',
    title: t('La sculpture au bar', 'The sculpture at the bar'),
    alt: t('Sculpture et cocktail Dyane Paris présentés au bar', 'Dyane Paris sculpture and cocktail presented at the bar'),
    caption: t('La présence de l’objet et la précision du service se répondent.', 'The presence of the object and precision of service meet.'),
  },
  {
    id: 'evenement', category: 'experiences', page: '/experiences',
    source: '/editorial/experiences/EVENT.png', file: 'hospitality/dyane-paris-experience-evenement-paris.png',
    title: t('Une expérience à Paris', 'An experience in Paris'),
    alt: t('Expérience Dyane Paris avec la Tour Eiffel en arrière-plan', 'Dyane Paris experience with the Eiffel Tower in the background'),
    caption: t('La dégustation entre en dialogue avec le lieu qui l’accueille.', 'The tasting experience enters into dialogue with its setting.'),
  },
  {
    id: 'personnalisation', category: 'experiences', page: '/experiences',
    source: '/editorial/experiences/PERSO%202.png', file: 'gifting/dyane-paris-personnalisation-sculpture-cadeau.png',
    title: t('La personnalisation', 'Personalisation'),
    alt: t('Peinture personnalisée sur une sculpture Dyane Paris', 'Personalised painting on a Dyane Paris sculpture'),
    caption: t('Un projet de personnalisation se construit avec la Conciergerie, selon les possibilités de réalisation.', 'A personalisation project is developed with the Concierge, subject to what can be made.'),
  },
  {
    id: 'collaboration', category: 'experiences', page: '/experiences',
    source: '/editorial/experiences/ART%201.png', file: 'collaborations/dyane-paris-dessin-personnalisation-artistique.png',
    title: t('Le projet artistique', 'The artistic project'),
    alt: t('Dessin d’une personnalisation artistique Dyane Paris', 'Drawing for a Dyane Paris artistic personalisation'),
    caption: t('Le dessin permet de préparer une nouvelle expression de la silhouette Dyane.', 'Drawing prepares a new expression of the Dyane silhouette.'),
  },
  {
    id: 'cadeau', category: 'experiences', page: '/experiences',
    source: '/editorial/experiences/BAR%205.png', file: 'gifting/dyane-paris-attention-personnalisee-cadeau.png',
    title: t('Une attention de la Maison', 'An attention from the House'),
    alt: t('Attention personnalisée dans l’univers Dyane Paris', 'Personalised attention in the world of Dyane Paris'),
    caption: t('Offrir une création Dyane, c’est réunir dégustation, objet et souvenir.', 'Giving a Dyane creation brings together a tasting experience, an object and a memory.'),
  },
  {
    id: 'maison-campagne', category: 'maison', page: '/',
    source: cloudinaryImages['maison-campagne'].url, file: '',
    title: t('L’univers Dyane Paris', 'The world of Dyane Paris'),
    alt: t('Campagne Dyane Paris en noir et blanc, Maison d’Art Liquide', 'Black-and-white Dyane Paris campaign, House of Liquid Art'),
    caption: t('Le regard de la Maison sur la sculpture et le cocktail.', 'The House’s perspective on sculpture and cocktails.'),
  },
  {
    id: 'collection-duo', category: 'collections', page: '/oeuvres',
    source: cloudinaryImages['collection-duo'].url, file: '',
    title: t('La collection Dyane Paris', 'The Dyane Paris collection'),
    alt: t('Sculptures Dyane Paris aux drapés rouge et vert', 'Dyane Paris sculptures with red and green drapery'),
    caption: t('Deux expressions de la silhouette en porcelaine de la Maison.', 'Two expressions of the House’s porcelain silhouette.'),
  },
  {
    id: 'hospitality-service', category: 'experiences', page: '/le-journal/cocktail-minibar-hotel',
    source: cloudinaryImages['hospitality-service'].url, file: '',
    title: t('L’art du service', 'The art of service'),
    alt: t('Service d’un cocktail dans l’univers de l’hospitalité Dyane Paris', 'Cocktail service in the Dyane Paris hospitality universe'),
    caption: t('La dégustation trouve sa place dans les lieux d’hospitalité.', 'The tasting experience finds its place in hospitality settings.'),
  },
  {
    id: 'hospitality-restaurant', category: 'experiences', page: '/le-journal/pornstar-martini',
    source: cloudinaryImages['hospitality-restaurant'].url, file: '',
    title: t('Le cocktail et le rituel', 'The cocktail and the ritual'),
    alt: t('Cocktail servi dans le récit du Pornstar Martini de Dyane Paris', 'A served cocktail in the Dyane Paris Pornstar Martini story'),
    caption: t('Le verre et le geste prolongent la création liquide.', 'The glass and the gesture extend the liquid creation.'),
  },
  {
    id: 'fabrication-modelage', category: 'fabrication', page: '/fabrication',
    source: cloudinaryImages['fabrication-modelage'].url, file: '',
    title: t('Le geste du modelage', 'The modelling gesture'),
    alt: t('Modelage à la main de la sculpture Dyane Paris', 'Hand modelling the Dyane Paris sculpture'),
    caption: t('Le travail de la matière fait naître la silhouette de la Maison.', 'Working the material brings the House’s silhouette to life.'),
  },
  {
    id: 'teo-corpus', category: 'collections', page: teo,
    source: cloudinaryImages['teo-corpus'].url, file: '',
    title: t('L’édition Teo for Dyane Paris', 'The Teo for Dyane Paris edition'),
    alt: t('Création de l’édition artistique Teo for Dyane Paris', 'A creation from the Teo for Dyane Paris artistic edition'),
    caption: t('Une autre expression de la sculpture à travers la collaboration artistique.', 'Another expression of the sculpture through artistic collaboration.'),
  },
]

const entityCategory = (image: CuratedImage): OfficialImageCategory => {
  if (image.id.endsWith('-catalogue') || image.id === 'collection-duo') return 'COLLECTION'
  if (image.id.startsWith('no1')) return 'NO1'
  if (image.id.startsWith('no2')) return 'NO2'
  if (image.id.startsWith('teo') || image.id === 'collaboration') return 'ARTISTES'
  if (image.id === 'personnalisation' || image.id === 'cadeau') return 'GIFTING'
  if (image.id === 'ingredients' || image.id === 'maison-service') return 'COCKTAILS'
  if (image.id === 'maison-art') return 'SAVOIR_FAIRE'
  return image.category === 'maison' ? 'MAISON' : image.category === 'fabrication' ? 'FABRICATION' : 'HOSPITALITY'
}

export const officialImages: OfficialImage[] = curatedImages.map((image) => {
  const remote = (cloudinaryImages as Record<string, { publicId: string; url: string; width: number; height: number }>)[image.id]
  const size = remote ?? imageFiles[image.id as keyof typeof imageFiles]
  return {
    ...image,
    gallerySection: image.category,
    category: entityCategory(image),
    publicId: remote?.publicId ?? null,
    url: remote?.url ?? `/images/officielles/${image.file}`,
    altFr: image.alt.fr, altEn: image.alt.en,
    product: image.id.startsWith('no1') ? 'Dyane No.1' : image.id.startsWith('no2') ? 'Dyane No.2 Basil Smash' : image.id.startsWith('teo') ? 'Teo for Dyane Paris' : null,
    priority: ['no1', 'no2', 'teo', 'maison-campagne', 'fabrication-modelage', 'hospitality-service', 'no1-catalogue', 'personnalisation'].includes(image.id) ? 1 : 2,
    width: size.width, height: size.height,
  }
})

// Kept as a compatibility name: a verified Cloudinary URL is preferred to a local alias.
export const officialImagePath = (image: OfficialImage) => image.url

export function officialImage(id: string) {
  const image = officialImages.find((item) => item.id === id)
  if (!image) throw new Error(`Unknown official image: ${id}`)
  return image
}

export function officialImageUrl(source: string) {
  const image = officialImages.find((item) => item.source === source)
  return image ? officialImagePath(image) : source
}

export function officialEditorialMedia<T extends { src?: string; alt?: string; poster?: string }>(media: T, locale: string): T {
  const image = officialImages.find((item) => item.source === media.src)
  return {
    ...media,
    ...(image ? { src: officialImagePath(image), alt: image.alt[locale === 'en' ? 'en' : 'fr'] } : {}),
    ...(media.poster ? { poster: officialImageUrl(media.poster) } : {}),
  }
}

export function officialSeoImage(id: string, locale: string = 'fr') {
  const image = officialImage(id)
  const language = locale === 'en' ? 'en' : 'fr'
  return {
    url: officialImagePath(image),
    width: image.width, height: image.height,
    alt: image.alt[language],
    caption: image.title[language],
    description: image.caption[language],
  }
}
