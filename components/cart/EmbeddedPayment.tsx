'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { cartFontVariables } from './fonts'
import styles from './EmbeddedPayment.module.css'

type Address = { name: string; address: { country: string; line1: string; line2: string | null; city: string; postal_code: string; state: string } }
type Amount = { amount: string; minorUnitsAmount: number }
type ShippingOption = { id: string; displayName: string | null }
type Session = {
  id: string
  shippingOptions: ShippingOption[]
  shipping: { shippingOption: ShippingOption } | null
  total: { shippingRate: Amount; total: Amount }
}
type Result<T> = { type: 'success'; session: T } | { type: 'error'; error: { message: string } }
type Actions = {
  getSession(): Session
  runServerUpdate(update: () => Promise<void>): Promise<Result<Session>>
  updateShippingOption(id: string): Promise<Result<Session>>
  confirm(options: { email: string }): Promise<Result<Session>>
}
type PaymentElement = { mount(element: HTMLElement): void; destroy(): void }
type AddressElement = PaymentElement & { unmount(): void; getValue(): Promise<{ complete: boolean; value: Address }> }
type StripeConstructor = (key: string, options: { locale: 'fr' | 'en' }) => {
  initCheckoutElementsSdk(options: {
    clientSecret: string
    elementsOptions: {
      appearance: { variables: Record<string, string> }
      fonts: { family: string; src: string; weight: string; display: 'swap' }[]
    }
  }): {
    createShippingAddressElement(): AddressElement
    createPaymentElement(): PaymentElement
    loadActions(): Promise<{ type: 'success'; actions: Actions } | { type: 'error' }>
  }
}
type Props = {
  locale: 'fr' | 'en'
  clientSecret: string
  publishableKey: string
  attemptId: string
  returnPath: string
  fulfillmentNote?: string
  onClose(): void
}

let stripeScript: Promise<StripeConstructor> | undefined

function loadStripe() {
  const browser = window as Window & { Stripe?: StripeConstructor }
  if (browser.Stripe) return Promise.resolve(browser.Stripe)
  stripeScript ??= new Promise<StripeConstructor>((resolve, reject) => {
    const script = document.createElement('script')
    const failure = () => {
      clearTimeout(timeout)
      script.remove()
      reject(new Error('Stripe.js unavailable'))
    }
    const timeout = window.setTimeout(failure, 15_000)
    script.src = 'https://js.stripe.com/endive/stripe.js'
    script.async = true
    script.addEventListener('load', () => {
      if (!browser.Stripe) return failure()
      clearTimeout(timeout)
      resolve(browser.Stripe)
    }, { once: true })
    script.addEventListener('error', failure, { once: true })
    document.head.appendChild(script)
  }).catch(error => {
    stripeScript = undefined
    throw error
  })
  return stripeScript
}

