'use client'
import { formatPrice } from '@/lib/formatPrice'
import { shippingAmount, shippingDescription, shippingDeliveryDescription } from '@/lib/shipping'
import { fulfillmentForSku, preorderTerms, type Fulfillment } from '@/lib/orders/fulfillment'

import { finishLabel } from '@/lib/personalization/catalog'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'
import { CART_STORAGE_KEY, TEO_ARTWORK_SKU, TEO_COMPOSITIONS, cartProducts, cartSubtotal, cleanCart, cartLineKey, type CartItem } from './catalog'
import s from './CartPage.module.css'
import Footer from '@/components/Footer'
import BrandWordmark from '@/components/BrandWordmark'
import { cartFontVariables } from './fonts'
import GiftMessageModal from './GiftMessageModal'
import { useCart } from '@/components/commerce/CartProvider'
import PremiumLoader, { useLoadingGate } from '@/components/commerce/PremiumLoader'
import { ProductDetailsModal, AvailabilityModal } from './CartInformation'
import PackagingSection from './PackagingSection'
import { giftOptions as validateGiftOptions, GIFT_OPTIONS_STORAGE_KEY, type GiftOptions } from '@/lib/gifts/options'
import { GIFT_STORAGE_KEY, normalizeGiftMessage, restoreGiftMessage } from '@/lib/gifts/message'
import EmbeddedPayment from './EmbeddedPayment'

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    gift: <><path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12" /><path d="M12 9S4 9 5 5c1-4 7 0 7 4Zm0 0s8 0 7-4c-1-4-7 0-7 4Z" /></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="1.5" /><path d="M2 9h20M5 15h5" /></>,
    truck: <><path d="M2 5h12v12H2zM14 10h4l4 4v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    return: <><path d="M5 7a8 8 0 1 1-1 9M5 3v5H1" /><path d="M9 9h7v8H9z" /></>,
    trash: <><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" /></>,
    plus: <path d="M5 12h14M12 5v14" />,
    minus: <path d="M5 12h14" />,
    arrow: <path d="m9 5 7 7-7 7" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

type Summary = { subtotal: number; checkoutAvailable: boolean; stockVerified: boolean;
  limits: Record<string, number>; mode?: 'test' | 'live' }
type Group = { fulfillment: Fulfillment; items: CartItem[] }
type Checkout = { clientSecret: string; publishableKey: string; returnPath: string; attemptId: string; fulfillment: Fulfillment }
type OrderStatus = { order: string; status: 'pending' | 'paid' | 'expired' | 'manual_review' | 'unavailable';
  fulfillment?: Fulfillment; items?: CartItem[] }

const fulfillmentOrder: readonly Fulfillment[] = ['stock', 'preorder']
const orderIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function orderGroups(items: CartItem[]): Group[] {
  return fulfillmentOrder.map(fulfillment => ({ fulfillment, items: items.filter(item => fulfillmentForSku(item.sku) === fulfillment) }))
    .filter(group => group.items.length > 0)
}

