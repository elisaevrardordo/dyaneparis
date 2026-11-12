const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')
const { createManagementServer, renderOrders, renderCard, dimensions } = require('../lib/orders/management.cjs')
const cache = new Map()
const gift = load('lib/gifts/message.ts', {}, cache)
const config = load('lib/stripe/config.ts', {}, cache)
const store = load('lib/stripe/store.ts', {}, cache)

async function setup() {
  const pg = new PGlite()
  for (const file of ['001_checkout.sql', '002_payment_snapshot.sql', '003_cart_items.sql', '004_gift_message_limits.sql', '005_gift_options.sql', '006_personalized_order_items.sql']) await pg.exec(fs.readFileSync('database/stripe/' + file, 'utf8'))
  const db = { query: async (sql, args) => { const r = await pg.query(sql, args); return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length } }, release() {} }
  const pool = { connect: async () => db, query: (...args) => db.query(...args) }
  await db.query("INSERT INTO dyane_checkout_inventory(sku,label,price_id,available,active) VALUES ('dyane-sculpture-25cl','25 cl','price_5500',10,true)")
  return { pg, db, pool }
}
const input = () => ({ attemptId: randomUUID(), items: [{ sku: 'dyane-sculpture-25cl', quantity: 1 }], locale: 'fr', adultConfirmed: true, giftMessage: 'Pour toi,\navec toute mon affection.' })
const params = lines => ({ mode: 'payment', line_items: lines.map(i => ({ price: i.price_id, quantity: i.quantity })), automatic_tax: { enabled: true } })

test('gift limits count Unicode characters and explicit lines, normalize CRLF and reject hidden controls', () => {
  for (const text of ['a'.repeat(300), '🎁'.repeat(300), '1\n2\n3', 'Bonne fête !']) assert.equal(gift.validGiftMessage(text), true)
  for (const text of ['a'.repeat(301), '🎁'.repeat(301), '1\n2\n3\n4', 'Invisible\u0000', 'Tab\t', 'Bidi\u202e']) assert.equal(gift.validGiftMessage(text), false)
  assert.equal(gift.normalizeGiftMessage('Pour toi\r\nAvec amour'), 'Pour toi\nAvec amour')
  assert.equal(gift.giftMessageStats('🎁🎁').characters, 2)
  assert.equal(gift.restoreGiftMessage('a'.repeat(301)), '')
  assert.equal(gift.restoreGiftMessage('  À bientôt  '), 'À bientôt')
  assert.equal(gift.restoreGiftMessage(null), '')
  assert.equal(gift.restoreGiftMessage('1\n2\n3\n4'), '')
})

test('Checkout validates the message before reservation and the store enforces limits independently', async () => {
  const { pg, db, pool } = await setup()
  try {
    assert.equal(config.checkoutPayload({ ...input(), giftMessage: 'Bonjour\r\nDyane' }).giftMessage, 'Bonjour\nDyane')
    for (const text of ['x'.repeat(301), '1\n2\n3\n4', '\u0000']) {
      assert.throws(() => config.checkoutPayload({ ...input(), giftMessage: text }))
      await assert.rejects(store.transaction(c => store.reserveCartOrder(c, { ...input(), giftMessage: text }, params), pool))
    }
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 10)
    assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_checkout_orders')).rows[0].n, 0)
  } finally { await pg.close() }
})

test('saved, edited and deleted drafts are frozen per attempt; only paid webhook orders expose printable messages', async () => {
  const { pg, db, pool } = await setup()
  try {
    const first = input()
    await store.transaction(c => store.reserveCartOrder(c, first, params), pool)
    await assert.rejects(store.transaction(c => store.reserveCartOrder(c, { ...first, giftMessage: 'Modified' }, params), pool))
    const edited = { ...input(), giftMessage: 'Une nouvelle attention.' }
    await store.transaction(c => store.reserveCartOrder(c, edited, params), pool)
    const deleted = { ...input(), giftMessage: '' }
    await store.transaction(c => store.reserveCartOrder(c, deleted, params), pool)
    const query = "SELECT id,created_at,gift_message FROM dyane_checkout_orders WHERE status='paid' AND payment_snapshot->>'paymentStatus'='paid' AND gift_message <> ''"
    assert.equal((await db.query(query)).rows.length, 0)
    const session = { id: 'cs_test_gift', livemode: false, mode: 'payment', currency: 'eur', metadata: { dyane_order_id: edited.attemptId }, client_reference_id: edited.attemptId,
      status: 'complete', payment_status: 'paid', automatic_tax: { status: 'complete' }, invoice: 'in_gift',
      line_items: { data: [{ price: { id: 'price_5500' }, quantity: 1 }], has_more: false } }
    await store.transaction(c => store.applySession(c, 'evt_gift_paid', session), pool)
    await store.transaction(c => store.applySession(c, 'evt_gift_paid', session), pool)
    const paid = (await db.query(query)).rows
    assert.equal(paid.length, 1)
    assert.equal(paid[0].gift_message, edited.giftMessage)
    assert.equal((await db.query('SELECT gift_message FROM dyane_checkout_orders WHERE id=$1', [deleted.attemptId])).rows[0].gift_message, '')
    const row = (await db.query('SELECT params,payment_snapshot FROM dyane_checkout_orders WHERE id=$1', [edited.attemptId])).rows[0]
    assert.ok(!JSON.stringify(row.params).includes(edited.giftMessage))
    assert.equal(row.payment_snapshot.invoiceId, 'in_gift')
    assert.equal((await db.query('SELECT available FROM dyane_checkout_inventory')).rows[0].available, 7)
    await assert.rejects(db.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['x'.repeat(301), first.attemptId]))
    await assert.rejects(db.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['1\n2\n3\n4', first.attemptId]))
  } finally { await pg.close() }
})

