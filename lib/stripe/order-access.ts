import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

export function isOrderId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function orderCookieName(orderId: string) { return `dyane_order_${orderId}` }

export function orderAccessToken(orderId: string, key: string) {
  return createHmac('sha256', key).update(`dyane-checkout-order/${orderId}`).digest('hex')
}

export function canAccessOrder(request: Request, orderId: string, key: string) {
  const cookie = request.headers.get('cookie')?.split(';').map(value => value.trim())
    .find(value => value.startsWith(`${orderCookieName(orderId)}=`))?.split('=')[1]
  if (!cookie || !/^[a-f0-9]{64}$/.test(cookie)) return false
  return timingSafeEqual(Buffer.from(cookie, 'hex'), Buffer.from(orderAccessToken(orderId, key), 'hex'))
}
