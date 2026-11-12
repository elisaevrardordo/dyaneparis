const test = require('node:test')
const assert = require('node:assert/strict')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./helpers/load-stripe.cjs')

const email = 'newsletter-check@example.test'
const request = (payload = { email, locale: 'fr', source: 'footer' }, headers = {}) => new Request('http://localhost:3000/api/newsletter', {
  method: 'POST', headers: { origin: 'http://localhost:3000', host: 'localhost:3000', ...headers }, body: JSON.stringify(payload),
})
async function withEnv(values, work) {
  const before = {}
  for (const key of Object.keys(values)) { before[key] = process.env[key]; if (values[key] === undefined) delete process.env[key]; else process.env[key] = values[key] }
  try { return await work() } finally { for (const key of Object.keys(values)) { if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key] } }
}
const secret = 'mock-newsletter-signing-secret-at-least-32'
const segmentId = 'segment-test'
const contactId = 'contact-test'

function route({
  save = async () => {},
  create = async () => ({ data: { id: contactId }, error: null }),
  get = async () => ({ data: null, error: { name: 'not_found', statusCode: 404 } }),
  list = async () => ({ data: { data: [], has_more: false }, error: null }),
  add = async () => ({ data: { id: segmentId }, error: null }),
} = {}) {
  const calls = { save: [], contact: [], lookup: [], segments: [], add: [], mail: [], sendOptions: [] }
  class Resend {
    constructor() {
      this.contacts = {
        create: async value => { calls.contact.push(value); return create(value) },
        get: async value => { calls.lookup.push(value); return get(value) },
        segments: {
          list: async value => { calls.segments.push(value); return list(value) },
          add: async value => { calls.add.push(value); return add(value) },
        },
      }
      this.emails = { send: async (value, options) => {
        calls.mail.push(value)
        calls.sendOptions.push(options)
        return { data: { id: 'mail-test' }, error: null }
      } }
    }
  }
  const post = load('app/api/newsletter/route.ts', {
    resend: { Resend },
    '@/lib/newsletter/previewStore': { savePreviewSubscription: async (...args) => { calls.save.push(args); await save(...args) } },
  }).POST
  return { post, calls }
}

test('preview confirms only after storage and never invokes Resend, even with a configured key', async () => {
  await withEnv({ NEWSLETTER_MODE: 'preview', RESEND_API_KEY: 'mock-only' }, async () => {
    const { post, calls } = route()
    const result = await post(request({ email: ' NEWSLETTER-CHECK@EXAMPLE.TEST ', locale: 'en', source: 'footer' }))
    assert.equal(result.status, 200)
    assert.deepEqual(await result.json(), { ok: true, mode: 'preview' })
    assert.equal(result.headers.get('cache-control'), 'no-store')
    assert.equal(calls.save[0][1].email, email)
    assert.equal(calls.save[0][1].locale, 'en')
    assert.equal(calls.contact.length + calls.mail.length, 0)
    const failed = route({ save: async () => { throw Error('storage down') } })
    assert.equal((await failed.post(request())).status, 503)
    assert.equal(failed.calls.contact.length + failed.calls.mail.length, 0)
  })
})

test('invalid, forged, oversized and bot requests never reach storage or delivery', async () => {
  await withEnv({ NEWSLETTER_MODE: 'preview' }, async () => {
    for (const payload of [null, [], {}, { email: 'bad' }, { email: 'x'.repeat(181) + '@example.test' }, { email: 'a\u0000b@example.test' },
      { email, locale: ['en'] }, { email, source: ['footer'] }, { email, injected: true }]) {
      const { post, calls } = route()
      assert.equal((await post(request(payload))).status, 400)
      assert.equal(calls.save.length + calls.contact.length + calls.mail.length, 0)
    }
    for (const [headers, status] of [[{ origin: 'https://evil.example' }, 403], [{ 'content-length': '5001' }, 413]]) {
      const { post, calls } = route()
      assert.equal((await post(request(undefined, headers))).status, status)
      assert.equal(calls.save.length, 0)
    }
    const { post, calls } = route()
    assert.equal((await post(request({ email, website: 'spam' }))).status, 200)
    assert.equal(calls.save.length + calls.contact.length + calls.mail.length, 0)
    const large = route()
    assert.equal((await large.post(request({ email, firstName: 'a'.repeat(5000) }))).status, 413)
  })
})