export default function EmbeddedPayment({ locale, clientSecret, publishableKey, attemptId, returnPath, fulfillmentNote, onClose }: Props) {
  const titleId = useId()
  const en = locale === 'en'
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [fatal, setFatal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<Session | null>(null)
  const [manualQuote, setManualQuote] = useState<{ amount: number; vat: number } | null>(null)
  const money = (cents: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100)
  const addressMount = useRef<HTMLDivElement>(null)
  const paymentMount = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const addressTitle = useRef<HTMLHeadingElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const sdk = useRef<{ actions: Actions; address: AddressElement; payment: PaymentElement } | null>(null)
  const addressMounted = useRef(false)
  const paymentMounted = useRef(false)
  const actionPending = useRef(false)
  const cancellation = useRef<AbortController | null>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!mounted) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const controller = new AbortController()
    cancellation.current = controller
    let address: AddressElement | undefined
    let payment: PaymentElement | undefined
    async function initialize() {
      try {
        if (!/^pk_(test|live)_\S+$/.test(publishableKey)) throw new Error('Invalid Stripe public key')
        const stripe = await loadStripe()
        if (controller.signal.aborted) return
        const fontDirectory = new URL('/images/newsletter/fonts/', window.location.origin)
        const checkout = stripe(publishableKey, { locale }).initCheckoutElementsSdk({
          clientSecret,
          elementsOptions: {
            fonts: [
              { family: 'Jost', src: `url(${new URL('jost-light.woff2', fontDirectory)}) format("woff2")`, weight: '300', display: 'swap' },
              { family: 'Jost', src: `url(${new URL('jost-medium.woff2', fontDirectory)}) format("woff2")`, weight: '500', display: 'swap' },
            ],
            appearance: {
              variables: {
                borderRadius: '0px',
                colorPrimary: '#202020',
                colorText: '#202020',
                fontFamily: 'Jost, sans-serif',
                fontSizeBase: '16px',
                fontWeightNormal: '300',
                fontWeightMedium: '500',
              },
            },
          },
        })
        const loaded = await checkout.loadActions()
        if (controller.signal.aborted || !addressMount.current) return
        if (loaded.type !== 'success') throw new Error('Stripe Checkout unavailable')
        address = checkout.createShippingAddressElement()
        payment = checkout.createPaymentElement()
        address.mount(addressMount.current)
        addressMounted.current = true
        sdk.current = { address, payment, actions: loaded.actions }
        setReady(true)
      } catch {
        if (!controller.signal.aborted) setFatal(true)
      }
    }
    void initialize()
    return () => {
      controller.abort()
      sdk.current = null
      addressMounted.current = false
      paymentMounted.current = false
      address?.destroy()
      payment?.destroy()
    }
  }, [clientSecret, locale, mounted, publishableKey])

  useEffect(() => {
    if (!sdk.current) return
    try {
      if (!summary) {
        if (addressMount.current && !addressMounted.current) {
          sdk.current.address.mount(addressMount.current)
          addressMounted.current = true
          addressTitle.current?.focus()
        }
        return
      }
      if (!paymentMount.current) return
      if (!paymentMounted.current) {
        sdk.current.payment.mount(paymentMount.current)
        paymentMounted.current = true
      }
      emailInput.current?.focus()
    } catch { setFatal(true) }
  }, [summary])

  async function confirmShipping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const signal = cancellation.current?.signal
    if (!sdk.current || actionPending.current || !signal || signal.aborted) return
    const { actions, address } = sdk.current
    actionPending.current = true
    setBusy(true)
    setError('')
    let rejectedDestination = false
    try {
      const { complete, value: { name, address: shippingAddress } } = await address.getValue()
      if (!complete) {
        setError(en ? 'Please complete the delivery address.' : 'Veuillez compléter l’adresse de livraison.')
        return
      }
      let quote: { amount: number; vat: number } | undefined
      const updated = await actions.runServerUpdate(async () => {
        const response = await fetch('/api/stripe/shipping', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
          body: JSON.stringify({ attemptId, sessionId: actions.getSession().id, shippingDetails: { name, address: shippingAddress } }),
        })
        rejectedDestination = response.status === 422
        if (!response.ok) throw new Error('Shipping update failed')
        quote = (await response.json()).manualQuote
      })
      if (rejectedDestination || updated.type !== 'success') throw new Error('Shipping update failed')
      const manual = quote && Number.isSafeInteger(quote.amount) && Number.isSafeInteger(quote.vat) ? quote : null
      if (!manual) {
        const [option] = updated.session.shippingOptions
        if (!option || updated.session.shippingOptions.length !== 1) throw new Error('No applicable shipping option')
        const selected = updated.session.shipping?.shippingOption.id === option.id
          ? updated : await actions.updateShippingOption(option.id)
        if (selected.type !== 'success') throw new Error('Shipping selection failed')
      }
      if (!signal.aborted) {
        // Stripe requires the shipping element to be unmounted when the server manages the address.
        address.unmount()
        addressMounted.current = false
        setManualQuote(manual)
        setSummary(actions.getSession())
      }
    } catch {
      if (!signal.aborted) setError(rejectedDestination
        ? (en ? 'We deliver only to metropolitan France and Monaco. Please check your address.' : 'Nous livrons uniquement en France métropolitaine et à Monaco. Veuillez vérifier votre adresse.')
        : (en ? 'Delivery could not be confirmed. Please try again.' : 'La livraison n’a pas pu être confirmée. Veuillez réessayer.'))
    } finally {
      actionPending.current = false
      if (!signal.aborted) setBusy(false)
    }
  }

  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const signal = cancellation.current?.signal
    if (!sdk.current || !summary || !emailInput.current || actionPending.current || !signal || signal.aborted) return
    actionPending.current = true
    setBusy(true)
    setError('')
    try {
      const path = returnPath.replace('{CHECKOUT_SESSION_ID}', encodeURIComponent(summary.id))
      const returnUrl = new URL(path, window.location.origin)
      if (!path.startsWith('/') || returnUrl.origin !== window.location.origin) throw new Error('Invalid checkout return URL')
      // The Checkout Session already supplies the return URL to Stripe.
      const result = await sdk.current.actions.confirm({ email: emailInput.current.value.trim() })
      if (signal.aborted) return
      if (result.type === 'error') setError(result.error.message)
      else window.location.assign(returnUrl.href)
    } catch {
      if (!signal.aborted) setError(en ? 'Payment could not be confirmed. Please try again.' : 'Le paiement n’a pas pu être confirmé. Veuillez réessayer.')
    } finally {
      actionPending.current = false
      if (!signal.aborted) setBusy(false)
    }
  }

  function navigateDialog(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && !actionPending.current) {
      event.preventDefault()
      onClose()
    }
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), iframe'))
      .filter(control => control.getClientRects().length > 0)
    const first = controls[0], last = controls[controls.length - 1]
    if ((event.shiftKey && event.target === first) || (!event.shiftKey && event.target === last)) {
      event.preventDefault()
      const nextControl = event.shiftKey ? last : first
      nextControl?.focus()
    }
  }

  if (!mounted) return null
  return createPortal(
    <div className={`${styles.overlay} ${cartFontVariables}`}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.panel} onKeyDown={navigateDialog}>
        <header className={styles.header}>
          <h2 id={titleId}>{en ? 'Secure payment' : 'Paiement sécurisé'}</h2>
          <button ref={closeButton} type="button" className={styles.close} onClick={onClose} disabled={busy}
            aria-label={en ? 'Close payment' : 'Fermer le paiement'}>×</button>
        </header>
        <div className={styles.content}>
          {fulfillmentNote && <p className={styles.note}>{fulfillmentNote}</p>}
          {fatal && <p role="alert" className={styles.error}>{en ? 'Payment is temporarily unavailable. Your bag is saved.' : 'Le paiement est momentanément indisponible. Votre panier est conservé.'}</p>}
          {!ready && !fatal && <p role="status" className={styles.note}>{en ? 'Opening Stripe…' : 'Ouverture de Stripe…'}</p>}
          <form hidden={!!summary || fatal} onSubmit={confirmShipping}>
            <h3 ref={addressTitle} tabIndex={-1}>{en ? 'Delivery address' : 'Adresse de livraison'}</h3>
            <div ref={addressMount} />
            {ready && <button type="submit" className={styles.primary} disabled={busy}>{busy ? (en ? 'Checking…' : 'Vérification…') : (en ? 'Confirm delivery address' : 'Confirmer l’adresse de livraison')}</button>}
          </form>
          <form hidden={!summary || fatal} onSubmit={pay}>
            {summary && <>
              <dl className={styles.totals}>
                <div><dt>{summary.shipping?.shippingOption.displayName ?? (en ? 'Shipping' : 'Livraison')}</dt><dd>{(manualQuote?.amount ?? summary.total.shippingRate.minorUnitsAmount) === 0 ? (en ? 'Complimentary' : 'Offerte') : manualQuote ? money(manualQuote.amount) : summary.total.shippingRate.amount}</dd></div>
                {manualQuote && <div><dt>{en ? 'VAT included (20%)' : 'Dont TVA (20 %)'}</dt><dd>{money(manualQuote.vat)}</dd></div>}
                <div><dt>{en ? 'Total including tax' : 'Total TTC'}</dt><dd>{summary.total.total.amount}</dd></div>
              </dl>
              <button type="button" disabled={busy} className={styles.edit} onClick={() => {
                setSummary(null)
                setError('')
              }}>{en ? 'Edit delivery address' : 'Modifier l’adresse de livraison'}</button>
              <h3>{en ? 'Payment details' : 'Informations de paiement'}</h3>
              <label className={styles.email}>{en ? 'Email address' : 'Adresse e-mail'}<input ref={emailInput} type="email" autoComplete="email" required /></label>
            </>}
            <div ref={paymentMount} />
            {summary && <button type="submit" className={styles.primary} disabled={busy}>{busy ? (en ? 'Confirming…' : 'Confirmation…') : (en ? `Pay ${summary.total.total.amount}` : `Payer ${summary.total.total.amount}`)}</button>}
          </form>
          {error && <p role="alert" className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>, document.body,
  )
}
