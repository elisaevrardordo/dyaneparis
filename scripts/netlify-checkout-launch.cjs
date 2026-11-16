const { setTimeout } = require('node:timers/promises')
const { Resend } = require('resend')

const checkoutEvents = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'invoice.paid',
]

async function verifyLaunch(stripe, env, price, check) {
  const origin = env.STRIPE_SITE_URL
  const expectedUrl = `${origin}/api/stripe/webhook`
  const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 100 }).catch(error => {
    check(false, `Could not list Stripe Live webhook endpoints (HTTP ${error.statusCode || 'unknown'}).`)
  })
  const endpoints = webhookEndpoints.data.filter(endpoint => endpoint.url === expectedUrl
    && endpoint.livemode && endpoint.status === 'enabled')
  check(endpoints.length === 1, 'Expected one active Stripe Live webhook for the Dyane Paris production URL.')
  const events = endpoints[0].enabled_events
  check(events.includes('*') || checkoutEvents.every(event => events.includes(event)),
    'The Stripe Live webhook does not subscribe to all required checkout and invoice events.')
  console.log('Stripe Live webhook URL and event subscriptions verified.')

  // This session has no card, customer, or Dyane order ID. Its expiration only tests Stripe delivery.
  const probe = `dyane-checkout-launch-${env.COMMIT_REF}`
  check(/^[a-f0-9]{40}$/.test(env.COMMIT_REF || ''), 'Missing Git commit for the launch verification.')
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/panier`,
    cancel_url: `${origin}/panier`,
    client_reference_id: probe,
  }, { idempotencyKey: probe }).catch(error => {
    check(false, `Could not create the unpaid Stripe Live verification session (HTTP ${error.statusCode || 'unknown'}).`)
  })
  const current = await stripe.checkout.sessions.retrieve(session.id)
  check(current.livemode && current.payment_status === 'unpaid' && current.client_reference_id === probe
    && !current.metadata?.dyane_order_id && ['open', 'expired'].includes(current.status),
  'The Stripe Live verification session does not match the expected unpaid probe.')
  if (current.status === 'open') await stripe.checkout.sessions.expire(current.id)

  const deadline = Date.now() + 25_000
  let expiration
  while (Date.now() < deadline) {
    const result = await stripe.events.list({
      type: 'checkout.session.expired', created: { gte: current.created }, limit: 100,
    }).catch(error => {
      check(false, `Could not verify the Stripe Live event delivery (HTTP ${error.statusCode || 'unknown'}).`)
    })
    expiration = result.data.find(event => event.livemode && event.data.object.id === current.id)
    if (expiration?.pending_webhooks === 0) break
    await setTimeout(1200)
  }
  check(expiration?.pending_webhooks === 0, 'Stripe Live did not confirm delivery of the signed expiration event.')
  console.log('Stripe Live confirmed delivery of the signed expiration event. No order or charge was created.')

  const resend = new Resend(env.RESEND_API_KEY)
  const { data } = await resend.emails.send({
    from: env.CONTACT_FORM_FROM?.trim() || 'Dyane Paris <website@mail.dyaneparis.com>',
    to: 'delivered+dyane-launch@resend.dev',
    subject: 'Dyane Paris · Vérification des confirmations',
    text: 'Vérification du service de confirmation de la boutique Dyane Paris.',
  }, { idempotencyKey: probe })
  check(data?.id, 'Resend rejected the production sender in the checkout email verification.')
  console.log('Resend accepted the production sender and sent a test to its verification address.')
}

module.exports = verifyLaunch
