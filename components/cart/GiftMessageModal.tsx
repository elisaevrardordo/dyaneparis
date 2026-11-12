'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { GIFT_MAX_CHARACTERS, GIFT_MAX_LINES, giftMessageStats, normalizeGiftMessage, validGiftMessage } from '@/lib/gifts/message'
import { localizedPath } from '@/i18n/paths'
import CommerceDialog from '@/components/commerce/CommerceDialog'
import s from '@/components/commerce/Commerce.module.css'

type Props = { message: string; locale: 'fr' | 'en'; onSave: (message: string) => void; onClose: () => void }
export default function GiftMessageModal({ message, locale, onSave, onClose }: Props) {
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const [draft, setDraft] = useState(message)
  const [limitError, setLimitError] = useState(false)
  const stats = giftMessageStats(draft)
  const valid = validGiftMessage(draft)
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || !draft.trim()) return
    onSave(normalizeGiftMessage(draft).trim()); onClose()
  }
  return <CommerceDialog title={t('Ajouter un message cadeau', 'Include a gift message')} kind="gift" closeLabel={t('Fermer le message cadeau', 'Close gift message')} onClose={onClose}>
    <div className={s.giftBody}><figure className={s.giftVisual}><div><Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1793745808/dyane-paris-carte-personnalis%C3%A9e.png" alt={t('La carte personnalisée Dyane Paris', 'The personalised Dyane Paris card')} fill sizes="(max-width: 760px) 100vw, 464px" style={{ objectFit: 'contain', objectPosition: 'center' }} priority /></div></figure>
      <form onSubmit={save}><p className={s.giftHandwriting}>{t('Votre carte sera manuscrite avec soin pour vos proches par Dyane Paris.', 'Your card will be handwritten with care for your loved ones by Dyane Paris.')}</p>
        <label className={s.giftLabel} htmlFor="gift-message">{t('Votre message personnalisé', 'Your personalized message.')}</label>
        <textarea id="gift-message" className={s.giftTextarea} value={draft} onChange={event => {
          const next = normalizeGiftMessage(event.target.value)
          const nextStats = giftMessageStats(next)
          if (nextStats.lines > GIFT_MAX_LINES || nextStats.characters > GIFT_MAX_CHARACTERS) { setLimitError(true); return }
          setDraft(next); setLimitError(false)
        }} rows={3} maxLength={1200} aria-describedby="gift-count gift-limits gift-input-error" aria-invalid={!valid} placeholder={t('Écrivez votre message ici...', 'Write your message here...')} />
        <p className={s.giftHelp} id="gift-limits">{t('3 lignes et 300 caractères maximum.', 'Maximum 3 lines and 300 characters.')}</p>
        <div className={s.giftBelow}><div className={s.giftCounts} id="gift-count" aria-live="polite"><span>{Math.max(0, GIFT_MAX_LINES - stats.lines)} {t('ligne(s) restante(s)', 'line(s) left')}</span><span>{Math.max(0, GIFT_MAX_CHARACTERS - stats.characters)} {t('caractères restants', 'characters left')}</span></div><button type="button" onClick={() => { onSave(''); onClose() }}>{t('Supprimer le message', 'Remove message')}</button></div>
        {(!valid || limitError) && <p id="gift-input-error" className={s.giftError} role="alert">{t('Veuillez limiter votre message à 3 lignes et 300 caractères, sans caractères de contrôle.', 'Please limit your message to 3 lines and 300 characters, without control characters.')}</p>}
        <button type="submit" className={s.primary} disabled={!valid || !draft.trim()}>{t('Appliquer', 'Apply')}</button>
      </form><Link className={s.giftExperience} href={localizedPath(locale, '/offrir-un-cocktail-de-luxe')}>{t('Découvrir l’expérience cadeau Dyane Paris', 'Discover the Dyane Paris gifting experience')}</Link>
    </div>
  </CommerceDialog>
}
