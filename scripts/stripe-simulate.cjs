const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs')
const { Pool } = require('pg')
const Stripe = require('stripe')
const { loadEnvConfig } = require('@next/env')
const { load } = require('../tests/helpers/load-stripe.cjs')

async function main() {
  loadEnvConfig(process.cwd(), false, { info() {}, error() {} })
  if (!process.env.STRIPE_DATABASE_URL) throw Error('Local PostgreSQL is required: npm run stripe:db')
  const databaseUrl = new URL(process.env.STRIPE_DATABASE_URL)
  if (!['127.0.0.1', 'localhost'].includes(databaseUrl.hostname) || databaseUrl.pathname !== '/dyane_stripe_sandbox') {
    throw Error('Simulations may run only on the dedicated local sandbox database')
  }
  // Overrides exist in this process only. No user API key is read, printed, or sent.
  Object.assign(process.env, {
    STRIPE_CHECKOUT_ENABLED: 'true', STRIPE_SECRET_KEY: 'rk_test_local_simulation',
    STRIPE_WEBHOOK_SECRET: 'whsec_local_simulation', STRIPE_ACCOUNT_ID: 'acct_1UWul7JqLuPXMAFh',
    STRIPE_SITE_URL: 'http://localhost:3000',
  })
  const catalog = JSON.parse(readFileSync('data/stripe-sandbox-catalog.json', 'utf8'))
  const schema = 'dyane_simulation_' + randomUUID().replaceAll('-', '')
  const admin = new Pool({ connectionString: process.env.STRIPE_DATABASE_URL })
  await admin.query(`CREATE SCHEMA ${schema}`)
  const pool = new Pool({ connectionString: process.env.STRIPE_DATABASE_URL, max: 10, options: `-c search_path=${schema}` })
  const report = {
    mode: 'local_application_simulation', stripeNetworkUsed: false,
    taxSource: '20% reference fixture, not a Stripe Tax calculation',
    shippingSource: 'Application rate for France passed to simulated Stripe Checkout',
    database: 'real PostgreSQL with concurrent connections', schema, orders: [], checks: [],
  }
  try {
    for (const migration of ['001_checkout.sql', '002_payment_snapshot.sql', '003_cart_items.sql', '004_gift_message_limits.sql', '005_gift_options.sql', '006_personalized_order_items.sql']) await pool.query(readFileSync('database/stripe/' + migration, 'utf8'))
    for (const item of catalog.products) await pool.query(`INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active)
      VALUES ($1,$2,$3,10,true)`, [item.sku, item.label, item.priceId])
    const store = load('lib/stripe/store.ts')
    const config = load('lib/stripe/config.ts')
    const { shippingAmount } = load('lib/shipping.ts')
    assert.equal(shippingAmount(19_999), 1_500)
    assert.equal(shippingAmount(20_000), 1_500)
    assert.equal(shippingAmount(20_001), 0)
    const sessions = new Map()
    const idempotency = new Map()
    let taxReady = true
    const signatures = new Stripe('rk_test_local_simulation')
    const stripe = {
      accounts: { retrieve: async () => ({ id: catalog.account }) },
      tax: { settings: { retrieve: async () => ({ status: taxReady ? 'active' : 'pending', livemode: false }) },
        registrations: { list: async () => ({ data: [{ country: 'FR', livemode: false }] }) } },
      prices: { retrieve: async id => {
        const item = catalog.products.find(p => p.priceId === id)
        assert.ok(item)
        return { id, active: true, livemode: false, type: 'one_time', currency: 'eur', unit_amount: item.unitAmount,
          tax_behavior: 'inclusive', product: { active: true, tax_code: 'txcd_41020002' } }
      } },
      webhooks: signatures.webhooks,
      checkout: { sessions: {
        create: async (params, options) => {
          if (idempotency.has(options.idempotencyKey)) return idempotency.get(options.idempotencyKey)
          const lines = params.line_items.map(({ price, quantity }) => {
            const item = catalog.products.find(p => p.priceId === price)
            assert.ok(item)
            return { price: { id: price, unit_amount: item.unitAmount }, quantity }
          })
          const subtotal = lines.reduce((sum, line) => sum + line.price.unit_amount * line.quantity, 0)
          assert.equal(params.shipping_address_collection.allowed_countries.join(','), 'FR')
          assert.equal(params.shipping_options.length, 1)
          const rate = params.shipping_options[0].shipping_rate_data
          assert.equal(rate.type, 'fixed_amount')
          assert.equal(rate.tax_behavior, 'inclusive')
          assert.equal(rate.fixed_amount.currency, 'eur')
          const shipping = rate.fixed_amount.amount
          assert.equal(shipping, shippingAmount(subtotal))
          const total = subtotal + shipping
          const id = 'cs_test_simulated_' + randomUUID().replaceAll('-', '')
          const session = { id, url: `https://checkout.stripe.com/c/pay/${id}`, mode: 'payment', currency: 'eur', livemode: false,
            status: 'open', payment_status: 'unpaid', client_reference_id: params.client_reference_id, metadata: params.metadata,
            amount_total: total, amount_subtotal: subtotal, total_details: { amount_tax: Math.round(total / 6), amount_shipping: shipping },
            automatic_tax: { enabled: true, status: 'complete' },
            line_items: { data: lines, has_more: false },
            invoice: null, payment_intent: null }
          sessions.set(id, session); idempotency.set(options.idempotencyKey, session)
          return session
        },
        retrieve: async id => sessions.get(id),
      } },
    }
    const storage = { ...store, orderPool: () => pool, transaction: work => store.transaction(work, pool) }
    const configuration = { ...config, stripeClient: () => stripe }
    const checkout = load('lib/stripe/checkout.ts', { './config': configuration, './store': storage })
    const route = load('app/api/stripe/checkout/route.ts', { '@/lib/stripe/config': configuration, '@/lib/stripe/checkout': checkout })
    const webhook = load('app/api/stripe/webhook/route.ts', { '@/lib/stripe/config': configuration, '@/lib/stripe/store': storage })
    const post = body => route.POST(new Request('http://localhost:3000/api/stripe/checkout', {
      method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' }, body: JSON.stringify(body),
    }))
    async function notify(session, type, id = 'evt_simulated_' + randomUUID()) {
      const body = JSON.stringify({ id, type, livemode: false, data: { object: session } })
      const signature = signatures.webhooks.generateTestHeaderString({ payload: body, secret: process.env.STRIPE_WEBHOOK_SECRET })
      return webhook.POST(new Request('http://localhost:3000/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': signature } }))
    }
    for (const item of catalog.products) {
      const attemptId = randomUUID()
      const payload = { sku: item.sku, quantity: 1, locale: 'fr', attemptId, adultConfirmed: true }
      const response = await post(payload)
      assert.equal(response.status, 200)
      const url = (await response.json()).url
      const retry = await post(payload)
      assert.equal((await retry.json()).url, url)
      const session = sessions.get(url.split('/').pop())
      assert.equal((await pool.query('SELECT available FROM dyane_checkout_inventory WHERE sku=$1', [item.sku])).rows[0].available, 9)
      session.status = 'complete'; session.payment_status = 'paid'
      session.payment_intent = 'pi_simulated_' + item.sku
      const eventId = 'evt_simulated_' + randomUUID()
      assert.equal((await notify(session, 'checkout.session.completed', eventId)).status, 200)
      assert.equal((await notify(session, 'checkout.session.completed', eventId)).status, 200)
      session.invoice = 'in_simulated_' + item.sku
      assert.equal((await notify({ id: session.invoice, metadata: session.metadata }, 'invoice.paid')).status, 200)
      assert.equal((await notify(session, 'checkout.session.expired')).status, 200)
      const row = (await pool.query('SELECT * FROM dyane_checkout_orders WHERE id=$1', [attemptId])).rows[0]
      assert.equal(row.status, 'paid')
      const expectedTotal = item.unitAmount + 1_500
      assert.equal(row.payment_snapshot.amountSubtotal, item.unitAmount)
      assert.equal(row.payment_snapshot.amountShipping, 1_500)
      assert.equal(row.payment_snapshot.amountTotal, expectedTotal)
      assert.equal(row.payment_snapshot.amountTax, Math.round(expectedTotal / 6))
      assert.equal(row.payment_snapshot.invoiceId, session.invoice)
      assert.equal((await pool.query('SELECT available FROM dyane_checkout_inventory WHERE sku=$1', [item.sku])).rows[0].available, 9)
      report.orders.push({ sku: item.sku, quantity: 1, subtotalCents: item.unitAmount, shippingCents: 1_500, grossCents: expectedTotal,
        referenceVatCents: row.payment_snapshot.amountTax, referenceNetCents: expectedTotal - row.payment_snapshot.amountTax,
        status: row.status, invoice: 'simulated', stockBefore: 10, stockAfter: 9 })
    }
    report.checks.push('Both full local handler flows: checkout, retry, signed payment event, financial snapshot, invoice reference and stock')
    report.checks.push('Duplicate events and expired-event delivery cannot duplicate or revert a paid order')
    report.checks.push('A delayed invoice.paid event fills the invoice reference after payment without changing stock')
    const first = catalog.products[0]
    taxReady = false
    assert.equal((await post({ sku: first.sku, quantity: 1, locale: 'fr', attemptId: randomUUID(), adultConfirmed: true })).status, 503)
    taxReady = true
    assert.equal((await pool.query('SELECT available FROM dyane_checkout_inventory WHERE sku=$1', [first.sku])).rows[0].available, 9)
    report.checks.push('Missing Tax setup blocks checkout before reserving stock')
    const abandoned = { sku: first.sku, quantity: 1, locale: 'fr', attemptId: randomUUID(), adultConfirmed: true }
    const abandonedUrl = (await (await post(abandoned)).json()).url
    const abandonedSession = sessions.get(abandonedUrl.split('/').pop())
    abandonedSession.status = 'expired'
    assert.equal((await notify(abandonedSession, 'checkout.session.expired')).status, 200)
    assert.equal((await notify(abandonedSession, 'checkout.session.expired')).status, 200)
    assert.equal((await pool.query('SELECT available FROM dyane_checkout_inventory WHERE sku=$1', [first.sku])).rows[0].available, 9)
    report.checks.push('Expired session releases its reservation exactly once')
    const giftInput = { items: [{ sku: first.sku, quantity: 1 }], locale: 'fr', attemptId: randomUUID(), adultConfirmed: true, giftMessage: 'Une attention pour toi.\nAvec toute mon affection,\nLa Maison Dyane Paris' }
    const giftResponse = await post(giftInput)
    assert.equal(giftResponse.status, 200)
    const giftUrl = (await giftResponse.json()).url
    const giftSession = sessions.get(giftUrl.split('/').pop())
    const printableQuery = "SELECT id FROM dyane_checkout_orders WHERE id=$1 AND status='paid' AND payment_snapshot->>'paymentStatus'='paid' AND gift_message <> ''"
    assert.equal((await pool.query(printableQuery, [giftInput.attemptId])).rowCount, 0)
    giftSession.status = 'complete'; giftSession.payment_status = 'paid'; giftSession.invoice = 'in_simulated_gift'
    assert.equal((await notify(giftSession, 'checkout.session.completed')).status, 200)
    const giftOrder = (await pool.query('SELECT gift_message,params FROM dyane_checkout_orders WHERE id=$1', [giftInput.attemptId])).rows[0]
    assert.equal(giftOrder.gift_message, giftInput.giftMessage)
    assert.ok(!JSON.stringify(giftOrder.params).includes(giftInput.giftMessage))
    assert.equal((await pool.query(printableQuery, [giftInput.attemptId])).rowCount, 1)
    await assert.rejects(pool.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['x'.repeat(301), giftInput.attemptId]))
    await assert.rejects(pool.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['1\n2\n3\n4\n5\n6\n7', giftInput.attemptId]))
    report.checks.push('Gift note stored in native PostgreSQL, absent from Stripe invoice parameters, unavailable to fulfilment until signed paid webhook, and database limits enforced')
    const intentInput = { items: [{ sku: first.sku, quantity: 1 }], locale: 'fr', attemptId: randomUUID(), adultConfirmed: true, giftMessage: '', giftOptions: { isGift: true } }
    const intentResponse = await post(intentInput)
    assert.equal(intentResponse.status, 200)
    const intentSession = sessions.get((await intentResponse.json()).url.split('/').pop())
    intentSession.status = 'complete'; intentSession.payment_status = 'paid'
    assert.equal((await notify(intentSession, 'checkout.session.completed')).status, 200)
    const intentOrder = (await pool.query('SELECT status,gift_message,gift_options,params FROM dyane_checkout_orders WHERE id=$1', [intentInput.attemptId])).rows[0]
    assert.equal(intentOrder.status, 'paid'); assert.equal(intentOrder.gift_options.isGift, true); assert.equal(intentOrder.gift_message, '')
    assert.ok(!JSON.stringify(intentOrder.params).includes('isGift'))
    await assert.rejects(pool.query('UPDATE dyane_checkout_orders SET gift_options=$1 WHERE id=$2', [{ isGift: true, shoppingBag: true }, intentInput.attemptId]))
    report.checks.push('Gift intent without a message persists through a signed paid webhook, stays outside Stripe invoice data, and rejects unapproved packaging options')
    const freeShippingInput = { items: catalog.products.map(item => ({ sku: item.sku, quantity: 1 })),
      locale: 'fr', attemptId: randomUUID(), adultConfirmed: true }
    const freeShippingResponse = await post(freeShippingInput)
    assert.equal(freeShippingResponse.status, 200)
    const freeShippingSession = sessions.get((await freeShippingResponse.json()).url.split('/').pop())
    assert.equal(freeShippingSession.amount_subtotal, 24_000)
    assert.equal(freeShippingSession.total_details.amount_shipping, 0)
    assert.equal(freeShippingSession.amount_total, 24_000)
    freeShippingSession.status = 'expired'
    assert.equal((await notify(freeShippingSession, 'checkout.session.expired')).status, 200)
    report.checks.push('France shipping is 1500 cents up to and including 20000 cents, and free above it; the two-format cart receives free shipping in simulated Checkout')
    await pool.query('UPDATE dyane_checkout_inventory SET available=1 WHERE sku=$1', [first.sku])
    const attempts = await Promise.allSettled(Array.from({ length: 20 }, () => store.transaction(db => store.reserveOrder(db,
      { sku: first.sku, quantity: 1, locale: 'fr', attemptId: randomUUID() }, price => ({ mode: 'payment', line_items: [{ price, quantity: 1 }] })), pool)))
    assert.equal(attempts.filter(r => r.status === 'fulfilled').length, 1)
    assert.equal((await pool.query('SELECT available FROM dyane_checkout_inventory WHERE sku=$1', [first.sku])).rows[0].available, 0)
    report.checks.push('Twenty concurrent PostgreSQL reservations for one unit: one accepted, nineteen rejected, no overselling')
    await pool.query('UPDATE dyane_checkout_inventory SET available=1')
    const cartAttempts = await Promise.allSettled(Array.from({ length: 20 }, () => store.transaction(db => store.reserveCartOrder(db,
      { items: catalog.products.map(p => ({ sku: p.sku, quantity: 1 })), locale: 'fr', attemptId: randomUUID(), giftMessage: 'Local test only' },
      lines => ({ mode: 'payment', line_items: lines.map(i => ({ price: i.price_id, quantity: i.quantity })) })), pool)))
    assert.equal(cartAttempts.filter(r => r.status === 'fulfilled').length, 1)
    assert.ok((await pool.query('SELECT available FROM dyane_checkout_inventory')).rows.every(r => r.available === 0))
    report.checks.push('Twenty concurrent two-format carts for one unit of each: one whole cart accepted, no partial reservation or overselling')
    report.passed = true
    mkdirSync('.stripe-local', { recursive: true, mode: 0o700 })
    writeFileSync('.stripe-local/simulation-results.json', JSON.stringify(report, null, 2), { mode: 0o600 })
    console.log(JSON.stringify(report, null, 2))
  } finally {
    await pool.end(); await admin.end()
    // Isolated simulation schema is retained for inspection. Public test inventory is untouched.
  }
}
main().catch(() => { console.error('Simulation failed. No secret values are printed. Check local PostgreSQL and the scenario assertions.'); process.exitCode = 1 })
