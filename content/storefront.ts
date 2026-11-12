import { cartProducts, TEO_ARTWORK_AMOUNT } from '@/components/cart/catalog'
import { no1CocktailPhoto, no2CocktailPhoto } from '@/content/productGalleryPhotos'
import { homeUniverse } from '@/content/home'

export type StorefrontImage = { src: string; alt: string; position: string }
type ProductCardImage = StorefrontImage & {
  labelTone?: 'light'
  infoTone?: 'light'
}

export type FeaturedWork = {
  id: string; title: string; subtitle: string; href: string; sku?: string;
  format?: string; collection?: 'no1' | 'no2'; enquirySku?: string; amount?: number;
  badges: ('personalizable' | 'limited')[]; images: ProductCardImage[];
  appendCollectionPhoto?: boolean;
  variants: { label: string; colour: string; href: string }[]
}
const image = (src: string, alt: string, position = '50% 50%'): StorefrontImage => ({ src, alt, position })
const red = '/images/officielles/collections/dyane-no1-pornstar-martini-portrait-officiel.png'
const green = '/images/officielles/collections/dyane-no2-basil-smash-portrait-officiel.png'
const basilSmashPhoto = image(no2CocktailPhoto, 'Cocktail Basil Smash Dyane No.2 dans un verre sur fond rouge')
const cocktailPhoto = {
  ...image('/home/shop/dyane-paris-cocktail-packshot-dyaneno2.png', 'Cocktail Dyane No.2 garni d’une fleur, sur une table en marbre'),
  altEn: 'Dyane No.2 cocktail garnished with a flower on a marble table',
}
const sculpturePhoto = {
  ...image('/home/shop/dyane-paris-sculpture-porcelaine-packshot-dyaneno2.png', 'La sculpture en porcelaine Dyane No.2'),
  altEn: 'The Dyane No.2 porcelain sculpture',
}

// Editorial selection only. Prices, quantity limits and Checkout SKUs come from the existing cart catalogue.
// Separate product pages fix the size. Only confirmed Checkout SKUs can be added to the bag.
export const featuredWorks: FeaturedWork[] = [
  { id: 'no1-25cl', title: 'Dyane No.1', subtitle: 'Inspiré du Pornstar Martini, 24 % vol. · 25 cl', format: '25 cl', collection: 'no1', sku: 'dyane-sculpture-25cl',
    href: '/sculptures/dyane-no1-pornstar-martini-25cl', badges: ['personalizable'],
    images: [
      { ...image('/images/officielles/collections/dyane-paris-no1-25cl-packshot.webp', 'Sculpture Dyane No.1 25 cl au drapé rouge, sur fond rouge'), labelTone: 'light' },
      { ...image('/images/officielles/collections/dyane-paris-no1-25cl-sculpture-cocktail.webp', 'Sculpture Dyane No.1 25 cl et son cocktail'), labelTone: 'light' },
      { ...image(no1CocktailPhoto, 'Cocktail Dyane No.1 dans une coupe garnie de fleurs roses'), labelTone: 'light', infoTone: 'light' },
    ], variants: [] },
  { id: 'no1-150cl', title: 'Dyane No.1', subtitle: 'Inspiré du Pornstar Martini, 24 % vol. · 1,5 L', format: '1,5 L', collection: 'no1', sku: 'dyane-sculpture-150cl',
    href: '/sculptures/dyane-no1-pornstar-martini-150cl', badges: ['personalizable'],
    appendCollectionPhoto: true,
    images: [
      { ...image(red, 'Dyane No.1, sculpture au drapé rouge'), labelTone: 'light' },
      { ...image('/images/officielles/collections/dyane-no1-pornstar-martini-sculpture-porcelaine.png', 'Dyane No.1, vue du dos'), infoTone: 'light' },
      { ...image('/images/officielles/collections/dyane-no1-pornstar-martini-flacon-porcelaine.png', 'Dyane No.1, détail du buste'), labelTone: 'light', infoTone: 'light' },
    ], variants: [] },
  { id: 'no2-25cl', title: 'Dyane No.2', subtitle: 'Basil Smash · 25 cl', format: '25 cl', collection: 'no2', sku: 'dyane-no2-25cl',
    href: '/sculptures/dyane-no2-basil-smash-25cl', badges: ['personalizable'],
    images: [
      { ...image('/images/officielles/collections/dyane-paris-no2-25cl-packshot.webp', 'Sculpture Dyane No.2 25 cl au drapé vert, sur fond rouge'), labelTone: 'light' },
      { ...image('/images/officielles/collections/dyane-paris-no2-25cl-sculpture-cocktail.webp', 'Sculpture Dyane No.2 25 cl et cocktail sur une table en marbre'), labelTone: 'light' },
      { ...basilSmashPhoto, labelTone: 'light', infoTone: 'light' },
    ], variants: [] },
  { id: 'no2-150cl', title: 'Dyane No.2', subtitle: 'Basil Smash · 1,5 L', format: '1,5 L', collection: 'no2', sku: 'dyane-no2-150cl',
    href: '/sculptures/dyane-no2-basil-smash-150cl', badges: ['personalizable'],
    images: [
      { ...image(green, 'Dyane No.2 Basil Smash, sculpture au drapé vert'), labelTone: 'light' },
      { ...image('/images/officielles/collections/dyane-no2-basil-smash-sculpture-porcelaine.png', 'Dyane No.2, vue du dos'), infoTone: 'light' },
      { ...basilSmashPhoto, labelTone: 'light', infoTone: 'light' },
    ], variants: [] },
  { id: 'teo', title: 'Teo for Dyane', subtitle: 'Cocktail au choix · Édition artistique', enquirySku: 'teo-for-dyane', amount: TEO_ARTWORK_AMOUNT, href: '/oeuvres/bouteille-signee-teokaykay', badges: ['limited'],
    images: [
      image('/dyane-teo.webp', 'Sculpture Teo for Dyane Paris'),
      { ...image('/images/officielles/collections/dyane-paris-teo-kaykay-detail-edition-artistique.jpg', 'Détail peint de l’édition Teo for Dyane'), labelTone: 'light', infoTone: 'light' },
    ], variants: [] },
]

