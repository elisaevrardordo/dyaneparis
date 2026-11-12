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
const personalized = (initials, finish = 'gold', quantity = 1) => ({ sku: 'dyane-sculpture-25cl', quantity, personalization: { initials, finish } })

test('No.2 sizes retain their own prices, stock and green initials through a paid order', async () => {
  const { pg, db, pool } = await setup()
  try {
    await pg.exec(fs.readFileSync('database/stripe/009_no2_green_personalization.sql', 'utf8'))
    for (const [sku, price] of [['dyane-no2-25cl', 'price_no2_25'], ['dyane-no2-150cl', 'price_no2_150']]) {
      await db.query('INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active) VALUES ($1,$1,$2,5,true)', [sku,price])
    }
    const selection = [personalized('DP', 'red'),
      { sku: 'dyane-no2-25cl', quantity: 1, personalization: { initials: 'DP', finish: 'green' } },
      { sku: 'dyane-no2-150cl', quantity: 1, personalization: { initials: 'AB', finish: 'gold' } }]
    assert.equal(catalog.cartSubtotal(selection), 29500)
    assert.equal(catalog.cleanCart(JSON.parse(JSON.stringify(selection))).length, 3)
    for (const [sku, finish] of [['dyane-no2-25cl','red'], ['dyane-sculpture-25cl','green']]) {
      assert.throws(() => config.validateCartItems([{ sku,quantity:1,personalization:{initials:'DP',finish} }]))
    }
    const input = config.checkoutPayload({ ...payload(), items: selection })
    await store.transaction(c => store.reserveCartOrder(c,input,params),pool)
    await store.transaction(c => store.applySession(c,'evt_no2_paid', {
      id:'cs_test_no2',livemode:false,mode:'payment',currency:'eur',metadata:{dyane_order_id:input.attemptId},
      client_reference_id:input.attemptId,status:'complete',payment_status:'paid',
      line_items:{data:[{price:{id:'price_5500'},quantity:1},{price:{id:'price_no2_25'},quantity:1},{price:{id:'price_no2_150'},quantity:1}],has_more:false},
    }),pool)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status,'paid')
    const rows = (await db.query('SELECT sku,personalization FROM dyane_checkout_order_items ORDER BY sku')).rows
    assert.equal(rows.find(row => row.sku==='dyane-no2-25cl').personalization.finish,'green')
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-no2-25cl'")).rows[0].available,4)
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-150cl'")).rows[0].available,5)
    // Local setup replays migrations; paid No.2 lines must survive a restart.
    for(const file of ['006_personalized_order_items.sql','007_red_personalization.sql','009_no2_green_personalization.sql']) await pg.exec(fs.readFileSync('database/stripe/'+file,'utf8'))
  } finally { await pg.close() }
})

test('personalized lines retain separate identities and reject invalid options or aggregate quantities', () => {
  const lines = [personalized('ABC'), personalized('DEF'), personalized('ABC', 'black')]
  assert.equal(config.validateCartItems(lines).length, 3)
  assert.equal(catalog.cleanCart([...lines, personalized('ABC')]).length, 3)
  assert.equal(catalog.cleanCart([...lines, personalized('ABC')]).find(i => catalog.cartLineKey(i) === catalog.cartLineKey(lines[0])).quantity, 2)
  assert.equal(catalog.cartSubtotal(lines), 16500)
  assert.equal(catalog.normalizeInitials('a1 b!cd'), 'ABC')
  for (const personalization of [null, {}, { initials: '', finish: 'gold' }, { initials: 'abcd', finish: 'gold' },
    { initials: 'abc', finish: 'gold' }, { initials: 'A1', finish: 'gold' }, { initials: 'A', finish: 'silver' },
    { initials: 'A', finish: 'gold', amount: 0 }]) {
    assert.throws(() => config.validateCartItems([{ ...lines[0], personalization }]))
  }
  assert.throws(() => config.validateCartItems([personalized('ABC', 'gold', 3), personalized('DEF', 'black', 3)]))
  assert.throws(() => config.validateCartItems([personalized('ABC'), personalized('ABC')]))
  assert.equal(catalog.cleanCart([personalized('ABC', 'gold', 4), personalized('DEF', 'black', 4)]).reduce((n, i) => n + i.quantity, 0), 5)
})

