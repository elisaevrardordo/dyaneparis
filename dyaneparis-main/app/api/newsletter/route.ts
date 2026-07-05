import { NextResponse } from 'next/server'
import { Resend } from 'resend'

type NewsletterPayload = {
    email?: unknown
    firstName?: unknown
    locale?: unknown
    source?: unknown
}

const defaultFrom = 'Dyane Paris <website@mail.dyaneparis.com>'

function asString(value: unknown, maxLength: number) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isAlreadyMember(error: { name?: string; message?: string } | null) {
    if (!error) return false
    const haystack = `${error.name || ''} ${error.message || ''}`.toLowerCase()
    return haystack.includes('already') || haystack.includes('exist')
}

const copy = {
    fr: {
        subject: 'Bienvenue chez Dyane Paris',
        heading: 'Merci de rejoindre la Maison.',
        body: 'Vous faites désormais partie des premières personnes informées de nos nouvelles collections, batchs et expériences exclusives.',
        signature: 'Dyane Paris — Maison d’Art Liquide',
    },
    en: {
        subject: 'Welcome to Dyane Paris',
        heading: 'Thank you for joining the Maison.',
        body: 'You are now among the first to hear about our new collections, batches and exclusive experiences.',
        signature: 'Dyane Paris — Liquid Art Maison',
    },
} as const

function welcomeHtml(locale: 'fr' | 'en') {
    const t = copy[locale]
    return `
        <div style="font-family: Georgia, serif; background: #0d0d0d; padding: 48px 24px; color: #f5f0e8;">
            <div style="max-width: 560px; margin: 0 auto; background: #111; border: 1px solid #262626;">
                <div style="padding: 40px 40px 28px; border-bottom: 1px solid #262626; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: #8a8176;">Newsletter</p>
                    <h1 style="margin: 0; font-weight: 400; font-size: 26px; color: #fff;">${t.heading}</h1>
                </div>
                <div style="padding: 32px 40px 40px;">
                    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: rgba(245,240,232,0.8);">${t.body}</p>
                    <p style="margin: 0; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,232,0.45);">${t.signature}</p>
                </div>
            </div>
        </div>
    `
}

export async function POST(request: Request) {
    let payload: NewsletterPayload

    try {
        payload = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const email = asString(payload.email, 180).toLowerCase()
    const firstName = asString(payload.firstName, 120)
    const localeRaw = asString(payload.locale, 8)
    const locale: 'fr' | 'en' = localeRaw === 'en' ? 'en' : 'fr'

    if (!isEmail(email)) {
        return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'Newsletter service is not configured.' }, { status: 500 })
    }

    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID
    if (!segmentId) {
        return NextResponse.json({ error: 'Newsletter segment is not configured.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    try {
        const { error } = await resend.contacts.create({
            email,
            firstName: firstName || undefined,
            unsubscribed: false,
            segments: [{ id: segmentId }],
        })

        if (error && !isAlreadyMember(error)) {
            console.error('Resend newsletter contact error:', error)
            return NextResponse.json({ error: 'Unable to subscribe.' }, { status: 502 })
        }
    } catch (error) {
        console.error('Newsletter subscription exception:', error)
        return NextResponse.json({ error: 'Unable to subscribe.' }, { status: 500 })
    }

    // Welcome email is best-effort: a failure here must not fail the subscription.
    try {
        await resend.emails.send({
            from: process.env.NEWSLETTER_FROM || process.env.CONTACT_FORM_FROM || defaultFrom,
            to: [email],
            subject: copy[locale].subject,
            html: welcomeHtml(locale),
            text: `${copy[locale].heading}\n\n${copy[locale].body}\n\n${copy[locale].signature}`,
            tags: [{ name: 'source', value: 'newsletter' }],
        })
    } catch (error) {
        console.error('Newsletter welcome email exception:', error)
    }

    return NextResponse.json({ ok: true })
}
