const test = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')
const { renderOrders } = require('../lib/orders/management.cjs')
const gifts = load('lib/gifts/options.ts')
const config = load('lib/stripe/config.ts')
const store = load('lib/stripe/store.ts')
const { createLoadingGate } = load('components/commerce/loadingGate.ts')
function fakeClock() {
  let time = 0, sequence = 0
  const queue = new Map()
  const clock = { now: () => time, schedule: (fn, ms) => { const id = ++sequence; queue.set(id, { at: time + ms, fn }); return id }, clear: id => queue.delete(id) }
  return { clock, tick(ms) { const target = time + ms; for (;;) { const next = [...queue].filter(([, task]) => task.at <= target).sort((a,b) => a[1].at - b[1].at)[0]; if (!next) break; time = next[1].at; queue.delete(next[0]); next[1].fn() } time = target } }
}
test('loader never flashes for quick work, delays 450 ms and holds a shown indicator before fade', async () => {
  const phases = [], fake = fakeClock(), gate = createLoadingGate(phase => phases.push(phase), fake.clock)
  gate.start(); fake.tick(100); await gate.finish(); fake.tick(1000)
  assert.ok(!phases.includes('visible'))
  gate.start(); fake.tick(449); assert.notEqual(phases.at(-1), 'visible')
  fake.tick(1); assert.equal(phases.at(-1), 'visible')
  const finish = gate.finish(); fake.tick(349); assert.equal(phases.at(-1), 'visible')
  fake.tick(1); assert.equal(phases.at(-1), 'leaving')
  fake.tick(180); await finish; assert.equal(phases.at(-1), 'hidden')
})
test('cancelled or restarted loading cannot leave stale timers or overlays behind', async () => {
  const phases = [], fake = fakeClock(), gate = createLoadingGate(phase => phases.push(phase), fake.clock)
  gate.start(); fake.tick(451); const finish = gate.finish(); gate.cancel(); await finish
  fake.tick(5000); assert.equal(phases.at(-1), 'hidden')
  gate.start(); fake.tick(400); gate.start(); fake.tick(400); assert.equal(phases.at(-1), 'hidden')
  gate.cancel(); fake.tick(5000); assert.equal(phases.at(-1), 'hidden')
})
test('gift options accept only the available gift intent, never unapproved packaging or shopping bags', () => {
  assert.equal(gifts.giftOptions(undefined, 'Bonjour').isGift, true)
  assert.equal(gifts.giftOptions({ isGift: true }).isGift, true)
  for (const value of [null, [], {}, { isGift: 'true' }, { isGift: true, shoppingBag: true }, { isGift: true, packaging: 'eco' }]) assert.throws(() => gifts.giftOptions(value))
  assert.throws(() => gifts.giftOptions({ isGift: false }, 'A note'))
  const payload = { items: [{ sku: 'dyane-sculpture-25cl', quantity: 1 }], locale: 'fr', attemptId: randomUUID(), adultConfirmed: true, giftMessage: '' }
  assert.equal(config.checkoutPayload({ ...payload, giftOptions: { isGift: true } }).giftOptions.isGift, true)
  assert.throws(() => config.checkoutPayload({ ...payload, giftOptions: { isGift: true, shoppingBag: true } }))
})
test('gift intent without a note is stored, immutable per attempt, preserved after paid webhook and shown in management', async () => {
  const pg = new PGlite()
  try {
    for (const file of ['001_checkout.sql', '002_payment_snapshot.sql', '003_cart_items.sql', '004_gift_message_limits.sql', '005_gift_options.sql', '006_personalized_order_items.sql']) await pg.exec(readFileSync('database/stripe/' + file, 'utf8'))
    const db = { query: async (sql,args) => { const result = await pg.query(sql,args); return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length } }, release() {} }
    const pool = { connect: async () => db }
    await db.query("INSERT INTO dyane_checkout_inventory(sku,label,price_id,available,active) VALUES ('dyane-sculpture-25cl','25cl','price_gift',5,true)")
    const input = { items: [{ sku: 'dyane-sculpture-25cl', quantity: 1 }], locale: 'fr', attemptId: randomUUID(), giftMessage: '', giftOptions: { isGift: true } }
    const params = lines => ({ mode: 'payment', line_items: lines.map(line => ({ price: line.price_id, quantity: line.quantity })) })
    await store.transaction(c => store.reserveCartOrder(c,input,params),pool)
    await assert.rejects(store.transaction(c => store.reserveCartOrder(c,{ ...input, giftOptions: { isGift: false } },params),pool))
    await assert.rejects(db.query('UPDATE dyane_checkout_orders SET gift_options=$1 WHERE id=$2', [{ isGift: true, shoppingBag: true },input.attemptId]))
    const session = { id: 'cs_test_gifting', livemode: false, mode: 'payment', currency: 'eur', metadata: { dyane_order_id: input.attemptId }, client_reference_id: input.attemptId, status: 'complete', payment_status: 'paid', line_items: { data: [{ price: { id: 'price_gift' }, quantity: 1 }], has_more: false } }
    await store.transaction(c => store.applySession(c,'evt_gifting_paid',session),pool)
    const row = (await db.query('SELECT * FROM dyane_checkout_orders WHERE id=$1',[input.attemptId])).rows[0]
    assert.equal(row.status,'paid'); assert.equal(row.gift_options.isGift,true)
    assert.ok(!JSON.stringify(row.params).includes('isGift'))
    const html = renderOrders([row]); assert.ok(html.includes('Offrir en cadeau')); assert.ok(html.includes('Aucun message à imprimer.')); assert.ok(!html.includes('Préparer la carte'))
  } finally { await pg.close() }
})
test('stock summary keeps the configured shipping price when stock or tax is unconfirmed', async () => {
  const previous = process.env.STRIPE_DATABASE_URL
  process.env.STRIPE_DATABASE_URL = 'local_fixture'
  try {
    const items = [{ sku: 'dyane-sculpture-25cl', quantity: 1 }]
    const failed = load('lib/stripe/cart-summary.ts', { './store': { orderPool: () => ({ query: async () => { throw Error('offline') } }) } })
    const unknown = await failed.cartSummary(items)
    assert.equal(unknown.stockVerified,false); assert.equal(unknown.shipping,1500); assert.equal(unknown.total,7000); assert.equal(unknown.tax,null)
    const ready = load('lib/stripe/cart-summary.ts', { './store': { orderPool: () => ({ query: async () => ({ rows: [{ sku: items[0].sku, active: true, available: 0 }] }) }) }, './config': { checkoutConfig: () => { throw Error('disabled') } } })
    const empty = await ready.cartSummary(items)
    assert.equal(empty.stockVerified,true); assert.equal(empty.limits[items[0].sku],0); assert.equal(empty.checkoutAvailable,false)
  } finally { if (previous === undefined) delete process.env.STRIPE_DATABASE_URL; else process.env.STRIPE_DATABASE_URL = previous }
})

test('default loader clock calls browser timer APIs without a foreign receiver', async () => {
  const vm = require('node:vm'), ts = require('typescript')
  const module = { exports: {} }, phases = []
  const code = ts.transpileModule(readFileSync('components/commerce/loadingGate.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  vm.runInNewContext(code, { module, exports: module.exports, Date, Promise,
    setTimeout: function(fn) { 'use strict'; assert.equal(this,undefined); fn(); return 1 },
    clearTimeout: function() { 'use strict'; assert.equal(this,undefined) },
  })
  const gate = module.exports.createLoadingGate(phase => phases.push(phase))
  gate.start(); await gate.finish()
  assert.ok(phases.includes('visible')); assert.equal(phases.at(-1),'hidden')
})
