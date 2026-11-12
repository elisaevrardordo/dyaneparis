'use client'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createLoadingGate } from './loadingGate'
import s from './Commerce.module.css'

export function useLoadingGate() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'leaving'>('hidden')
  const gate = useMemo(() => createLoadingGate(setPhase), [])
  useEffect(() => () => gate.cancel(), [gate])
  return { phase, ...gate }
}
export default function PremiumLoader({ phase, label, onCancel, cancelLabel = 'Annuler' }: { phase: 'hidden' | 'visible' | 'leaving'; label: string; onCancel?: () => void; cancelLabel?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const active = phase !== 'hidden'
  useEffect(() => {
    if (!active) return
    const element = dialog.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element?.showModal(); document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus() }
  }, [active])
  if (!active) return null
  return <dialog ref={dialog} className={`${s.loader} ${phase === 'leaving' ? s.loaderLeaving : ''}`} aria-label={label} onCancel={event => { event.preventDefault(); onCancel?.() }}><div role="status" aria-live="polite"><Image src="/icon.png" alt="" width={62} height={62} unoptimized className={s.loaderIcon} /><p>{label}</p>{onCancel && <button type="button" onClick={onCancel}>{cancelLabel}</button>}</div></dialog>
}
