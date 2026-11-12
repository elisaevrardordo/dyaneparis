import { createHmac, timingSafeEqual } from 'node:crypto'
import { newsletterSiteOrigin } from './welcomeEmail'

const contactIdPattern = /^[A-Za-z0-9-]{1,100}$/
const signaturePattern = /^[A-Za-z0-9_-]{43}$/

function sign(contactId: string, segmentId: string, locale: 'fr' | 'en', secret: string) {
    return createHmac('sha256', secret)
        .update(`dyane-newsletter-unsubscribe-v1\n${segmentId}\n${locale}\n${contactId}`)
        .digest('base64url')
}

export function newsletterUnsubscribeUrl(contactId: string, segmentId: string, locale: 'fr' | 'en', secret: string) {
    if (!contactIdPattern.test(contactId)) throw new Error('Invalid newsletter contact ID')
    const url = new URL('/api/newsletter/unsubscribe', newsletterSiteOrigin)
    url.searchParams.set('locale', locale)
    url.searchParams.set('token', `${contactId}.${sign(contactId, segmentId, locale, secret)}`)
    return url.toString()
}

export function verifyNewsletterUnsubscribeToken(token: string, segmentId: string, locale: 'fr' | 'en', secret: string) {
    const [contactId, signature, extra] = token.split('.')
    if (extra !== undefined || !contactIdPattern.test(contactId) || !signature || !signaturePattern.test(signature)) return null
    const expected = sign(contactId, segmentId, locale, secret)
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? contactId : null
}
