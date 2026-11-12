import { finishLabel } from '@/lib/personalization/catalog'
import 'server-only'
import type { GiftOptions } from '../gifts/options'
import type Stripe from 'stripe'
import { assertCheckoutAccount, assertTaxReady, checkoutUsesAutomaticTax, CheckoutError, checkoutConfig, commerceCheckoutConfig, stripeClient } from './config'
import { orderPool, reserveOrder, reserveCartOrder, transaction } from './store'
import { TEO_ARTWORK_SKU, cartProducts, cartSubtotal, type CartItem } from '@/components/cart/catalog'
import { shippingAmount, type DeliveryCountry } from '@/lib/shipping'
import { commerceIntegration, fulfillmentForSku, isSingleFulfillment } from '@/lib/orders/fulfillment'

type SingleInput = { sku: string; quantity: number; locale: 'fr' | 'en'; attemptId: string }
type CartInput = { items: CartItem[]; locale: 'fr' | 'en'; attemptId: string; giftMessage?: string; giftOptions?: GiftOptions }

export function shippingOption(subtotal: number, locale: 'fr' | 'en', country: DeliveryCountry = 'FR'): Stripe.Checkout.SessionCreateParams.ShippingOption {
  const amount = shippingAmount(subtotal, country)
  const destination = country === 'MC' ? 'Monaco' : 'France'
  return {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount, currency: 'eur' },
      display_name: amount === 0
        ? (locale === 'en' ? `Complimentary delivery in ${destination}` : `Livraison offerte ${country === 'MC' ? 'à' : 'en'} ${destination}`)
        : (locale === 'en' ? `Delivery in ${destination}` : `Livraison ${country === 'MC' ? 'à' : 'en'} ${destination}`),
      tax_behavior: 'inclusive',
      tax_code: 'txcd_92010001',
    },
  }
}

export async function createCheckout(input: SingleInput | CartInput) {
  return 'items' in input ? createCartCheckout(input) : createSingleCheckout(input)
}

async function createSingleCheckout(input: SingleInput) {
  const config = checkoutConfig()
  if (config.livemode || process.env.STRIPE_PUBLISHABLE_KEY) throw new CheckoutError('Use the configured cart checkout')
  if (input.sku === TEO_ARTWORK_SKU) throw new CheckoutError('Choose a cocktail in the cart checkout', 400)
  const stripe = stripeClient(config.key)
  await assertTaxReady(stripe, config.account)
  const candidate = await orderPool().query<{ price_id: string }>(`
    SELECT price_id, 0 AS priority FROM dyane_checkout_orders WHERE id=$1
    UNION ALL
    SELECT price_id, 1 AS priority FROM dyane_checkout_inventory WHERE sku=$2 AND active
    ORDER BY priority LIMIT 1`, [input.attemptId, input.sku])
  if (!candidate.rows[0]) throw new CheckoutError('Item unavailable', 409)
  const priceId = candidate.rows[0].price_id
  // Validate before reserving stock: bad configuration must not consume inventory.
  const price = await stripe.prices.retrieve(priceId, { expand: ['product'] })
  const product = price.product as Stripe.Product
  const unitAmount = price.unit_amount
  const taxCode = typeof product.tax_code === 'string' ? product.tax_code : product.tax_code?.id
  if (price.livemode || !price.active || price.type !== 'one_time' || price.currency !== 'eur'
    || !unitAmount || price.tax_behavior !== 'inclusive' || product.deleted || !product.active
    || !taxCode || taxCode === 'txcd_00000000') {
    throw new CheckoutError('Configure an active EUR tax-inclusive product price and tax code')
  }
  const prefix = input.locale === 'en' ? '/en' : ''
  const order = await transaction(db => reserveOrder(db, input, price => {
    if (price !== priceId) throw new CheckoutError('Catalog changed; retry', 409)
    return {
      mode: 'payment', ui_mode: 'hosted_page', locale: input.locale,
      integration_identifier: 'dyane-sandbox-kmptxqaz',
      client_reference_id: input.attemptId, metadata: { dyane_order_id: input.attemptId },
      payment_intent_data: { metadata: { dyane_order_id: input.attemptId } },
      customer_creation: 'always', tax_id_collection: { enabled: true },
      line_items: [{ price, quantity: input.quantity }], automatic_tax: { enabled: true },
      invoice_creation: { enabled: true, invoice_data: { metadata: { dyane_order_id: input.attemptId } } },
      shipping_address_collection: { allowed_countries: ['FR'] },
      shipping_options: [shippingOption(unitAmount * input.quantity, input.locale)],
      expires_at: Math.floor(Date.now() / 1000) + 35 * 60,
      success_url: `${config.origin}${prefix}/paiement-test?result=returned`,
      cancel_url: `${config.origin}${prefix}/paiement-test?result=cancelled`,
    }
  }))
  // Frozen params make retries stable even if catalog or deployment configuration changes.
  const session = await stripe.checkout.sessions.create(order.params, { idempotencyKey: `dyane-checkout/${order.id}` })
  if (session.livemode || !session.url || session.status !== 'open') throw new CheckoutError('Session unavailable', 409)
  const url = new URL(session.url)
  if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new CheckoutError('Unexpected Checkout URL')
  await orderPool().query(`UPDATE dyane_checkout_orders SET session_id=$2, updated_at=now()
    WHERE id=$1 AND (session_id IS NULL OR session_id=$2)`, [order.id, session.id])
  return session.url
}

