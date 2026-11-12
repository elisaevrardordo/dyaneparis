import { shippingDeliveryDescription, shippingDescription } from '../shipping'

export type Fulfillment = 'stock' | 'preorder'

export const commerceIntegration = 'dyane-commerce-v1'

const preorderSkus = new Set(['dyane-sculpture-25cl', 'dyane-no2-25cl'])

export function fulfillmentForSku(sku: string): Fulfillment {
  return preorderSkus.has(sku) ? 'preorder' : 'stock'
}

export function preorderTerms(locale: 'fr' | 'en', showPaymentTerms = true) {
  const label = locale === 'en' ? 'Preorder.' : 'Précommande.'
  const payment = !showPaymentTerms ? '' : locale === 'en' ? ' Payment in full when ordering.' : ' Paiement intégral à la commande.'
  return `${label}${payment} ${shippingDeliveryDescription(locale, true)}`
}

export function shopDeliveryTerms(locale: 'fr' | 'en', fulfillment: Fulfillment, showPaymentTerms = true) {
  const timeline = fulfillment === 'preorder' ? preorderTerms(locale, showPaymentTerms) : shippingDeliveryDescription(locale, false)
  return [timeline, shippingDescription(locale), shippingDescription(locale, 'MC')].join('\n')
}

export function isSingleFulfillment(items: readonly { sku: string }[], fulfillment: Fulfillment) {
  return items.length > 0 && items.every(item => fulfillmentForSku(item.sku) === fulfillment)
}
