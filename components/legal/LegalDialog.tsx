'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import BrandWordmark from '@/components/BrandWordmark'
import { cartFontVariables } from '@/components/cart/fonts'
import { localizedPath } from '@/i18n/paths'
import styles from './Legal.module.css'

export default function LegalDialog({ children, locale, intercepted = false }: {
  children: ReactNode; locale: string; intercepted?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const label = useId()
  const closeLabel = locale === 'en' ? 'Close legal information' : 'Fermer les informations légales'

  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.body.style.overflow = overflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  function close() {
    if (intercepted) router.back()
    else router.replace(localizedPath(locale === 'en' ? 'en' : 'fr'))
  }

  return <dialog ref={dialog} aria-labelledby={label} className={`${styles.dialog} ${cartFontVariables}`}
    onCancel={event => { event.preventDefault(); close() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
    }}>
    <header className={styles.header}>
      <div className={styles.wordmark}><BrandWordmark /></div>
      <span id={label} className={styles.srOnly}>{locale === 'en' ? 'Legal information - Dyane Paris' : 'Informations légales - Dyane Paris'}</span>
      <button type="button" className={styles.close} aria-label={closeLabel} onClick={close} autoFocus>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={locale === 'en' ? 'Legal document' : 'Document juridique'}>{children}</div>
  </dialog>
}
