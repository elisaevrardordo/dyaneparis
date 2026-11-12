const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const Stripe = require('stripe')
const { PGlite } = require('@electric-sql/pglite')

function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file)
  if (cache.has(file)) return cache.get(file)
  const module = { exports: {} }
  cache.set(file, module.exports)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText
  const localRequire = name => {
    if (name === 'server-only') return {}
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name.startsWith('.') || name.startsWith('@/')) {
      return load((name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name)) + '.ts', mocks, cache)
    }
    return require(name)
  }
  vm.runInNewContext(code, { module, exports: module.exports, require: localRequire, process, URL, Buffer, Date, Set, console }, { filename: file })
  cache.set(file, module.exports)
  return module.exports
}

const config = load('lib/stripe/config.ts')
const validEnv = {
  STRIPE_CHECKOUT_ENABLED: 'true', STRIPE_SECRET_KEY: 'rk_test_fixture',
  STRIPE_DATABASE_URL: 'postgres://fixture', STRIPE_ACCOUNT_ID: 'acct_fixture',
  STRIPE_SITE_URL: 'http://localhost:3000',
}
const liveEnv = {
  ...validEnv, VERCEL_ENV: 'production', STRIPE_MODE: 'live', STRIPE_LIVE_READY: 'true',
  STRIPE_SECRET_KEY: 'rk_live_fixture', STRIPE_SITE_URL: 'https://www.dyaneparis.com',
  STRIPE_WEBHOOK_SECRET: 'whsec_fixture',
}
const attempt = '00000000-0000-4000-8000-000000000001'
const input = { sku: 'test-no1', quantity: 1, locale: 'fr', attemptId: attempt }

test('checkout remains closed without explicit sandbox configuration and rejects live keys/production origins', () => {
  assert.throws(() => config.checkoutConfig({}))
  assert.equal(config.checkoutConfig(validEnv).origin, 'http://localhost:3000')
  for (const change of [
    { STRIPE_SECRET_KEY: 'sk_live_fixture' }, { STRIPE_CHECKOUT_ENABLED: 'false' },
    { STRIPE_DATABASE_URL: '' }, { STRIPE_SITE_URL: 'https://www.dyaneparis.com' },
    { VERCEL_ENV: 'production' }, { STRIPE_MODE: 'test' },
    { STRIPE_SITE_URL: 'https://preview.example/a' }, { STRIPE_SITE_URL: 'http://preview.example' },
    { STRIPE_SITE_URL: 'https://user:pass@preview.example' },
  ]) assert.throws(() => config.checkoutConfig({ ...validEnv, ...change }))
})

test('live checkout requires production, its canonical origin and explicit readiness while webhook config survives closure', () => {
  assert.equal(config.checkoutConfig(liveEnv).livemode, true)
  const closed = { ...liveEnv, STRIPE_CHECKOUT_ENABLED: 'false', STRIPE_LIVE_READY: 'false' }
  assert.equal(config.stripeEnvironment(closed).livemode, true)
  assert.throws(() => config.checkoutConfig(closed))
  for (const change of [
    { VERCEL_ENV: 'preview' }, { STRIPE_MODE: '' }, { STRIPE_SITE_URL: 'https://dyaneparis.com' },
    { STRIPE_SECRET_KEY: 'rk_test_fixture' }, { STRIPE_LIVE_READY: 'false' }, { STRIPE_WEBHOOK_SECRET: '' },
  ]) assert.throws(() => config.checkoutConfig({ ...liveEnv, ...change }))
})

test('the hosted production configuration preserves the checkout mode guard outside Vercel', () => {
  const production = { DYANE_DEPLOYMENT_ENV: 'production' }
  assert.equal(config.shopMode({ ...production, DYANE_CART_PREVIEW: 'true' }), 'closed')
  assert.throws(() => config.checkoutConfig({ ...validEnv, ...production }), /deployment environment/)
  assert.equal(config.checkoutConfig({ ...liveEnv, VERCEL_ENV: undefined, ...production }).livemode, true)
})

