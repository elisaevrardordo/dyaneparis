'use client'
import { useRef, useState } from 'react'
import { emptyProject, type ConciergeProject } from '@/lib/personalization/project'
import s from './BespokeEnquiry.module.css'

export default function BespokeEnquiry({ locale, initialMessage = '', className = '' }: {
  locale: 'fr' | 'en'; initialMessage?: string; className?: string
}) {
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const values = new FormData(form)
    const project = { ...emptyProject(), sculpture: 'to-discuss', firstName: String(values.get('firstName') || ''), lastName: String(values.get('lastName') || ''), email: String(values.get('email') || ''), desiredDate: String(values.get('desiredDate') || ''), budget: String(values.get('budget') || '') as ConciergeProject['budget'], message: `${values.get('kind')}\n${values.get('message')}`, consent: values.get('consent') === 'on' }
    const fingerprint = JSON.stringify({ project, locale })
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() }
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/concierge-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project, locale, source: 'bespoke', submissionId: attempt.current.id, website: String(values.get('website') || '') }) })
      const result = await response.json()
      if (!response.ok || result.ok !== true || !result.id) throw Error('unavailable')
      setSent(true)
    } catch { setError(t('Votre demande n’a pas pu être transmise. Votre texte est conservé ici. Écrivez à conciergerie@dyaneparis.com ou réessayez plus tard.', 'Your enquiry could not be sent. Your text is kept here. Email conciergerie@dyaneparis.com or try again later.')) }
    finally { setBusy(false) }
  }
  return <section className={`${s.section} ${className}`} aria-labelledby="bespoke-enquiry-title"><h2 id="bespoke-enquiry-title">{t('CONFIEZ-NOUS VOTRE PROJET', 'TELL US ABOUT YOUR PROJECT')}</h2><p>{t('Créations et peintures sur commande, compositions de mixologie, cadeaux privés ou d’entreprise, éditions spéciales et collaborations artistiques. Chaque projet fait l’objet d’une étude de faisabilité et d’un devis.', 'Commissioned works and paintings, mixology compositions, private or corporate gifts, special editions and artistic collaborations. Each project is subject to a feasibility study and quotation.')}</p>{sent ? <p role="status">{t('Votre demande a été transmise à la Conciergerie.', 'Your enquiry has been sent to the Concierge.')}</p> : <form onSubmit={submit} aria-busy={busy}>
    <label>{t('Prénom', 'First name')}<input name="firstName" required maxLength={80} autoComplete="given-name" /></label><label>{t('Nom', 'Last name')}<input name="lastName" required maxLength={100} autoComplete="family-name" /></label><label className={s.wide}>E-mail<input type="email" name="email" required maxLength={180} autoComplete="email" /></label>
    <label>{t('Type de projet', 'Project type')}<select name="kind" required defaultValue={initialMessage ? (en ? 'Private creation' : 'Création privée') : ''}><option value="">{t('Choisir', 'Choose')}</option>{(en ? ['Private creation','Corporate gift','Hand-painted work','Mixology composition','Special edition or collaboration'] : ['Création privée','Cadeau d’entreprise','Peinture personnalisée','Composition de mixologie','Édition spéciale ou collaboration']).map(value => <option key={value}>{value}</option>)}</select></label>
    <label>{t('Date souhaitée (à confirmer)', 'Preferred date (to confirm)')}<input type="date" name="desiredDate" /></label>
    <label className={s.wide}>{t('Budget indicatif (facultatif)', 'Indicative budget (optional)')}<select name="budget"><option value="">{t('Choisir', 'Choose')}</option><option value="under-500">{t('Moins de 500 €', 'Under €500')}</option><option value="500-1000">500 € - 1 000 €</option><option value="1000-2500">1 000 € - 2 500 €</option><option value="2500-5000">2 500 € - 5 000 €</option><option value="5000-10000">5 000 € - 10 000 €</option></select></label>
    <label className={s.wide}>{t('Votre message', 'Your message')}<textarea name="message" defaultValue={initialMessage} required maxLength={1800} rows={5} /></label><label className={s.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className={`${s.wide} ${s.consent}`}><input type="checkbox" name="consent" required />{t('J’accepte que mes informations soient utilisées pour traiter cette demande.', 'I agree to my information being used to process this enquiry.')}</label>
    {error && <p className={s.wide} role="alert">{error}</p>}<button type="submit" className={s.wide} disabled={busy}>{busy ? t('Transmission…', 'Sending…') : t('TRANSMETTRE À LA CONCIERGERIE', 'SEND TO THE CONCIERGE')}</button>
    <p className={s.wide}><a href="mailto:conciergerie@dyaneparis.com">conciergerie@dyaneparis.com</a></p>
  </form>}</section>
}
