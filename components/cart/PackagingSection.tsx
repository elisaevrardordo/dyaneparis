'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import CommerceDialog from '@/components/commerce/CommerceDialog'
import type { GiftOptions } from '@/lib/gifts/options'
import c from '@/components/commerce/Commerce.module.css'
import s from './PackagingSection.module.css'
export default function PackagingSection({ locale, options, message, confirmation, disabled, onGift, onMessage }: {
  locale: 'fr' | 'en'; options: GiftOptions; message: string; confirmation: string; disabled: boolean; onGift: (value: boolean) => void; onMessage: () => void
}) {
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const [information, setInformation] = useState(false)
  return <section className={s.section} aria-labelledby="gifting-title"><div className={s.heading}><h2 id="gifting-title">{t('Emballage et cadeaux', 'Packaging & gifts')}</h2><span>{t('Les attentions de la Maison', 'Details from the House')}</span></div>
    <div className={s.packaging}><div className={s.packagingBody}><fieldset className={s.packagingChoices} disabled><legend>{t('Présentation de votre commande', 'Your order presentation')}</legend><label><input type="radio" name="packaging" /><span><strong>{t('Packaging signature Dyane Paris', 'Dyane Paris signature packaging')}</strong><small>{t('Présentation et disponibilité à confirmer avec la Conciergerie.', 'Presentation and availability to be confirmed with the Concierge.')}</small></span><em>{t('À confirmer', 'To be confirmed')}</em></label></fieldset><button type="button" className={s.infoLink} onClick={() => setInformation(true)}>{t('En savoir plus sur la présentation', 'Learn about presentation')}</button></div>
    </div>
    <div className={s.row}><div className={s.rowCopy}><label><input type="checkbox" checked={options.isGift} onChange={event => onGift(event.target.checked)} disabled={disabled} /><span>{t('Offrir en cadeau', 'Give as a gift')}</span></label><p>{t('Une attention personnelle, sans supplément.', 'A personal touch, at no extra cost.')}</p><button type="button" className={s.messageLink} onClick={onMessage} disabled={disabled} aria-haspopup="dialog">{message ? t('Modifier le message cadeau', 'Edit gift message') : t('Ajouter un message cadeau', 'Include a gift message')}</button></div><div className={s.rowVisual}><Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1793745808/dyane-paris-carte-personnalis%C3%A9e.png" alt="" fill sizes="(max-width: 760px) 25vw, 12vw" /></div></div>
    {message && <div className={s.messagePreview}><p>{message}</p><small>{t('Votre carte sera manuscrite avec soin pour vos proches par Dyane Paris.', 'Your card will be handwritten with care for your loved ones by Dyane Paris.')}</small></div>}
    <p className={s.confirmation} role="status">{confirmation}</p><Link className={s.experience} href={localizedPath(locale, '/offrir-un-cocktail-de-luxe')}>{t('L’art d’offrir selon Dyane Paris', 'The art of gifting with Dyane Paris')} <span aria-hidden="true">↗</span></Link>
    {information && <CommerceDialog title={t('La présentation de votre commande', 'Your order presentation')} onClose={() => setInformation(false)} closeLabel={t('Fermer les informations de présentation', 'Close presentation information')}><div className={c.noticeCopy}><p>{t('La Maison prépare l’expérience cadeau autour de votre sculpture. La présentation et la disponibilité du packaging signature sont à confirmer avec la Conciergerie.', 'The House is preparing the gifting experience around your sculpture. Signature packaging presentation and availability are to be confirmed with the Concierge.')}</p><p className={c.status}>{t('Vous pouvez dès maintenant enregistrer l’intention cadeau et votre message. Aucun emballage ni service supplémentaire n’est facturé ou promis.', 'You can save your gift preference and message now. No additional packaging or service is charged or promised.')}</p><Link href={localizedPath(locale, '/contact')}>{t('Contacter la Conciergerie', 'Contact the Concierge')}</Link></div></CommerceDialog>}
  </section>
}
