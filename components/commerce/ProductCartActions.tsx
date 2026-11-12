'use client'
import { formatPrice } from '@/lib/formatPrice'
import { PersonalizeButton } from '@/components/personalization/PersonalizationDrawer'
import { cartProducts, validateComposition, type Composition } from '@/components/cart/catalog'
import { useCart } from './CartProvider'
import s from './Commerce.module.css'
export default function ProductCartActions({ locale, className = '', showPrice = false, sku = 'dyane-sculpture-150cl', composition, sandbox = true }: {
  sku?: string; locale: 'fr' | 'en'; className?: string; showPrice?: boolean; composition?: Composition; sandbox?: boolean
}) {
  const product = cartProducts.find(item => item.sku === sku)!
  const cart = useCart()
  const en = locale === 'en'
  const addLabel = en ? 'ADD TO BAG' : 'AJOUTER AU PANIER'
  const addingLabel = en ? 'ADDING…' : 'AJOUT EN COURS…'

  return <section className={`${s.productActions} ${className}`} aria-label={en ? 'Your selection' : 'Votre sélection'}>
    {sandbox && <p>{en ? 'SANDBOX · NO REAL PURCHASE' : 'SANDBOX · AUCUN ACHAT RÉEL'}</p>}
    {showPrice && <p data-selected-price aria-live="polite">{formatPrice(product.amount, locale)}</p>}
    <button type="button" className={s.primary} onClick={() => cart.add(sku, undefined, true, composition)} disabled={!cart.loaded || cart.adding || !validateComposition(sku, composition)}>
      {cart.adding ? addingLabel : addLabel}
    </button>
    {product.personalization.enabled && <PersonalizeButton sku={sku} locale={locale} className={s.secondary} label={en ? 'Personalise' : 'Personnaliser'} />}
  </section>
}
