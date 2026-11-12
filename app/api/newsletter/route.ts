import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { savePreviewSubscription } from '@/lib/newsletter/previewStore'
import { newsletterWelcomeEmail } from '@/lib/newsletter/welcomeEmail'
import { subscribeToNewsletter } from '@/lib/newsletter/subscription'
import { newsletterUnsubscribeUrl } from '@/lib/newsletter/unsubscribeLink'
import {
    clientIp,
    createMemoryRateLimiter,
    isTrustedSameOrigin,
    requestBodyTooLarge,
} from '@/lib/requestSecurity'

type NewsletterPayload = {
    email?: unknown
    firstName?: unknown
    locale?: unknown
    source?: unknown
    website?: unknown
}

const defaultFrom = 'Dyane Paris <website@mail.dyaneparis.com>'
const isRateLimited = createMemoryRateLimiter(60 * 60 * 1000, 6)

function asString(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\u0000-\u001f\u007f]/.test(value)
}

function response(payload: Record<string, unknown>, status = 200, headers = {}) {
    return NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export async function POST(request: Request) {
    if (!isTrustedSameOrigin(request)) {
        return response({ error: 'Forbidden origin.' }, 403)
    }

    if (requestBodyTooLarge(request, 4_000)) {
        return response({ error: 'Request body too large.' }, 413)
    }

    if (isRateLimited(clientIp(request))) {
        return response({ error: 'Too many requests.', code: 'rate_limited' }, 429, { 'Retry-After': '3600' })
    }

    let payload: NewsletterPayload

    try {
        const body = await request.text()
        if (Buffer.byteLength(body, 'utf8') > 4_000) return response({ error: 'Request body too large.' }, 413)
        payload = JSON.parse(body)
    } catch {
        return response({ error: 'Invalid request body.' }, 400)
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)
        || Object.keys(payload).some(key => !['email', 'firstName', 'locale', 'source', 'website'].includes(key))) {
        return response({ error: 'Invalid request body.' }, 400)
    }
    if (asString(payload.website, 200)) return response({ ok: true })

    if (typeof payload.email !== 'string' || payload.email.trim().length > 180
        || (payload.firstName !== undefined && (typeof payload.firstName !== 'string' || payload.firstName.length > 120))
        || (payload.locale !== undefined && (typeof payload.locale !== 'string' || !['fr', 'en'].includes(payload.locale)))
        || (payload.source !== undefined && (typeof payload.source !== 'string' || !['footer', 'newsletter_section'].includes(payload.source)))) {
        return response({ error: 'Invalid subscription.' }, 400)
    }

    const email = asString(payload.email, 180).toLowerCase()
    const firstName = asString(payload.firstName, 120)
    const localeRaw = asString(payload.locale, 8)
    const locale: 'fr' | 'en' = localeRaw === 'en' ? 'en' : 'fr'
    const source = asString(payload.source, 40) || 'footer'

    if (!isEmail(email)) {
        return response({ error: 'Invalid email address.' }, 400)
    }

    // Explicit loopback-only persistence: never invoke Resend in the local preview.
    if (process.env.NEWSLETTER_MODE === 'preview') {
        try {
            await savePreviewSubscription(request, { email, locale, source })
            return response({ ok: true, mode: 'preview' })
        } catch {
            console.error('Local newsletter storage unavailable')
            return response({ error: 'Newsletter preview unavailable.', code: 'unavailable' }, 503)
        }
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        return response({ error: 'Newsletter service is not configured.', code: 'unavailable' }, 503)
    }

    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID
    const unsubscribeSecret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET
    if (!segmentId || !unsubscribeSecret || unsubscribeSecret.length < 32) {
        return response({ error: 'Newsletter service is not configured.', code: 'unavailable' }, 503)
    }

    const resend = new Resend(apiKey)

    try {
        const subscription = await subscribeToNewsletter(resend, { email, firstName, segmentId })
        if (subscription.status === 'opted-out') {
            return response({ error: 'Newsletter preferences must be updated before subscribing.', code: 'unavailable' }, 409)
        }
        if (subscription.status === 'subscribed') {
            const unsubscribeUrl = newsletterUnsubscribeUrl(subscription.contactId, segmentId, locale, unsubscribeSecret)

            // Keep confirmed subscriptions valid when the delivery provider is unavailable.
            try {
                const { data, error } = await resend.emails.send({
                    from: process.env.NEWSLETTER_FROM || process.env.CONTACT_FORM_FROM || defaultFrom,
                    to: [email],
                    ...newsletterWelcomeEmail(locale, { firstName: subscription.firstName, unsubscribeUrl }),
                    headers: {
                        'List-Unsubscribe': `<${unsubscribeUrl}>`,
                        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                    },
                    tags: [{ name: 'source', value: 'newsletter' }],
                }, { idempotencyKey: `newsletter-welcome/${segmentId}/${subscription.contactId}` })
                if (error || !data?.id) console.error('Newsletter welcome email not accepted', error?.name)
            } catch {
                console.error('Newsletter welcome email unavailable')
            }
        }
    } catch {
        console.error('Newsletter subscription unavailable')
        return response({ error: 'Unable to subscribe.', code: 'unavailable' }, 502)
    }

    return response({ ok: true, mode: 'resend' })
}