test('the live storefront requires matching public Stripe credentials and delivery services', () => {
  assert.equal(config.shopMode({ ...validEnv, DYANE_CART_PREVIEW: 'true' }), 'sandbox')
  assert.equal(config.shopMode(liveEnv), 'closed')
  const approved = { ...liveEnv, RESEND_API_KEY: 're_fixture', STRIPE_PUBLISHABLE_KEY: 'pk_live_fixture' }
  assert.equal(config.shopMode(approved), 'closed')
  Object.assign(approved, { STRIPE_MANUAL_VAT_FR: 'txr_frfixture', STRIPE_MANUAL_VAT_MC: 'txr_mcfixture' })
  assert.equal(config.shopMode(approved), 'live')
  assert.equal(config.shopMode({ ...approved, STRIPE_PUBLISHABLE_KEY: 'pk_test_fixture' }), 'closed')
  assert.equal(config.shopMode({ ...approved, STRIPE_CHECKOUT_ENABLED: 'false' }), 'closed')
})

test('checkout rejects custom amounts, arbitrary prices, missing age confirmation and invalid quantities', () => {
  const valid = { ...input, adultConfirmed: true }
  assert.equal(config.checkoutPayload(valid).sku, 'test-no1')
  for (const change of [{ amount: 1 }, { price: 'price_attacker' }, { quantity: 0 }, { quantity: 1.5 },
    { quantity: 6 }, { adultConfirmed: false }, { attemptId: 'invalid' }, { locale: 'de' }]) {
    assert.throws(() => config.checkoutPayload({ ...valid, ...change }))
  }
  assert.throws(() => config.checkoutPayload(null))
})

test('Tax requires matching sandbox account, active settings and an active French registration', async () => {
  const stripe = {
    accounts: { retrieve: async () => ({ id: 'acct_fixture' }) },
    tax: { settings: { retrieve: async () => ({ livemode: false, status: 'active' }) },
      registrations: { list: async () => ({ data: [{ country: 'FR', livemode: false }] }) } },
  }
  await config.assertTaxReady(stripe, 'acct_fixture')
  await assert.rejects(config.assertTaxReady(stripe, 'acct_other'))
  stripe.tax.settings.retrieve = async () => ({ livemode: false, status: 'pending' })
  await assert.rejects(config.assertTaxReady(stripe, 'acct_fixture'))
  stripe.tax.settings.retrieve = async () => ({ livemode: false, status: 'active' })
  stripe.tax.registrations.list = async () => ({ data: [] })
  await assert.rejects(config.assertTaxReady(stripe, 'acct_fixture'))
})

test('live Tax readiness requires an enabled account and a live French registration', async () => {
  let chargesEnabled = false
  let registrationMode = false
  const stripe = {
    accounts: { retrieve: async () => ({ id: 'acct_fixture', charges_enabled: chargesEnabled }) },
    tax: { settings: { retrieve: async () => ({ livemode: true, status: 'active' }) },
      registrations: { list: async () => ({ data: [{ country: 'FR', livemode: registrationMode }] }) } },
  }
  await assert.rejects(config.assertTaxReady(stripe, 'acct_fixture', true))
  chargesEnabled = true
  await assert.rejects(config.assertTaxReady(stripe, 'acct_fixture', true))
  registrationMode = true
  await config.assertTaxReady(stripe, 'acct_fixture', true)
})

test('the Tax testing option never bypasses live or legacy checks and still validates the sandbox account', async () => {
  const flag = { STRIPE_SANDBOX_SKIP_AUTOMATIC_TAX: 'true' }
  assert.equal(config.checkoutUsesAutomaticTax(false, true, {}), true)
  assert.equal(config.checkoutUsesAutomaticTax(false, true, flag), false)
  assert.equal(config.checkoutUsesAutomaticTax(false, false, flag), true)
  assert.equal(config.checkoutUsesAutomaticTax(true, true, flag), true)
  const stripe = { accounts: { retrieve: async () => ({ id: 'acct_fixture' }) } }
  await config.assertCheckoutAccount(stripe, 'acct_fixture', false, false)
  await assert.rejects(config.assertCheckoutAccount(stripe, 'acct_other', false, false))
})

