'use client'
import { formatPrice } from '@/lib/formatPrice'

import EditorialImage from '@/components/editorial/EditorialImage'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { cartProducts, normalizeInitials, type Personalization } from '@/components/cart/catalog'
import { cartFontVariables } from '@/components/cart/fonts'
import { useCart } from '@/components/commerce/CartProvider'
import { personalizableWorks, finishLabel, personalizationNotice, type PersonalizableWork } from '@/lib/personalization/catalog'
import BespokeEnquiry from './BespokeEnquiry'
import { localizedPath } from '@/i18n/paths'
import { preorderTerms } from '@/lib/orders/fulfillment'
import s from './Personalization.module.css'

export type PersonalizableProduct = PersonalizableWork

export function SculpturePreview({ product, initials = '', finish = 'gold', example = true, locale = 'fr', priority = false }: {
  product: PersonalizableProduct; initials?: string; finish?: Personalization['finish']; example?: boolean; locale?: string; priority?: boolean
}) {
  const preview = product.personalization.preview
  const finishImage = example ? product.finishImages?.[finish] : undefined
  const en = locale === 'en'
  const alt = finishImage
    ? `${en ? 'Engraving example' : 'Exemple de gravure'} · ${finishLabel(finish, locale)} · ${product.name}`
    : `${en ? 'Dyane Paris sculpture' : 'Sculpture Dyane Paris'}, ${product.format}`
  const style = { '--initials-x': `${preview.x}%`, '--initials-y': `${preview.y}%`, '--initials-scale': preview.scale,
    '--initials-rotate': `${preview.rotate}deg`, '--initials-skew': `${preview.skew}deg` } as CSSProperties
  return <div className={s.preview} data-finish-preview={Boolean(finishImage)}>
    <div className={s.photoFrame}>
      <div className={finishImage ? s.finishPortrait : s.portrait} style={style}>
        <EditorialImage
          src={finishImage || preview.image}
          alt={alt}
          fill
          sizes={finishImage ? '(max-width: 760px) calc(100vw - 44px), (max-width: 1050px) calc(55vw - 56px), 38vw' : '(max-width: 760px) 75vw, 32vw'}
          priority={priority}
          className={s.sculpture}
        />
        {initials && !finishImage && <span className={s.initials} data-finish={finish} role="img" aria-label={locale === 'en' ? `Initials ${initials}` : `Initiales ${initials}`}>{initials}</span>}
      </div>
    </div>
  </div>
}

