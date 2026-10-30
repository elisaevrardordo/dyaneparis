import { officialImage, type OfficialImage } from './officialImages'

type GalleryImage = Pick<OfficialImage, 'id' | 'gallerySection' | 'page' | 'title' | 'alt' | 'caption' | 'width' | 'height' | 'url'>
type GalleryText = GalleryImage['title']

const t = (fr: string, en: string): GalleryText => ({ fr, en })
const no1 = '/oeuvres/dyane-no1-pornstar-martini'
const no2 = '/oeuvres/dyane-no2-basil-smash'

function selectedImage(
  asset: string,
  gallerySection: GalleryImage['gallerySection'],
  page: string,
  title: GalleryText,
  alt: GalleryText,
  caption: GalleryText,
  width = 1080,
  height = 1350,
): GalleryImage {
  return {
    id: asset.replace(/^v\d+\//, '').replace(/\.[^.]+$/, ''),
    url: `https://res.cloudinary.com/dazhkrimv/image/upload/${asset}`,
    gallerySection, page, title, alt, caption, width, height,
  }
}

// Gallery-only selection, in visible order. The shared registry is deliberately
// unchanged: product images, OpenGraph and other editorial pages keep their assets.
export const galleryImages: readonly GalleryImage[] = [
  // 1-11: the works.
  officialImage('no1-catalogue'),
  selectedImage(
    'v1791499963/dyane-paris-collection-sculptures-porcelaine-rouge-verte.png', 'collections', '/oeuvres',
    t('La collection Dyane Paris', 'The Dyane Paris collection'),
    t('Sculptures en porcelaine Dyane Paris aux drapés rouge et vert', 'Dyane Paris porcelain sculptures with red and green drapery'),
    t('Deux expressions de la silhouette en porcelaine de la Maison.', 'Two expressions of the House’s porcelain silhouette.'),
    1440, 1080,
  ),
  selectedImage(
    'v1792596483/dyane-paris-cocktail-signature-rouge.png', 'collections', '/oeuvres',
    t('Le cocktail et la couleur', 'Cocktails and colour'),
    t('Cocktail signature Dyane Paris dans une mise en scène aux tons rouges', 'Dyane Paris signature cocktail in a red-toned setting'),
    t('Un cocktail signature présenté dans une mise en scène de lumière et de couleur.', 'A signature cocktail presented in a setting of light and colour.'),
  ),
  officialImage('no1-portrait'),
  selectedImage(
    'v1792596480/dyane-paris-cocktail-luxe-coupe-pornstar-martini-dyaneno1.png', 'collections', no1,
    t('Dyane No.1 - le Pornstar Martini en coupe', 'Dyane No.1 - Pornstar Martini in a coupe'),
    t('Cocktail Pornstar Martini Dyane No.1 présenté en coupe', 'Dyane No.1 Pornstar Martini cocktail served in a coupe'),
    t('Le Pornstar Martini de Dyane No.1 se découvre dans le rituel de dégustation.', 'The Dyane No.1 Pornstar Martini unfolds through the tasting ritual.'),
  ),
  officialImage('no2-portrait'),
  officialImage('teo'),
  selectedImage(
    'v1792596446/dyane-paris-art-de-recevoir-cocktail-signature.png', 'collections', '/experiences',
    t('L’art de recevoir', 'The art of hosting'),
    t('Cocktail signature Dyane Paris dans l’art de recevoir', 'Dyane Paris signature cocktail in the art of hosting'),
    t('Le cocktail accompagne le geste et l’attention portés à chaque réception.', 'The cocktail accompanies the gesture and care given to every reception.'),
  ),
  officialImage('teo-detail'),
  officialImage('collection-duo'),
  selectedImage(
    'v1792596444/dyane-paris-cocktail-luxe-jaune-art-de-recevoir.png', 'collections', '/experiences',
    t('Le cocktail et l’art de recevoir', 'Cocktails and the art of hosting'),
    t('Cocktail jaune dans l’univers de l’art de recevoir Dyane Paris', 'Yellow cocktail in the Dyane Paris art of hosting universe'),
    t('Une composition liquide mise en scène dans l’univers de la Maison.', 'A liquid composition presented in the world of the House.'),
  ),
  // 12: the former second image travels with its complete description and link.
  { ...officialImage('no2-catalogue'), gallerySection: 'maison' },
  officialImage('maison-art'),
  selectedImage(
    'v1792596466/dyane-paris-sculpture-porcelaine-rouge-art-floral.png', 'maison', '/la-maison',
    t('La sculpture et l’art floral', 'Sculpture and floral art'),
    t('Sculpture en porcelaine au drapé rouge dans une composition florale Dyane Paris', 'Porcelain sculpture with red drapery in a Dyane Paris floral composition'),
    t('La sculpture dialogue avec les fleurs dans une composition de la Maison.', 'The sculpture enters into dialogue with flowers in a House composition.'),
  ),
  officialImage('maison-service'),
  selectedImage(
    'v1792596468/dyane-paris-peinture-main-sculpture-porcelaine.png', 'maison', '/fabrication',
    t('Le geste de la peinture', 'The gesture of painting'),
    t('Peinture à la main d’une sculpture en porcelaine Dyane Paris', 'Hand painting a Dyane Paris porcelain sculpture'),
    t('La main de l’artisan accompagne les finitions de la sculpture en porcelaine.', 'The artisan’s hand shapes the finishing touches of the porcelain sculpture.'),
  ),
  // 17-21: craftsmanship.
  selectedImage(
    'v1792596559/dyane-paris-sculpture-porcelaine-detail-visage.png', 'fabrication', '/fabrication',
    t('Le visage de la sculpture', 'The face of the sculpture'),
    t('Détail du visage de la sculpture en porcelaine Dyane Paris', 'Detail of the face of the Dyane Paris porcelain sculpture'),
    t('Les traits du visage révèlent le travail sculptural de la porcelaine.', 'The features of the face reveal the sculptural work of porcelain.'),
  ),
  selectedImage(
    'v1792596557/dyane-paris-sculpture-porcelaine-voile-rouge-detail.png', 'fabrication', '/fabrication',
    t('Le détail du drapé rouge', 'The red drapery in detail'),
    t('Détail du drapé rouge d’une sculpture en porcelaine Dyane Paris', 'Detail of the red drapery of a Dyane Paris porcelain sculpture'),
    t('La couleur souligne les plis et le mouvement du drapé en porcelaine.', 'Colour highlights the folds and movement of the porcelain drapery.'),
  ),
  officialImage('peinture'),
  officialImage('ingredients'),
  officialImage('fabrication-modelage'),
  // 22-28: hospitality and personalisation.
  selectedImage(
    'v1791499959/dyane-paris-cocktail-luxe-highball-bar.png', 'experiences', '/experiences',
    t('Le cocktail au bar', 'The cocktail at the bar'),
    t('Cocktail Dyane Paris présenté dans un verre highball au bar', 'Dyane Paris cocktail presented in a highball glass at the bar'),
    t('La verrerie et le lieu prolongent l’expérience de dégustation.', 'Glassware and setting extend the tasting experience.'),
  ),
  selectedImage(
    'v1788706396/dyane-paris-art-de-recevoir-cocktail-cameliajordana.png', 'experiences', '/experiences',
    t('Une réception Dyane Paris', 'A Dyane Paris reception'),
    t('L’art de recevoir et le cocktail dans l’univers Dyane Paris', 'The art of hosting and cocktails in the world of Dyane Paris'),
    t('Le cocktail prend place dans un moment de rencontre et de partage.', 'The cocktail becomes part of a moment of encounter and sharing.'),
    1920, 1080,
  ),
  officialImage('hospitality-restaurant'),
  officialImage('personnalisation'),
  selectedImage(
    'v1791499959/dyane-paris-cocktail-signature-coupe.png', 'experiences', '/experiences',
    t('Le cocktail signature en coupe', 'The signature cocktail in a coupe'),
    t('Cocktail signature Dyane Paris présenté en coupe', 'Dyane Paris signature cocktail presented in a coupe'),
    t('La coupe accompagne la présentation et le rituel du cocktail.', 'The coupe accompanies the presentation and ritual of the cocktail.'),
  ),
  selectedImage(
    'v1788706395/dyane-paris-hospitality-cocktail-bar-luxe.png', 'experiences', '/experiences',
    t('Dyane Paris et l’hospitalité', 'Dyane Paris and hospitality'),
    t('Cocktail et hospitalité dans l’univers d’un bar Dyane Paris', 'Cocktails and hospitality in the world of a Dyane Paris bar'),
    t('La Maison inscrit ses créations dans les lieux et les moments qui les accueillent.', 'The House places its creations within the settings and moments that welcome them.'),
    1920, 1080,
  ),
  selectedImage(
    'v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png', 'experiences', no2,
    t('La sculpture dans la lumière', 'The sculpture in the light'),
    t('Sculpture Dyane Paris au drapé vert dans une lumière ambrée', 'Dyane Paris sculpture with green drapery in amber light'),
    t('La lumière révèle les volumes et les reflets de la sculpture au drapé vert.', 'Light reveals the volumes and reflections of the green-draped sculpture.'),
    514, 640,
  ),
]

export function gallerySeoImage(image: GalleryImage, locale: string) {
  const language = locale === 'en' ? 'en' : 'fr'
  return {
    url: image.url, width: image.width, height: image.height,
    alt: image.alt[language], caption: image.title[language], description: image.caption[language],
  }
}
