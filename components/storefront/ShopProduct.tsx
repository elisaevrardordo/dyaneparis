'use client'
import { formatPrice } from '@/lib/formatPrice'
import { fulfillmentForSku, preorderTerms, shopDeliveryTerms } from '@/lib/orders/fulfillment'

import { personalizationNotice } from '@/lib/personalization/catalog'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductPageClosing from '@/components/product/ProductPageClosing'
import ProductShowcase from '@/components/product/ProductShowcase'
import showcase from '@/components/product/ProductShowcase.module.css'
import { productVideos, produits } from '@/components/data/productDetails'
import { PersonalizeButton } from '@/components/personalization/PersonalizationDrawer'
import { useCart } from '@/components/commerce/CartProvider'
import { cartProducts } from '@/components/cart/catalog'
import type { FeaturedWork } from '@/content/storefront'
import { localizedPath } from '@/i18n/paths'
import s from './ShopProduct.module.css'

export default function ShopProduct({ work, locale, sandboxCartEnabled, liveCartEnabled = false }: {
  work: FeaturedWork; sandboxCartEnabled: boolean; liveCartEnabled?: boolean; locale: 'fr' | 'en'
}) {
  const product = cartProducts.find(item => item.sku === work.sku)
  const sku = product?.sku
  const canPurchase = sandboxCartEnabled || liveCartEnabled
  const fulfillment = sku ? fulfillmentForSku(sku) : 'stock'
  const preorder = fulfillment === 'preorder'
  const format = work.format || product?.format || ''
  const no2 = work.collection === 'no2'
  const cart = useCart()
  const [limit, setLimit] = useState<number | null>(null)
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const path = (href: string) => localizedPath(locale, href)
  const delivery = shopDeliveryTerms(locale, fulfillment, canPurchase)
  const stockStatus = limit === null
    ? t('Disponibilité à confirmer auprès de la Conciergerie.', 'Contact the Concierge to confirm availability.')
    : limit > 0 ? t('Disponible.', 'Available.') : t('Indisponible.', 'Unavailable.')
  useEffect(() => {
    if (!canPurchase || !sku) return
    const controller = new AbortController()
    setLimit(null)
    void fetch('/api/stripe/cart-summary', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ sku, quantity: 1 }], flow: 'commerce' }), signal: controller.signal })
      .then(async response => { if (!response.ok) return; const result = await response.json(); if (!controller.signal.aborted && result.stockVerified && Number.isInteger(result.limits?.[sku])) setLimit(result.limits[sku]) }).catch(() => {})
    return () => controller.abort()
  }, [sku, canPurchase])
  const workSlug = no2 ? 'dyane-no2-basil-smash' : 'dyane-no1-pornstar-martini'
  const contextImage = work.appendCollectionPhoto ? produits[workSlug].images[1] : undefined
  const video = productVideos[workSlug]
  const photos = [
    ...work.images.map(photo => ({ ...photo, type: 'image' as const })),
    ...(contextImage ? [{ src: contextImage, type: 'image' as const, alt: `${t('Ambiance de la collection', 'Collection setting')} ${work.title}` }] : []),
    ...(video ? [{ src: video.src, type: 'video' as const, alt: `${t('Film de la collection', 'Collection film')} ${work.title}`, caption: video.caption[locale] }] : []),
  ]

  return <main className={`theme-page ${s.showcasePage}`} data-sculpture-product={sku || work.enquirySku}>
    <ProductShowcase items={photos} locale={locale} title={work.title}>
        <h1>{work.title}</h1>
        <p className={showcase.subtitle}>{no2 ? 'Basil Smash' : t('Inspiré du Pornstar Martini, 24 % vol.', 'Inspired by the Pornstar Martini, 24% vol.')} · {format}</p>
        <section className={showcase.formatPurchase} aria-label={t('Votre création', 'Your creation')}>
          {sandboxCartEnabled && <p className={s.notice}>{t('SANDBOX · AUCUN ACHAT RÉEL', 'SANDBOX · NO REAL PURCHASE')}</p>}
          <p className={showcase.formatPrice}>{product ? formatPrice(product.amount, locale) : t('Sur demande', 'On request')}{preorder && <small className={s.priceTax}> {t('TTC', 'incl. VAT')}</small>}</p>
          {preorder && <p className={s.status}>{preorderTerms(locale, canPurchase)}</p>}
          {canPurchase && product && <button type="button" className={showcase.orderButton} disabled={!cart.loaded || cart.adding || limit === 0} onClick={() => cart.add(product.sku)}>{cart.adding ? t('Ajout en cours…', 'Adding…') : t('Ajouter au panier', 'Add to bag')}</button>}
          {(!canPurchase || !product) && <Link className={showcase.orderButton} href={path('/contact')}>{t('Contacter la Conciergerie', 'Contact the Concierge')}</Link>}
          <PersonalizeButton sku={sku || work.enquirySku || ''} locale={locale} className={showcase.personalizeButton} showPreorderTerms={preorder} conciergeOnly={!canPurchase} />
        </section>
        {canPurchase && product && <Link className={showcase.privateOrder} href={path('/contact')}>{t('Passer une commande privée', 'Place a private order')}</Link>}
        {!preorder && <p className={s.status}>{canPurchase ? stockStatus : t('Disponible auprès de la Conciergerie. Livraison sous 5 jours ouvrés en France métropolitaine et à Monaco.', 'Available through the Concierge. Delivery within 5 business days in metropolitan France and Monaco.')}</p>}
        {sandboxCartEnabled && <p className={s.notice}>{t('Aperçu de test. Aucun paiement réel. Les informations réglementaires du format seront confirmées avant l’ouverture des ventes.', 'Test preview. No real payment. Regulatory information for this size will be confirmed before sales open.')}</p>}
        <section className={s.personalization}><h2>{t('PERSONNALISER VOTRE DYANE', 'PERSONALISE YOUR DYANE')}</h2><p>{no2 ? t('Vos initiales, jusqu’à trois lettres. Finition dorée ou verte, sans supplément.', 'Your initials, up to three letters. Gold or green finish, included.') : t('Vos initiales, jusqu’à trois lettres. Finition dorée ou rouge, sans supplément.', 'Your initials, up to three letters. Gold or red finish, included.')}</p><p>{personalizationNotice(locale)}</p></section>
        <div className={s.intro}><strong>{t('UNE CRÉATION À DÉGUSTER. UNE SCULPTURE À CONSERVER.', 'A CREATION TO TASTE. A SCULPTURE TO KEEP.')}</strong><p>{t('Chaque œuvre liquide associe une composition de mixologie à une sculpture en porcelaine peinte à la main. Une rencontre entre le geste, la matière et le goût.', 'Each liquid work brings together a mixology composition and a hand-painted porcelain sculpture. A meeting of gesture, material and taste.')}</p></div>
        <div className={s.details}>
          <details><summary>{t('COMPOSITION & INFORMATIONS ALIMENTAIRES', 'COMPOSITION & FOOD INFORMATION')}</summary><p>{no2 ? t('Gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. Déclaration des allergènes : à confirmer auprès de la Conciergerie.', 'Gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. Contact the Concierge for the allergen declaration.') : t('Vodka artisanale française, vanille Madagascar Bourbon Gold, purée de fruit de la passion, touche de framboise sauvage et jus de citron biologique. Composition issue du catalogue Dyane No.1.\n24 % vol. Déclaration des allergènes : à obtenir auprès de la Conciergerie avant commande.', 'French craft vodka, Madagascar Bourbon Gold vanilla, passion-fruit purée, a touch of wild raspberry and organic lemon juice. Composition from the Dyane No.1 catalogue.\n24% vol. Contact the Concierge for the allergen declaration before ordering.')}</p></details>
          <details><summary>{t('LA PORCELAINE & LE SAVOIR-FAIRE', 'PORCELAIN & CRAFT')}</summary><p>{t('Sculpture en porcelaine peinte à la main. Composition de mixologie embouteillée en France, dans la région d’Avignon.\nContenance : ', 'Hand-painted porcelain sculpture. Mixology composition bottled in the Avignon region of France.\nVolume: ')}{format}{t('. Dimensions et poids de ce format : à confirmer avec la Maison.', '. Dimensions and weight for this size: confirm with the House.')}</p></details>
          <details><summary>{t('CONSERVATION & DÉGUSTATION', 'STORAGE & SERVING')}</summary><p>{t('Consultez les indications de conservation et d’utilisation figurant sur votre flacon. Pour les conditions avant et après ouverture de ce format, contactez la Conciergerie.', 'Refer to the storage and use instructions on your bottle. Contact the Concierge for storage conditions before and after opening for this size.')}</p></details>
          <details><summary>{t('LIVRAISON, RETOURS & CONTACT', 'DELIVERY, RETURNS & CONTACT')}</summary><p>{delivery}</p><Link href={path('/cgv')}>{t('Consulter les conditions de vente', 'Read terms of sale')}</Link><p><a href="mailto:conciergerie@dyaneparis.com">conciergerie@dyaneparis.com</a></p></details>
        </div>
        <p className={s.legal}>{t('Vente réservée aux personnes majeures. L’abus d’alcool est dangereux pour la santé. À consommer avec modération.', 'Sale restricted to adults. Alcohol abuse is dangerous for your health. Drink responsibly.')}</p>
    </ProductShowcase>
    <ProductPageClosing locale={locale} currentSku={work.sku ?? work.enquirySku} />
  </main>
}