export default function PersonalizationDrawer({ product, locale, open, onClose, showPreorderTerms, conciergeOnly }: {
  product: PersonalizableProduct; locale: 'fr' | 'en'; open: boolean; onClose: () => void; showPreorderTerms: boolean; conciergeOnly: boolean
}) {
  const cart = useCart()
  const trigger = useRef<HTMLElement | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const initialsInput = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [initials, setInitials] = useState('')
  const [finish, setFinish] = useState<Personalization['finish']>(product.personalization.finishes[0])
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [enquiry, setEnquiry] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const en = locale === 'en'
  const purchasable = !conciergeOnly && cartProducts.some(item => item.sku === product.sku)
  const money = formatPrice((product.amount || 0) + product.personalization.surcharge, locale)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`dyane-personalization-${product.sku}`) || 'null')
      if (saved && typeof saved.initials === 'string') setInitials(normalizeInitials(saved.initials))
      if (saved && product.personalization.finishes.includes(saved.finish)) setFinish(saved.finish)
    } catch { /* Storage may be unavailable. */ }
    setDraftLoaded(true)
  }, [product.sku, product.personalization.finishes])
  useEffect(() => {
    if (!draftLoaded) return
    try { localStorage.setItem(`dyane-personalization-${product.sku}`, JSON.stringify({ initials, finish })) } catch { /* Keep the current form usable. */ }
  }, [draftLoaded, product.sku, initials, finish])
  useEffect(() => {
    if (!mounted || !open) return
    const element = dialog.current
    if (!element) return
    setAdded(false); setError('')
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    close.current?.focus()
    return () => { element.close(); document.body.style.overflow = before; trigger.current?.focus() }
  }, [mounted, open])

  async function addToBag(event: React.FormEvent) {
    event.preventDefault()
    if (cart.adding) return
    if (!/^[A-Z]{1,3}$/.test(initials)) {
      setError(en ? 'Enter one to three letters, A to Z.' : 'Saisissez une à trois lettres, de A à Z.')
      initialsInput.current?.focus(); return
    }
    if (!purchasable) { setEnquiry(true); return }
    const success = await cart.add(product.sku, { initials, finish }, false)
    if (success) { setAdded(true); setError('') }
    else setError(en ? 'Availability could not be confirmed. Check your bag (five pieces per format maximum) and try again.' : 'Disponibilité non confirmée. Vérifiez votre panier (cinq pièces par format maximum) puis réessayez.')
  }

  if (!mounted) return null
  return createPortal(<dialog ref={dialog} className={`${s.drawer} ${cartFontVariables}`} aria-labelledby={`personalization-${product.sku}`} onCancel={event => { event.preventDefault(); onClose() }}>
    <div className={s.drawerContent}>
      <header className={s.drawerHeader}>
        <h2 id={`personalization-${product.sku}`}>{en ? 'PERSONALISE' : 'PERSONNALISER'}</h2>
        <button ref={close} type="button" className={s.close} onClick={onClose} aria-label={en ? 'Close personalisation' : 'Fermer la personnalisation'}><span /></button>
      </header>
      <form onSubmit={addToBag} className={s.drawerForm}>
        <SculpturePreview product={product} initials={initials} finish={finish} locale={locale} />
        {showPreorderTerms && <p className={s.conditions}>{preorderTerms(locale, !conciergeOnly)}</p>}
        {added ? <div className={s.added}>
          <p role="status">{en ? 'Your personalised sculpture has been added to your bag.' : 'Votre sculpture personnalisée a été ajoutée au panier.'}</p>
          <p>{product.format} · {initials} · {finishLabel(finish, locale)}</p>
          <Link href={localizedPath(locale, '/panier')} className={s.outline}>{en ? 'VIEW MY BAG' : 'VOIR MON PANIER'}</Link>
          <button type="button" className={s.textButton} onClick={onClose}>{en ? 'CONTINUE DISCOVERING' : 'POURSUIVRE LA DÉCOUVERTE'}</button>
        </div> : <>
          <fieldset className={s.finishes}>
            <legend className={s.srOnly}>{en ? 'Initials finish' : 'Finition des initiales'}</legend>
            {product.personalization.finishes.map(option => <label key={option} data-selected={finish === option}>
              <input type="radio" name="finish" value={option} checked={finish === option} onChange={() => setFinish(option)} />
              {finishLabel(option, locale)}
            </label>)}
          </fieldset>
          <div className={s.initialsField}>
            <label htmlFor={`initials-${product.sku}`}>{en ? 'Your initials*' : 'Vos initiales*'}</label>
            <input ref={initialsInput} id={`initials-${product.sku}`} value={initials} onChange={event => { setInitials(normalizeInitials(event.target.value)); setError('') }} maxLength={3} required pattern="[A-Z]{1,3}" autoComplete="off" autoCapitalize="characters" spellCheck={false} aria-describedby={`initials-help-${product.sku}`} />
            <p id={`initials-help-${product.sku}`}>{en ? 'Max. 3 letters' : 'Max. 3 lettres'}</p>
          </div>
          <p className={s.error} role="alert">{error}</p>
          <button type="submit" className={s.addToBag} disabled={purchasable && (cart.adding || !cart.loaded)} aria-busy={purchasable && cart.adding}>
            <span>{purchasable && <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M5 8h14v13H5zM8 8V6a4 4 0 0 1 8 0v2" /></svg>}{conciergeOnly ? (en ? 'Contact the Concierge' : 'Contacter la Conciergerie') : !purchasable ? (en ? 'REQUEST THIS PERSONALISATION' : 'DEMANDER CETTE PERSONNALISATION') : (en ? 'ADD TO BAG' : 'AJOUTER AU PANIER')}</span>
            <span>{product.amount === null ? (en ? 'On request' : 'Sur demande') : money}</span>
          </button>
          <p className={s.included}>{product.amount === null ? (en ? 'Feasibility and quotation confirmed with the Concierge.' : 'Faisabilité et devis confirmés avec la Conciergerie.') : (en ? 'Personalisation included' : 'Personnalisation offerte')}</p>
          <p className={s.conditions}>{personalizationNotice(locale)}</p>
        </>}
      </form>
      {enquiry && <BespokeEnquiry key={`${product.sku}:${initials}:${finish}`} locale={locale} initialMessage={`${product.name} · ${product.format}\n${en ? 'Initials' : 'Initiales'} : ${initials}\n${en ? 'Finish' : 'Finition'} : ${finishLabel(finish, locale)}`} />}
    </div>
  </dialog>, document.body)
}

export function PersonalizeButton({ sku, locale, className, composition, label, showPreorderTerms = false, conciergeOnly = false }: {
  sku: string; composition?: string; locale: 'fr' | 'en'; className?: string; label?: string; showPreorderTerms?: boolean; conciergeOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const product = personalizableWorks.find(item => item.sku === sku)
  if (!product?.personalization.enabled) return null
  return <>
    <button type="button" className={className || s.outline} onClick={() => setOpen(true)} aria-haspopup="dialog">{label ?? (locale === 'en' ? 'PERSONALISE' : 'PERSONNALISER')}</button>
    <PersonalizationDrawer key={product.sku} product={composition ? { ...product, format: `${product.format} · ${composition}` } : product} locale={locale} open={open} onClose={() => setOpen(false)} showPreorderTerms={showPreorderTerms} conciergeOnly={conciergeOnly} />
  </>
}
