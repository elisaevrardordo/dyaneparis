'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import styles from './Contact.module.css'

type ContactFormProps = {
  locale: string
}

type ContactValues = {
  honorific: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  subject: string
  message: string
  consent: boolean
  website: string
}

type FieldName = keyof Omit<ContactValues, 'website'>
type FormErrors = Partial<Record<FieldName | 'form', string>>

const initialValues: ContactValues = {
  honorific: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations('contact')
  const [values, setValues] = useState<ContactValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const submissionId = useRef<string | null>(null)
  const countries = t.raw('countries') as Array<{ label: string; value: string }>
  const subjects = t.raw('subjects') as Array<{ label: string; value: string }>

  const updateValue = (field: Exclude<keyof ContactValues, 'consent' | 'website'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'error') setStatus('idle')
  }

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!values.firstName.trim()) nextErrors.firstName = t('errors.required')
    if (!values.lastName.trim()) nextErrors.lastName = t('errors.required')
    if (!values.email.trim()) nextErrors.email = t('errors.required')
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = t('errors.email')
    if (!values.country) nextErrors.country = t('errors.required')
    if (!values.subject) nextErrors.subject = t('errors.required')
    if (!values.message.trim()) nextErrors.message = t('errors.required')
    if (!values.consent) nextErrors.consent = t('errors.consent')
    return nextErrors
  }

  const focusFirstInvalidField = (nextErrors: FormErrors) => {
    const order: FieldName[] = ['firstName', 'lastName', 'email', 'country', 'subject', 'message', 'consent']
    const firstInvalid = order.find((field) => nextErrors[field])
    if (!firstInvalid) return
    window.requestAnimationFrame(() => document.getElementById(`contact-${firstInvalid}`)?.focus())
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalidField(nextErrors)
      return
    }

    setStatus('sending')
    submissionId.current ??= crypto.randomUUID()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          source: localizedPath(locale, '/contact'),
          submissionId: submissionId.current,
        }),
      })

      if (!response.ok) throw new Error('send_failed')
      setStatus('success')
      setErrors({})
      setValues(initialValues)
    } catch {
      setStatus('error')
      setErrors((current) => ({ ...current, form: t('errors.send') }))
    }
  }

  if (status === 'success') {
    return (
      <section className={styles.success} aria-live="polite" aria-labelledby="contact-success-title">
        <p className={styles.successEyebrow}>{t('successEyebrow')}</p>
        <h2 id="contact-success-title" className={styles.successTitle}>{t('successTitle')}</h2>
        <p className={styles.successCopy}>{t('merci')}</p>
      </section>
    )
  }

  const textField = (
    field: 'firstName' | 'lastName' | 'email' | 'phone',
    options: { autoComplete: string; inputMode?: 'email' | 'tel'; type?: 'email' | 'tel' | 'text' },
  ) => {
    const errorId = `${field}-error`
    return (
      <div className={styles.fieldGroup}>
        <div className={styles.field} data-filled={values[field].length > 0}>
          <input
            id={`contact-${field}`}
            className={styles.control}
            type={options.type ?? 'text'}
            inputMode={options.inputMode}
            autoComplete={options.autoComplete}
            value={values[field]}
            onChange={updateValue(field)}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={errors[field] ? errorId : undefined}
          />
          <label className={styles.floatingLabel} htmlFor={`contact-${field}`}>{t(`fields.${field}`)}</label>
        </div>
        <p id={errorId} className={styles.fieldError}>{errors[field] ?? ''}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formMeta}>
        <fieldset className={styles.honorifics}>
          <legend>{t('fields.honorific')}</legend>
          {(['mr', 'mrs', 'mx'] as const).map((option) => (
            <label className={styles.radioLabel} key={option}>
              <input
                type="radio"
                name="honorific"
                value={option}
                checked={values.honorific === option}
                onChange={updateValue('honorific')}
              />
              <span>{t(`honorifics.${option}`)}</span>
            </label>
          ))}
        </fieldset>
        <p>{t('requiredNote')}</p>
      </div>

      <div className={styles.twoColumns}>
        {textField('firstName', { autoComplete: 'given-name' })}
        {textField('lastName', { autoComplete: 'family-name' })}
      </div>

      <div className={styles.twoColumns}>
        {textField('email', { autoComplete: 'email', inputMode: 'email', type: 'email' })}
        {textField('phone', { autoComplete: 'tel', inputMode: 'tel', type: 'tel' })}
      </div>

      <div className={styles.fieldGroup}>
        <div className={`${styles.field} ${styles.selectField}`} data-filled={values.country.length > 0}>
          <label className={styles.selectLabel} htmlFor="contact-country">{t('fields.country')}</label>
          <select
            id="contact-country"
            className={styles.control}
            autoComplete="country-name"
            value={values.country}
            onChange={updateValue('country')}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'country-error' : undefined}
          >
            <option value="" disabled>{t('fields.select')}</option>
            {countries.map((country) => <option value={country.value} key={country.value}>{country.label}</option>)}
          </select>
        </div>
        <p id="country-error" className={styles.fieldError}>{errors.country ?? ''}</p>
      </div>

      <div className={styles.fieldGroup}>
        <div className={`${styles.field} ${styles.selectField}`} data-filled={values.subject.length > 0}>
          <label className={styles.selectLabel} htmlFor="contact-subject">{t('fields.subject')}</label>
          <select
            id="contact-subject"
            className={styles.control}
            value={values.subject}
            onChange={updateValue('subject')}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          >
            <option value="" disabled>{t('fields.select')}</option>
            {subjects.map((subject) => <option value={subject.value} key={subject.value}>{subject.label}</option>)}
          </select>
        </div>
        <p id="subject-error" className={styles.fieldError}>{errors.subject ?? ''}</p>
      </div>

      <div className={styles.fieldGroup}>
        <div className={`${styles.field} ${styles.messageField}`} data-filled={values.message.length > 0}>
          <textarea
            id="contact-message"
            className={styles.control}
            rows={6}
            value={values.message}
            onChange={updateValue('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          <label className={styles.floatingLabel} htmlFor="contact-message">{t('fields.message')}</label>
        </div>
        <p id="message-error" className={styles.fieldError}>{errors.message ?? ''}</p>
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setValues((current) => ({ ...current, website: event.target.value }))}
        />
      </div>

      <p className={styles.privacyCopy}>
        {t('privacyBefore')}{' '}
        <Link href={localizedPath(locale, '/confidentialite')}>{t('privacyLink')}</Link>
        {t('privacyAfter')}
      </p>

      <div className={styles.consentGroup}>
        <label className={styles.consentLabel}>
          <input
            id="contact-consent"
            className={styles.checkbox}
            type="checkbox"
            checked={values.consent}
            onChange={(event) => {
              setValues((current) => ({ ...current, consent: event.target.checked }))
              if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }))
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            {t('consentBefore')}{' '}
            <Link href={localizedPath(locale, '/confidentialite')}>{t('privacyLink')}</Link>
            {t('consentAfter')}
          </span>
        </label>
        <p id="consent-error" className={styles.fieldError}>{errors.consent ?? ''}</p>
      </div>

      <div className={styles.submitArea} aria-live="polite">
        <p className={styles.formError} role={errors.form ? 'alert' : undefined}>{errors.form ?? ''}</p>
        <button className={styles.submit} type="submit" disabled={status === 'sending'}>
          <span>{status === 'sending' ? t('sending') : t('envoyer')}</span>
        </button>
      </div>
    </form>
  )
}
