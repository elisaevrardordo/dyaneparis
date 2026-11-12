/** Catalogue amounts are stored in cents; display whole euros without redundant decimals. */
export function formatPrice(amount: number, locale: string = 'fr') {
  return `${new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount / 100)} EUR`
}
