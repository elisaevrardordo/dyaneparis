export const TEO_ARTWORK_AMOUNT = 57000
export const TEO_ARTWORK_SKU = 'teo-for-dyane'
export const TEO_COMPOSITIONS = { no1: 'Pornstar Martini', no2: 'Basil Smash' } as const

export type Composition = keyof typeof TEO_COMPOSITIONS
export type Personalization = { initials: string; finish: 'gold' | 'black' | 'red' | 'green' }
export type CartItem = { sku: string; quantity: number; personalization?: Personalization; composition?: Composition }
export const cartProducts = [
  {
    sku: 'dyane-sculpture-25cl', name: 'Dyane No.1', format: '25 cl', reference: 'dyane-sculpture-25cl',
    amount: 5500, image: '/journal/dyane-paris-cocktail-25cl-hotel.webp',
    href: '/sculptures/dyane-no1-pornstar-martini-25cl',
    personalization: { enabled: true, finishes: ['gold', 'red', 'black'], surcharge: 0,
      preview: { image: '/journal/dyane-paris-cocktail-25cl-hotel.webp', x: 50, y: 80, scale: .65, rotate: 2, skew: -3 } },
  },
  {
    sku: 'dyane-sculpture-150cl', name: 'Dyane No.1', format: '1,5 L', reference: 'dyane-sculpture-150cl',
    amount: 18500, image: '/images/officielles/collections/dyane-no1-pornstar-martini-flacon-porcelaine.png',
    href: '/sculptures/dyane-no1-pornstar-martini-150cl',
    personalization: { enabled: true, finishes: ['gold', 'red', 'black'], surcharge: 0,
      preview: { image: '/images/officielles/collections/dyane-no1-pornstar-martini-portrait-officiel.png', x: 49, y: 86, scale: .75, rotate: 2, skew: -3 } },
  },
  {
    sku: 'dyane-no2-25cl', name: 'Dyane No.2', format: '25 cl', reference: 'dyane-no2-25cl',
    amount: 5500, image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-vert.png',
    href: '/sculptures/dyane-no2-basil-smash-25cl',
    personalization: { enabled: true, finishes: ['gold', 'green'], surcharge: 0,
      preview: { image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-vert.png', x: 50, y: 86, scale: .75, rotate: 2, skew: -3 } },
  },
  {
    sku: 'dyane-no2-150cl', name: 'Dyane No.2', format: '1,5 L', reference: 'dyane-no2-150cl',
    amount: 18500, image: '/images/officielles/collections/dyane-no2-basil-smash-sculpture-porcelaine.png',
    href: '/sculptures/dyane-no2-basil-smash-150cl',
    personalization: { enabled: true, finishes: ['gold', 'green'], surcharge: 0,
      preview: { image: '/images/officielles/collections/dyane-no2-basil-smash-sculpture-porcelaine.png', x: 50, y: 86, scale: .75, rotate: 2, skew: -3 } },
  },
  {
    sku: TEO_ARTWORK_SKU, name: 'Teo for Dyane', format: 'Édition artistique', reference: TEO_ARTWORK_SKU,
    amount: TEO_ARTWORK_AMOUNT, image: '/dyane-teo.webp', href: '/oeuvres/bouteille-signee-teokaykay',
    personalization: { enabled: false, finishes: [], surcharge: 0 },
  },
] as const
export const CART_STORAGE_KEY = 'dyane-cart-v1'
export const MAX_CART_QUANTITY_PER_SKU = 5

export function normalizeInitials(value: string) { return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) }
export function validatePersonalization(sku: string, value: unknown): value is Personalization {
  const product = cartProducts.find(p => p.sku === sku)
  if (!product?.personalization.enabled || !value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  return Object.keys(p).length === 2 && Object.keys(p).every(k => ['initials', 'finish'].includes(k))
    && typeof p.initials === 'string' && /^[A-Z]{1,3}$/.test(p.initials)
    && product.personalization.finishes.some(f => f === p.finish)
}
export function isTeoComposition(value: unknown): value is Composition {
  return value === 'no1' || value === 'no2'
}
export function validateComposition(sku: string, value: unknown) {
  return sku === TEO_ARTWORK_SKU ? isTeoComposition(value) : value === undefined
}
export function cartLineKey(item: Pick<CartItem, 'sku' | 'personalization' | 'composition'>) {
  if (item.composition) return `${item.sku}:${item.composition}`
  return item.personalization ? `${item.sku}:${item.personalization.finish}:${item.personalization.initials}` : item.sku
}
export function cleanCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return []
  const merged = new Map<string, CartItem>()
  const totals = new Map<string, number>()
  for (const item of value) {
    if (!item || typeof item !== 'object' || !cartProducts.some(p => p.sku === item.sku)
      || !Number.isInteger(item.quantity) || item.quantity < 1
      || !validateComposition(item.sku, item.composition)
      || (item.personalization !== undefined && !validatePersonalization(item.sku, item.personalization))) continue
    const remaining = MAX_CART_QUANTITY_PER_SKU - (totals.get(item.sku) || 0)
    const quantity = Math.min(remaining, item.quantity)
    if (!quantity) continue
    const next: CartItem = { sku: item.sku, quantity,
      ...(item.composition ? { composition: item.composition } : {}),
      ...(item.personalization ? { personalization: { initials: item.personalization.initials, finish: item.personalization.finish } } : {}) }
    const key = cartLineKey(next)
    const previous = merged.get(key)
    merged.set(key, { ...next, quantity: quantity + (previous?.quantity || 0) })
    totals.set(item.sku, (totals.get(item.sku) || 0) + quantity)
  }
  return [...merged.values()].sort((a, b) => cartLineKey(a).localeCompare(cartLineKey(b)))
}
export function cartSubtotal(items: CartItem[]) {
  return cleanCart(items).reduce((sum, item) => {
    const product = cartProducts.find(p => p.sku === item.sku)
    return sum + ((product?.amount || 0) + (item.personalization ? product?.personalization.surcharge || 0 : 0)) * item.quantity
  }, 0)
}
