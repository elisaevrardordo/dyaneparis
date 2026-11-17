/** Catalogue amounts are stored in cents; display whole euros without redundant decimals. */
export function formatPrice(amount: number, locale: string = 'fr', display: 'code' | 'symbol' = 'code') {
  const options: Intl.NumberFormatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 2 }
  if (display === 'symbol') {
    options.style = 'currency'
    options.currency = 'EUR'
  }
  const price = new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', options).format(amount / 100)
  return display === 'symbol' ? price : `${price} EUR`
}
