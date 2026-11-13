import 'server-only'
import { giftOptions, type GiftOptions } from '../gifts/options'
import { Pool, type PoolClient } from 'pg'
import type Stripe from 'stripe'
import { CheckoutError, validateCartItems } from './config'
import { orderDatabaseUrl } from '../deployment'
import { cartLineKey, type CartItem, type Personalization } from '@/components/cart/catalog'
import { normalizeGiftMessage, validGiftMessage } from '../gifts/message'
import { commerceIntegration, isSingleFulfillment, type Fulfillment } from '../orders/fulfillment'
import { isManualShippingLine, isManualVatCocktail, manualVatFromMetadata, verifyManualVatSession } from './manualVat'
import { isDeliveryCountry, isDeliveryPostcode, shippingAmount } from '../shipping'

let pool: Pool | undefined
export function orderPool() {
  const connectionString = orderDatabaseUrl()
  if (!connectionString) throw new CheckoutError('Order database required')
  pool ??= new Pool({ connectionString, max: 5, connectionTimeoutMillis: 5000 })
  return pool
}

export type Order = {
  id: string; sku: string; quantity: number; locale: 'fr' | 'en'; status: string
  price_id: string; session_id: string | null; params: Stripe.Checkout.SessionCreateParams
  created_at: Date; payment_snapshot?: Record<string, unknown>
  fulfillment?: Fulfillment
}

export async function transaction<T>(work: (db: PoolClient) => Promise<T>, source = orderPool()): Promise<T> {
  const db = await source.connect()
  try {
    await db.query('BEGIN')
    const result = await work(db)
    await db.query('COMMIT')
    return result
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  } finally { db.release() }
}

