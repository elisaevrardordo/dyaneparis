import { NextResponse } from 'next/server'
import { stripeEnvironment } from '@/lib/stripe/config'
import { canAccessOrder, isOrderId } from '@/lib/stripe/order-access'
import { orderPool, type Order } from '@/lib/stripe/store'
import { commerceIntegration } from '@/lib/orders/fulfillment'
import type { CartItem } from '@/components/cart/catalog'

export const runtime = 'nodejs'
const headers = { 'Cache-Control': 'no-store' }

export async function GET(request: Request) {
  try {
    const config = stripeEnvironment()
    const id = new URL(request.url).searchParams.get('order')
    if (!isOrderId(id) || !canAccessOrder(request, id, config.key)) return new NextResponse(null, { status: 404, headers })
    const db = orderPool()
    const { rows: [order] } = await db.query<Order>('SELECT * FROM dyane_checkout_orders WHERE id=$1', [id])
    if (!order || order.params.integration_identifier !== commerceIntegration) return new NextResponse(null, { status: 404, headers })
    const status = order.status === 'reserved' ? 'pending' : order.status
    if (status !== 'paid') return NextResponse.json({ status, fulfillment: order.fulfillment }, { headers })
    const { rows } = await db.query<CartItem>(
      `SELECT sku,quantity,personalization,to_jsonb(item)->>'composition' AS composition
       FROM dyane_checkout_order_items item WHERE order_id=$1 ORDER BY line_key`, [id])
    const items = rows.map(item => ({ sku: item.sku, quantity: item.quantity,
      ...(item.personalization ? { personalization: item.personalization } : {}), ...(item.composition ? { composition: item.composition } : {}),
    }))
    return NextResponse.json({ status, fulfillment: order.fulfillment, items }, { headers })
  } catch { return new NextResponse(null, { status: 503, headers }) }
}
