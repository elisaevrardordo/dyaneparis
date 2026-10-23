import { NextResponse } from 'next/server'
import { clientIp, createMemoryRateLimiter, isTrustedSameOrigin, requestBodyTooLarge } from '@/lib/requestSecurity'

export const runtime = 'nodejs'

const isRateLimited = createMemoryRateLimiter(60_000, 10)
const catalog: Record<string, { label: string; amount: number }> = {
  'dyane-1-25cl': { label: 'DYANE No.1 — Rouge — 25 cl', amount: 5500 },
  'dyane-1-15l': { label: 'DYANE No.1 — Rouge — 1,5 L', amount: 18500 },
  'dyane-2-25cl': { label: 'DYANE No.2 — Vert — 25 cl', amount: 5500 },
  'dyane-2-15l': { label: 'DYANE No.2 — Vert — 1,5 L', amount: 18500 },
}

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 })
  if (requestBodyTooLarge(request, 4000)) return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  if (isRateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })

  const key = process.env.STRIPE_SECRET_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const shippingRate = process.env.STRIPE_SHIPPING_RATE_ID
  if (!key || !siteUrl || !shippingRate) {
    return NextResponse.json({ error: 'Paiement en cours de configuration' }, { status: 503 })
  }

  let body: { productId?: unknown; quantity?: unknown; locale?: unknown }
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const id = typeof body.productId === 'string' ? body.productId : ''
  const product = catalog[id]
  const quantity = body.quantity
  if (!product || !Number.isInteger(quantity) || typeof quantity !== 'number' || quantity < 1 || quantity > 6) {
    return NextResponse.json({ error: 'Invalid product or quantity' }, { status: 400 })
  }

  const locale = body.locale === 'en' ? 'en' : 'fr'
  const origin = new URL(siteUrl).origin
  const params = new URLSearchParams({
    mode: 'payment',
    locale,
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(product.amount),
    'line_items[0][price_data][product_data][name]': product.label,
    'line_items[0][quantity]': String(quantity),
    'shipping_address_collection[allowed_countries][0]': 'FR',
    'shipping_options[0][shipping_rate]': shippingRate,
    'billing_address_collection': 'required',
    'phone_number_collection[enabled]': 'true',
    'success_url': `${origin}/${locale}/boutique-noel?success=1&session_id={CHECKOUT_SESSION_ID}`,
    'cancel_url': `${origin}/${locale}/boutique-noel?canceled=1`,
    'metadata[product_id]': id,
    'metadata[quantity]': String(quantity),
  })

  let response: Response
  try {
    response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Payment provider unavailable' }, { status: 502 })
  }

  const result = await response.json()
  if (!response.ok || typeof result.url !== 'string') {
    console.error('Stripe Checkout session error', { status: response.status, code: result.error?.code })
    return NextResponse.json({ error: 'Impossible de créer le paiement' }, { status: 502 })
  }

  return NextResponse.json({ url: result.url })
}
