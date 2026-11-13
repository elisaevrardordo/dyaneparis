import { formatPrice } from '@/lib/formatPrice'
import Image from 'next/image'
import Link from 'next/link'
import { personalizableWorks, personalizationNotice } from '@/lib/personalization/catalog'
import { localizedPath } from '@/i18n/paths'
import { fulfillmentForSku, preorderTerms } from '@/lib/orders/fulfillment'
import { PersonalizeButton, SculpturePreview } from './PersonalizationDrawer'
import s from './PersonalizableCollection.module.css'

export default function PersonalizableCollection({ locale, sandboxCartEnabled, liveCartEnabled }: {
  locale: 'fr' | 'en'; sandboxCartEnabled: boolean; liveCartEnabled: boolean
}) {
  const en = locale === 'en'
  const canPurchase = sandboxCartEnabled || liveCartEnabled
  const money = (amount: number) => formatPrice(amount, locale)
  const path = (href: string) => localizedPath(locale, href)
  return <main className={s.page}>
    <section className={s.opening} aria-labelledby="collection-title">
      <div className={s.heroPhoto}>
        <Image src="/images/officielles/collections/dyane-no1-pornstar-martini-sculpture-porcelaine.png" alt={en ? 'The red-draped porcelain sculpture, Dyane Paris' : 'La sculpture en porcelaine au drapé rouge, Dyane Paris'} fill priority sizes="100vw" />
      </div>
      <div className={s.intro}>
        <p className={s.eyebrow}>DYANE PARIS</p>
        <h1 id="collection-title">{en ? 'THE PERSONALISABLES' : 'LES PERSONNALISABLES'}</h1>
        <p>{en ? 'A work to give. A mark to leave.' : 'Une œuvre à offrir. Une empreinte à laisser.'}</p>
      </div>
    </section>
    <section className={s.products} aria-label={en ? 'Personalisable sculptures' : 'Sculptures personnalisables'}>
      {personalizableWorks.map(product => {
        const preorder = fulfillmentForSku(product.sku) === 'preorder'
        return <article key={product.sku} className={s.product}>
          <Link href={path(`/personnalisables/${product.sku}`)} className={s.gridVisual} aria-label={`${product.name}, ${product.format}`}><SculpturePreview product={product} example={false} locale={locale} /></Link>
          <div className={s.productHeading}><h2>{product.name} <span>{product.format}</span></h2><p>{product.amount === null ? (en ? 'On request' : 'Sur demande') : money(product.amount)}</p></div>
          {preorder && <p className={s.description}>{preorderTerms(locale, canPurchase)}</p>}
          <p className={s.description}>{en ? 'Your initials, in the finish of your choice.' : 'Vos initiales, dans la finition de votre choix.'}</p>
          <div className={s.productActions}><PersonalizeButton sku={product.sku} locale={locale} showPreorderTerms={preorder} conciergeOnly={!canPurchase} /><Link href={path(`/personnalisables/${product.sku}`)}>{en ? 'DISCOVER' : 'DÉCOUVRIR'}</Link></div>
        </article>
      })}
    </section>
    <p className={s.conditions}>{personalizationNotice(locale)}</p>
    {!liveCartEnabled && <p className={s.shopNotice}>{en ? 'Online purchasing is not open yet. The Concierge is available for enquiries.' : 'L’achat en ligne n’est pas encore ouvert. La Conciergerie reste à votre disposition.'}</p>}
    <section className={s.christmas} aria-labelledby="christmas-title">
      <div className={s.christmasPhoto}><Image src="/images/officielles/gifting/dyane-paris-personnalisation-sculpture-cadeau.png" alt={en ? 'A hand-painted landscape on a Dyane porcelain sculpture' : 'Un paysage peint à la main sur une sculpture en porcelaine Dyane'} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
      <div className={s.christmasCopy}><p className={s.eyebrow}>{en ? 'A CHRISTMAS CREATION' : 'UNE CRÉATION POUR NOËL'}</p><h2 id="christmas-title">{en ? 'WHAT IF YOUR GIFT DID NOT EXIST YET?' : 'ET SI VOTRE CADEAU N’EXISTAIT PAS ENCORE ?'}</h2><p>{en ? 'From a simple engraving to a work imagined entirely for you, Dyane Paris brings your most singular wishes to life.' : 'De la simple gravure à une œuvre entièrement imaginée pour vous, Dyane Paris donne vie à vos envies les plus singulières.'}</p><Link href={path('/votre-cadeau-de-noel-reve')} className={s.outline}>{en ? 'IMAGINE MY CHRISTMAS GIFT' : 'IMAGINER MON CADEAU DE NOËL'}</Link><Link className={s.yearRound} href={path('/oeuvre-sur-commande')}>{en ? 'BESPOKE CREATIONS, ALL YEAR ROUND' : 'LES ŒUVRES SUR COMMANDE, TOUTE L’ANNÉE'}</Link></div>
    </section>
  </main>
}
