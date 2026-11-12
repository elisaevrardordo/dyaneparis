import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyNewsletterUnsubscribeToken } from '@/lib/newsletter/unsubscribeLink'

const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
}

function unsubscribePage(locale: 'fr' | 'en', message: string, status: number, confirm = false) {
    const title = locale === 'en' ? 'Dyane Paris newsletter' : 'Newsletter Dyane Paris'
    const button = locale === 'en' ? 'Unsubscribe' : 'Se désinscrire'

    return new NextResponse(`<!doctype html><html lang="${locale}"><head>
        <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${title}</title></head>
        <body style="margin:0;color:#111;background:#fff;text-align:center;">
            <main style="max-width:520px;margin:60px auto;padding:0 24px;">
                <h1 style="font:30px Georgia,serif;">${title}</h1>
                <p style="font:16px/1.6 Arial,sans-serif;">${message}</p>
                ${confirm ? `<form method="post"><button style="padding:13px 22px;border:1px solid #111;background:#fff;color:#111;">${button}</button></form>` : ''}
            </main>
        </body></html>`, { status, headers })
}

function unsubscribeRequest(request: Request) {
    const params = new URL(request.url).searchParams
    const locale = params.get('locale') === 'en' ? 'en' : 'fr'
    const en = locale === 'en'
    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID
    const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET
    const token = params.get('token') || ''
    const contactId = segmentId && secret && secret.length >= 32
        ? verifyNewsletterUnsubscribeToken(token, segmentId, locale, secret)
        : null

    return { locale, en, segmentId, contactId } as const
}

export function GET(request: Request) {
    const { locale, en, contactId } = unsubscribeRequest(request)
    return contactId
        ? unsubscribePage(locale, en ? 'Would you like to stop receiving the Dyane Paris newsletter?' : 'Souhaitez-vous ne plus recevoir la newsletter Dyane Paris ?', 200, true)
        : unsubscribePage(locale, en ? 'This unsubscribe link is invalid.' : 'Ce lien de désinscription est invalide.', 400)
}

export async function POST(request: Request) {
    const { locale, en, segmentId, contactId } = unsubscribeRequest(request)
    if (!contactId || !segmentId) {
        return unsubscribePage(locale, en ? 'This unsubscribe link is invalid.' : 'Ce lien de désinscription est invalide.', 400)
    }

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && process.env.NEWSLETTER_MODE !== 'preview') {
        try {
            const resend = new Resend(apiKey)
            const { data, error } = await resend.contacts.segments.remove({ contactId, segmentId })
            if (data?.deleted || error?.statusCode === 404 || error?.name === 'not_found') {
                return unsubscribePage(locale, en ? 'You are unsubscribed from the Dyane Paris newsletter.' : 'Vous êtes désinscrit de la newsletter Dyane Paris.', 200)
            }
        } catch {
            console.error('Newsletter unsubscribe request failed')
        }
    }

    return unsubscribePage(locale, en ? 'We could not unsubscribe you. Please try again later.' : 'La désinscription a échoué. Veuillez réessayer plus tard.', 503)
}
