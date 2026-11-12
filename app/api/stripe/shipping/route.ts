import { NextResponse } from 'next/server'
import { clientIp, createMemoryRateLimiter, requestBodyTooLarge } from '@/lib/requestSecurity'
import { CheckoutError, commerceCheckoutConfig, stripeClient } from '@/lib/stripe/config'
import { canAccessOrder, isOrderId } from '@/lib/stripe/order-access'
import { isManualShippingLine, manualShippingLine, manualVatFromMetadata, verifyManualVatSession } from '@/lib/stripe/manualVat'
import { shippingOption } from '@/lib/stripe/checkout'
import { commerceIntegration } from '@/lib/orders/fulfillment'
import { isDeliveryCountry, isDeliveryPostcode, shippingAmount } from '@/lib/shipping'
import { transaction, type Order } from '@/lib/stripe/store'

export const runtime = 'nodejs'
const limited = createMemoryRateLimiter(60_000, 30)
const noStore = { 'Cache-Control': 'no-store' }

function addressField(value: unknown, required = true): string {
  if (!required && (value === null || value === undefined || value === '')) return ''
  if (typeof value !== 'string' || !value.trim() || value.length > 200 || /\p{Cc}/u.test(value)) {
    throw new CheckoutError('Invalid shipping address', 422)
  }
  return value.trim()
}

export async function POST(request: Request) {
  try {
    const config = commerceCheckoutConfig()
    if (request.headers.get('origin') !== config.origin) throw new CheckoutError('Forbidden', 403)
    if (limited(clientIp(request))) throw new CheckoutError('Too many requests', 429)
    if (requestBodyTooLarge(request, 4096)) throw new CheckoutError('Payload too large', 413)
    const raw = await request.text()
    if (Buffer.byteLength(raw) > 4096) throw new CheckoutError('Payload too large', 413)
    let body: { attemptId?: unknown; sessionId?: unknown; shippingDetails?: { name?: unknown; address?: Record<string, unknown> } } | null
    try { body = JSON.parse(raw) } catch { throw new CheckoutError('Invalid request', 400) }
    const { attemptId, sessionId, shippingDetails } = body ?? {}
    if (!isOrderId(attemptId) || typeof sessionId !== 'string' || !/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
      throw new CheckoutError('Invalid request', 400)
    }
    if (!canAccessOrder(request, attemptId, config.key)) throw new CheckoutError('Forbidden', 403)
    const address = shippingDetails?.address
    const country = address?.country
    if (!shippingDetails || !address || !isDeliveryCountry(country) || !isDeliveryPostcode(country, address.postal_code)) {
      throw new CheckoutError('Delivery destination unavailable', 422)
    }
    const details = { name: addressField(shippingDetails.name), address: {
      country, postal_code: addressField(address.postal_code), city: addressField(address.city),
      line1: addressField(address.line1), line2: addressField(address.line2, false), state: addressField(address.state, false),
    } }
    const stripe = stripeClient(config.key)
    const quote = await transaction(async db => {
      const { rows: [order] } = await db.query<Order>('SELECT * FROM dyane_checkout_orders WHERE id=$1 FOR UPDATE', [attemptId])
      if (!order || order.session_id !== sessionId || order.params.integration_identifier !== commerceIntegration
        || !['reserved', 'pending'].includes(order.status)) throw new CheckoutError('Order unavailable', 409)
      const subtotal = Number(order.params.metadata?.dyane_subtotal)
      if (!Number.isSafeInteger(subtotal) || subtotal <= 0) throw new CheckoutError('Order amount unavailable')
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.livemode !== config.livemode || session.client_reference_id !== attemptId || session.status !== 'open'
        || session.permissions?.update_shipping_details !== 'server_only') throw new CheckoutError('Session unavailable', 409)
      const rates = manualVatFromMetadata(order.params.metadata)
      if (!rates) {
        if (config.livemode) throw new CheckoutError('Manual VAT is required', 409)
        await stripe.checkout.sessions.update(sessionId, {
          collected_information: { shipping_details: details },
          shipping_options: [shippingOption(subtotal, order.locale, country)],
        })
        return undefined
      }
      if (session.automatic_tax?.enabled !== false || session.shipping_options.length > 0) {
        throw new CheckoutError('Tax configuration changed', 409)
      }
      const lines = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 })
      const products = lines.data.filter(line => !isManualShippingLine(line))
      if (lines.has_more || !products.length || products.reduce((sum, line) => sum + line.amount_total, 0) !== subtotal) {
        throw new CheckoutError('Order amount unavailable', 409)
      }
      const freight = manualShippingLine(subtotal, country, order.locale, rates[country])
      const updated = await stripe.checkout.sessions.update(sessionId, {
        collected_information: { shipping_details: details },
        line_items: [...products.map(line => ({ id: line.id, tax_rates: [rates[country]] })), ...(freight ? [freight] : [])],
      })
      const priced = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ['data.taxes.rate'] })
      if (!verifyManualVatSession({ ...updated, line_items: priced }, rates, subtotal)) {
        throw new CheckoutError('Delivery tax could not be verified')
      }
      return { amount: shippingAmount(subtotal, country), vat: updated.total_details?.amount_tax }
    })
    return NextResponse.json({ updated: true, ...(quote ? { manualQuote: quote } : {}) }, { headers: noStore })
  } catch (error) {
    return NextResponse.json({ updated: false }, { status: error instanceof CheckoutError ? error.status : 503, headers: noStore })
  }
}
