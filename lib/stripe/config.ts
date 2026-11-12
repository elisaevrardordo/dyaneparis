import 'server-only'
import Stripe from 'stripe'
import { isProductionDeployment } from '../deployment'
import { giftOptions, type GiftOptions } from '../gifts/options'
import { normalizeGiftMessage, validGiftMessage } from '../gifts/message'
import { cartLineKey, cartProducts, MAX_CART_QUANTITY_PER_SKU, validateComposition, validatePersonalization, type CartItem } from '@/components/cart/catalog'

export class CheckoutError extends Error {
  constructor(message: string, public status = 503) { super(message) }
}

export function stripeEnvironment(env = process.env) {
  const mode = env.STRIPE_MODE ?? 'sandbox'
  if (mode !== 'sandbox' && mode !== 'live') throw new CheckoutError('Invalid Stripe mode')
  const livemode = mode === 'live'
  const production = isProductionDeployment(env)
  if (livemode !== production) throw new CheckoutError('Stripe mode does not match the deployment environment')
  const key = env.STRIPE_SECRET_KEY ?? ''
  const keyPattern = livemode ? /^(rk|sk)_live_\S+$/ : /^(rk|sk)_test_\S+$/
  if (!keyPattern.test(key)) throw new CheckoutError('Stripe key does not match the configured mode')
  const account = env.STRIPE_ACCOUNT_ID ?? ''
  if (!/^acct_\w+$/.test(account)) throw new CheckoutError('Stripe account required')
  let origin: URL
  try { origin = new URL(env.STRIPE_SITE_URL || 'http://localhost:3000') }
  catch { throw new CheckoutError('Invalid checkout origin') }
  if (origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash
    || !['https:', 'http:'].includes(origin.protocol)
    || (origin.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(origin.hostname))) {
    throw new CheckoutError('Invalid checkout origin')
  }
  if (livemode ? origin.origin !== 'https://www.dyaneparis.com' : /(^|\.)dyaneparis\.com$/i.test(origin.hostname)) {
    throw new CheckoutError('Checkout origin does not match the configured mode')
  }
  return { mode, livemode, key, account, origin: origin.origin }
}

export function checkoutConfig(env = process.env) {
  if (env.STRIPE_CHECKOUT_ENABLED !== 'true') throw new CheckoutError('Checkout disabled')
  if (!env.STRIPE_DATABASE_URL) throw new CheckoutError('Order database required')
  const config = stripeEnvironment(env)
  if (config.livemode && (env.STRIPE_LIVE_READY !== 'true' || !/^whsec_\S+$/.test(env.STRIPE_WEBHOOK_SECRET ?? ''))) {
    throw new CheckoutError('Live checkout has not been configured for opening')
  }
  return config
}

export function commerceCheckoutConfig(env = process.env) {
  const config = checkoutConfig(env)
  const publishableKey = env.STRIPE_PUBLISHABLE_KEY ?? ''
  if (!(config.livemode ? /^pk_live_\S+$/ : /^pk_test_\S+$/).test(publishableKey)
    || !/^whsec_\S+$/.test(env.STRIPE_WEBHOOK_SECRET ?? '')
    || (config.livemode && !env.RESEND_API_KEY)) {
    throw new CheckoutError('Checkout services have not been configured for this environment')
  }
  return { ...config, publishableKey }
}

export function checkoutUsesAutomaticTax(livemode: boolean, commerce: boolean, env = process.env) {
  // Test checkout can exercise payment and fulfilment before Tax is configured.
  // Production and the legacy sandbox flows always require Stripe Tax.
  return livemode || !commerce || env.STRIPE_SANDBOX_SKIP_AUTOMATIC_TAX !== 'true'
}

export async function assertCheckoutAccount(stripe: Stripe, account: string, livemode: boolean, automaticTax: boolean) {
  if (livemode || automaticTax) return assertTaxReady(stripe, account, livemode)
  if ((await stripe.accounts.retrieve(null)).id !== account) throw new CheckoutError('Stripe account mismatch')
}

export function shopMode(env = process.env): 'sandbox' | 'live' | 'closed' {
  if (!isProductionDeployment(env)) return env.DYANE_CART_PREVIEW === 'true' ? 'sandbox' : 'closed'
  try { return commerceCheckoutConfig(env).livemode ? 'live' : 'closed' }
  catch { return 'closed' }
}

