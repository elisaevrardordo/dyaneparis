const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')

const store = load('lib/stripe/store.ts')
const { commerceIntegration } = load('lib/orders/fulfillment.ts')

async function testDatabase() {
  const db = new PGlite()
  for (const file of fs.readdirSync('database/stripe').filter(name => name.endsWith('.sql')).sort()) {
    await db.exec(fs.readFileSync(`database/stripe/${file}`, 'utf8'))
  }
  await db.exec(`INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active,preorder_enabled) VALUES
    ('dyane-sculpture-25cl','No.1 25 cl','price_no1_25',0,true,true),
    ('dyane-no2-25cl','No.2 25 cl','price_no2_25',0,true,true),
    ('dyane-sculpture-150cl','No.1 150 cl','price_no1_150',100,true,false),
    ('teo-for-dyane','Teo','price_teo',20,true,false)`)
  const pool = { connect: async () => ({ query: async (sql, args) => {
    const result = await db.query(sql, args)
    return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length }
  }, release() {} }) }
  return { db, transact: work => store.transaction(work, pool) }
}

const parameters = (id, subtotal, lines) => ({
  mode: 'payment', ui_mode: 'elements', integration_identifier: commerceIntegration,
  metadata: { dyane_order_id: id, dyane_subtotal: String(subtotal) },
  automatic_tax: { enabled: true }, line_items: lines.map(line => ({ price: line.price_id, quantity: line.quantity })),
})

test('zero-stock preorders are opted in, separated from stock, paid and replayed without touching physical inventory', async () => {
  const { db, transact } = await testDatabase()
  try {
    const attemptId = randomUUID()
    const items = [{ sku: 'dyane-sculpture-25cl', quantity: 1 }, { sku: 'dyane-no2-25cl', quantity: 1 }]
    const input = { attemptId, items, locale: 'fr', fulfillment: 'preorder' }
    const reserve = value => transact(client => store.reserveCartOrder(client, value, lines => parameters(value.attemptId, 11000, lines)))
    await assert.rejects(reserve({ ...input, items: [...items, { sku: 'dyane-sculpture-150cl', quantity: 1 }] }), /separately/)
    await reserve(input)
    await reserve(input)
    const session = { id: 'cs_test_order', livemode: false, client_reference_id: attemptId, mode: 'payment', currency: 'eur',
      metadata: { dyane_order_id: attemptId }, payment_status: 'paid', status: 'complete', amount_total: 13000,
      automatic_tax: { status: 'complete' }, shipping_cost: { amount_total: 2000 },
      collected_information: { shipping_details: { name: 'Fixture', address: { country: 'MC', postal_code: '98000' } } },
      line_items: { has_more: false, data: [{ quantity: 1, price: { id: 'price_no1_25' } }, { quantity: 1, price: { id: 'price_no2_25' } }] },
    }
    assert.equal((await transact(client => store.applySession(client, 'evt_new_order', session))).fulfillment, 'preorder')
    assert.equal(await transact(client => store.applySession(client, 'evt_new_order', session)), undefined)
    assert.deepEqual((await db.query('SELECT status,fulfillment FROM dyane_checkout_orders')).rows, [{ status: 'paid', fulfillment: 'preorder' }])
    assert.equal((await db.query("SELECT SUM(available)::int AS n FROM dyane_checkout_inventory WHERE sku LIKE '%25cl'")).rows[0].n, 0)
    await db.exec("UPDATE dyane_checkout_inventory SET preorder_enabled=false WHERE sku='dyane-no2-25cl'")
    await assert.rejects(reserve({ ...input, attemptId: randomUUID() }), /Item unavailable/)
  } finally { await db.close() }
})

