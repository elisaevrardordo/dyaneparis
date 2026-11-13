import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripeClient, stripeEnvironment } from '@/lib/stripe/config'
import { manualVatFromMetadata } from '@/lib/stripe/manualVat'
import { deliverProductionPurchaseEmails, enqueueProductionPurchaseEmails } from '@/lib/stripe/purchaseNotifications'
import { applySession, orderPool, transaction } from '@/lib/stripe/store'
import { captureTestPurchaseEmail } from '@/lib/stripe/testPurchaseEmail'

export const runtime = 'nodejs'
const supported = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired', 'invoice.paid'])

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
  if (!/^whsec_\S+$/.test(secret)) return new NextResponse(null, { status: 503 })
  let config: ReturnType<typeof stripeEnvironment>
  try { config = stripeEnvironment() }
  catch { return new NextResponse(null, { status: 503 }) }
  const stripe = stripeClient(config.key)
  const body = await request.text()
  if (Buffer.byteLength(body) > 1_000_000) return new NextResponse(null, { status: 413 })
  let event: Stripe.Event
  try { event = stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature') || '', secret) }
  catch { return new NextResponse(null, { status: 400 }) }
  if (event.livemode !== config.livemode || (event.account !== undefined && event.account !== config.account)) {
    return new NextResponse(null, { status: 400 })
  }
  if (!supported.has(event.type)) return NextResponse.json({ received: true })
  try {
    const object = event.data.object as { id: string; livemode?: boolean; metadata?: Record<string, string> }
    if (typeof object.livemode === 'boolean' && object.livemode !== config.livemode) {
      return new NextResponse(null, { status: 400 })
    }
    const orderId = object.metadata?.dyane_order_id
    if (!orderId) return NextResponse.json({ received: true })
    if (config.livemode && (await stripe.accounts.retrieve(null)).id !== config.account) {
      throw new Error('Stripe account mismatch')
    }
    let sessionId = object.id
    if (event.type === 'invoice.paid') {
      const result = await orderPool().query<{ session_id: string | null }>(
        'SELECT session_id FROM dyane_checkout_orders WHERE id::text=$1', [orderId],
      )
      if (!result.rows[0]?.session_id) throw new Error('Checkout session binding pending')
      sessionId = result.rows[0].session_id
    }
    // Read the current state to tolerate events delivered out of order.
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
    if (session.livemode !== config.livemode || session.metadata?.dyane_order_id !== orderId) {
      throw new Error('Checkout session mode or binding mismatch')
    }
    if (manualVatFromMetadata(session.metadata)) {
      session.line_items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ['data.taxes.rate'] })
    }
    if (event.type === 'invoice.paid') {
      const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice?.id
      if (invoiceId !== object.id) throw new Error('Invoice mismatch')
    }
    await transaction(async db => {
      const paidOrder = await applySession(db, event.id, session, event.type, config.livemode)
      if (!paidOrder) return
      if (config.livemode) await enqueueProductionPurchaseEmails(db, paidOrder, session)
      else await captureTestPurchaseEmail(db, paidOrder, session)
    })
    if (config.livemode) await deliverProductionPurchaseEmails(orderId)
    return NextResponse.json({ received: true })
  } catch {
    // No 2xx before durable commit: Stripe retries transient API/DB failures.
    console.error('Stripe webhook processing failed', { eventId: event.id, type: event.type })
    return new NextResponse(null, { status: 500 })
  }
}
