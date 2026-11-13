import type Stripe from 'stripe'
import { isDeliveryCountry, isDeliveryPostcode, shippingAmount, type DeliveryCountry } from '../shipping'

export type ManualVatRates = Record<DeliveryCountry, string>

const cocktailSkus = new Set(['dyane-sculpture-25cl', 'dyane-sculpture-150cl', 'dyane-no2-25cl', 'dyane-no2-150cl'])
export const isManualVatCocktail = (sku: string) => cocktailSkus.has(sku)

export function manualVatRates(fr: unknown, mc: unknown): ManualVatRates | undefined {
  const isRate = (id: unknown): id is string => typeof id === 'string' && /^txr_[a-zA-Z0-9]+$/.test(id)
  if (isRate(fr) && isRate(mc) && fr !== mc) return { FR: fr, MC: mc }
}

export const manualVatMetadata = (rates: ManualVatRates) => ({ dyane_vat_fr: rates.FR, dyane_vat_mc: rates.MC })
export const manualVatFromMetadata = (metadata?: Stripe.MetadataParam | null) => manualVatRates(metadata?.dyane_vat_fr, metadata?.dyane_vat_mc)

export function validManualVatRate(rate: Stripe.TaxRate, id: string, country: DeliveryCountry, livemode: boolean) {
  return rate.id === id && rate.livemode === livemode && rate.active && rate.inclusive && rate.percentage === 20 && rate.country === country
}

export const isManualShippingLine = (line: Stripe.LineItem) => line.metadata?.dyane_line_role === 'shipping'
export const includedVat = (ttc: number) => Math.round(ttc / 6)

export function manualShippingLine(subtotal: number, country: DeliveryCountry, locale: 'fr' | 'en', taxRate: string): Stripe.Checkout.SessionUpdateParams.LineItem | undefined {
  const fee = shippingAmount(subtotal, country)
  if (!fee) return
  const name = country === 'MC' ? (locale === 'fr' ? 'Livraison à Monaco' : 'Delivery in Monaco')
    : (locale === 'fr' ? 'Livraison en France métropolitaine' : 'Delivery in metropolitan France')
  return {
    quantity: 1,
    tax_rates: [taxRate],
    metadata: { dyane_line_role: 'shipping' },
    price_data: { currency: 'eur', unit_amount: fee, tax_behavior: 'inclusive', product_data: { name } },
  }
}

export function verifyManualVatSession(session: Stripe.Checkout.Session, rates: ManualVatRates, subtotal: number) {
  const address = session.collected_information?.shipping_details?.address
  const country = address?.country
  if (!isDeliveryCountry(country) || !isDeliveryPostcode(country, address?.postal_code) || !Number.isSafeInteger(subtotal) || subtotal <= 0) return false
  if (session.automatic_tax?.enabled !== false || session.shipping_cost || session.total_details?.amount_shipping !== 0
    || session.total_details?.amount_discount !== 0 || !session.line_items || session.line_items.has_more) return false
  const fee = shippingAmount(subtotal, country)
  const lines = session.line_items.data
  const delivery = lines.filter(isManualShippingLine)
  if (fee ? delivery.length !== 1 || delivery[0].quantity !== 1 || delivery[0].amount_total !== fee : delivery.length !== 0) return false
  if (session.amount_total !== subtotal + fee || !lines.every(line => {
    const rate = line.taxes?.[0]?.rate
    return line.currency === 'eur' && line.amount_discount === 0 && line.price?.tax_behavior === 'inclusive'
      && line.taxes?.length === 1 && rate?.id === rates[country] && rate.inclusive && rate.percentage === 20
      && rate.country === country && rate.livemode === session.livemode
  })) return false
  if (lines.reduce((sum, line) => sum + line.amount_total, 0) !== session.amount_total) return false
  const tax = session.total_details?.amount_tax
  const roundedPerLine = lines.reduce((sum, line) => sum + includedVat(line.amount_total), 0)
  // The invoice may round by line or on the total per rate. Both preserve the gross total.
  return tax === roundedPerLine || tax === includedVat(session.amount_total)
}
