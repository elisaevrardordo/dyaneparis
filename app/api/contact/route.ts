import { NextResponse } from 'next/server'
import { Resend } from 'resend'

type ContactPayload = {
    prenom?: unknown
    email?: unknown
    pays?: unknown
    codePostal?: unknown
    ville?: unknown
    sujet?: unknown
    message?: unknown
    locale?: unknown
}

const defaultFrom = 'Dyane Paris Website <website@mail.dyaneparis.com>'
const defaultTo = 'contact@dyaneparis.com'

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
            <td style="padding: 8px 12px; border: 1px solid #e6e2dc; color: #6f6a62; width: 160px;">${label}</td>
            <td style="padding: 8px 12px; border: 1px solid #e6e2dc; color: #111;">${escapeHtml(value || '-')}</td>
        </tr>
    `
}

export async function POST(request: Request) {
    let payload: ContactPayload

    try {
        payload = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const prenom = asString(payload.prenom, 120)
    const email = asString(payload.email, 180).toLowerCase()
    const pays = asString(payload.pays, 120)
    const codePostal = asString(payload.codePostal, 40)
    const ville = asString(payload.ville, 120)
    const sujet = asString(payload.sujet, 160) || 'Demande via le formulaire'
    const message = asString(payload.message, 5000)
    const locale = asString(payload.locale, 8) || 'fr'

    if (!prenom || !email || !pays || !codePostal || !ville || !message) {
        return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isEmail(email)) {
        return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const submittedAt = new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        dateStyle: 'long',
        timeStyle: 'short',
    })

    const text = [
        'Nouveau message depuis le formulaire Dyane Paris',
        '',
        `Nom: ${prenom}`,
        `Email: ${email}`,
        `Pays / Region: ${pays}`,
        `Code postal: ${codePostal}`,
        `Ville: ${ville}`,
        `Sujet: ${sujet}`,
        `Langue de la page: ${locale}`,
        `Envoye le: ${submittedAt}`,
        '',
        'Message:',
        message,
    ].join('\n')

    const html = `
        <div style="font-family: Georgia, serif; background: #f8f5f0; padding: 32px; color: #111;">
            <div style="max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #e6e2dc;">
                <div style="padding: 28px 32px; border-bottom: 1px solid #e6e2dc;">
                    <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a8176;">Dyane Paris</p>
                    <h1 style="margin: 0; font-weight: 400; font-size: 24px;">Nouveau message de contact</h1>
                </div>
                <div style="padding: 28px 32px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
                        ${row('Nom', prenom)}
                        ${row('Email', email)}
                        ${row('Pays / Region', pays)}
                        ${row('Code postal', codePostal)}
                        ${row('Ville', ville)}
                        ${row('Sujet', sujet)}
                        ${row('Langue', locale)}
                        ${row('Envoye le', submittedAt)}
                    </table>
                    <div style="margin-top: 28px;">
                        <p style="margin: 0 0 10px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8176;">Message</p>
                        <div style="white-space: pre-wrap; border: 1px solid #e6e2dc; padding: 18px; font-size: 15px; line-height: 1.7;">${escapeHtml(message)}</div>
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
                subject: `Dyane Paris - ${sujet}`,
                text,
                html,
                tags: [{ name: 'source', value: 'contact_form' }],
            },
            { idempotencyKey: crypto.randomUUID() }
        )

        if (error) {
            console.error('Resend contact email error:', error)
            return NextResponse.json({ error: 'Unable to send email.' }, { status: error.statusCode || 500 })
        }

        return NextResponse.json({ ok: true, id: data?.id })
    } catch (error) {
        console.error('Contact email exception:', error)
        return NextResponse.json({ error: 'Unable to send email.' }, { status: 500 })
    }
}
