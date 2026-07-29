import type { ConfigurationSelection, PriceAmount, PricingCatalog } from './types'

export const pricing = {
  currency: 'EUR',
  formatBase: {
    '25cl': 100_000,
    '1-5l': 150_000,
    '12l': null,
  },
  artistSupplements: {
    'atelier-dyane': 0,
  },
  artworkSupplements: {
    'voile-monochrome': 0,
  },
  paletteSupplements: {
    'bordeaux-profond': 0,
    'bleu-nocturne': 0,
    'terre-de-sienne': 0,
  },
  finishSupplements: {
    mat: 0,
    satine: 0,
  },
} as const satisfies PricingCatalog

export function calculateConfigurationPrice(selection: ConfigurationSelection): PriceAmount {
  const parts = [
    pricing.formatBase[selection.formatId],
    pricing.artistSupplements[selection.artistId],
    pricing.artworkSupplements[selection.artworkId],
    pricing.paletteSupplements[selection.paletteId],
    pricing.finishSupplements[selection.finishId],
  ]

  if (parts.some((amount) => amount === null)) return null
  return parts.reduce<number>((total, amount) => total + (amount ?? 0), 0)
}

export function formatPrice(amount: PriceAmount, locale = 'fr-FR') {
  if (amount === null) return locale.startsWith('fr') ? 'Prix sur demande' : 'Price on request'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(amount / 100)
}