export async function reserveOrder(db: PoolClient, input: { attemptId: string; sku: string; quantity: number; locale: 'fr' | 'en' },
  makeParams: (priceId: string) => Stripe.Checkout.SessionCreateParams) {
  // Serialize retries of this attempt even when no order exists yet.
  await db.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [input.attemptId])
  const existing = await db.query<Order>('SELECT * FROM dyane_checkout_orders WHERE id = $1 FOR UPDATE', [input.attemptId])
  const order = existing.rows[0]
  if (order) {
    if (order.sku !== input.sku || order.quantity !== input.quantity || order.locale !== input.locale) throw new CheckoutError('Attempt already used', 409)
    const lines = await db.query<{ personalization: Personalization | null }>('SELECT personalization FROM dyane_checkout_order_items WHERE order_id=$1', [order.id])
    if (lines.rows.some(line => line.personalization) || ['dyane-cart-kmptxqaz', commerceIntegration].includes(order.params.integration_identifier ?? '')
      || (order.params.line_items && order.params.line_items.length !== 1)) throw new CheckoutError('Attempt already used by a cart', 409)
    if (!['reserved', 'pending'].includes(order.status) || Date.now() - new Date(order.created_at).getTime() > 30 * 60_000) {
      throw new CheckoutError('Attempt expired; start again', 409)
    }
    return order
  }
  const inventory = await db.query<{ price_id: string }>(`UPDATE dyane_checkout_inventory SET available = available - $2
    WHERE sku = $1 AND active = true AND available >= $2 RETURNING price_id`, [input.sku, input.quantity])
  if (!inventory.rows[0]) throw new CheckoutError('Item unavailable', 409)
  const params = makeParams(inventory.rows[0].price_id)
  const inserted = await db.query<Order>(`INSERT INTO dyane_checkout_orders (id, sku, quantity, locale, price_id, params)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [input.attemptId, input.sku, input.quantity, input.locale, inventory.rows[0].price_id, params])
  return inserted.rows[0]
}

export type ReservedCartItem = CartItem & { price_id: string }
export async function reserveCartOrder(db: PoolClient, input: {
  attemptId: string; items: CartItem[]; locale: 'fr' | 'en'; giftMessage?: string; giftOptions?: GiftOptions; fulfillment?: Fulfillment
}, makeParams: (items: ReservedCartItem[]) => Stripe.Checkout.SessionCreateParams) {
  if (!validGiftMessage(input.giftMessage ?? '')) throw new CheckoutError('Invalid gift message', 400)
  input = { ...input, giftMessage: normalizeGiftMessage(input.giftMessage ?? '').trim() }
  let options: GiftOptions
  try { options = giftOptions(input.giftOptions, input.giftMessage) } catch { throw new CheckoutError('Invalid gift options', 400) }
  const items = validateCartItems(input.items)
  if (input.fulfillment && !isSingleFulfillment(items, input.fulfillment)) throw new CheckoutError('Fulfillment groups must be ordered separately', 400)
  await db.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [input.attemptId])
  const existing = await db.query<Order & { gift_message: string; gift_options: GiftOptions }>('SELECT * FROM dyane_checkout_orders WHERE id=$1 FOR UPDATE', [input.attemptId])
  if (existing.rows[0]) {
    const order = existing.rows[0]
    const stored = await db.query<CartItem & { personalization: Personalization | null }>(
      `SELECT sku,quantity,personalization,to_jsonb(item)->>'composition' AS composition
       FROM dyane_checkout_order_items item WHERE order_id=$1 ORDER BY line_key`, [order.id])
    const previous: CartItem[] = stored.rows.length ? stored.rows.map(i => ({ sku: i.sku, quantity: i.quantity,
      ...(i.personalization ? { personalization: { initials: i.personalization.initials, finish: i.personalization.finish } } : {}),
      ...(i.composition ? { composition: i.composition } : {}) })) : [{ sku: order.sku, quantity: order.quantity }]
    previous.sort((a, b) => cartLineKey(a).localeCompare(cartLineKey(b)))
    if (JSON.stringify(previous) !== JSON.stringify(items) || order.locale !== input.locale
      || (order.fulfillment ?? 'stock') !== (input.fulfillment ?? 'stock')
      || order.gift_message !== (input.giftMessage || '') || order.gift_options.isGift !== options.isGift) throw new CheckoutError('Attempt already used', 409)
    if (!['reserved', 'pending'].includes(order.status) || Date.now() - new Date(order.created_at).getTime() > 30 * 60_000) throw new CheckoutError('Attempt expired', 409)
    return order
  }
  const totals = new Map<string, number>()
  for (const item of items) totals.set(item.sku, (totals.get(item.sku) || 0) + item.quantity)
  const prices = new Map<string, string>()
  // Lock and reserve aggregate quantities once per SKU in stable order.
  for (const [sku, quantity] of [...totals].sort(([a], [b]) => a.localeCompare(b))) {
    const stock = input.fulfillment === 'preorder'
      ? await db.query<{ price_id: string }>(`SELECT price_id FROM dyane_checkout_inventory
          WHERE sku=$1 AND active AND preorder_enabled FOR SHARE`, [sku])
      : await db.query<{ price_id: string }>(`UPDATE dyane_checkout_inventory SET available=available-$2
          WHERE sku=$1 AND active AND available >= $2 RETURNING price_id`, [sku, quantity])
    if (!stock.rows[0]) throw new CheckoutError('Item unavailable', 409)
    prices.set(sku, stock.rows[0].price_id)
  }
  const reserved = items.map(item => ({ ...item, price_id: prices.get(item.sku) as string }))
  const params = makeParams(reserved)
  const first = reserved[0]
  const result = await db.query<Order>(`INSERT INTO dyane_checkout_orders (id,sku,quantity,locale,price_id,params,gift_message,gift_options)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [input.attemptId, first.sku, first.quantity, input.locale, first.price_id, params, input.giftMessage || '', options])
  for (const item of reserved) {
    const values = [input.attemptId, item.sku, item.quantity, item.price_id, cartLineKey(item), item.personalization || null]
    if (item.composition) {
      await db.query(`INSERT INTO dyane_checkout_order_items (order_id,sku,quantity,price_id,line_key,personalization,composition)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`, [...values, item.composition])
    } else {
      await db.query(`INSERT INTO dyane_checkout_order_items (order_id,sku,quantity,price_id,line_key,personalization)
        VALUES ($1,$2,$3,$4,$5,$6)`, values)
    }
  }
  if (input.fulfillment === 'preorder') {
    await db.query(`UPDATE dyane_checkout_orders SET fulfillment='preorder' WHERE id=$1`, [input.attemptId])
    result.rows[0].fulfillment = 'preorder'
  }
  return result.rows[0]
}

type CheckoutOrderItem = Pick<ReservedCartItem, 'sku' | 'quantity' | 'price_id' | 'composition'>
export type PaidCheckoutOrder = { id: string; items: CheckoutOrderItem[]; fulfillment?: Fulfillment }