test('personalizations persist per line, retry independently of JSON property order, and cannot change on an existing attempt', async () => {
  const { pg, db, pool } = await setup()
  try {
    const input = config.checkoutPayload({ ...payload(), items: [personalized('ABC'), personalized('DEF', 'black')] })
    const order = await store.transaction(c => store.reserveCartOrder(c, input, params), pool)
    const rows = (await db.query('SELECT line_key,personalization FROM dyane_checkout_order_items ORDER BY line_key')).rows
    assert.equal(rows.length, 2)
    assert.equal(new Set(rows.map(i => i.line_key)).size, 2)
    assert.deepEqual(rows.map(i => i.personalization.initials).sort(), ['ABC', 'DEF'])
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-25cl'")).rows[0].available, 3)
    const retry = await store.transaction(c => store.reserveCartOrder(c, { ...input, items: [...input.items].reverse() }, () => { throw Error('No new parameters on retry') }), pool)
    assert.equal(retry.id, order.id)
    for (const changed of [[personalized('ABC'), personalized('XYZ', 'black')], [personalized('ABC', 'black'), personalized('DEF', 'black')]]) {
      await assert.rejects(store.transaction(c => store.reserveCartOrder(c, { ...input, items: changed }, params), pool), /Attempt already used/)
    }
    await assert.rejects(store.transaction(c => store.reserveOrder(c, { ...input, sku: 'dyane-sculpture-25cl', quantity: 1 }, () => ({})), pool), /cart/)
  } finally { await pg.close() }
})

test('personalized webhook accepts Stripe coalesced prices, verifies options, and releases aggregate stock exactly once', async () => {
  const { pg, db, pool } = await setup()
  try {
    const input = config.checkoutPayload({ ...payload(), items: [personalized('ABC'), personalized('DEF', 'black')] })
    const metadata = { dyane_order_id: input.attemptId, dyane_line_1: JSON.stringify(input.items[0].personalization), dyane_line_2: JSON.stringify(input.items[1].personalization) }
    await store.transaction(c => store.reserveCartOrder(c, input, lines => ({ ...params(lines), metadata })), pool)
    const session = { id: 'cs_test_personalized', livemode: false, mode: 'payment', currency: 'eur', metadata,
      client_reference_id: input.attemptId, status: 'expired', payment_status: 'unpaid', line_items: { data: [{ price: { id: 'price_5500' }, quantity: 2 }], has_more: false } }
    await assert.rejects(store.transaction(c => store.applySession(c, 'evt_tampered_options', { ...session, metadata: { ...metadata, dyane_line_1: 'tampered' } }), pool), /metadata mismatch/)
    assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_checkout_events')).rows[0].n, 0)
    await store.transaction(c => store.applySession(c, 'evt_expired_personalized', session), pool)
    await store.transaction(c => store.applySession(c, 'evt_expired_personalized', session), pool)
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-25cl'")).rows[0].available, 5)
    await store.transaction(c => store.applySession(c, 'evt_paid_personalized', { ...session, status: 'complete', payment_status: 'paid' }), pool)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'paid')
    assert.equal((await db.query("SELECT available FROM dyane_checkout_inventory WHERE sku='dyane-sculpture-25cl'")).rows[0].available, 3)
    assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_checkout_order_items WHERE personalization IS NOT NULL')).rows[0].n, 2)
  } finally { await pg.close() }
})


test('red No.1 initials persist through reservation and paid webhook, with separate cart identities', async () => {
  const { pg, db, pool } = await setup()
  try {
    await pg.exec(fs.readFileSync('database/stripe/007_red_personalization.sql', 'utf8'))
    const red = personalized('DP', 'red')
    assert.equal(catalog.cleanCart([red, personalized('DP')]).length, 2)
    assert.equal(catalog.cartSubtotal([red]), 5500)
    assert.equal(catalog.cleanCart(JSON.parse(JSON.stringify([red])))[0].personalization.finish, 'red')
    for (const invalid of [{ ...red, sku: 'dyane-no2' }, personalized('DP', 'green')]) {
      assert.throws(() => config.validateCartItems([invalid]))
    }
    const input = config.checkoutPayload({ ...payload(), items: [red] })
    const order = await store.transaction(c => store.reserveCartOrder(c, input, lines => ({ ...params(lines), metadata: {
      dyane_order_id: input.attemptId, dyane_line_1: JSON.stringify({ sku: red.sku, quantity: 1, ...red.personalization }),
    } })), pool)
    const metadata = order.params.metadata
    const session = { id: 'cs_test_red', livemode: false, mode: 'payment', currency: 'eur', metadata,
      client_reference_id: input.attemptId, status: 'complete', payment_status: 'paid',
      line_items: { data: [{ price: { id: 'price_5500' }, quantity: 1 }], has_more: false } }
    await store.transaction(c => store.applySession(c, 'evt_red_paid', session), pool)
    assert.equal((await db.query('SELECT status FROM dyane_checkout_orders')).rows[0].status, 'paid')
    const row = (await db.query('SELECT personalization FROM dyane_checkout_order_items')).rows[0]
    assert.equal(row.personalization.finish, 'red')
    assert.equal(row.personalization.initials, 'DP')
    // Local setup reapplies schema files on restart: existing red orders must survive it.
    await pg.exec(fs.readFileSync('database/stripe/006_personalized_order_items.sql', 'utf8'))
    await pg.exec(fs.readFileSync('database/stripe/007_red_personalization.sql', 'utf8'))
    assert.equal((await db.query('SELECT personalization FROM dyane_checkout_order_items')).rows[0].personalization.finish, 'red')
  } finally { await pg.close() }
})
