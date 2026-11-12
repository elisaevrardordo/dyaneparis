import { NextResponse } from 'next/server'
import { clientIp, createMemoryRateLimiter } from '@/lib/requestSecurity'
import { checkoutConfig, checkoutPayload, CheckoutError } from '@/lib/stripe/config'
import { createCheckout, createCommerceCheckout } from '@/lib/stripe/checkout'
import { canAccessOrder, orderAccessToken, orderCookieName } from '@/lib/stripe/order-access'

export const runtime = 'nodejs'
const limited = createMemoryRateLimiter(60_000, 10)

export async function POST(request: Request) {
  try {
    const config = checkoutConfig()
    if (request.headers.get('origin') !== config.origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (limited(clientIp(request))) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const raw = await request.text()
    if (Buffer.byteLength(raw) > 8192) return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    let value: unknown
    try { value = JSON.parse(raw) } catch { throw new CheckoutError('Invalid request', 400) }
    const input = checkoutPayload(value)
    if ('flow' in input && input.flow === 'commerce') {
      const result = await createCommerceCheckout(input, canAccessOrder(request, input.attemptId, config.key))
      const response = NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
      response.cookies.set(orderCookieName(input.attemptId), orderAccessToken(input.attemptId, config.key), {
        httpOnly: true, secure: config.origin.startsWith('https:'), sameSite: 'lax', path: '/api/stripe', maxAge: 2 * 24 * 60 * 60,
      })
      return response
    }
    return NextResponse.json({ url: await createCheckout(input) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const status = error instanceof CheckoutError ? error.status : 503
    // Do not leak API errors, key values, database URLs, or customer information.
    return NextResponse.json({ error: status === 400 ? 'Invalid request' : 'Checkout unavailable' }, { status })
  }
}