// All state changes and event deduplication commit together. Never ship from a redirect.
export async function applySession(db: PoolClient, eventId: string, session: Stripe.Checkout.Session, eventType = '', livemode = false): Promise<PaidCheckoutOrder | undefined> {
  if (session.livemode !== livemode || !session.metadata?.dyane_order_id) return
  const result = await db.query<Order>('SELECT * FROM dyane_checkout_orders WHERE id::text = $1 FOR UPDATE', [session.metadata.dyane_order_id])
  const order = result.rows[0]
  if (!order) throw new Error('Unknown Dyane order')
  if (order.session_id && order.session_id !== session.id) throw new Error('Session mismatch')
  const storedItems = await db.query<CheckoutOrderItem>(
    `SELECT sku,quantity,price_id,to_jsonb(item)->>'composition' AS composition
     FROM dyane_checkout_order_items item WHERE order_id=$1 ORDER BY sku,line_key`, [order.id])
  const items: CheckoutOrderItem[] = storedItems.rows.length ? storedItems.rows.map(({ composition, ...item }) => (
    composition ? { ...item, composition } : item
  )) : [{ sku: order.sku, quantity: order.quantity, price_id: order.price_id }]
  const manualVat = manualVatFromMetadata(order.params.metadata)
  const lines = session.line_items
  const productLines = manualVat ? lines?.data.filter(line => !isManualShippingLine(line)) : lines?.data
  // Stripe may coalesce equal-price lines; verify total quantities by price without losing our per-line options.
  const quantities = (entries: { price: string | undefined; quantity: number | null }[]) => {
    const totals = new Map<string, number>()
    for (const entry of entries) {
      if (!entry.price || !Number.isInteger(entry.quantity) || Number(entry.quantity) < 1) return ''
      totals.set(entry.price, (totals.get(entry.price) || 0) + Number(entry.quantity))
    }
    return [...totals].sort(([a], [b]) => a.localeCompare(b)).map(([price, quantity]) => `${price}/${quantity}`).join('|')
  }
  const expected = quantities(items.map(i => ({ price: i.price_id, quantity: i.quantity })))
  const received = quantities(productLines?.map(i => ({ price: i.price?.id, quantity: i.quantity })) || [])
  if (session.mode !== 'payment' || session.currency !== 'eur' || session.client_reference_id !== order.id
    || !lines || lines.has_more || !expected || expected !== received) throw new Error('Order contents mismatch')
  const commerce = order.params.integration_identifier === commerceIntegration
  if (livemode && !commerce) throw new Error('Order integration mismatch')
  for (const [key, value] of Object.entries(order.params.metadata || {})) {
    if (key.startsWith('dyane_line_') && session.metadata?.[key] !== value) throw new Error('Personalization metadata mismatch')
  }
  const inserted = await db.query(`INSERT INTO dyane_checkout_events (id, order_id) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING id`, [eventId, order.id])
  if (!inserted.rowCount) return
  const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice?.id ?? null
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null
  if (['paid', 'manual_review'].includes(order.status)) {
    // The post-payment invoice may become available after checkout.session.completed.
    // Fill references without allowing a later notification to undo payment or stock.
    await db.query(`UPDATE dyane_checkout_orders SET payment_snapshot=payment_snapshot || jsonb_strip_nulls($2::jsonb),
      updated_at=now() WHERE id=$1`, [order.id, { invoiceId, paymentIntentId }])
    return
  }
  let next = session.payment_status === 'paid' ? 'paid'
    : session.status === 'expired' || eventType === 'checkout.session.async_payment_failed' ? 'expired' : 'pending'
  if (next === 'paid' && order.status === 'expired') {
    if (order.fulfillment !== 'preorder') {
      await db.query('SAVEPOINT late_stock')
      for (const item of items) {
        const stock = await db.query(`UPDATE dyane_checkout_inventory SET available = available - $2
          WHERE sku = $1 AND available >= $2 RETURNING sku`, [item.sku, item.quantity])
        if (!stock.rowCount) { next = 'manual_review'; break }
      }
      if (next === 'manual_review') await db.query('ROLLBACK TO SAVEPOINT late_stock')
      await db.query('RELEASE SAVEPOINT late_stock')
    }
  } else if (next === 'expired' && order.status !== 'expired') {
    if (order.fulfillment !== 'preorder') {
      for (const item of items) await db.query('UPDATE dyane_checkout_inventory SET available = available + $2 WHERE sku = $1', [item.sku, item.quantity])
    }
  } else if (order.status === 'expired') {
    // A stale pending notification cannot reopen a released reservation.
    next = 'expired'
  }
  if (next === 'paid' && order.params.automatic_tax?.enabled && session.automatic_tax?.status !== 'complete') next = 'manual_review'
  const delivery = commerce ? session.collected_information?.shipping_details : undefined
  const country = delivery?.address.country
  const subtotal = Number(order.params.metadata?.dyane_subtotal)
  if (next === 'paid' && commerce) {
    if (manualVat) {
      if (!items.every(item => isManualVatCocktail(item.sku)) || !verifyManualVatSession(session, manualVat, subtotal)) next = 'manual_review'
    } else if (!isDeliveryCountry(country) || !isDeliveryPostcode(country, delivery?.address.postal_code)
      || !Number.isSafeInteger(subtotal) || subtotal <= 0
      || session.shipping_cost?.amount_total !== shippingAmount(subtotal, country)
      || session.amount_total !== subtotal + shippingAmount(subtotal, country)) next = 'manual_review'
  }
  const snapshot = {
    currency: session.currency, amountSubtotal: manualVat ? subtotal : session.amount_subtotal, amountTotal: session.amount_total,
    amountTax: session.total_details?.amount_tax,
    amountShipping: manualVat && isDeliveryCountry(country) ? shippingAmount(subtotal, country) : session.total_details?.amount_shipping,
    taxStatus: session.automatic_tax?.status, paymentStatus: session.payment_status,
    invoiceId, paymentIntentId, ...(delivery ? { delivery } : {}),
  }
  await db.query(`UPDATE dyane_checkout_orders SET status=$2, session_id=$3, payment_snapshot=$4, updated_at=now() WHERE id=$1`,
    [order.id, next, session.id, snapshot])

  return next === 'paid' ? { id: order.id, items, fulfillment: order.fulfillment ?? 'stock' } : undefined
}
