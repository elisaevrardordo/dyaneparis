export type DeliveryCountry = 'FR' | 'MC'

const FREE_SHIPPING_THRESHOLD = 20_000
const STANDARD_SHIPPING: Record<DeliveryCountry, number> = { FR: 1_500, MC: 2_000 }

export function isDeliveryCountry(value: unknown): value is DeliveryCountry {
  return value === 'FR' || value === 'MC'
}

// The form uses separate country and postal-code fields to check destination eligibility.
// La Poste distinguishes metropolitan France, overseas territories and Monaco in its routing data.
// https://www.data.gouv.fr/datasets/base-officielle-des-codes-postaux
// https://lastation.laposte.fr/sites/p8_u1/files/2023-05/SP8855-Volume%203_V1.11%20-%20Routage%20Logique.pdf
// This range check includes Corsica (20) and cannot verify an exact address or an assigned postal code.
export function isDeliveryPostcode(country: unknown, postcode: unknown): boolean {
  if (!isDeliveryCountry(country) || typeof postcode !== 'string') return false
  const normalized = postcode.trim()
  if (country === 'MC') return normalized === '98000'
  return /^(?:0[1-9]|[1-8][0-9]|9[0-5])[0-9]{3}$/.test(normalized)
}

export function shippingAmount(subtotal: number, country: DeliveryCountry = 'FR') {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING[country]
}

export function shippingDescription(locale: 'fr' | 'en', country: DeliveryCountry = 'FR') {
  const euros = (cents: number) => new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(cents / 100)
  const standard = euros(STANDARD_SHIPPING[country])
  const threshold = euros(FREE_SHIPPING_THRESHOLD)
  const destination = country === 'MC' ? 'Monaco' : locale === 'en' ? 'metropolitan France' : 'France métropolitaine'

  return locale === 'en'
    ? `Delivery in ${destination} is ${standard}, with complimentary delivery on orders over ${threshold}.`
    : `Livraison ${country === 'MC' ? 'à' : 'en'} ${destination} à ${standard}, offerte pour toute commande de plus de ${threshold}.`
}

export function shippingDeliveryDescription(locale: 'fr' | 'en', preorder: boolean) {
  if (preorder) return locale === 'en' ? 'Delivery expected in early January 2027.' : 'Livraison prévue début janvier 2027.'
  return locale === 'en' ? 'Delivery within 5 business days.' : 'Livraison sous 5 jours ouvrés.'
}
