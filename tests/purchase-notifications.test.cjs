const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const test = require('node:test')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')
const { TEO_ARTWORK_SKU } = load('components/cart/catalog.ts')

const order = {
  id: '00000000-0000-4000-8000-000000000001', fulfillment: 'preorder',
  items: [{ sku: 'dyane-sculpture-25cl', price_id: 'price_fixture', quantity: 1 }],
}
const session = {
  livemode: true, payment_status: 'paid', client_reference_id: order.id,
  currency: 'eur', amount_total: 7000, locale: 'en',
  customer_details: { email: 'buyer@example.test', name: '<Alicia> Doe' },
}

async function fixture(t, send) {
  const db = new PGlite()
  t.after(() => db.close())
  for (const migration of ['001_checkout.sql', '012_purchase_notifications.sql']) {
    await db.exec(readFileSync(`database/stripe/${migration}`, 'utf8'))
  }
  await db.query(`INSERT INTO dyane_checkout_inventory (sku,label,price_id) VALUES ($1,'Fixture',$2)`,
    [order.items[0].sku, order.items[0].price_id])
  await db.query(`INSERT INTO dyane_checkout_orders (id,sku,quantity,locale,price_id,params,status)
    VALUES ($1,$2,1,'en',$3,'{}','paid')`, [order.id, order.items[0].sku, order.items[0].price_id])

  for (const [key, value] of Object.entries({ RESEND_API_KEY: 'fixture', CONTACT_FORM_FROM: 'Dyane Paris <test@example.test>' })) {
    const previous = process.env[key]
    process.env[key] = value
    t.after(() => {
      if (previous === undefined) delete process.env[key]
      else process.env[key] = previous
    })
  }
  const calls = []
  const notifications = load('lib/stripe/purchaseNotifications.ts', {
    './store': { orderPool: () => db },
    resend: { Resend: class {
      emails = { send: async (payload, options) => {
        const call = { payload, key: options.idempotencyKey }
        calls.push(call)
        return send ? send(call) : { data: { id: `message-${calls.length}` } }
      } }
    } },
  })
  const read = async () => (await db.query(`SELECT * FROM dyane_checkout_purchase_emails ORDER BY purpose`)).rows
  return { db, calls, read, ...notifications }
}

test('only webhook-confirmed live payments queue customer and House emails', async t => {
  const { db, calls, read, enqueueProductionPurchaseEmails, deliverProductionPurchaseEmails } = await fixture(t)
  await enqueueProductionPurchaseEmails(db, order, { ...session, livemode: false })
  await enqueueProductionPurchaseEmails(db, order, { ...session, payment_status: 'unpaid' })
  await db.query(`UPDATE dyane_checkout_orders SET status='pending' WHERE id=$1`, [order.id])
  await enqueueProductionPurchaseEmails(db, order, session)
  await deliverProductionPurchaseEmails(order.id)
  assert.equal((await read()).length, 0)
  assert.equal(calls.length, 0)

  await db.transaction(async tx => {
    await tx.query(`UPDATE dyane_checkout_orders SET status='paid' WHERE id=$1`, [order.id])
    await enqueueProductionPurchaseEmails(tx, order, session)
    assert.equal(calls.length, 0)
  })
  await enqueueProductionPurchaseEmails(db, order, { ...session, customer_details: { email: 'different@example.test' } })
  const [customer, house] = await read()
  assert.equal(customer.payload.to[0], 'buyer@example.test')
  assert.equal(house.payload.to[0], 'contact@dyaneparis.com')
  assert.match(customer.payload.html, /lang="en"/)
  assert.match(customer.payload.html, /Hello &lt;Alicia&gt;/)
  assert.match(customer.payload.text, /Delivery expected in early January 2027\./)
  assert.match(customer.payload.html, /Payment was taken when you placed your preorder\./)
  assert.match(house.payload.text, /Livraison prévue début janvier 2027\./)
  assert.doesNotMatch(house.payload.text, /buyer@example\.test|Alicia/)

  await deliverProductionPurchaseEmails(order.id)
  await deliverProductionPurchaseEmails(order.id)
  assert.equal(calls.length, 2)
  for (const row of await read()) {
    assert.equal(row.state, 'accepted')
    assert.equal(row.payload, null)
    assert.ok(row.provider_id)
  }
})

