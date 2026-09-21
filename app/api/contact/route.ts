import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  clientIp,
  createMemoryRateLimiter,
  isTrustedSameOrigin,
  requestBodyTooLarge,
} from '@/lib/requestSecurity'

type ContactPayload = {
  honorific?: unknown
  firstName?: unknown
  lastName?: unknown
  email?: unknown
  phone?: unknown
  country?: unknown
  subject?: unknown
  message?: unknown
  consent?: unknown
  website?: unknown
  locale?: unknown
  source?: unknown
  submissionId?: unknown
}

const defaultFrom = 'Dyane Paris Website <website@mail.dyaneparis.com>'
const defaultTo = 'contact@dyaneparis.com'
const rateLimitWindow = 10 * 60 * 1000
const rateLimitMaximum = 4
const isRateLimited = createMemoryRateLimiter(rateLimitWindow, rateLimitMaximum)

function asString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 12px;border:1px solid #e6e2dc;color:#6f6a62;width:160px">${label}</td>
      <td style="padding:8px 12px;border:1px solid #e6e2dc;color:#111">${escapeHtml(value || '-')}</td>
    </tr>
  `
}

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden origin.' }, { status: 403 })
  }

  if (requestBodyTooLarge(request, 20_000)) {
    return NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(rateLimitWindow / 1000) } },
    )
  }

  let payload: ContactPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const website = asString(payload.website, 200)
  if (website) return NextResponse.json({ ok: true })

  const honorific = asString(payload.honorific, 20)
  const firstName = asString(payload.firstName, 80)
  const lastName = asString(payload.lastName, 100)
  const email = asString(payload.email, 180).toLowerCase()
  const phone = asString(payload.phone, 60)
  const country = asString(payload.country, 100)
  const subject = asString(payload.subject, 160)
  const message = asString(payload.message, 5000)
  const consent = payload.consent === true
  const locale = asString(payload.locale, 8) === 'en' ? 'en' : 'fr'
  const source = asString(payload.source, 120) || `/${locale}/contact`
  const submissionId = asString(payload.submissionId, 80)

  if (!firstName || !lastName || !email || !country || !subject || !message || !consent) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 })
  }

  const resend = new Resend(apiKey)
  const submittedAt = new Date().toLocaleString(locale === 'en' ? 'en-GB' : 'fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'long',
    timeStyle: 'short',
  })
  const fullName = `${firstName} ${lastName}`

  const text = [
    'Nouveau message depuis le formulaire Dyane Paris',
    '',
    `Civilite: ${honorific || '-'}`,
    `Prenom: ${firstName}`,
    `Nom: ${lastName}`,
    `Email: ${email}`,
    `Telephone: ${phone || '-'}`,
    `Pays / Region: ${country}`,
    `Sujet: ${subject}`,
    `Langue de la page: ${locale}`,
    `Origine: ${source}`,
    `Envoye le: ${submittedAt}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const html = `
    <div style="font-family:Georgia,serif;background:#f7f7f5;padding:32px;color:#111">
      <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #e6e2dc">
        <div style="padding:28px 32px;border-bottom:1px solid #e6e2dc">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#8a8176">Dyane Paris</p>
          <h1 style="margin:0;font-weight:400;font-size:24px">Nouveau message de contact</h1>
        </div>
        <div style="padding:28px 32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">
            ${row('Civilite', honorific)}
            ${row('Nom', fullName)}
            ${row('Email', email)}
            ${row('Telephone', phone)}
            ${row('Pays / Region', country)}
            ${row('Sujet', subject)}
            ${row('Langue', locale)}
            ${row('Origine', source)}
            ${row('Envoye le', submittedAt)}
          </table>
          <div style="margin-top:28px">
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a8176">Message</p>
            <div style="white-space:pre-wrap;border:1px solid #e6e2dc;padding:18px;font-size:15px;line-height:1.7">${escapeHtml(message)}</div>
          </div>
        </div>
      </div>
    </div>
  `

  try {
    const { data, error } = await resend.emails.send(
      {
        from: process.env.CONTACT_FORM_FROM || defaultFrom,
        to: [process.env.CONTACT_FORM_TO || defaultTo],
        replyTo: email,
        subject: `Dyane Paris - ${subject}`,
        text,
        html,
        tags: [{ name: 'source', value: 'contact_form' }],
      },
      submissionId ? { idempotencyKey: `contact/${submissionId}` } : undefined,
    )

    if (error) {
      console.error('Resend contact email error')
      return NextResponse.json({ error: 'Unable to send email.' }, { status: error.statusCode || 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch {
    console.error('Contact email exception')
    return NextResponse.json({ error: 'Unable to send email.' }, { status: 500 })
  }
}
