'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import s from './Commerce.module.css'

export default function CommerceDialog({ title, children, onClose, kind = 'notice', closeLabel = 'Fermer' }: {
  title: string; children: ReactNode; onClose: () => void; kind?: 'product' | 'notice' | 'gift' | 'added'; closeLabel?: string
}) {
  const id = useId()
  const ref = useRef<HTMLDialogElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const element = ref.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element?.showModal(); document.body.style.overflow = 'hidden'
    return () => { if (timer.current) clearTimeout(timer.current); element?.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus() }
  }, [])
  function close() {
    if (timer.current) return
    setLeaving(true)
    timer.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180)
  }
  return <dialog ref={ref} className={`${s.dialog} ${s[kind]} ${leaving ? s.leaving : ''}`} aria-labelledby={id}
    onCancel={event => { event.preventDefault(); close() }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled)'))
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && event.target === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && event.target === last) { event.preventDefault(); first?.focus() }
    }}>
    <header className={s.dialogHeader}><h2 id={id}>{title}</h2><button type="button" className={s.close} aria-label={closeLabel} onClick={close}><svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1"><path d="m5 5 14 14M19 5 5 19" /></svg></button></header>
    {children}
  </dialog>
}