export const storefront = {
  // Change media, order and crop here. No binary placeholders or third-party brand assets.
  sections: ['hero', 'chapters', 'products', 'universe', 'story', 'triptych', 'craft', 'film'] as const,
  hero: {
    foreground: 'white' as const,
    images: [
      {
        ...cocktailPhoto,
        href: '/boutique/composition',
        title: 'LA COMPOSITION', subtitle: 'L’art de la mixologie',
        titleEn: 'THE COMPOSITION', subtitleEn: 'The art of mixology',
        boutique: {
          ...image('/home/shop/dyane-paris-dyane-no2-cocktail-haute-mixologie.webp', 'Gros plan du cocktail Dyane No.2 garni de fleurs'),
          altEn: 'Close-up of the Dyane No.2 cocktail garnished with flowers',
        },
      },
      {
        ...sculpturePhoto,
        href: '/boutique/sculpture',
        title: 'LA SCULPTURE', subtitle: 'L’art de la porcelaine',
        titleEn: 'THE SCULPTURE', subtitleEn: 'The art of porcelain',
        boutique: {
          ...image('/home/shop/dyane-paris-dyane-no1-visage-sculpture-porcelaine.webp', 'Gros plan du visage de la sculpture en porcelaine Dyane No.1'),
          altEn: 'Close-up of the face of the Dyane No.1 porcelain sculpture',
        },
      },
    ],
  },
  universe: homeUniverse,
  triptych: {
    video: { src: '/home/shop/service.mp4', poster: '/home/shop/service-poster.jpg', position: '50% 50%' },
    images: [image('/images/officielles/fabrication/dyane-paris-peinture-main-drape-porcelaine.png', 'Le geste de la peinture à la main'), image('/images/officielles/collections/dyane-no1-pornstar-martini-sculpture-porcelaine.png', 'La porcelaine et le drapé rouge de Dyane No.1')],
  },
  film: { src: '/home/shop/campaign.mp4', poster: '/home/hero/hero-dyane-website-vdef-poster.jpg', position: '50% 50%', ratio: '16 / 9' },
}
export function featuredPrice(work: FeaturedWork): number | null {
  return cartProducts.find(product => product.sku === work.sku)?.amount ?? work.amount ?? null
}
export const sculpturePages = featuredWorks.filter(work => work.href.startsWith('/sculptures/'))