export function stripeClient(key: string) {
  return new Stripe(key, { apiVersion: '2026-10-28.endive', maxNetworkRetries: 2, timeout: 15_000 })
}

export function checkoutPayload(value: unknown) {
  if (!value || typeof value !== 'object') throw new CheckoutError('Invalid request', 400)
  const p = value as Record<string, unknown>
  if ('items' in p) {
    if (Object.keys(p).some(k => !['items', 'locale', 'attemptId', 'adultConfirmed', 'giftMessage', 'giftOptions', 'flow'].includes(k))
      || (p.flow !== undefined && p.flow !== 'commerce')
      || !['fr', 'en'].includes(String(p.locale)) || p.adultConfirmed !== true
      || typeof p.attemptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.attemptId)
      || (p.giftMessage !== undefined && !validGiftMessage(p.giftMessage))) throw new CheckoutError('Invalid request', 400)
    let options: GiftOptions
    try { options = giftOptions(p.giftOptions, typeof p.giftMessage === 'string' ? normalizeGiftMessage(p.giftMessage).trim() : '') }
    catch { throw new CheckoutError('Invalid gift options', 400) }
    return { giftOptions: options, items: validateCartItems(p.items), locale: p.locale as 'fr' | 'en', attemptId: p.attemptId,
      ...(p.flow === 'commerce' ? { flow: 'commerce' as const } : {}),
      giftMessage: typeof p.giftMessage === 'string' ? normalizeGiftMessage(p.giftMessage).trim() : '' }
  }
  if (Object.keys(p).some(k => !['sku', 'quantity', 'locale', 'attemptId', 'adultConfirmed'].includes(k))
    || typeof p.sku !== 'string' || !/^[a-z0-9-]{1,100}$/.test(p.sku)
    || !Number.isInteger(p.quantity) || Number(p.quantity) < 1 || Number(p.quantity) > 5
    || !['fr', 'en'].includes(String(p.locale))
    || typeof p.attemptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.attemptId)
    || p.adultConfirmed !== true) throw new CheckoutError('Invalid request', 400)
  return { sku: p.sku, quantity: Number(p.quantity), locale: p.locale as 'fr' | 'en', attemptId: p.attemptId }
}

export function validateCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > cartProducts.length * MAX_CART_QUANTITY_PER_SKU) throw new CheckoutError('Invalid cart', 400)
  const seen = new Set<string>()
  const totals = new Map<string, number>()
  return value.map(item => {
    if (!item || typeof item !== 'object' || Object.keys(item).some(k => !['sku', 'quantity', 'personalization', 'composition'].includes(k))
      || !cartProducts.some(p => p.sku === item.sku)
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY_PER_SKU
      || !validateComposition(item.sku, item.composition)
      || (item.personalization !== undefined && !validatePersonalization(item.sku, item.personalization))) throw new CheckoutError('Invalid cart', 400)
    const next: CartItem = { sku: item.sku, quantity: item.quantity,
      ...(item.composition ? { composition: item.composition } : {}),
      ...(item.personalization ? { personalization: { initials: item.personalization.initials, finish: item.personalization.finish } } : {}) }
    const key = cartLineKey(next)
    const quantity = (totals.get(item.sku) || 0) + item.quantity
    if (seen.has(key) || quantity > MAX_CART_QUANTITY_PER_SKU) throw new CheckoutError('Invalid cart', 400)
    seen.add(key)
    totals.set(item.sku, quantity)
    return next
  }).sort((a, b) => cartLineKey(a).localeCompare(cartLineKey(b)))
}

export async function assertTaxReady(stripe: Stripe, expectedAccount: string, livemode = false) {
  const [account, settings, registrations] = await Promise.all([
    stripe.accounts.retrieve(null), stripe.tax.settings.retrieve(),
    stripe.tax.registrations.list({ status: 'active', limit: 100 }),
  ])
  if (account.id !== expectedAccount || (livemode && !account.charges_enabled)
    || settings.livemode !== livemode || settings.status !== 'active'
    || !registrations.data.some(r => r.country === 'FR' && r.livemode === livemode)) {
    throw new CheckoutError('Stripe account and French Tax registration must match the configured mode')
  }
}