async function database() {
  const pg = new PGlite()
  await pg.exec(fs.readFileSync('database/stripe/001_checkout.sql', 'utf8'))
  await pg.exec(fs.readFileSync('database/stripe/002_payment_snapshot.sql', 'utf8'))
  await pg.exec(fs.readFileSync('database/stripe/003_cart_items.sql', 'utf8'))
  for (const file of ['004_gift_message_limits.sql', '005_gift_options.sql', '006_personalized_order_items.sql']) await pg.exec(fs.readFileSync('database/stripe/' + file, 'utf8'))
  await pg.exec(fs.readFileSync('database/stripe/004_gift_message_limits.sql', 'utf8'))
  await pg.exec(fs.readFileSync('database/stripe/005_gift_options.sql', 'utf8'))
  const db = { query: async (sql, args) => {
    const result = await pg.query(sql, args)
    return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length }
  }, release() {} }
  await db.query(`INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active)
    VALUES ('test-no1','Fixture, not a retail price','price_fixture',2,true)`)
  return { pg, db, source: { connect: async () => db } }
}
const store = load('lib/stripe/store.ts')
const params = price => ({ mode: 'payment', line_items: [{ price, quantity: 1 }] })
function session(overrides = {}) {
  return { id: 'cs_test_fixture', livemode: false, mode: 'payment', currency: 'eur',
    client_reference_id: attempt, metadata: { dyane_order_id: attempt }, status: 'complete', payment_status: 'paid',
    line_items: { data: [{ price: { id: 'price_fixture' }, quantity: 1 }], has_more: false }, ...overrides }
}

test('SQL reserves stock once per attempt, rejects reuse with different contents and prevents overselling', async () => {
  const { pg, db, source } = await database()
  try {
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    await store.transaction(c => store.reserveOrder(c, input, () => { throw Error('must reuse frozen parameters') }), source)
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 1)
    await assert.rejects(store.transaction(c => store.reserveOrder(c, { ...input, quantity: 2 }, params), source))
    await assert.rejects(store.transaction(c => store.reserveOrder(c, { ...input, attemptId: '00000000-0000-4000-8000-000000000002', quantity: 2 }, params), source))
    assert.equal((await db.query('SELECT count(*)::int AS count FROM dyane_checkout_orders')).rows[0].count, 1)
  } finally { await pg.close() }
})

test('SQL rolls back stock and event deduplication when work fails', async () => {
  const { pg, db, source } = await database()
  try {
    await assert.rejects(store.transaction(c => store.reserveOrder(c, input, () => { throw Error('bad config') }), source))
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 2)
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    await assert.rejects(store.transaction(async c => { await store.applySession(c, 'evt_fixture', session()); throw Error('commit failed') }, source))
    assert.equal((await db.query('SELECT count(*)::int AS count FROM dyane_checkout_events')).rows[0].count, 0)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'reserved')
  } finally { await pg.close() }
})

test('paid state survives repeated and out-of-order expiration notifications', async () => {
  const { pg, db, source } = await database()
  try {
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    await store.transaction(c => store.applySession(c, 'evt_paid', session()), source)
    await store.transaction(c => store.applySession(c, 'evt_paid', session()), source)
    await store.transaction(c => store.applySession(c, 'evt_old', session({ status: 'expired', payment_status: 'unpaid' })), source)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'paid')
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 1)
    assert.equal((await db.query('SELECT count(*)::int AS count FROM dyane_checkout_events')).rows[0].count, 2)
  } finally { await pg.close() }
})

test('delayed payment is pending until paid; failure/expiration releases stock once', async () => {
  const { pg, db, source } = await database()
  try {
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    await store.transaction(c => store.applySession(c, 'evt_pending', session({ payment_status: 'unpaid' })), source)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'pending')
    await store.transaction(c => store.applySession(c, 'evt_failed', session({ payment_status: 'unpaid' }), 'checkout.session.async_payment_failed'), source)
    await store.transaction(c => store.applySession(c, 'evt_expired', session({ status: 'expired', payment_status: 'unpaid' })), source)
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 2)
    await store.transaction(c => store.applySession(c, 'evt_late_success', session()), source)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'paid')
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 1)
  } finally { await pg.close() }
})

test('late payment after released stock is sold is held for manual review', async () => {
  const { pg, db, source } = await database()
  try {
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    await store.transaction(c => store.applySession(c, 'evt_expired', session({ status: 'expired', payment_status: 'unpaid' })), source)
    await db.query('UPDATE dyane_checkout_inventory SET available=0')
    await store.transaction(c => store.applySession(c, 'evt_late_paid', session()), source)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'manual_review')
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 0)
  } finally { await pg.close() }
})