test('an uncertain provider response is retried with the identical stored payload and key', async t => {
  let firstCustomerSend = true
  const { db, calls, read, enqueueProductionPurchaseEmails, deliverProductionPurchaseEmails } = await fixture(t, call => {
    if (call.key.endsWith('/customer') && firstCustomerSend) {
      firstCustomerSend = false
      throw new Error('response lost after simulated acceptance')
    }
    return { data: { id: `message-${call.key.split('/').at(-1)}` } }
  })
  await enqueueProductionPurchaseEmails(db, { ...order, fulfillment: 'stock' }, session)
  await assert.rejects(deliverProductionPurchaseEmails(order.id), /delivery pending/)
  const [pending, accepted] = await read()
  assert.equal(pending.state, 'pending')
  assert.ok(pending.first_attempt_at)
  assert.equal(accepted.state, 'accepted')
  process.env.CONTACT_FORM_FROM = 'Changed <new@example.test>'
  await enqueueProductionPurchaseEmails(db, order, session)
  await deliverProductionPurchaseEmails(order.id)
  assert.equal(calls.length, 3)
  assert.deepEqual(calls[0], calls[2])
  assert.match(calls[2].payload.text, /Delivery within 5 business days\./)
  assert.equal((await read())[0].attempt_count, 2)
})

test('parallel delivery calls claim each purpose once', async t => {
  let beginCustomer
  let releaseCustomer
  const customerStarted = new Promise(resolve => { beginCustomer = resolve })
  const customerCanFinish = new Promise(resolve => { releaseCustomer = resolve })
  const { db, calls, enqueueProductionPurchaseEmails, deliverProductionPurchaseEmails } = await fixture(t, async call => {
    if (call.key.endsWith('/customer')) {
      beginCustomer()
      await customerCanFinish
    }
    return { data: { id: `message-${call.key.split('/').at(-1)}` } }
  })
  await enqueueProductionPurchaseEmails(db, order, session)
  const first = deliverProductionPurchaseEmails(order.id)
  try {
    await Promise.race([customerStarted, first])
    await assert.rejects(deliverProductionPurchaseEmails(order.id), /delivery pending/)
  } finally {
    releaseCustomer()
    await first
  }
  assert.equal(calls.length, 2)
  assert.equal(new Set(calls.map(call => call.key)).size, 2)
})

test('an interrupted sender leaves the webhook retryable until its lease expires', async t => {
  const { db, calls, enqueueProductionPurchaseEmails, deliverProductionPurchaseEmails } = await fixture(t)
  await enqueueProductionPurchaseEmails(db, order, session)
  await db.query(`UPDATE dyane_checkout_purchase_emails SET first_attempt_at=now(), lease_until=now() + interval '2 minutes', attempt_count=1
    WHERE order_id=$1 AND purpose='customer'`, [order.id])
  await assert.rejects(deliverProductionPurchaseEmails(order.id), /delivery pending/)
  assert.equal(calls.length, 1)
  assert.ok(calls[0].key.endsWith('/house'))
  await db.query(`UPDATE dyane_checkout_purchase_emails SET lease_until=now() - interval '1 second'
    WHERE order_id=$1 AND purpose='customer'`, [order.id])
  await deliverProductionPurchaseEmails(order.id)
  assert.equal(calls.length, 2)
  assert.ok(calls[1].key.endsWith('/customer'))
})

test('missing recipients and expired retry windows are recorded for review', async t => {
  const { db, calls, read, enqueueProductionPurchaseEmails, deliverProductionPurchaseEmails } = await fixture(t)
  await enqueueProductionPurchaseEmails(db, order, { ...session, customer_details: { email: 'a@example.test,b@example.test' } })
  await db.query(`UPDATE dyane_checkout_purchase_emails SET first_attempt_at=now() - interval '23 hours 1 minute', attempt_count=1
    WHERE order_id=$1 AND purpose='house'`, [order.id])
  await deliverProductionPurchaseEmails(order.id)
  assert.deepEqual((await read()).map(row => row.review_reason), ['recipient_unavailable', 'retry_window_elapsed'])
  assert.equal(calls.length, 0)
})

test('paid notifications identify the selected cocktail on each Teo line', async t => {
  const { db, read, enqueueProductionPurchaseEmails } = await fixture(t)
  const teo = { sku: TEO_ARTWORK_SKU, price_id: 'price_teo_fixture' }
  const items = [{ ...teo, quantity: 1, composition: 'no1' }, { ...teo, quantity: 2, composition: 'no2' }]
  await enqueueProductionPurchaseEmails(db, { ...order, items, fulfillment: 'stock' }, { ...session, amount_total: 171_000 })
  for (const { payload } of await read()) {
    assert.match(payload.text, /1 × Teo for Dyane · Pornstar Martini/)
    assert.match(payload.text, /2 × Teo for Dyane · Basil Smash/)
  }
})
