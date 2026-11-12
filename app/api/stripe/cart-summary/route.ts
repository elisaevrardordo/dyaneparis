import { NextResponse } from 'next/server'
import { validateCartItems } from '@/lib/stripe/config'
import { cartSummary } from '@/lib/stripe/cart-summary'
import { clientIp, createMemoryRateLimiter, isTrustedSameOrigin } from '@/lib/requestSecurity'

export const runtime = 'nodejs'
const limited = createMemoryRateLimiter(60_000, 40)
export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) return new NextResponse(null, { status: 403 })
  if (limited(clientIp(request))) return new NextResponse(null, { status: 429 })
  try {
    const raw = await request.text()
    if (Buffer.byteLength(raw) > 8192) return new NextResponse(null, { status: 413 })
    const body = JSON.parse(raw)
    if (!body || Object.keys(body).some(k => k !== 'items' && k !== 'flow')
      || (body.flow !== undefined && body.flow !== 'commerce')) return new NextResponse(null, { status: 400 })
    return NextResponse.json(await cartSummary(validateCartItems(body.items), body.flow === 'commerce'), { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: 'Unable to verify cart' }, { status: 400 }) }
}