async function createCartCheckout(input: CartInput) {
  const config = checkoutConfig()
  if (config.livemode || process.env.STRIPE_PUBLISHABLE_KEY) throw new CheckoutError('Use the configured cart checkout')
  const { session } = await reserveAndCreateCartSession(input, config)
  if (!session.url) throw new CheckoutError('Session unavailable', 409)
  const url = new URL(session.url)
  if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new CheckoutError('Unexpected Checkout URL')
  return session.url
}

export async function createCommerceCheckout(input: CartInput, returningBuyer: boolean) {
  const config = commerceCheckoutConfig()
  const prefix = input.locale === 'en' ? '/en' : ''
  const returnPath = `${prefix}/panier?result=returned&order=${input.attemptId}`
  const { session } = await reserveAndCreateCartSession(input, config, returnPath, returningBuyer)
  if (!session.client_secret) throw new CheckoutError('Session unavailable', 409)
  return { clientSecret: session.client_secret, publishableKey: config.publishableKey, returnPath }
}

async function reserveAndCreateCartSession(input: CartInput, config: ReturnType<typeof checkoutConfig>, returnPath?: string, returningBuyer = false) {
  const fulfillment = returnPath ? fulfillmentForSku(input.items[0].sku) : undefined
  if (fulfillment && !isSingleFulfillment(input.items, fulfillment)) throw new CheckoutError('Fulfillment groups must be ordered separately', 400)
  const stripe = stripeClient(config.key)
  const automaticTax = checkoutUsesAutomaticTax(config.livemode, Boolean(returnPath))
  await assertCheckoutAccount(stripe, config.account, config.livemode, automaticTax)
  const existing = await orderPool().query<OrderForCart>('SELECT params,session_id FROM dyane_checkout_orders WHERE id=$1', [input.attemptId])
  if (returnPath && existing.rows[0]?.session_id && !returningBuyer) throw new CheckoutError('Attempt already used', 409)
  const frozen = existing.rows[0]?.params
  if (frozen && (frozen.integration_identifier === commerceIntegration) !== Boolean(returnPath)) throw new CheckoutError('Attempt already used', 409)
  const catalog = await orderPool().query<{ sku: string; price_id: string }>(
    'SELECT sku,price_id FROM dyane_checkout_inventory WHERE sku=ANY($1::text[]) AND active', [input.items.map(i => i.sku)])
  const ids = new Map(catalog.rows.map(i => [i.sku, i.price_id]))
  if (!frozen && input.items.some(i => !ids.has(i.sku))) throw new CheckoutError('Item unavailable', 409)
  const lineItems = frozen?.line_items || input.items.map(item => ({ price: ids.get(item.sku) as string, quantity: item.quantity }))
  for (const line of lineItems) {
    const price = await stripe.prices.retrieve(line.price as string, { expand: ['product'] })
    const product = price.product as Stripe.Product
    const code = typeof product.tax_code === 'string' ? product.tax_code : product.tax_code?.id
    const expectedAmount = input.items.find(i => ids.get(i.sku) === price.id)
    const approved = cartProducts.find(p => p.sku === expectedAmount?.sku)
    if (price.livemode !== config.livemode || !price.active || price.type !== 'one_time' || price.currency !== 'eur'
      || !price.unit_amount || price.tax_behavior !== 'inclusive' || product.deleted || !product.active
      || ((automaticTax || frozen?.automatic_tax?.enabled) && (!code || code === 'txcd_00000000'))
      || (!frozen && (!approved || price.unit_amount !== approved.amount))) {
      throw new CheckoutError('Product configuration unavailable')
    }
  }
  const prefix = input.locale === 'en' ? '/en' : ''
  const order = await transaction(db => reserveCartOrder(db, { ...input, fulfillment }, reserved => {
    if (reserved.some(i => ids.get(i.sku) !== i.price_id)) throw new CheckoutError('Catalog changed', 409)
    const metadata: Record<string, string> = { dyane_order_id: input.attemptId }
    if (fulfillment) {
      metadata.dyane_fulfillment = fulfillment
      metadata.dyane_subtotal = String(cartSubtotal(reserved))
    }
    const personalizedDescriptions: string[] = []
    for (const [index, item] of reserved.entries()) {
      if (item.composition) {
        metadata[`dyane_line_${index + 1}`] = JSON.stringify({ sku: item.sku, quantity: item.quantity, composition: item.composition })
      }
      if (!item.personalization) continue
      const product = cartProducts.find(p => p.sku === item.sku)
      // A future surcharge requires an explicitly configured Stripe price, never a browser amount.
      if (product?.personalization.surcharge !== 0) throw new CheckoutError('Personalization price unavailable')
      metadata[`dyane_line_${index + 1}`] = JSON.stringify({ sku: item.sku, quantity: item.quantity, ...item.personalization })
      personalizedDescriptions.push(`${product.format} x ${item.quantity} : ${item.personalization.initials}, ${finishLabel(item.personalization.finish, input.locale)}`)
    }
    const common: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment', locale: input.locale,
      client_reference_id: input.attemptId, metadata,
      payment_intent_data: { metadata },
      customer_creation: 'always', tax_id_collection: { enabled: true },
      line_items: reserved.map(i => ({ price: i.price_id, quantity: i.quantity })),
      automatic_tax: { enabled: automaticTax },
      invoice_creation: { enabled: true, invoice_data: { metadata } },
      expires_at: Math.floor(Date.now() / 1000) + 35 * 60,
    }
    if (returnPath) return {
      ...common, ui_mode: 'elements', integration_identifier: commerceIntegration,
      return_url: `${config.origin}${returnPath}`,
      permissions: { update_shipping_details: 'server_only' },
      shipping_address_collection: { allowed_countries: ['FR', 'MC'] },
      shipping_options: [shippingOption(cartSubtotal(reserved), input.locale)],
    }
    return {
      ...common, ui_mode: 'hosted_page', integration_identifier: 'dyane-cart-kmptxqaz',
      ...(personalizedDescriptions.length ? { custom_text: { submit: { message: `${input.locale === 'en' ? 'Your personalisations' : 'Vos personnalisations'} : ${personalizedDescriptions.join(' ; ')}` } } } : {}),
      shipping_address_collection: { allowed_countries: ['FR'] },
      shipping_options: [shippingOption(cartSubtotal(reserved), input.locale)],
      success_url: `${config.origin}${prefix}/panier?result=returned`, cancel_url: `${config.origin}${prefix}/panier?result=cancelled`,
    }
  }))
  const session = await stripe.checkout.sessions.create(order.params, { idempotencyKey: `dyane-checkout/${order.id}` })
  if (session.livemode !== config.livemode || session.status !== 'open') throw new CheckoutError('Session unavailable', 409)
  await orderPool().query(`UPDATE dyane_checkout_orders SET session_id=$2,updated_at=now()
    WHERE id=$1 AND (session_id IS NULL OR session_id=$2)`, [order.id, session.id])
  return { session }
}
type OrderForCart = { params: Stripe.Checkout.SessionCreateParams; session_id: string | null }
