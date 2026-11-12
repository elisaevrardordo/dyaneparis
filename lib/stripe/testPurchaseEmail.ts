import 'server-only'
import type { PoolClient } from 'pg'
import type Stripe from 'stripe'
import { cartProducts } from '@/components/cart/catalog'
import { purchaseThankYouEmail } from '@/lib/email/purchaseThankYouEmail'
import { shippingDeliveryDescription } from '@/lib/shipping'
import type { PaidCheckoutOrder } from './store'

export async function captureTestPurchaseEmail(db: PoolClient, order: PaidCheckoutOrder, session: Stripe.Checkout.Session) {
  if (session.livemode !== false || session.payment_status !== 'paid') return

  const recipient = session.customer_details?.email?.trim() || session.customer_email?.trim()
  const total = session.amount_total
  if (!recipient || typeof total !== 'number') return

  const items = order.items.map(item => {
    const product = cartProducts.find(product => product.sku === item.sku)
    const description = session.line_items?.data.find(line => line.price?.id === item.price_id)?.description?.trim()
    const recipe = item.composition ? (item.composition === 'no1' ? 'Pornstar Martini' : 'Basil Smash') : null
    const name = product ? `${product.name} · ${recipe ?? product.format}` : description || item.sku
    return { name, quantity: item.quantity }
  })
  const email = purchaseThankYouEmail({
    firstName: session.customer_details?.name?.trim().split(/\s+/, 1)[0],
    orderNumber: order.id,
    items,
    paidTotal: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total / 100),
    dispatchMessage: order.fulfillment ? shippingDeliveryDescription('fr', order.fulfillment === 'preorder') : undefined,
    ...(order.fulfillment === 'preorder' ? {
      paymentMessage: 'Le paiement a été effectué lors de votre précommande.',
    } : {}),
  })

  // Record the rendered message locally. There is no delivery worker for this table.
  await db.query(`INSERT INTO dyane_checkout_test_emails (order_id, recipient, subject, text_body, html_body)
    VALUES ($1,$2,$3,$4,$5) ON CONFLICT (order_id) DO NOTHING`,
    [order.id, recipient, email.subject, email.text, email.html])
}
