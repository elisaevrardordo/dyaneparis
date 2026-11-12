import 'server-only'
import type { PoolClient } from 'pg'
import { Resend } from 'resend'
import type Stripe from 'stripe'
import { TEO_COMPOSITIONS, cartProducts } from '@/components/cart/catalog'
import { contactEmail } from '@/lib/email/dyaneEmail'
import { purchaseThankYouEmail } from '@/lib/email/purchaseThankYouEmail'
import { shippingDeliveryDescription } from '@/lib/shipping'
import { type PaidCheckoutOrder, orderPool } from './store'

type Purpose = 'customer' | 'house'
type EmailPayload = {
  from: string
  to: string[]
  replyTo?: string
  subject: string
  text: string
  html?: string
}

const sender = 'Dyane Paris <website@mail.dyaneparis.com>'

function checkoutEmail(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email?.trim() || session.customer_email?.trim()
  return email && email.length <= 254 && !/\p{Cc}/u.test(email) && /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email)
    ? email : null
}

export async function enqueueProductionPurchaseEmails(db: PoolClient, order: PaidCheckoutOrder, session: Stripe.Checkout.Session) {
  if (session.livemode !== true || session.payment_status !== 'paid') return
  const total = session.amount_total
  if (session.client_reference_id !== order.id || session.currency !== 'eur'
    || typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) {
    throw new Error('Purchase notification has invalid payment details')
  }

  const locale = session.locale?.startsWith('en') ? 'en' : 'fr'
  const recipient = checkoutEmail(session)
  const from = process.env.CONTACT_FORM_FROM?.trim() || sender
  const items = order.items.map(item => {
    const product = cartProducts.find(product => product.sku === item.sku)
    const description = session.line_items?.data.find(line => line.price?.id === item.price_id)?.description?.trim()
    const recipe = item.composition ? TEO_COMPOSITIONS[item.composition] : null
    const name = product ? `${product.name} · ${recipe ?? product.format}` : description || item.sku
    return { name, quantity: item.quantity }
  })
  const formatTotal = (language: string) => new Intl.NumberFormat(language, { style: 'currency', currency: 'EUR' }).format(total / 100)
  const preorder = order.fulfillment === 'preorder'
  const purchaseDetails = {
    locale,
    firstName: session.customer_details?.name?.trim().split(/\s+/, 1)[0],
    orderNumber: order.id,
    items,
    paidTotal: formatTotal(locale),
    dispatchMessage: order.fulfillment ? shippingDeliveryDescription(locale, preorder) : undefined,
    paymentMessage: preorder ? (locale === 'en' ? 'Payment was taken when you placed your preorder.' : 'Le paiement a été effectué lors de votre précommande.') : undefined,
  } as const
  const customer = recipient ? {
    from, to: [recipient], replyTo: contactEmail, ...purchaseThankYouEmail(purchaseDetails),
  } : null
  const house: EmailPayload = {
    from, to: [contactEmail], subject: `Nouvelle commande réglée - Dyane Paris - ${order.id}`,
    text: [
      `Commande réglée n° ${order.id}`,
      ...items.map(item => `${item.quantity} × ${item.name}`),
      `Total réglé · ${formatTotal('fr')}`,
      ...(order.fulfillment ? [shippingDeliveryDescription('fr', preorder)] : []),
      ...(recipient ? [] : ['Adresse e-mail du client indisponible. Vérifiez la commande avant de le contacter.']),
    ].join('\n'),
  }

  for (const [purpose, payload] of [['customer', customer], ['house', house]] as const) {
    await db.query(`INSERT INTO dyane_checkout_purchase_emails (order_id, purpose, state, payload, review_reason)
      SELECT id, $2, $3, $4::jsonb, $5 FROM dyane_checkout_orders WHERE id=$1 AND status='paid'
      ON CONFLICT (order_id, purpose) DO NOTHING`,
    [order.id, purpose, payload ? 'pending' : 'review', payload, payload ? null : 'recipient_unavailable'])
  }
}

export async function deliverProductionPurchaseEmails(orderId: string) {
  const db = orderPool()
  // Keep automatic retries inside Resend's 24-hour idempotency window.
  // https://resend.com/docs/dashboard/emails/idempotency-keys
  await db.query(`UPDATE dyane_checkout_purchase_emails
    SET state='review', payload=NULL, lease_until=NULL, review_reason='retry_window_elapsed'
    WHERE order_id=$1 AND state='pending' AND first_attempt_at <= now() - interval '23 hours'
      AND (lease_until IS NULL OR lease_until <= now())`, [orderId])
  const pending = await db.query<{ purpose: Purpose }>(`SELECT email.purpose FROM dyane_checkout_purchase_emails email
    JOIN dyane_checkout_orders purchase ON purchase.id=email.order_id
    WHERE email.order_id=$1 AND email.state='pending' AND purchase.status='paid'
    ORDER BY email.purpose`, [orderId])
  if (!pending.rows.length) return

  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Purchase notification provider unavailable')
  const resend = new Resend(key)
  let retryPending = false

  for (const { purpose } of pending.rows) {
    // PostgreSQL rechecks the lease predicate after acquiring the row lock.
    const claim = await db.query<{ payload: EmailPayload; attempt_count: number }>(`UPDATE dyane_checkout_purchase_emails
      SET first_attempt_at=COALESCE(first_attempt_at, now()), lease_until=now() + interval '2 minutes',
        attempt_count=attempt_count+1
      WHERE order_id=$1 AND purpose=$2 AND state='pending'
        AND (lease_until IS NULL OR lease_until <= now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
        AND EXISTS (SELECT 1 FROM dyane_checkout_orders WHERE id=$1 AND status='paid')
      RETURNING payload, attempt_count`, [orderId, purpose])
    const attempt = claim.rows[0]
    if (!attempt) {
      retryPending = true
      continue
    }

    let providerId: string | undefined
    let conflict = false
    try {
      const { data, error } = await resend.emails.send(attempt.payload, { idempotencyKey: `dyane-purchase/${orderId}/${purpose}` })
      if (!error) providerId = data?.id
      conflict = error?.name === 'invalid_idempotent_request'
    } catch {
      // The provider may have accepted a request whose response never arrived.
      // A retry must reuse the exact stored payload and key.
    }

    const identity = [orderId, purpose, attempt.attempt_count]
    if (providerId) {
      await db.query(`UPDATE dyane_checkout_purchase_emails
        SET state='accepted', payload=NULL, lease_until=NULL, accepted_at=now(), provider_id=$4
        WHERE order_id=$1 AND purpose=$2 AND attempt_count=$3 AND state='pending'`, [...identity, providerId])
    } else if (conflict) {
      await db.query(`UPDATE dyane_checkout_purchase_emails
        SET state='review', payload=NULL, lease_until=NULL, review_reason='idempotency_conflict'
        WHERE order_id=$1 AND purpose=$2 AND attempt_count=$3 AND state='pending'`, identity)
    } else {
      await db.query(`UPDATE dyane_checkout_purchase_emails SET lease_until=NULL
        WHERE order_id=$1 AND purpose=$2 AND attempt_count=$3 AND state='pending'`, identity)
      retryPending = true
    }
  }
  if (retryPending) {
    // A previous invocation may have died after claiming the row. Keep Stripe's retry alive until the lease clears.
    const outstanding = await db.query(`SELECT 1 FROM dyane_checkout_purchase_emails
      WHERE order_id=$1 AND state='pending' LIMIT 1`, [orderId])
    if (outstanding.rowCount) throw new Error('Purchase notification delivery pending')
  }
}