function reconcilePaidCart(order: string, paidItems: CartItem[], fallback: CartItem[]) {
  const marker = `dyane-paid-cart/${order}`
  const stored = localStorage.getItem(marker)
  if (stored === 'applied') return

  const cart = localStorage.getItem(CART_STORAGE_KEY)
  const current = cart ? cleanCart(JSON.parse(cart)) : fallback
  const before = JSON.stringify(current)
  let next: CartItem[]
  if (stored) {
    const previous = JSON.parse(stored) as { before: string; after: string }
    // A reload may happen between writing the cart and completing its receipt marker.
    // If the cart changed in between, preserve the current selection.
    next = previous.before === before ? cleanCart(JSON.parse(previous.after)) : current
  } else {
    const paid = new Map(paidItems.map(item => [cartLineKey(item), item.quantity]))
    next = current.flatMap(item => {
      const quantity = paid.get(cartLineKey(item)) ?? 0
      if (quantity > item.quantity) return [item]
      return item.quantity === quantity ? [] : [{ ...item, quantity: item.quantity - quantity }]
    })
    localStorage.setItem(marker, JSON.stringify({ before, after: JSON.stringify(next) }))
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
  localStorage.setItem(marker, 'applied')
  return next
}

export default function CartPage({ locale }: { locale: 'fr' | 'en' }) {
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const path = (value: string) => localizedPath(locale, value)
  const money = (amount: number) => formatPrice(amount, locale)
  const { items, setItems, loaded, storageError: cartStorageError, adding, add } = useCart()
  const [storageError, setStorageError] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [giftOptions, setGiftOptions] = useState<GiftOptions>({ isGift: false })
  const [detailsSku, setDetailsSku] = useState<string | null>(null)
  const [availabilitySku, setAvailabilitySku] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const checkoutLoading = useLoadingGate()
  const checkoutRequest = useRef<AbortController | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [giftConfirmation, setGiftConfirmation] = useState('')
  const [busy, setBusy] = useState<Fulfillment | null>(null)
  const [payment, setPayment] = useState<Checkout | null>(null)
  const [error, setError] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [summaryState, setSummaryState] = useState<{ fingerprint: string; groups: Partial<Record<Fulfillment, Summary>> } | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [reconciledOrder, setReconciledOrder] = useState<string | null>(null)
  const [statusRefresh, setStatusRefresh] = useState(0)
  const attempt = useRef<Partial<Record<Fulfillment, { fingerprint: string; id: string }>>>({})
  const errorRef = useRef<HTMLParagraphElement>(null)
  const query = useSearchParams()
  const result = query.get('result')
  const orderParameter = query.get('order') ?? ''
  const returnedOrder = result === 'returned' && orderIdPattern.test(orderParameter) ? orderParameter.toLowerCase() : null
  const verifiedOrder = orderStatus?.order === returnedOrder ? orderStatus : null
  const groups = orderGroups(items)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const fingerprint = JSON.stringify(items)
  const summaries = summaryState?.fingerprint === fingerprint ? summaryState.groups : {}
  const limits = { ...summaries.stock?.limits, ...summaries.preorder?.limits }
  const locked = Boolean(busy || payment)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(GIFT_STORAGE_KEY)
      const restored = restoreGiftMessage(stored)
      setGiftMessage(restored)
      const options = sessionStorage.getItem(GIFT_OPTIONS_STORAGE_KEY)
      const saved = options ? validateGiftOptions(JSON.parse(options)) : { isGift: false }
      setGiftOptions({ isGift: saved.isGift || Boolean(restored) })
      if (stored && !restored) setGiftConfirmation(en ? 'Please enter your message again within the limits.' : 'Veuillez rédiger votre message à nouveau dans les limites prévues.')
    } catch { setStorageError(true) }
  }, [en])
  useEffect(() => () => checkoutRequest.current?.abort(), [])
  useEffect(() => {
    if (!loaded) return
    try { sessionStorage.setItem(GIFT_STORAGE_KEY, giftMessage); sessionStorage.setItem(GIFT_OPTIONS_STORAGE_KEY, JSON.stringify(giftOptions)) } catch { setStorageError(true) }
  }, [giftMessage, giftOptions, loaded])
  useEffect(() => {
    if (!loaded || !items.length) { setSummaryState(null); setRefreshing(false); return }
    const controller = new AbortController()
    setRefreshing(true)
    const timer = window.setTimeout(async () => {
      const values: Partial<Record<Fulfillment, Summary>> = {}
      await Promise.all(orderGroups(JSON.parse(fingerprint)).map(async group => {
        try {
          const response = await fetch('/api/stripe/cart-summary', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: group.items, flow: 'commerce' }), signal: controller.signal })
          if (response.ok) values[group.fulfillment] = await response.json()
        } catch { /* Checkout remains unavailable until the server can verify the selection. */ }
      }))
      if (!controller.signal.aborted) {
        setSummaryState({ fingerprint, groups: values })
        setRefreshing(false)
      }
    }, refresh > 0 ? 0 : 220)
    return () => { clearTimeout(timer); controller.abort() }
  }, [fingerprint, loaded, items.length, refresh])

  // biome-ignore lint/correctness/useExhaustiveDependencies: The refresh button restarts polling for the same order.
  useEffect(() => {
    if (!returnedOrder) return
    const controller = new AbortController()
    let next: ReturnType<typeof setTimeout> | undefined
    let observed: OrderStatus | undefined
    let checks = 0
    setOrderStatus(null)
    const timeout = setTimeout(() => {
      controller.abort()
      if (!observed) setOrderStatus({ order: returnedOrder, status: 'unavailable' })
    }, 15_000)

    async function checkStatus(order: string) {
      try {
        const response = await fetch(`/api/stripe/order-status?${new URLSearchParams({ order })}`, { cache: 'no-store', signal: controller.signal })
        if (response.ok) {
          const data = await response.json()
          if (controller.signal.aborted) return
          if (['paid', 'pending', 'expired', 'manual_review'].includes(data?.status)) {
            const paidItems = data.status === 'paid' && Array.isArray(data.items) ? cleanCart(data.items) : undefined
            observed = {
              order, status: data.status,
              fulfillment: data.fulfillment === 'stock' || data.fulfillment === 'preorder' ? data.fulfillment : undefined,
              ...(paidItems && paidItems.length === data.items.length ? { items: paidItems } : {}),
            }
            setOrderStatus(observed)
            if (observed.status !== 'pending') { clearTimeout(timeout); return }
          }
        }
      } catch { /* A brief retry allows Stripe's webhook time to settle. */ }
      if (controller.signal.aborted) return
      checks += 1
      if (checks < 6) next = setTimeout(() => void checkStatus(order), 2200)
      else {
        clearTimeout(timeout)
        if (!observed) setOrderStatus({ order, status: 'unavailable' })
      }
    }

    void checkStatus(returnedOrder)
    return () => { controller.abort(); clearTimeout(timeout); clearTimeout(next) }
  }, [returnedOrder, statusRefresh])

  useEffect(() => {
    if (!loaded || adding || verifiedOrder?.status !== 'paid' || !verifiedOrder.items?.length) return
    let cancelled = false
    const reconcile = () => {
      if (cancelled || !verifiedOrder.items) return
      try {
        const next = reconcilePaidCart(verifiedOrder.order, verifiedOrder.items, items)
        if (next) setItems(next)
        setReconciledOrder(verifiedOrder.order)
      } catch { setStorageError(true) }
    }
    if (navigator.locks) void navigator.locks.request('dyane-paid-cart', reconcile).catch(() => { if (!cancelled) reconcile() })
    else reconcile()
    return () => { cancelled = true }
  }, [adding, items, loaded, setItems, verifiedOrder])

  function change(line: CartItem, quantity: number) {
    setError('')
    const key = cartLineKey(line)
    const others = items.filter(item => cartLineKey(item) !== key)
    const sameSku = others.filter(item => item.sku === line.sku).reduce((sum, item) => sum + item.quantity, 0)
    const next = quantity <= 0 ? others : cleanCart([...others, { ...line, quantity: Math.min(5 - sameSku, quantity) }])
    setItems(next)
    setAnnouncement(quantity <= 0 ? t('Article retiré du panier.', 'Item removed from your bag.') : t('Quantité mise à jour.', 'Quantity updated.'))
  }
  function statusBlocksCheckout(fulfillment: Fulfillment) {
    if (!returnedOrder || (verifiedOrder?.fulfillment && verifiedOrder.fulfillment !== fulfillment)) return false
    if (verifiedOrder?.status === 'paid') return reconciledOrder !== returnedOrder
    return verifiedOrder?.status !== 'expired'
  }

  async function checkout(event: React.FormEvent<HTMLFormElement>, group: Group) {
    event.preventDefault()
    const { items: selection, fulfillment } = group
    if (locked || checkoutRequest.current || adding || statusBlocksCheckout(fulfillment) || !summaries[fulfillment]?.checkoutAvailable) return
    // Reuse the explicit confirmation at entry; never silently assert majority.
    let adultConfirmed = document.documentElement.dataset.ageConfirmed === 'true'
    try { adultConfirmed ||= sessionStorage.getItem('age-confirmed') === 'true' } catch { /* The entry gate also keeps the confirmation in memory. */ }
    if (!adultConfirmed) {
      setError(t('Veuillez confirmer votre majorité à l’entrée du site avant de poursuivre.', 'Please confirm your legal age at the site entrance before continuing.'))
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    setBusy(fulfillment); setError('')
    const controller = new AbortController(); checkoutRequest.current = controller
    const timeout = setTimeout(() => controller.abort('timeout'), 25_000)
    const payload = { items: selection, giftMessage: giftMessage.trim(), giftOptions, locale }
    const next = JSON.stringify(payload)
    const existing = attempt.current[fulfillment]
    const attemptId = existing?.fingerprint === next ? existing.id : crypto.randomUUID()
    attempt.current[fulfillment] = { fingerprint: next, id: attemptId }
    try {
      checkoutLoading.start()
      const response = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, flow: 'commerce', attemptId, adultConfirmed }), signal: controller.signal })
      if (!response.ok) {
        if (response.status === 409) delete attempt.current[fulfillment]
        throw new Error(response.status === 409 ? 'stock' : 'unavailable')
      }
      const details = await response.json()
      if (typeof details.clientSecret !== 'string' || !details.clientSecret || typeof details.publishableKey !== 'string'
        || !details.publishableKey.startsWith('pk_') || typeof details.returnPath !== 'string') throw new Error('unavailable')
      const returnUrl = new URL(details.returnPath, window.location.origin)
      if (returnUrl.origin !== window.location.origin || returnUrl.pathname !== path('/panier')
        || returnUrl.searchParams.get('result') !== 'returned' || returnUrl.searchParams.get('order') !== attemptId) throw new Error('unavailable')
      clearTimeout(timeout)
      await checkoutLoading.finish()
      controller.signal.throwIfAborted()
      setPayment({ clientSecret: details.clientSecret, publishableKey: details.publishableKey, returnPath: details.returnPath, attemptId, fulfillment })
    } catch (cause) {
      clearTimeout(timeout)
      await checkoutLoading.finish()
      setError(controller.signal.reason === 'cancel' ? t('Ouverture du paiement annulée. Votre panier est conservé ; une éventuelle réservation expirera automatiquement.', 'Checkout opening cancelled. Your bag is saved; any reservation will expire automatically.') : cause instanceof Error && cause.message === 'stock'
        ? t('La disponibilité a changé. Vérifiez les quantités ou contactez la Conciergerie.', 'Availability has changed. Check quantities or contact the Concierge.')
        : t('Le paiement est momentanément indisponible. Votre panier est conservé. La Conciergerie reste à votre disposition.', 'Payment is temporarily unavailable. Your bag is saved. Please contact the Concierge.'))
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally { clearTimeout(timeout); checkoutRequest.current = null; setBusy(null) }
  }
  const totals = new Map<string, number>()
  for (const item of items) totals.set(item.sku, (totals.get(item.sku) || 0) + item.quantity)
  const groupTitle = (fulfillment: Fulfillment) => fulfillment === 'preorder' ? t('Précommandes', 'Preorders') : t('Articles en stock', 'In-stock items')
  const groupTerms = (fulfillment: Fulfillment) => fulfillment === 'preorder' ? preorderTerms(locale) : shippingDeliveryDescription(locale, false)
  const estimateRange = (lower: number, upper: number) => lower === upper ? money(lower) : `${money(lower)} ${t('à', 'to')} ${money(upper)}`
  const testMode = groups.some(group => summaries[group.fulfillment]?.mode === 'test')
  const statusMessage = returnedOrder ? {
    pending: t('Votre paiement est en cours de vérification. Vous pouvez vérifier à nouveau dans quelques instants.', 'Your payment is being verified. You can check again in a moment.'),
    paid: t('Paiement confirmé. Merci pour votre commande.', 'Payment confirmed. Thank you for your order.'),
    expired: t('La session de paiement a expiré. Vous pouvez reprendre votre commande.', 'Your payment session expired. You can start checkout again.'),
    manual_review: t('Votre commande est en cours de vérification par la Maison. Contactez la Conciergerie avant de renouveler le paiement.', 'The House is reviewing your order. Please contact the Concierge before paying again.'),
    unavailable: t('Le statut du paiement est momentanément indisponible. Veuillez vérifier à nouveau avant de renouveler le paiement.', 'Your payment status is temporarily unavailable. Please check again before paying again.'),
  }[verifiedOrder?.status ?? 'pending'] : undefined

  return <div className={`${s.page} ${cartFontVariables}`}>
    <a className={s.skip} href="#cart-content">{t('Aller au panier', 'Skip to your bag')}</a>
    <header className={s.header}>
      <Link href={path('/personnalisables')} aria-label="Collections" className={s.menuLink}><Icon name="menu" /><span>{t('Collections', 'Collections')}</span></Link>
      <Link href={path('/')} aria-label={t('Dyane Paris - accueil', 'Dyane Paris - home')} className={s.logo}>
        <BrandWordmark />
      </Link>
      <div className={s.headerRight}><Link href={path('/contact')}>{t('Nous contacter', 'Contact us')}</Link><span role="img" aria-label={t(`${count} articles dans le panier`, `${count} items in your bag`)} className={s.bag}><Icon name="bag" /><span>{count}</span></span></div>
    </header>
    <div className={s.helpBand}><aside className={s.helpBanner} aria-label={t('Besoin d’aide', 'Need help')}>
      <span className={s.helpEmblem} aria-hidden="true"><Image src="/images/brand/dyane-concierge-white-emblem.png" alt="" width={1254} height={1254} sizes="80px" /></span>
      <p>{t('Besoin d’aide ? Contactez-nous à', 'Need help? Contact us at')} <a href="mailto:conciergerie@dyaneparis.com">conciergerie@dyaneparis.com</a></p>
    </aside></div>
    <main className={s.columns} id="cart-content">
      <section className={s.left} aria-labelledby="cart-title">
        <div className={s.headingRow}><h1 id="cart-title">{t('Mon panier', 'My shopping bag')} <span>({count})</span></h1>{testMode && <span className={s.sandbox}>{t('Environnement de test', 'Test environment')}</span>}</div>
        <p className={s.srOnly} aria-live="polite" aria-atomic="true">{announcement}</p>
        {(storageError || cartStorageError) && <p className={s.notice}>{t('Votre navigateur ne permet pas de conserver le panier après fermeture de cette page.', 'Your browser cannot save your bag after this page is closed.')}</p>}
        {statusMessage && <div className={s.notice} role="status"><p>{statusMessage}</p>
          {verifiedOrder?.fulfillment && (verifiedOrder.status === 'paid' || verifiedOrder.status === 'pending') && <p>{groupTerms(verifiedOrder.fulfillment)}</p>}
          {verifiedOrder?.status === 'paid' && !verifiedOrder.items?.length && <p>{t('La liste des articles réglés est momentanément indisponible. Votre panier est conservé.', 'The list of paid items is temporarily unavailable. Your bag has been saved.')}</p>}
          {(verifiedOrder?.status === 'pending' || verifiedOrder?.status === 'unavailable' || (verifiedOrder?.status === 'paid' && !verifiedOrder.items?.length)) && <button type="button" className={s.statusRetry} onClick={() => setStatusRefresh(value => value + 1)}>{t('Vérifier à nouveau', 'Check again')}</button>}
          {verifiedOrder?.status === 'manual_review' && <Link className={s.statusRetry} href={path('/contact')}>{t('Contacter la Conciergerie', 'Contact the Concierge')}</Link>}
        </div>}
        {result === 'returned' && !returnedOrder && <p className={s.notice} role="status">{t('Vous êtes de retour du paiement. La confirmation de votre commande dépend de la validation du paiement.', 'You have returned from checkout. Your order is confirmed after payment has been verified.')}</p>}
        {result === 'cancelled' && <p className={s.notice} role="status">{t('Votre paiement a été interrompu. Votre panier est conservé. Une éventuelle réservation sera libérée à l’expiration de la session.', 'Checkout was interrupted. Your bag is saved. Any reservation is released when the checkout session expires.')}</p>}
        {!loaded ? <div className={s.loading} aria-busy="true">{t('Chargement de votre panier…', 'Loading your bag…')}</div> : groups.length ? groups.map(group => <section className={s.itemGroup} key={group.fulfillment} aria-labelledby={`bag-${group.fulfillment}`}>
          <div className={s.itemGroupHeading}><h2 id={`bag-${group.fulfillment}`}>{groupTitle(group.fulfillment)}</h2><p>{groupTerms(group.fulfillment)}</p></div>
          <ul className={s.items}>{group.items.map(item => {
            const product = cartProducts.find(p => p.sku === item.sku)
            if (!product) return null
            const limit = (limits[item.sku] ?? 5) - ((totals.get(item.sku) || 0) - item.quantity)
            return <li className={s.product} key={cartLineKey(item)}>
              <Link href={path(product.href)} className={s.productImage}><Image src={product.image} alt={t(`Sculpture ${product.name} en porcelaine - ${product.format}`, `${product.name} porcelain sculpture - ${product.format}`)} fill sizes="(max-width: 760px) 34vw, 22vw" priority /></Link>
              <div className={s.productInfo}><h3>{product.name}</h3>
                {item.composition ? <Link href={path(product.href)} className={s.detailLink}>{t('Voir les détails', 'View details')}</Link>
                  : <button type="button" className={s.detailLink} onClick={() => setDetailsSku(product.sku)} aria-haspopup="dialog">{t('Voir les détails', 'View details')}</button>}
                <dl className={s.details}><div><dt>{t('Format', 'Size')} :</dt><dd>{product.format}</dd></div><div><dt>{t('Matière', 'Material')} :</dt><dd>{t('Porcelaine peinte à la main', 'Hand-painted porcelain')}</dd></div>
                  {item.composition && <div><dt>{t('Composition', 'Cocktail')} :</dt><dd>{TEO_COMPOSITIONS[item.composition]}</dd></div>}
                  {item.personalization && <><div><dt>{t('Initiales', 'Initials')} :</dt><dd>{item.personalization.initials}</dd></div><div><dt>{t('Finition', 'Finish')} :</dt><dd>{finishLabel(item.personalization.finish, locale)} · {t('offerte', 'included')}</dd></div></>}
                </dl>
                <button type="button" className={s.availabilityLink} onClick={() => setAvailabilitySku(product.sku)} aria-haspopup="dialog">{t('Disponibilité', 'Availability')}</button>
                {limit < item.quantity && <p className={s.stockError}>{t('Quantité indisponible', 'Quantity unavailable')}</p>}
                <div className={s.productBottom}><p className={s.price}>{money(product.amount * item.quantity)}</p>
                  <div className={s.controls}>
                    <fieldset className={s.quantity}><legend className={s.srOnly}>{t(`Quantité - ${product.format}`, `Quantity - ${product.format}`)}</legend>
                      <button type="button" disabled={locked || adding} onClick={() => change(item, item.quantity - 1)} aria-label={item.quantity === 1 ? t(`Supprimer ${product.name} ${product.format}`, `Remove ${product.name} ${product.format}`) : t(`Diminuer la quantité ${product.format}`, `Decrease ${product.format} quantity`)}><Icon name={item.quantity === 1 ? "trash" : "minus"} size={17} /></button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button type="button" disabled={locked || adding || item.quantity >= Math.min(5, limit)} onClick={() => change(item, item.quantity + 1)} aria-label={t(`Augmenter la quantité ${product.format}`, `Increase ${product.format} quantity`)}><Icon name="plus" size={17} /></button>
                    </fieldset>
                  </div>
                </div>
              </div>
            </li>
          })}</ul>
        </section>) : <div className={s.empty}><Icon name="bag" size={34} /><h2>{t('Votre panier attend sa première œuvre.', 'Your bag awaits its first creation.')}</h2><p>{t('Deux formats, une même rencontre entre l’art et la mixologie.', 'Two formats, one encounter between art and mixology.')}</p><Link href={path('/oeuvres')}>{t('Découvrir les créations', 'Discover the collection')} <span aria-hidden="true">↗</span></Link></div>}

        {loaded && <section className={`${s.additions} ${items.length ? s.afterGifting : ''}`} aria-label={t('Choisir un format', 'Choose a size')}>
          <p>{t(items.length ? 'Compléter votre sélection' : 'Choisir votre format', items.length ? 'Complete your selection' : 'Choose your size')}</p>
          <div>{cartProducts.filter(p => !items.some(i => i.sku === p.sku)).map(p => p.sku === TEO_ARTWORK_SKU
            ? <Link key={p.sku} href={path(p.href)} className={s.chooseComposition}>{p.name} · {p.format}<span>{money(p.amount)}</span><Icon name="arrow" size={16} /></Link>
            : <button key={p.sku} type="button" onClick={() => add(p.sku)} disabled={locked || adding}>{p.name} · {p.format}<span>{money(p.amount)}</span><Icon name="plus" size={16} /></button>)}</div>
        </section>}

        <PackagingSection locale={locale} options={giftOptions} message={giftMessage} confirmation={giftConfirmation} disabled={locked || adding || !loaded}
          onGift={isGift => { setGiftOptions({ isGift }); if (!isGift) { setGiftMessage(''); setGiftConfirmation(t('L’option cadeau et son message ont été retirés.', 'The gift preference and message have been removed.')) } }}
          onMessage={() => setGiftOpen(true)} />
      </section>

      <aside className={s.right} aria-label={t('Récapitulatif de commande', 'Order summary')}>
        <div className={s.summary}><h2 className={s.summaryTitle}>{groups.length > 1 ? t('Vos commandes', 'Your orders') : t('Votre commande', 'Your order')}</h2>
          {groups.length > 1 && <p className={s.splitNote}>{t('Les articles en stock et les précommandes se règlent séparément. La livraison est calculée pour chaque commande.', 'In-stock items and preorders are paid for separately. Shipping is calculated for each order.')}</p>}
          {groups.length > 1 && giftOptions.isGift && <p className={s.splitNote}>{t('Vos options cadeau s’appliquent à chaque commande.', 'Your gift preferences apply to each order.')}</p>}
          {groups.map(group => {
            const { fulfillment } = group
            const summary = summaries[fulfillment]
            const subtotal = cartSubtotal(group.items)
            const shippingFrance = shippingAmount(subtotal, 'FR')
            const shippingMonaco = shippingAmount(subtotal, 'MC')
            const unavailable = group.items.some(item => limits[item.sku] !== undefined && limits[item.sku] < (totals.get(item.sku) ?? 0))
            const checkoutReady = summary?.checkoutAvailable === true && !unavailable
            const checkoutLabel = fulfillment === 'preorder' ? t('Régler la précommande', 'Pay for the preorder')
              : groups.length > 1 ? t('Régler les articles en stock', 'Pay for in-stock items') : t('Procéder au paiement', 'Proceed to checkout')

            return <section key={fulfillment} className={s.orderGroup} aria-labelledby={`order-${fulfillment}`}>
              <h3 id={`order-${fulfillment}`}>{groupTitle(fulfillment)}</h3>
              <dl className={s.totals}>
                <div><dt>{t('Sous-total', 'Subtotal')}</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>{t('Livraison France / Monaco', 'France / Monaco shipping')}</dt><dd>{shippingFrance === 0 ? t('Offerte', 'Complimentary') : estimateRange(shippingFrance, shippingMonaco)}</dd></div>
                <div><dt>{t('Taxes', 'Tax')}</dt><dd>{t('Incluses', 'Included')}</dd></div>
              </dl>
              <div className={s.total}><span>{t('Total estimé', 'Estimated total')}</span><strong>{estimateRange(subtotal + shippingFrance, subtotal + shippingMonaco)}</strong></div>
              <p className={s.taxNote}>{t('Livraison et détail de la TVA confirmés selon votre adresse.', 'Shipping and the tax breakdown are confirmed using your address.')}</p>
              <form onSubmit={event => void checkout(event, group)}>
                <button className={s.checkout} type="submit" disabled={!loaded || locked || adding || !checkoutReady || statusBlocksCheckout(fulfillment)}>{busy === fulfillment ? t('Ouverture du paiement…', 'Opening checkout…') : checkoutLabel}</button>
              </form>
              {!checkoutReady && <p className={s.pending}>{refreshing ? t('Vérification de la disponibilité…', 'Checking availability…')
                : unavailable ? t('Vérifiez les quantités de cette commande.', 'Check the quantities in this order.')
                  : t('Le paiement est momentanément indisponible.', 'Checkout is temporarily unavailable.')}</p>}
            </section>
          })}
          {error && <p ref={errorRef} tabIndex={-1} role="alert" className={s.error}>{error} <Link href={path('/contact')}>{t('Nous contacter', 'Contact us')}</Link></p>}
          <Link href={path('/oeuvres')} className={s.continue}>{t('Continuer mes achats', 'Continue shopping')}</Link>
          <p className={s.secure}><Icon name="lock" size={13} />{t('Paiement sécurisé par Stripe', 'Secure payment by Stripe')}</p>
        </div>
        <div className={s.services}><h2>{t('Aide & services', 'Help & services')}</h2>
          <details><summary><Icon name="card" /><span><strong>{t('Paiement sécurisé', 'Secure payment')}</strong><small>{t('Vos informations restent protégées', 'Your information stays protected')}</small></span><Icon name="arrow" size={18} /></summary><p>{t('Le paiement est sécurisé par Stripe. Les moyens disponibles sont proposés lors du paiement. Dyane Paris ne conserve pas vos coordonnées bancaires.', 'Payment is secured by Stripe. Available payment methods are shown at checkout. Dyane Paris does not store your card details.')}</p></details>
          <details><summary><Icon name="truck" /><span><strong>{t('Livraison & expédition', 'Shipping & delivery')}</strong><small>{t('Les modalités de votre commande', 'Details for your order')}</small></span><Icon name="arrow" size={18} /></summary><p>{shippingDescription(locale, 'FR')} {shippingDescription(locale, 'MC')} <Link href={path('/contact')}>{t('Échanger avec la Maison', 'Contact the House')}</Link></p></details>
          <details><summary><Icon name="return" /><span><strong>{t('Retours & conditions', 'Returns & conditions')}</strong><small>{t('Les engagements de la Maison', 'The House’s commitments')}</small></span><Icon name="arrow" size={18} /></summary><p>{t('Consultez les conditions applicables à votre achat, à la rétractation et aux éventuelles personnalisations.', 'Read the terms that apply to your purchase, withdrawal rights and any personalisation.')} <Link href={path('/cgv')}>{t('Lire les conditions de vente', 'Read the terms of sale')}</Link></p></details>
        </div>
        <div className={s.alcohol}><strong>{t('Vente réservée aux personnes majeures.', 'For adults of legal drinking age only.')}</strong><p>{t('Une preuve de majorité doit pouvoir être présentée lors de la délivrance. L’abus d’alcool est dangereux pour la santé. À consommer avec modération.', 'Proof of age must be available on delivery. Alcohol abuse is harmful to your health. Please drink responsibly.')}</p><Link href={path('/cgv')}>{t('Conditions générales de vente', 'Terms of sale')}</Link></div>
      </aside>
    </main>
    {giftOpen && <GiftMessageModal message={giftMessage} locale={locale} onClose={() => setGiftOpen(false)} onSave={message => {
      setGiftMessage(normalizeGiftMessage(message))
      if (message) setGiftOptions({ isGift: true })
      setGiftConfirmation(message ? t('Votre message cadeau a été ajouté à votre commande, sans supplément.', 'Your gift message has been added to your order at no extra cost.') : t('Le message cadeau a été supprimé.', 'Your gift message has been removed.'))
    }} />}
    {detailsSku && <ProductDetailsModal sku={detailsSku} locale={locale} onClose={() => setDetailsSku(null)} />}
    {availabilitySku && <AvailabilityModal locale={locale} fulfillment={fulfillmentForSku(availabilitySku)} verified={summaries[fulfillmentForSku(availabilitySku)]?.stockVerified === true} limit={limits[availabilitySku]} refreshing={refreshing} onRefresh={() => setRefresh(value => value + 1)} onClose={() => setAvailabilitySku(null)} />}
    {payment && <EmbeddedPayment key={payment.attemptId} locale={locale} clientSecret={payment.clientSecret} publishableKey={payment.publishableKey}
      attemptId={payment.attemptId} returnPath={payment.returnPath} fulfillmentNote={groupTerms(payment.fulfillment)} onClose={() => setPayment(null)} />}
    <PremiumLoader phase={checkoutLoading.phase} label={t('Ouverture de votre paiement sécurisé', 'Opening your secure checkout')} onCancel={() => checkoutRequest.current?.abort('cancel')} />
    <Footer />
  </div>
}