test('print layout escapes customer text and requires a supplied physical format', () => {
  const order = { id: randomUUID(), gift_message: '<script>alert("private")</script>\nAvec amour.', created_at: new Date() }
  const list = renderOrders([order]), preview = renderCard(order, null)
  assert.ok(list.includes('&lt;script&gt;'))
  assert.ok(!preview.includes('<script>alert('))
  assert.match(preview, /id="print-card" type="button" disabled/)
  assert.ok(preview.includes('Aperçu provisoire'))
  assert.equal(dimensions(new URLSearchParams()), null)
  assert.equal(dimensions(new URLSearchParams('width=0&height=90')), false)
  assert.equal(dimensions(new URLSearchParams('width=150;alert(1)&height=90')), false)
  assert.match(renderCard(order, dimensions(new URLSearchParams('width=150&height=90'))), /@page\{size:150mm 90mm/)
})

test('management HTTP console denies anonymous access, hostile hosts and origins, and unpaid order IDs', async () => {
  const pending = randomUUID(), paid = randomUUID()
  const pool = { query: async (sql, args) => ({ rows: args && args[0] === paid ? [{ id: paid, created_at: new Date(), gift_message: 'Private paid note' }] : [] }) }
  // Port is supplied explicitly because Host matching is part of the access boundary.
  const port = 3048
  const { server, sessionUrl } = createManagementServer({ pool, port })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  const base = `http://127.0.0.1:${port}`
  try {
    assert.equal((await fetch(base + '/')).status, 401)
    assert.equal((await fetch(base + '/orders/' + paid + '/card')).status, 401)
    assert.equal((await fetch(base + '/session?token=wrong')).status, 401)
    const login = await fetch(sessionUrl, { redirect: 'manual' })
    assert.equal(login.status, 303)
    const cookie = login.headers.get('set-cookie').split(';')[0]
    assert.ok(login.headers.get('set-cookie').includes('HttpOnly; SameSite=Strict'))
    const get = (path, headers = {}) => fetch(base + path, { headers: { Cookie: cookie, ...headers } })
    const hostileHostStatus = await new Promise((resolve, reject) => {
      require('node:http').get(base, { headers: { Host: 'attacker.example', Cookie: cookie } }, response => { response.resume(); resolve(response.statusCode) }).on('error', reject)
    })
    assert.equal(hostileHostStatus, 403)
    assert.equal((await get('/', { Origin: 'https://attacker.example' })).status, 403)
    assert.equal((await get('/orders/' + pending + '/card')).status, 404)
    const card = await get('/orders/' + paid + '/card')
    assert.equal(card.status, 200)
    assert.equal(card.headers.get('cache-control'), 'no-store, private')
    assert.ok((await card.text()).includes('Private paid note'))
    assert.equal((await get('/orders/' + paid + '/card?width=-1&height=90')).status, 400)
  } finally { await new Promise(resolve => server.close(resolve)) }
})

test('three-line migration preserves historical cards and rejects new longer messages', async () => {
  const { pg, db, pool } = await setup()
  try {
    // Reproduce an older installation which accepted six-line notes.
    await pg.exec(fs.readFileSync('database/stripe/004_gift_message_limits.sql', 'utf8').replace('> 3\n', '> 6\n'))
    const first = input()
    await store.transaction(c => store.reserveCartOrder(c, first, params), pool)
    const historical = '1\n2\n3\n4\n5\n6'
    await db.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', [historical, first.attemptId])
    await pg.exec(fs.readFileSync('database/stripe/008_three_line_gift_message.sql', 'utf8'))
    await db.query("UPDATE dyane_checkout_orders SET status='expired' WHERE id=$1", [first.attemptId])
    assert.equal((await db.query('SELECT gift_message FROM dyane_checkout_orders WHERE id=$1', [first.attemptId])).rows[0].gift_message, historical)
    await assert.rejects(db.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['1\n2\n3\n4', first.attemptId]))
    await db.query('UPDATE dyane_checkout_orders SET gift_message=$1 WHERE id=$2', ['1\n2\n3', first.attemptId])
  } finally { await pg.close() }
})
