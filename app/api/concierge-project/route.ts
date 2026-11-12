import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { clientIp, createMemoryRateLimiter, isTrustedSameOrigin, requestBodyTooLarge } from '@/lib/requestSecurity'
import { projectSummary, validateProject } from '@/lib/personalization/project'

export const runtime = 'nodejs'
const windowMs = 10 * 60 * 1000
const limited = createMemoryRateLimiter(windowMs, 4)
const maximumBytes = 20_000
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  if (!request.headers.get('origin') || !isTrustedSameOrigin(request)) return NextResponse.json({ error: 'Forbidden origin.' }, { status: 403 })
  if (requestBodyTooLarge(request, maximumBytes)) return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  if (limited(clientIp(request))) return NextResponse.json({ error: 'Too many requests.' }, { status: 429, headers: { 'Retry-After': String(windowMs / 1000) } })
  let value: Record<string, unknown>
  try {
    const raw = await request.text()
    if (Buffer.byteLength(raw, 'utf8') > maximumBytes) return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid payload')
    value = parsed as Record<string, unknown>
  } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  if (Object.keys(value).some(key => !['project', 'locale', 'submissionId', 'website', 'source'].includes(key))
    || !['fr', 'en'].includes(String(value.locale)) || typeof value.submissionId !== 'string' || !uuid.test(value.submissionId)
    || typeof value.website !== 'string' || value.website !== '') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  if (value.source !== undefined && !['bespoke', 'christmas'].includes(String(value.source))) return NextResponse.json({ error: 'Invalid source.' }, { status: 400 })
  const bespoke = value.source === 'bespoke'
  const project = validateProject(value.project, { bespoke })
  if (!project) return NextResponse.json({ error: 'Invalid project.' }, { status: 400 })
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: 'Email service unavailable.' }, { status: 503 })
  const locale = value.locale === 'en' ? 'en' : 'fr'
  const title = bespoke ? 'Votre œuvre sur commande' : 'Votre cadeau de Noël rêvé'
  const rows = projectSummary(project, locale)
  const text = [`Dyane Paris - ${title}`, '', ...rows.map(([label, content]) => `${label}: ${content || '-'}`),
    '', 'Demande de projet uniquement. Aucun achat, prix fixe ou délai de réalisation confirmé.', 'Consentement au traitement de la demande : oui.'].join('\n')
  const html = `<div style="font-family:Georgia,serif;color:#111;max-width:720px;margin:auto;padding:32px"><p style="font-size:11px;letter-spacing:.2em">DYANE PARIS</p><h1 style="font-size:24px;font-weight:400">${title}</h1><p>Demande de projet uniquement, sous réserve d’étude et de faisabilité.</p><table style="width:100%;border-collapse:collapse">${rows.map(([label, content]) => `<tr><th style="font-weight:400;text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #eee">${escapeHtml(label)}</th><td style="padding:12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(content || '-')}</td></tr>`).join('')}</table><p>Consentement au traitement de la demande : oui.</p></div>`
  try {
    const resend = new Resend(key)
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FORM_FROM || 'Dyane Paris Website <website@mail.dyaneparis.com>',
      to: ['conciergerie@dyaneparis.com'], replyTo: project.email,
      subject: bespoke ? 'Dyane Paris - Projet d’œuvre sur commande' : 'Dyane Paris - Projet de cadeau de Noël sur mesure', text, html,
      tags: [{ name: 'source', value: bespoke ? 'bespoke_project' : 'christmas_bespoke_project' }],
    }, { idempotencyKey: `concierge-project/${value.submissionId}` })
    if (error || !data?.id) return NextResponse.json({ error: 'Unable to send project.' }, { status: 502 })
    return NextResponse.json({ ok: true, id: data.id }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Unable to send project.' }, { status: 502 })
  }
}
