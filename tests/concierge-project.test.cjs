const test = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { load } = require('./helpers/load-stripe.cjs')

const schema = load('lib/personalization/project.ts')
const project = () => ({ ...schema.emptyProject(), firstName: 'Anne', lastName: 'Martin',
  email: 'anne@example.test', budget: '1000-2500', desiredDate: '2026-12-20', consent: true })
const body = () => ({ project: project(), locale: 'fr', submissionId: randomUUID(), website: '' })
const request = (payload = body(), headers = {}) => new Request('https://preview.example.test/api/concierge-project', {
  method: 'POST', headers: { origin: 'https://preview.example.test', host: 'preview.example.test', 'content-type': 'application/json', ...headers },
  body: JSON.stringify(payload),
})

function route(send = async () => ({ data: { id: 'email-test-id' }, error: null })) {
  const calls = []
  class Resend {
    constructor() { this.emails = { send: async (...args) => { calls.push(args); return send(...args) } } }
  }
  return { post: load('app/api/concierge-project/route.ts', { resend: { Resend } }).POST, calls }
}

async function withKey(value, work) {
  const original = process.env.RESEND_API_KEY
  if (value === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = value
  try { return await work() } finally {
    if (original === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = original
  }
}

test('bespoke schema accepts wishes, normalises contact data and retains explicit feasibility labels', () => {
  const input = { ...project(), email: ' ANNE@EXAMPLE.TEST ', bodyColour: ' Blanc ', finish: 'matte', mixology: 'no-low-alcohol' }
  const valid = schema.validateProject(input)
  assert.equal(valid.email, 'anne@example.test')
  assert.equal(valid.bodyColour, 'Blanc')
  const summary = schema.projectSummary(valid, 'fr').map(row => row.join(': ')).join('\n')
  assert.match(summary, /sous réserve de faisabilité/)
  assert.match(summary, /1 000 € - 2 500 €/)
})

test('bespoke schema rejects fabricated models, unbounded or malformed choices and invalid consent/date', () => {
  const invalid = [{ sculpture: 'fake' }, { finish: 'guaranteed-gold' }, { mixology: 'wine' }, { budget: 'free' },
    { budget: '' }, { consent: false }, { exclusive: 'yes' }, { email: 'bad@example' }, { firstName: '  ' },
    { desiredDate: '2026-02-30' }, { desiredDate: 'yesterday' }, { message: 'x'.repeat(2001) },
    { inscription: 'hello\u0000world' }, { unknown: 'injected' }]
  for (const change of invalid) assert.equal(schema.validateProject({ ...project(), ...change }), null, JSON.stringify(change))
  const missing = project(); delete missing.phone
  assert.equal(schema.validateProject(missing), null)
  assert.equal(schema.validateProject(null), null)
  assert.equal(schema.validateProject([]), null)
})

test('concierge endpoint never reports transmission when email configuration or delivery is absent', async () => {
  await withKey(undefined, async () => {
    const { post, calls } = route()
    const response = await post(request())
    assert.equal(response.status, 503)
    assert.equal((await response.json()).ok, undefined)
    assert.equal(calls.length, 0)
  })
  await withKey('mock-key-only', async () => {
    for (const send of [async () => ({ data: null, error: { message: 'failure' } }),
      async () => ({ data: {}, error: null }), async () => { throw new Error('network failure') }]) {
      const { post } = route(send)
      const response = await post(request())
      assert.equal(response.status, 502)
      assert.equal((await response.json()).ok, undefined)
    }
  })
})

test('only verified send succeeds, fixed concierge recipient, complete escaped summary and stable idempotency', async () => {
  await withKey('mock-key-only', async () => {
    const { post, calls } = route()
    const payload = body()
    payload.project.message = '<script>alert("x")</script> & spécial'
    payload.project.bodyColour = 'Bleu'
    payload.project.inscription = 'AM'
    const response = await post(request(payload))
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), { ok: true, id: 'email-test-id' })
    const [mail, options] = calls[0]
    assert.deepEqual(Array.from(mail.to), ['conciergerie@dyaneparis.com'])
    assert.equal(mail.replyTo, 'anne@example.test')
    assert.equal(options.idempotencyKey, `concierge-project/${payload.submissionId}`)
    assert.match(mail.text, /Bleu/)
    assert.match(mail.text, /AM/)
    assert.match(mail.text, /2026-12-20/)
    assert.match(mail.text, /Aucun achat, prix fixe ou délai/)
    assert.ok(!mail.html.includes('<script>'))
    assert.match(mail.html, /&lt;script&gt;/)
    assert.match(mail.html, /&amp; spécial/)
    assert.match(mail.html, /Consentement au traitement de la demande : oui/)
  })
})

test('same-origin, honeypot, strict payload and byte limit stop requests before any email send', async () => {
  await withKey('mock-key-only', async () => {
    for (const [payload, headers, status] of [
      [body(), { origin: 'https://attacker.example.test' }, 403],
      [body(), { origin: '' }, 403],
      [{ ...body(), website: 'spam.example.test' }, {}, 400],
      [{ ...body(), locale: 'de' }, {}, 400],
      [{ ...body(), submissionId: 'not-a-uuid' }, {}, 400],
      [{ ...body(), to: 'attacker@example.test' }, {}, 400],
      [{ ...body(), project: { ...project(), consent: false } }, {}, 400],
      [body(), { 'content-length': '20001' }, 413],
      [{ ...body(), website: 'x'.repeat(21000) }, {}, 413],
    ]) {
      const { post, calls } = route()
      assert.equal((await post(request(payload, headers))).status, status)
      assert.equal(calls.length, 0)
    }
  })
})

test('rate limiting caps repeated submissions without a fake successful response', async () => {
  await withKey('mock-key-only', async () => {
    const { post, calls } = route()
    for (let count = 0; count < 4; count++) assert.equal((await post(request())).status, 200)
    const response = await post(request())
    assert.equal(response.status, 429)
    assert.equal(response.headers.get('retry-after'), '600')
    assert.equal(calls.length, 4)
  })
})

test('year-round bespoke enquiry uses the existing protected delivery route with the correct subject', async () => {
  await withKey('test-fixture', async () => {
    const { post, calls } = route()
    const response = await post(request({ ...body(), project: { ...project(), sculpture: 'to-discuss', budget: '' }, source: 'bespoke' }))
    assert.equal(response.status,200)
    assert.match(calls[0][0].subject,/œuvre sur commande/)
    assert.match(calls[0][0].text,/À définir avec la Maison/)
    assert.match(calls[0][0].text,/Non renseigné/)
    assert.equal(schema.validateProject({ ...project(), sculpture: 'to-discuss', budget: '' }),null,'Christmas route remains strict')
    assert.ok(!calls[0][0].text.includes('cadeau de Noël rêvé'))
    const rejected = await post(request({ ...body(), source: 'fake-campaign' }))
    assert.equal(rejected.status,400)
    assert.equal(calls.length,1)
  })
})
