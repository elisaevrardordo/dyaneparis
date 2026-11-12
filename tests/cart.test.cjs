const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')
const cache = new Map()
const config = load('lib/stripe/config.ts', {}, cache)
const store = load('lib/stripe/store.ts', {}, cache)
const catalog = load('components/cart/catalog.ts')
const { shippingAmount } = load('lib/shipping.ts')
const items = [{ sku: 'dyane-sculpture-150cl', quantity: 1 }, { sku: 'dyane-sculpture-25cl', quantity: 1 }]
const payload = () => ({ items, locale: 'fr', attemptId: randomUUID(), adultConfirmed: true, giftMessage: 'Pour toi, avec affection.' })

async function setup() {
  const pg = new PGlite()
  for (const file of ['001_checkout.sql', '002_payment_snapshot.sql', '003_cart_items.sql', '004_gift_message_limits.sql', '005_gift_options.sql', '006_personalized_order_items.sql']) await pg.exec(fs.readFileSync('database/stripe/' + file, 'utf8'))
  const db = { query: async (sql, args) => {
    const result = await pg.query(sql, args)
    return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length }
  }, release() {} }
  const pool = { connect: async () => db, query: (...args) => db.query(...args) }
  for (const [sku, amount] of [['dyane-sculpture-150cl', 18500], ['dyane-sculpture-25cl', 5500]]) {
    await db.query('INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active) VALUES ($1,$1,$2,5,true)', [sku, 'price_' + amount])
  }
  return { pg, db, pool }
}
const params = lines => ({ mode: 'payment', line_items: lines.map(i => ({ price: i.price_id, quantity: i.quantity })) })

test('persistent cart sanitizes untrusted data and computes integer-cent totals', () => {
  assert.equal(catalog.cartSubtotal(items), 24000)
  assert.equal(catalog.cartSubtotal([{ sku: 'dyane-sculpture-25cl', quantity: 2 }]), 11000)
  assert.equal(catalog.cleanCart([{ sku: 'unknown', quantity: 2 }]).length, 0)
  assert.equal(catalog.cleanCart([{ sku: 'dyane-sculpture-25cl', quantity: 99 }])[0].quantity, 5)
  assert.equal(catalog.cleanCart([...items, { sku: 'dyane-sculpture-25cl', quantity: 2 }]).find(i => i.sku === 'dyane-sculpture-25cl').quantity, 3)
  assert.equal(catalog.cleanCart(null).length, 0)
})

test('Teo cocktail choices use distinct lines with a shared SKU and quantity cap', () => {
  const sku = catalog.TEO_ARTWORK_SKU
  const no1 = { sku, quantity: 1, composition: 'no1' }
  const no2 = { sku, quantity: 2, composition: 'no2' }
  const cleaned = catalog.cleanCart([no1, no2, no1])
  assert.equal(cleaned.length, 2)
  assert.equal(cleaned[0].quantity, 2)
  assert.equal(cleaned[1].quantity, 2)
  assert.notEqual(catalog.cartLineKey(no1), catalog.cartLineKey(no2))
  assert.equal(catalog.cartSubtotal(cleaned), 4 * 57_000)
  assert.deepEqual(Array.from(config.validateCartItems([no2, no1]), line => line.composition), ['no1', 'no2'])
  assert.throws(() => config.validateCartItems([{ sku, quantity: 1 }]))
  assert.throws(() => config.validateCartItems([{ ...no1, composition: 'other' }]))
  assert.throws(() => config.validateCartItems([{ ...no1, sku: 'dyane-no2-150cl' }]))
  assert.throws(() => config.validateCartItems([{ ...no1, personalization: { initials: 'A', finish: 'gold' } }]))
  assert.throws(() => config.validateCartItems([{ ...no1, quantity: 4 }, no2]))
  assert.equal(catalog.cleanCart([{ ...no1, quantity: 4 }, no2])[1].quantity, 1)
})

test('French delivery is free only above the €200 order subtotal', () => {
  assert.equal(shippingAmount(19_999), 1500)
  assert.equal(shippingAmount(20_000), 1500)
  assert.equal(shippingAmount(20_001), 0)
})

test('cart API rejects price overrides, duplicate/unknown SKUs, excess quantities and invalid gift notes', () => {
  assert.equal(config.checkoutPayload(payload()).items.length, 2)
  for (const change of [{ items: [] }, { items: [items[0], items[0]] }, { items: [{ sku: 'other', quantity: 1 }] },
    { items: [{ ...items[0], quantity: 6 }] }, { items: [{ ...items[0], price: 1 }] },
    { amount: 1 }, { giftMessage: 'x'.repeat(501) }, { adultConfirmed: false }]) {
    assert.throws(() => config.checkoutPayload({ ...payload(), ...change }))
  }
})

test('multi-item stock reservation is atomic and idempotent, including the gift note', async () => {
  const { pg, db, pool } = await setup()
  try {
    const input = config.checkoutPayload(payload())
    await store.transaction(c => store.reserveCartOrder(c, input, params), pool)
    await store.transaction(c => store.reserveCartOrder(c, input, () => { throw Error('Must reuse params') }), pool)
    assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_checkout_orders')).rows[0].n, 1)
    assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_checkout_order_items')).rows[0].n, 2)
    assert.equal((await db.query('SELECT gift_message FROM dyane_checkout_orders')).rows[0].gift_message, input.giftMessage)
    assert.ok((await db.query('SELECT available FROM dyane_checkout_inventory')).rows.every(r => r.available === 4))
    await assert.rejects(store.transaction(c => store.reserveCartOrder(c, { ...input, giftMessage: 'Changed' }, params), pool))
    await db.query("UPDATE dyane_checkout_inventory SET available=0 WHERE sku='dyane-sculpture-25cl'")
    await assert.rejects(store.transaction(c => store.reserveCartOrder(c, { ...input, attemptId: randomUUID() }, params), pool))
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-150cl'")).rows[0].available, 4)
  } finally { await pg.close() }
})