test('a completed checkout outside the delivery zone is held for review and sends no order confirmation', async () => {
  const { db, transact } = await testDatabase()
  try {
    const attemptId = randomUUID()
    const input = { attemptId, items: [{ sku: 'dyane-sculpture-150cl', quantity: 1 }], locale: 'fr', fulfillment: 'stock' }
    await transact(client => store.reserveCartOrder(client, input, lines => parameters(attemptId, 18500, lines)))
    const session = { id: 'cs_test_outside', livemode: false, client_reference_id: attemptId, mode: 'payment', currency: 'eur',
      metadata: { dyane_order_id: attemptId }, payment_status: 'paid', status: 'complete', amount_total: 20000,
      automatic_tax: { status: 'complete' }, shipping_cost: { amount_total: 1500 },
      collected_information: { shipping_details: { address: { country: 'FR', postal_code: '97110' } } },
      line_items: { has_more: false, data: [{ quantity: 1, price: { id: 'price_no1_150' } }] },
    }
    assert.equal(await transact(client => store.applySession(client, 'evt_outside', session)), undefined)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'manual_review')
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-150cl'")).rows[0].available, 99)
  } finally { await db.close() }
})

test('Teo recipes are saved separately and consume the same physical inventory', async () => {
  const { db, transact } = await testDatabase()
  try {
    await db.exec("UPDATE dyane_checkout_inventory SET available=2 WHERE sku='teo-for-dyane'")
    const attemptId = randomUUID()
    const items = [{ sku: 'teo-for-dyane', quantity: 1, composition: 'no1' }, { sku: 'teo-for-dyane', quantity: 1, composition: 'no2' }]
    const input = { attemptId, items, locale: 'fr', fulfillment: 'stock' }
    const reserve = value => transact(client => store.reserveCartOrder(client, value, lines => parameters(value.attemptId, 114000, lines)))
    await reserve(input)
    await reserve(input)
    await assert.rejects(reserve({ ...input, attemptId: randomUUID(), items: [items[0]] }), /Item unavailable/)
    assert.deepEqual((await db.query('SELECT composition FROM dyane_checkout_order_items ORDER BY composition')).rows, [{ composition: 'no1' }, { composition: 'no2' }])
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='teo-for-dyane'")).rows[0].available, 0)
  } finally { await db.close() }
})

test('shipping validates the destination and signed order cookie before updating the Stripe session', async () => {
  const attemptId = randomUUID()
  const key = 'sk_test_fixture'
  const origin = 'http://localhost:3000'
  const sessionId = 'cs_test_fixture'
  const { orderAccessToken, orderCookieName } = load('lib/stripe/order-access.ts')
  const cookie = `${orderCookieName(attemptId)}=${orderAccessToken(attemptId, key)}`
  const changes = []
  let subtotal = '18500'
  const stripe = { checkout: { sessions: {
    retrieve: async () => ({ livemode: false, client_reference_id: attemptId, status: 'open', permissions: { update_shipping_details: 'server_only' } }),
    update: async (_id, value) => changes.push(value),
  } } }
  const { POST } = load('app/api/stripe/shipping/route.ts', {
    '@/lib/stripe/config': { ...load('lib/stripe/config.ts'), commerceCheckoutConfig: () => ({ origin, key, livemode: false }), stripeClient: () => stripe },
    '@/lib/stripe/store': { transaction: work => work({ query: async () => ({ rows: [{ session_id: sessionId, status: 'reserved', locale: 'fr',
      params: { integration_identifier: commerceIntegration, metadata: { dyane_subtotal: subtotal } } }] }) }) },
  })
  const request = (country, postal_code, withCookie = true) => new Request(`${origin}/api/stripe/shipping`, { method: 'POST',
    headers: withCookie ? { origin, cookie } : { origin }, body: JSON.stringify({ attemptId, sessionId,
      shippingDetails: { name: 'Fixture', address: { country, postal_code, city: 'Fixture', line1: 'Fixture' } } }),
  })
  assert.equal((await POST(request('FR', '75001', false))).status, 403)
  assert.equal((await POST(request('FR', '97110'))).status, 422)
  assert.equal((await POST(request('BE', '10000'))).status, 422)
  assert.equal(changes.length, 0)
  assert.equal((await POST(request('FR', '75001'))).status, 200)
  assert.equal((await POST(request('MC', '98000'))).status, 200)
  subtotal = '20001'
  assert.equal((await POST(request('MC', '98000'))).status, 200)
  assert.deepEqual(changes.map(change => change.shipping_options[0].shipping_rate_data.fixed_amount.amount), [1500, 2000, 0])
  assert.ok(changes.every(change => change.shipping_options[0].shipping_rate_data.tax_behavior === 'inclusive'))
})