test('webhook rejects unknown sessions, changed prices/quantities and ignores live payloads', async () => {
  const { pg, db, source } = await database()
  try {
    await store.transaction(c => store.reserveOrder(c, input, params), source)
    for (const change of [{ client_reference_id: 'wrong' }, { currency: 'usd' },
      { line_items: { data: [{ price: { id: 'price_other' }, quantity: 1 }] } }]) {
      await assert.rejects(store.transaction(c => store.applySession(c, 'evt_invalid', session(change)), source))
    }
    await store.transaction(c => store.applySession(c, 'evt_live', session({ livemode: true })), source)
    assert.equal((await db.query('SELECT count(*)::int AS count FROM dyane_checkout_events')).rows[0].count, 0)
  } finally { await pg.close() }
})

test('webhook checks the real SDK signature and returns 500 on storage failure so Stripe retries', async () => {
  const oldKey = process.env.STRIPE_SECRET_KEY
  const oldSecret = process.env.STRIPE_WEBHOOK_SECRET
  process.env.STRIPE_SECRET_KEY = 'rk_test_fixture'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fixture'
  let reads = 0
  const stripe = new Stripe('rk_test_fixture')
  stripe.checkout.sessions.retrieve = async () => { reads++; return session() }
  const route = load('app/api/stripe/webhook/route.ts', {
    '@/lib/stripe/config': { stripeEnvironment: () => config.stripeEnvironment(validEnv), stripeClient: () => stripe },
    '@/lib/stripe/purchaseNotifications': {},
    '@/lib/stripe/store': { transaction: async () => { throw Error('database offline') } },
  })
  const body = JSON.stringify({ id: 'evt_fixture', type: 'checkout.session.completed', livemode: false, data: { object: session() } })
  const signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: 'whsec_fixture' })
  try {
    assert.equal((await route.POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': 'invalid' } }))).status, 400)
    assert.equal(reads, 0)
    assert.equal((await route.POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': signature } }))).status, 500)
    assert.equal(reads, 1)
  } finally {
    if (oldKey === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = oldKey
    if (oldSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = oldSecret
  }
})

test('signed live webhook rejects mismatched modes and accounts and retries pending notification delivery', async () => {
  const oldSecret = process.env.STRIPE_WEBHOOK_SECRET
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fixture'
  try {
    const stripe = new Stripe('rk_test_fixture')
    const current = session({ id: 'cs_live_fixture', livemode: true })
    let actualAccount = 'acct_fixture'
    let reads = 0
    const actions = []
    stripe.accounts.retrieve = async () => ({ id: actualAccount })
    stripe.checkout.sessions.retrieve = async () => { reads++; return current }
    const route = load('app/api/stripe/webhook/route.ts', {
      '@/lib/stripe/config': { stripeEnvironment: () => config.stripeEnvironment(liveEnv), stripeClient: () => stripe },
      '@/lib/stripe/store': {
        transaction: async work => { await work({}); actions.push('commit') },
        applySession: async (_db, _event, _session, _type, livemode) => {
          assert.equal(livemode, true)
          return actions.length === 0 ? { id: attempt } : null
        },
      },
      '@/lib/stripe/purchaseNotifications': {
        enqueueProductionPurchaseEmails: async () => actions.push('enqueue'),
        deliverProductionPurchaseEmails: async id => {
          assert.equal(id, attempt)
          actions.push('deliver')
          if (actions.length === 3) throw Error('delivery temporarily unavailable')
        },
      },
      '@/lib/stripe/testPurchaseEmail': { captureTestPurchaseEmail: () => assert.fail('sandbox capture in live webhook') },
    })
    const notify = async (overrides = {}) => {
      const body = JSON.stringify({ id: 'evt_live_fixture', type: 'checkout.session.completed',
        livemode: true, data: { object: current }, ...overrides })
      const signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: 'whsec_fixture' })
      return route.POST(new Request('http://localhost/api/stripe/webhook', {
        method: 'POST', body, headers: { 'stripe-signature': signature },
      }))
    }
    assert.equal((await notify({ livemode: false })).status, 400)
    assert.equal((await notify({ account: 'acct_other' })).status, 400)
    assert.equal((await notify({ data: { object: { ...current, livemode: false } } })).status, 400)
    actualAccount = 'acct_other'
    assert.equal((await notify()).status, 500)
    assert.equal(reads, 0)
    actualAccount = 'acct_fixture'
    assert.equal((await notify()).status, 500)
    assert.equal((await notify()).status, 200)
    assert.equal(reads, 2)
    assert.deepEqual(actions, ['enqueue', 'commit', 'deliver', 'commit', 'deliver'])
  } finally {
    if (oldSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = oldSecret
  }
})

test('signed sandbox webhook captures one purchase email only after payment is confirmed', async () => {
  const { pg, db, source } = await database()
  const oldKey = process.env.STRIPE_SECRET_KEY
  const oldSecret = process.env.STRIPE_WEBHOOK_SECRET
  process.env.STRIPE_SECRET_KEY = 'rk_test_fixture'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fixture'

  try {
    const migration = fs.readFileSync('database/stripe/010_test_purchase_emails.sql', 'utf8')
    await pg.exec(migration)
    await pg.exec(migration)
    await store.transaction(c => store.reserveOrder(c, input, params), source)

    let current = session({
      payment_status: 'unpaid',
      amount_total: 18500,
      customer_details: { name: 'Camille Exemple', email: 'camille@example.test' },
      line_items: { data: [{ price: { id: 'price_fixture' }, quantity: 1, description: 'Dyane No.1 · 1,5 L' }], has_more: false },
    })
    const stripe = new Stripe('rk_test_fixture')
    stripe.checkout.sessions.retrieve = async () => current
    let failCapture = false
    const storage = {
      ...store,
      orderPool: () => db,
      transaction: work => store.transaction(c => work({
        query: (sql, args) => {
          if (failCapture && sql.includes('INSERT INTO dyane_checkout_test_emails')) throw Error('capture unavailable')
          return c.query(sql, args)
        },
      }), source),
    }
    const route = load('app/api/stripe/webhook/route.ts', {
      '@/lib/stripe/config': { stripeEnvironment: () => config.stripeEnvironment(validEnv), stripeClient: () => stripe },
      '@/lib/stripe/purchaseNotifications': {},
      '@/lib/stripe/store': storage,
    })
    const notify = async (id, type, object = current, livemode = false) => {
      const body = JSON.stringify({ id, type, livemode, data: { object } })
      const signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: 'whsec_fixture' })
      return route.POST(new Request('http://localhost/api/stripe/webhook', {
        method: 'POST', body, headers: { 'stripe-signature': signature },
      }))
    }
    const captured = async () => (await db.query('SELECT * FROM dyane_checkout_test_emails')).rows
    const status = async () => (await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status

    assert.equal((await notify('evt_waiting', 'checkout.session.completed')).status, 200)
    assert.equal(await status(), 'pending')
    assert.equal((await captured()).length, 0)
    assert.equal((await notify('evt_declined', 'checkout.session.async_payment_failed')).status, 200)
    assert.equal(await status(), 'expired')
    assert.equal((await captured()).length, 0)

    current = { ...current, payment_status: 'paid', invoice: 'in_test_fixture' }
    assert.equal((await notify('evt_live', 'checkout.session.completed', current, true)).status, 400)
    assert.equal((await captured()).length, 0)
    failCapture = true
    assert.equal((await notify('evt_success', 'checkout.session.async_payment_succeeded')).status, 500)
    assert.equal(await status(), 'expired')
    assert.equal((await captured()).length, 0)
    failCapture = false
    assert.equal((await notify('evt_success', 'checkout.session.async_payment_succeeded')).status, 200)
    assert.equal(await status(), 'paid')
    assert.equal((await notify('evt_success', 'checkout.session.async_payment_succeeded')).status, 200)
    assert.equal((await notify('evt_invoice', 'invoice.paid', { id: current.invoice, metadata: current.metadata })).status, 200)
    assert.equal((await notify('evt_paid_again', 'checkout.session.completed')).status, 200)

    const emails = await captured()
    assert.equal(emails.length, 1)
    const [message] = emails
    assert.equal(message.order_id, attempt)
    assert.equal(message.recipient, 'camille@example.test')
    assert.equal(message.subject, 'Merci pour votre commande — Dyane Paris')
    assert.match(message.html_body, /Bonjour Camille,/)
    assert.ok(message.html_body.includes(attempt))
    assert.match(message.text_body, /1 × Dyane No[.]1 · 1,5 L/)
    assert.match(message.text_body, /Total réglé · 185,00\s*€/)
  } finally {
    if (oldKey === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = oldKey
    if (oldSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = oldSecret
    await pg.close()
  }
})

test('Checkout creates only server-priced sessions with Tax, invoices, shipping and stable idempotency', async () => {
  const { pg, db, source } = await database()
  const savedEnv = Object.fromEntries(Object.keys(validEnv).map(k => [k, process.env[k]]))
  Object.assign(process.env, validEnv)
  const calls = []
  const priceReads = []
  let productTaxCode = 'txcd_fixture'
  const stripe = {
    accounts: { retrieve: async () => ({ id: 'acct_fixture' }) },
    tax: { settings: { retrieve: async () => ({ livemode: false, status: 'active' }) },
      registrations: { list: async () => ({ data: [{ country: 'FR', livemode: false }] }) } },
    prices: { retrieve: async id => { priceReads.push(id); return { id, livemode: false, active: true, type: 'one_time',
      currency: 'eur', unit_amount: 12345, tax_behavior: 'inclusive', product: { active: true, tax_code: productTaxCode } } } },
    checkout: { sessions: { create: async (params, options) => {
      calls.push({ params, options })
      return { id: 'cs_test_fixture', url: 'https://checkout.stripe.com/c/pay/fixture', livemode: false, status: 'open' }
    } } },
  }
  const checkout = load('lib/stripe/checkout.ts', {
    './config': { ...config, stripeClient: () => stripe },
    './store': { ...store, orderPool: () => db, transaction: work => store.transaction(work, source) },
  })
  try {
    assert.equal(await checkout.createCheckout(input), 'https://checkout.stripe.com/c/pay/fixture')
    await db.query("UPDATE dyane_checkout_inventory SET price_id='price_changed'")
    await checkout.createCheckout(input)
    assert.deepEqual(priceReads, ['price_fixture', 'price_fixture'])
    assert.equal(JSON.stringify(calls[0]), JSON.stringify(calls[1]))
    const { params, options } = calls[0]
    assert.equal(params.ui_mode, 'hosted_page')
    assert.equal(params.line_items[0].price, 'price_fixture')
    assert.equal(params.line_items[0].quantity, 1)
    assert.equal(params.automatic_tax.enabled, true)
    assert.equal(params.invoice_creation.enabled, true)
    assert.equal(params.shipping_address_collection.allowed_countries[0], 'FR')
    assert.equal(params.shipping_options.length, 1)
    const rate = params.shipping_options[0].shipping_rate_data
    assert.equal(rate.fixed_amount.amount, 1500)
    assert.equal(rate.fixed_amount.currency, 'eur')
    assert.equal(rate.tax_behavior, 'inclusive')
    assert.equal(params.success_url, 'http://localhost:3000/paiement-test?result=returned')
    assert.equal(params.payment_method_types, undefined)
    assert.equal(params.line_items[0].price_data, undefined)
    assert.equal(options.idempotencyKey, `dyane-checkout/${attempt}`)
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 1)
    productTaxCode = 'txcd_00000000'
    await assert.rejects(checkout.createCheckout({ ...input, attemptId: '00000000-0000-4000-8000-000000000002' }))
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 1)
  } finally {
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value
    }
    await pg.close()
  }
})

test('Checkout route rejects missing/forged origins and invalid bodies before creating sessions', async () => {
  let calls = 0
  const route = load('app/api/stripe/checkout/route.ts', {
    '@/lib/stripe/config': { ...config, checkoutConfig: () => ({ origin: 'http://localhost:3000' }) },
    '@/lib/stripe/checkout': { createCheckout: async () => { calls++; return 'https://checkout.stripe.com/c/pay/fixture' } },
  })
  const request = (body, origin) => new Request('http://localhost:3000/api/stripe/checkout', {
    method: 'POST', body, headers: origin ? { origin } : {},
  })
  assert.equal((await route.POST(request('{}'))).status, 403)
  assert.equal((await route.POST(request('{}', 'https://attacker.example'))).status, 403)
  assert.equal((await route.POST(request('null', 'http://localhost:3000'))).status, 400)
  assert.equal((await route.POST(request('{', 'http://localhost:3000'))).status, 400)
  assert.equal((await route.POST(request('x'.repeat(8193), 'http://localhost:3000'))).status, 413)
  assert.equal(calls, 0)
  assert.equal((await route.POST(request(JSON.stringify({ ...input, adultConfirmed: true }), 'http://localhost:3000'))).status, 200)
  assert.equal(calls, 1)
})

test('manual VAT verifies the country, inclusive rate, activity and mode in Stripe', async () => {
  const rates = { FR: 'txr_fr', MC: 'txr_mc' }
  const fixture = { FR: { id: rates.FR, country: 'FR', inclusive: true, percentage: 20, livemode: true, active: true },
    MC: { id: rates.MC, country: 'MC', inclusive: true, percentage: 20, livemode: true, active: true } }
  const stripe = { taxRates: { retrieve: async id => id === rates.FR ? fixture.FR : fixture.MC } }
  await config.assertManualVatReady(stripe, rates, true)
  for (const change of [{ country: 'FR' }, { inclusive: false }, { percentage: 10 }, { livemode: false }, { active: false }]) {
    const original = fixture.MC
    fixture.MC = { ...original, ...change }
    await assert.rejects(config.assertManualVatReady(stripe, rates, true))
    fixture.MC = original
  }
})

const vat = load('lib/stripe/manualVat.ts')
const rates = { FR: 'txr_fr', MC: 'txr_mc' }
function vatSession(country, subtotal, fee, tax) {
  const rate = { id: rates[country], inclusive: true, percentage: 20, country, livemode: false }
  const line = amount => ({ amount_total: amount, amount_discount: 0, quantity: 1, currency: 'eur',
    price: { tax_behavior: 'inclusive' }, taxes: [{ rate }] })
  return { livemode: false, automatic_tax: { enabled: false }, amount_total: subtotal + fee,
    total_details: { amount_tax: tax, amount_shipping: 0, amount_discount: 0 }, shipping_cost: null,
    collected_information: { shipping_details: { address: { country, postal_code: country === 'MC' ? '98000' : '75001' } } },
    line_items: { has_more: false, data: [line(subtotal), ...(fee ? [{ ...line(fee), metadata: { dyane_line_role: 'shipping' } }] : [])] } }
}

test('the four cocktail SKUs can use the verified rate; the artwork and new SKUs stay outside it', () => {
  for (const sku of ['dyane-sculpture-25cl', 'dyane-sculpture-150cl', 'dyane-no2-25cl', 'dyane-no2-150cl']) assert.ok(vat.isManualVatCocktail(sku))
  for (const sku of ['teo-for-dyane', 'other-artwork']) assert.ok(!vat.isManualVatCocktail(sku))
  assert.equal(vat.manualShippingLine(5500, 'FR', 'fr', rates.FR).price_data.unit_amount, 1500)
  assert.equal(vat.manualShippingLine(5500, 'MC', 'fr', rates.MC).price_data.unit_amount, 2000)
  assert.equal(vat.manualShippingLine(20000, 'MC', 'fr', rates.MC).price_data.unit_amount, 2000)
  assert.equal(vat.manualShippingLine(20001, 'MC', 'fr', rates.MC), undefined)
})

test('manual VAT accepts either Stripe rounding policy without changing the price or shipping', () => {
  assert.ok(vat.verifyManualVatSession(vatSession('FR', 5500, 1500, 1167), rates, 5500))
  assert.ok(vat.verifyManualVatSession(vatSession('MC', 5500, 2000, 1250), rates, 5500))
  assert.ok(vat.verifyManualVatSession(vatSession('MC', 18500, 2000, 3416), rates, 18500))
  assert.ok(vat.verifyManualVatSession(vatSession('MC', 18500, 2000, 3417), rates, 18500))
  assert.ok(vat.verifyManualVatSession(vatSession('MC', 22000, 0, 3667), rates, 22000))
})

test('manual VAT rejects an untaxed or duplicate fee, a wrong jurisdiction and an inflated total', () => {
  const check = change => {
    const session = vatSession('MC', 5500, 2000, 1250)
    change(session)
    assert.equal(vat.verifyManualVatSession(session, rates, 5500), false)
  }
  check(session => { session.line_items.data[1].taxes = [] })
  check(session => { session.shipping_cost = { amount_total: 2000 } })
  check(session => { session.line_items.data[0].taxes[0].rate = { id: rates.FR, country: 'FR', percentage: 20, inclusive: true, livemode: false } })
  check(session => { session.amount_total += 1100 })
  check(session => { session.collected_information.shipping_details.address.postal_code = '75001' })
  check(session => { session.total_details.amount_tax = 917 })
})