test('multi-item webhook verifies every line, handles duplicates and releases all stock once', async () => {
  const { pg, db, pool } = await setup()
  try {
    const input = config.checkoutPayload(payload())
    await store.transaction(c => store.reserveCartOrder(c, input, params), pool)
    const session = { id: 'cs_test_cart', livemode: false, mode: 'payment', currency: 'eur', metadata: { dyane_order_id: input.attemptId },
      client_reference_id: input.attemptId, status: 'expired', payment_status: 'unpaid',
      line_items: { data: [{ price: { id: 'price_5500' }, quantity: 1 }, { price: { id: 'price_18500' }, quantity: 1 }], has_more: false } }
    await assert.rejects(store.transaction(c => store.applySession(c, 'evt_wrong', { ...session, line_items: { data: [session.line_items.data[0]], has_more: false } }), pool))
    await store.transaction(c => store.applySession(c, 'evt_expired', session), pool)
    await store.transaction(c => store.applySession(c, 'evt_expired', session), pool)
    assert.ok((await db.query('SELECT available FROM dyane_checkout_inventory')).rows.every(r => r.available === 5))
    await db.query("UPDATE dyane_checkout_inventory SET available=0 WHERE sku='dyane-sculpture-25cl'")
    await store.transaction(c => store.applySession(c, 'evt_late_paid', { ...session, status: 'complete', payment_status: 'paid' }), pool)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'manual_review')
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-150cl'")).rows[0].available, 5)
  } finally { await pg.close() }
})

test('same Checkout endpoint creates both server-priced lines and keeps gift text out of Stripe metadata', async () => {
  const { pg, db, pool } = await setup()
  const env = { STRIPE_CHECKOUT_ENABLED: 'true', STRIPE_SECRET_KEY: 'rk_test_fixture', STRIPE_DATABASE_URL: 'fixture',
    STRIPE_ACCOUNT_ID: 'acct_fixture', STRIPE_SITE_URL: 'http://localhost:3000' }
  const previous = Object.fromEntries(Object.keys(env).map(k => [k, process.env[k]]))
  Object.assign(process.env, env)
  const calls = []
  const stripe = {
    accounts: { retrieve: async () => ({ id: 'acct_fixture' }) },
    tax: { settings: { retrieve: async () => ({ status: 'active', livemode: false }) }, registrations: { list: async () => ({ data: [{ country: 'FR', livemode: false }] }) } },
    prices: { retrieve: async id => ({ id, active: true, livemode: false, type: 'one_time', currency: 'eur',
      unit_amount: Number(id.split('_')[1]), tax_behavior: 'inclusive', product: { active: true, tax_code: 'txcd_fixture' } }) },
    checkout: { sessions: { create: async (params, options) => { calls.push({ params, options }); return { id: `cs_test_${params.client_reference_id}`, url: 'https://checkout.stripe.com/c/pay/cart', status: 'open', livemode: false } } } },
  }
  const mocks = { './config': { ...config, stripeClient: () => stripe }, './store': { ...store, orderPool: () => pool, transaction: work => store.transaction(work, pool) } }
  const checkout = load('lib/stripe/checkout.ts', mocks)
  const { cartSummary } = load('lib/stripe/cart-summary.ts', mocks)
  try {
    const input = config.checkoutPayload(payload())
    const free = await cartSummary(input.items)
    const standard = await cartSummary([items[0]])
    assert.equal(free.checkoutAvailable, true)
    assert.equal(free.shipping, 0)
    assert.equal(free.total, 24000)
    assert.equal(standard.checkoutAvailable, true)
    assert.equal(standard.shipping, 1500)
    assert.equal(standard.total, 20000)
    await checkout.createCheckout(input)
    await checkout.createCheckout(input)
    assert.equal(JSON.stringify(calls[0]), JSON.stringify(calls[1]))
    assert.equal(calls[0].params.line_items.length, 2)
    assert.equal(calls[0].params.automatic_tax.enabled, true)
    assert.equal(calls[0].params.invoice_creation.enabled, true)
    assert.equal(calls[0].params.shipping_options.length, 1)
    assert.equal(calls[0].params.shipping_options[0].shipping_rate_data.fixed_amount.amount, free.shipping)
    await checkout.createCheckout({ ...input, attemptId: randomUUID(), items: [items[0]] })
    assert.equal(calls[2].params.shipping_options[0].shipping_rate_data.fixed_amount.amount, standard.shipping)
    assert.match(calls[0].params.success_url, /\/panier\?result=returned$/)
    assert.ok(!JSON.stringify(calls).includes(input.giftMessage))
    assert.equal((await db.query('SELECT gift_message FROM dyane_checkout_orders WHERE id=$1', [input.attemptId])).rows[0].gift_message, input.giftMessage)
  } finally {
    for (const [k,v] of Object.entries(previous)) { if (v === undefined) delete process.env[k]; else process.env[k] = v }
    await pg.close()
  }
})
