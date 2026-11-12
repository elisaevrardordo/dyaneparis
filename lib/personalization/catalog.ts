import { cartProducts, type Personalization } from '@/components/cart/catalog'

export const engravingImages = {
  no1: {
    gold: '/images/personnalisation/dyane-paris-no1-gravure-doree.webp',
    red: '/images/personnalisation/dyane-paris-no1-gravure-rouge.webp',
  },
  no2: {
    gold: '/images/personnalisation/dyane-paris-no2-gravure-doree.webp',
    green: '/images/personnalisation/dyane-paris-no2-gravure-verte.webp',
  },
} as const

export type PersonalizableWork = {
  sku: string; name: string; format: string; amount: number | null; image: string
  personalization: {
    enabled: boolean; finishes: readonly Personalization['finish'][]; surcharge: number
    preview: { image: string; x: number; y: number; scale: number; rotate: number; skew: number }
  }
  finishImages?: Partial<Record<Personalization['finish'], string>>
}

export const personalizableWorks: PersonalizableWork[] = cartProducts.flatMap(product => product.personalization.enabled ? [{ ...product,
  personalization: { ...product.personalization, finishes: product.sku.startsWith('dyane-no2-') ? ['gold', 'green'] as const : ['gold', 'red'] as const },
  finishImages: product.sku.startsWith('dyane-no2-') ? engravingImages.no2 : engravingImages.no1 }] : [])

export function finishLabel(finish: Personalization['finish'], locale: string = 'fr') {
  return ({ gold: ['Doré', 'Gold'], black: ['Noir', 'Black'], red: ['Rouge', 'Red'], green: ['Vert', 'Green'] } as const)[finish][locale === 'en' ? 1 : 0]
}

export function personalizationNotice(locale: string) {
  return locale === 'en'
    ? 'Personalised products cannot be returned or exchanged.'
    : 'Les produits personnalisés ne peuvent ni être retournés ni échangés.'
}
