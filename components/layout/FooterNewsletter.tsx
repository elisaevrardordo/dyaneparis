'use client'

import Link from 'next/link'
import { useId, useRef, useState, type FormEvent } from 'react'
import { localizedPath } from '@/i18n/paths'
import { newsletterError, newsletterSuccess } from '@/lib/newsletter/messages'
import styles from './SiteFooter.module.css'

export default function FooterNewsletter({ locale }: { locale: 'fr' | 'en' }) {
  const en = locale === 'en'
  const id = useId()
  const busy = useRef(false)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [preview, setPreview] = useState(false)
  const [errorCode, setErrorCode] = useState<string>()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current) return
    busy.current = true
    setStatus('loading')
    setErrorCode(undefined)
    try {
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), website, locale, source: 'footer' }) })
      const result = await response.json()
      if (!response.ok || result?.ok !== true) {
        setErrorCode(typeof result?.code === 'string' ? result.code : undefined)
        throw new Error('Subscription not confirmed')
      }
      setPreview(result.mode === 'preview')
      setStatus('success')
      setEmail('')
    } catch { setStatus('error') }
    finally { busy.current = false }
  }
  return <section className={styles.newsletter} aria-labelledby={`${id}-title`}>
    <h2 className={styles.title} id={`${id}-title`}>{en ? 'Enter the world of Dyane' : "Entrez dans l'univers Dyane"}</h2>
    <p className={styles.description}>{en ? 'Discover the House’s creations, artistic collaborations and exclusive gatherings.' : 'Découvrez les créations, collaborations artistiques et rendez-vous exclusifs de la Maison.'}</p>
    {status === 'success' ? <p className={styles.formStatus} role="status">{newsletterSuccess(locale, preview)}</p> : <form onSubmit={submit} aria-busy={status === 'loading'}>
      <div className={styles.hidden} aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></div>
      <label className={styles.hidden} htmlFor={`${id}-email`}>{en ? 'Email address' : 'Adresse e-mail'}</label>
      <div className={styles.emailRow}><input className={styles.emailInput} id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={180} placeholder={en ? 'Email address' : 'Adresse e-mail'} value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }} disabled={status === 'loading'} /><button className={styles.emailButton} type="submit" disabled={status === 'loading'}>{status === 'loading' ? (en ? 'Please wait…' : 'Un instant…') : (en ? 'Subscribe' : "S'inscrire")}</button></div>
      {status === 'error' && <p className={styles.formError} role="alert">{newsletterError(locale, errorCode)}</p>}
    </form>}
    <p className={styles.privacy}>{en ? 'By subscribing, you agree to receive news from Dyane Paris. ' : 'En vous inscrivant, vous acceptez de recevoir les actualités de Dyane Paris. '}<Link href={localizedPath(locale, '/confidentialite')} scroll={false}>{en ? 'Privacy policy' : 'Politique de confidentialité'}</Link></p>
  </section>
}