test('rate limiting prevents repeated submissions and includes a retry delay', async () => {
  const { post, calls } = route()
  await withEnv({ NEWSLETTER_MODE: 'preview' }, async () => {
    for (let n = 0; n < 6; n++) assert.equal((await post(request())).status, 200)
    const result = await post(request())
    assert.equal(result.status, 429)
    assert.equal(result.headers.get('retry-after'), '3600')
    assert.equal(calls.save.length, 6)
  })
})

test('real subscriptions need configuration and an explicit provider confirmation', async () => {
  await withEnv({ NEWSLETTER_MODE: 'resend', RESEND_API_KEY: undefined, RESEND_SEGMENT_ID: undefined, RESEND_AUDIENCE_ID: undefined, NEWSLETTER_UNSUBSCRIBE_SECRET: undefined }, async () => {
    const unconfigured = route()
    assert.equal((await unconfigured.post(request())).status, 503)
    assert.equal(unconfigured.calls.contact.length, 0)
    process.env.RESEND_API_KEY = 'mock-only'
    assert.equal((await route().post(request())).status, 503)
    process.env.RESEND_SEGMENT_ID = segmentId
    assert.equal((await route().post(request())).status, 503)
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET = secret
    for (const create of [async () => ({ data: null, error: { message: 'Segment does not exist' } }),
      async () => ({ data: {}, error: null }), async () => { throw Error('network failure') }]) {
      const { post, calls } = route({ create })
      assert.equal((await post(request())).status, 502)
      assert.equal(calls.mail.length, 0)
    }
    for (const [locale, subject, path] of [
      ['fr', "Bienvenue dans l'univers Dyane Paris", '/la-maison'],
      ['en', 'Welcome to the world of Dyane Paris', '/en/la-maison'],
    ]) {
      const success = route()
      const result = await success.post(request({ email, locale, source: 'footer', firstName: 'A & <b>' }))
      assert.deepEqual(await result.json(), { ok: true, mode: 'resend' })
      assert.equal(success.calls.contact[0].segments[0].id, 'segment-test')
      assert.equal(success.calls.mail.length, 1)
      assert.equal(success.calls.save.length, 0)
      const [welcome] = success.calls.mail
      const url = `https://www.dyaneparis.com${path}`
      assert.equal(welcome.subject, subject)
      assert.ok(welcome.html.includes(`<html lang="${locale}">`))
      assert.ok(welcome.html.includes('src="https://www.dyaneparis.com/images/brand/dyane-paris-newsletter.png"'))
      assert.ok(welcome.html.includes(`href="${url}"`))
      assert.match(welcome.html, /A &amp; &lt;b&gt;/)
      assert.match(welcome.html, /display:none[^>]*>(L'art de la mixologie|The art of mixology)/)
      const images = ['dyane-paris-newsletter.png', 'dyane-no1-detail-porcelaine.jpg', 'dyane-no1-pornstar-martini.jpg', 'dyane-no2-basil-smash.jpg']
      const imagePositions = images.map(image => welcome.html.indexOf(image))
      assert.ok(imagePositions.every((position, index) => position >= 0 && (index === 0 || position > imagePositions[index - 1])))
      const prefix = 'https://www.dyaneparis.com' + (locale === 'en' ? '/en' : '')
      for (const path of ['/oeuvres/dyane-no1-pornstar-martini', '/oeuvres/dyane-no2-basil-smash']) {
        assert.equal(welcome.html.split('href="' + prefix + path + '"').length - 1, 2)
      }
      assert.match(welcome.html, />DYANE NO\.1</)
      assert.match(welcome.html, />DYANE NO\.2</)
      assert.match(welcome.html, /href="mailto:contact@dyaneparis\.com"[^>]*>contact@dyaneparis\.com</)
      assert.ok(welcome.text.includes('contact@dyaneparis.com'))
      assert.ok(welcome.html.includes('href="' + prefix + '/mentions-legales"'))
      assert.match(welcome.html, /\/fonts\/cormorant-garamond-regular\.woff2/)
      assert.match(welcome.html, /\/fonts\/jost-light\.woff2/)
      assert.match(welcome.html, /href="https:\/\/www\.instagram\.com\/dyaneparis_\/"/)
      assert.match(welcome.html, /\/images\/newsletter\/instagram\.png/)
      assert.equal(welcome.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
      const unsubscribe = welcome.headers['List-Unsubscribe'].slice(1, -1)
      assert.equal(new URL(unsubscribe).searchParams.get('locale'), locale)
      assert.ok(welcome.text.startsWith(subject) && welcome.text.endsWith(unsubscribe))
      assert.equal(success.calls.sendOptions[0].idempotencyKey, 'newsletter-welcome/' + segmentId + '/' + contactId)
    }
  })
})

test('only a newly confirmed segment membership triggers welcome', async () => {
  await withEnv({ NEWSLETTER_MODE: 'resend', RESEND_API_KEY: 'mock-only', RESEND_SEGMENT_ID: segmentId, NEWSLETTER_UNSUBSCRIBE_SECRET: secret }, async () => {
    const get = async () => ({ data: { id: contactId, first_name: 'Camille', unsubscribed: false }, error: null })
    const list = async ({ after }) => ({
      data: after ? { data: [{ id: segmentId }], has_more: false } : { data: [{ id: 'other' }], has_more: true },
      error: null,
    })
    const existing = route({ get, list })
    assert.equal((await existing.post(request())).status, 200)
    assert.equal(existing.calls.segments[1].after, 'other')
    assert.equal(existing.calls.contact.length + existing.calls.add.length + existing.calls.mail.length, 0)

    const newMember = route({ get })
    assert.equal((await newMember.post(request())).status, 200)
    assert.equal(newMember.calls.add[0].segmentId, segmentId)
    assert.match(newMember.calls.mail[0].html, /Bonjour Camille,/)

    const unknown = route({ get: async () => ({ data: null, error: { name: 'restricted_api_key', statusCode: 403 } }) })
    assert.equal((await unknown.post(request())).status, 502)
    assert.equal(unknown.calls.contact.length + unknown.calls.mail.length, 0)

    let lookups = 0
    const concurrent = route({
      get: async () => ++lookups === 1 ? ({ data: null, error: { statusCode: 404 } }) : get(),
      create: async () => ({ data: null, error: { statusCode: 409 } }),
      list: async () => ({ data: { data: [{ id: segmentId }], has_more: false }, error: null }),
    })
    assert.equal((await concurrent.post(request())).status, 200)
    assert.equal(concurrent.calls.mail.length, 0)
  })
})

test('unsubscribe validates a signed token, confirms on GET and removes only the newsletter segment on POST', async () => {
  const { newsletterUnsubscribeUrl } = load('lib/newsletter/unsubscribeLink.ts')
  const removals = []
  class Resend {
    constructor() {
      this.contacts = { segments: { remove: async value => { removals.push(value); return { data: { deleted: true }, error: null } } } }
    }
  }
  const unsubscribe = load('app/api/newsletter/unsubscribe/route.ts', { resend: { Resend } })
  await withEnv({ NEWSLETTER_MODE: 'resend', RESEND_API_KEY: 'mock-only', RESEND_SEGMENT_ID: segmentId, NEWSLETTER_UNSUBSCRIBE_SECRET: secret }, async () => {
    const url = newsletterUnsubscribeUrl(contactId, segmentId, 'en', secret)
    const confirmation = unsubscribe.GET(new Request(url))
    assert.equal(confirmation.status, 200)
    assert.match(await confirmation.text(), /<form method="post">/)
    assert.equal(removals.length, 0)
    assert.equal((await unsubscribe.POST(new Request(url + 'broken', { method: 'POST' }))).status, 400)
    assert.equal(removals.length, 0)
    const response = await unsubscribe.POST(new Request(url, {
      method: 'POST', body: 'List-Unsubscribe=One-Click',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }))
    assert.equal(response.status, 200)
    assert.equal(removals.length, 1)
    assert.equal(removals[0].contactId, contactId)
    assert.equal(removals[0].segmentId, segmentId)
    assert.match(await response.text(), /You are unsubscribed/)
  })
})

test('preview storage refuses external origins and any database other than the dedicated loopback sandbox', () => {
  const store = load('lib/newsletter/previewStore.ts')
  const env = { NEWSLETTER_MODE: 'preview', STRIPE_DATABASE_URL: 'postgresql://test:fake@127.0.0.1:55432/dyane_stripe_sandbox' }
  assert.ok(store.localNewsletterDatabase(request(), env))
  for (const changed of [{ NEWSLETTER_MODE: 'resend' }, { VERCEL: '1' },
    { STRIPE_DATABASE_URL: 'postgresql://test:fake@db.example:55432/dyane_stripe_sandbox' },
    { STRIPE_DATABASE_URL: 'postgresql://test:fake@127.0.0.1:5432/production' }]) {
    assert.throws(() => store.localNewsletterDatabase(request(), { ...env, ...changed }))
  }
  assert.throws(() => store.localNewsletterDatabase(new Request('https://preview.example/api/newsletter'), env))
  assert.throws(() => store.localNewsletterDatabase(request(undefined, { 'x-forwarded-host': 'shop.example' }), env))
})

test('SQL persistence is idempotent and rolls back failed writes', async () => {
  const db = new PGlite()
  let fail = false
  class Pool {
    async connect() { return { query: async (sql, params) => {
      if (sql.includes('pg_advisory')) return { rows: [] }
      if (fail && sql.startsWith('INSERT')) throw Error('insert failed')
      return db.query(sql, params)
    }, release() {} } }
  }
  const store = load('lib/newsletter/previewStore.ts', { pg: { Pool } })
  try {
    await withEnv({ NEWSLETTER_MODE: 'preview', VERCEL: undefined, STRIPE_DATABASE_URL: 'postgresql://test:fake@127.0.0.1:55432/dyane_stripe_sandbox' }, async () => {
      await store.savePreviewSubscription(request(), { email, locale: 'fr', source: 'footer' })
      await store.savePreviewSubscription(request(), { email, locale: 'en', source: 'newsletter_section' })
      const rows = await db.query('SELECT email,locale,source FROM dyane_newsletter_preview_subscriptions')
      assert.equal(rows.rows.length, 1)
      assert.equal(rows.rows[0].locale, 'en')
      fail = true
      await assert.rejects(store.savePreviewSubscription(request(), { email: 'other@example.test', locale: 'fr', source: 'footer' }))
      assert.equal((await db.query('SELECT count(*)::int AS n FROM dyane_newsletter_preview_subscriptions')).rows[0].n, 1)
    })
  } finally { await db.close() }
})

test('confirmation copy distinguishes a local test from a real subscription in both languages', () => {
  const messages = load('lib/newsletter/messages.ts')
  assert.match(messages.newsletterSuccess('fr', true), /test.*localement/)
  assert.match(messages.newsletterSuccess('en', true), /Test.*locally/)
  assert.match(messages.newsletterSuccess('fr', false), /confirmée/)
  assert.match(messages.newsletterError('fr', 'rate_limited'), /une heure/)
})

test('purchase thank-you shares the Dyane design and escapes order details', () => {
  const { purchaseThankYouEmail } = load('lib/email/purchaseThankYouEmail.ts')
  const purchase = purchaseThankYouEmail({
    firstName: 'A & B',
    orderNumber: 'DY-<001>',
    items: [{ name: 'Dyane No.1 <1,5 L>', quantity: 1 }],
    paidTotal: '185,00 €',
  })
  assert.match(purchase.html, /Bonjour A &amp; B,/)
  assert.match(purchase.html, /Votre commande n° DY-&lt;001&gt; est confirmée/)
  assert.match(purchase.html, /1 × Dyane No\.1 &lt;1,5 L&gt;/)
  assert.match(purchase.html, /Total réglé<\/strong> · 185,00 €/)
  assert.match(purchase.html, /href="mailto:contact@dyaneparis\.com"/)
  assert.match(purchase.html, /href="https:\/\/www\.instagram\.com\/dyaneparis_\/"/)
  assert.match(purchase.html, /\/images\/newsletter\/instagram\.png/)
  assert.match(purchase.html, /Cormorant Garamond/)
  assert.ok(purchase.text.includes('1 × Dyane No.1 <1,5 L>'))
})
