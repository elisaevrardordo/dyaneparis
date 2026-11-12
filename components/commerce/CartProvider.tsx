'use client'
import { formatPrice } from '@/lib/formatPrice'
import Image from 'next/image'
import Link from 'next/link'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { CART_STORAGE_KEY, TEO_COMPOSITIONS, cartProducts, cleanCart, type Personalization, type CartItem } from '@/components/cart/catalog'
import { localizedPath } from '@/i18n/paths'
import { fulfillmentForSku } from '@/lib/orders/fulfillment'
import CommerceDialog from './CommerceDialog'
import PremiumLoader, { useLoadingGate } from './PremiumLoader'
import s from './Commerce.module.css'

type CartContextValue = { items: CartItem[]; loaded: boolean; storageError: boolean; adding: boolean; setItems: (items: CartItem[]) => void;
  add: (sku: string, personalization?: Personalization, confirmation?: boolean, composition?: CartItem['composition']) => Promise<boolean> }
const CartContext = createContext<CartContextValue | null>(null)
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('Cart provider required'); return context }
export default function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const en = locale === 'en'
  const [items, updateItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState<CartItem | null>(null)
  const [error, setError] = useState('')
  const request = useRef<AbortController | null>(null)
  const working = useRef(false)
  const loading = useLoadingGate()
  useEffect(() => {
    try { updateItems(cleanCart(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'))) } catch { setStorageError(true) }
    setLoaded(true)
    const storage = (event: StorageEvent) => { if (event.key === CART_STORAGE_KEY) { try { updateItems(cleanCart(JSON.parse(event.newValue || '[]'))) } catch { setStorageError(true) } } }
    window.addEventListener('storage', storage)
    return () => { request.current?.abort(); window.removeEventListener('storage', storage) }
  }, [])
  useEffect(() => { if (loaded) { try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)) } catch { setStorageError(true) } } }, [items, loaded])
  useEffect(() => { if (pathname) { setAdded(null); setError('') } }, [pathname])
  function setItems(next: CartItem[]) { if (!working.current) updateItems(cleanCart(next)) }
  async function add(sku: string, personalization?: Personalization, confirmation = true, composition?: CartItem['composition']) {
    if (working.current || !loaded) return false
    const [selection] = cleanCart([{ sku, quantity: 1, ...(personalization !== undefined ? { personalization } : {}),
      ...(composition !== undefined ? { composition } : {}) }])
    if (!selection) return false
    working.current = true; setAdding(true); setError('')
    const controller = new AbortController(); request.current = controller
    const timeout = setTimeout(() => controller.abort('timeout'), 15_000)
    let success = false
    try {
      loading.start()
      let current = items
      try { current = cleanCart(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || JSON.stringify(items))) } catch { setStorageError(true) }
      const total = current.filter(item => item.sku === sku).reduce((sum, item) => sum + item.quantity, 0)
      if (total >= 5) throw new Error('limit')
      const next = cleanCart([...current, selection])
      const fulfillment = fulfillmentForSku(sku)
      const group = next.filter(item => fulfillmentForSku(item.sku) === fulfillment)
      const response = await fetch('/api/stripe/cart-summary', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: group, flow: 'commerce' }), signal: controller.signal })
      if (!response.ok) throw new Error('unverified')
      const result = await response.json()
      const totals = new Map<string, number>()
      for (const item of group) totals.set(item.sku, (totals.get(item.sku) || 0) + item.quantity)
      if (result.stockVerified !== true || !result.limits || [...totals].some(([key, quantity]) => !Number.isInteger(result.limits[key]) || result.limits[key] < quantity)) throw new Error('availability')
      controller.signal.throwIfAborted()
      // A successful availability check adds to the bag; stock is reserved only by Checkout.
      try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next)) } catch { setStorageError(true) }
      updateItems(next); success = true
    } catch (cause) {
      if (confirmation && controller.signal.reason !== 'cancel') setError(cause instanceof Error && cause.message === 'limit'
        ? (en ? 'A maximum of five pieces per size can be selected. Contact the Concierge for a larger order.' : 'Vous pouvez sélectionner cinq pièces par format. Pour une commande plus importante, contactez la Conciergerie.')
        : (en ? 'Availability could not be confirmed for your selection. Your bag has been preserved. Please try again or contact the Concierge.' : 'La disponibilité de votre sélection n’a pas pu être confirmée. Votre panier est conservé. Réessayez ou contactez la Conciergerie.'))
    } finally {
      clearTimeout(timeout)
      await loading.finish()
      setAdding(false); working.current = false; request.current = null
      if (success && !controller.signal.aborted && confirmation) setAdded(selection)
    }
    return success
  }
  const product = cartProducts.find(p => p.sku === added?.sku)
  return <CartContext.Provider value={{ items, loaded, storageError, adding, setItems, add }}>{children}
    <PremiumLoader phase={loading.phase} label={en ? 'Preparing your selection' : 'Votre sélection se prépare'} onCancel={() => request.current?.abort('cancel')} />
    {product && added && <CommerceDialog title={en ? 'Added to your bag' : 'Ajouté à votre panier'} kind="added" closeLabel={en ? 'Close added item' : 'Fermer la confirmation d’ajout'} onClose={() => setAdded(null)}>
      <div className={s.addedBody}><div className={s.addedImage}><Image src={product.image} alt={`${product.name} - ${product.format}`} fill sizes="180px" /></div><div className={s.addedDescription}><h3>{product.name}</h3><p>{product.format} · {formatPrice(product.amount, locale)}</p>{added.composition && <p>{TEO_COMPOSITIONS[added.composition]}</p>}</div><Link className={s.primary} href={localizedPath(locale, '/panier')} onClick={() => setAdded(null)}>{en ? 'View my bag' : 'Voir mon panier'}</Link><button type="button" className={s.secondary} onClick={() => setAdded(null)}>{en ? 'Continue shopping' : 'Continuer mes achats'}</button><p className={s.addedNote}>{en ? 'Availability is checked again at checkout.' : 'La disponibilité est revérifiée au paiement.'}</p></div>
    </CommerceDialog>}
    {error && !adding && <CommerceDialog title={en ? 'Availability of this item' : 'Disponibilité de votre sélection'} onClose={() => setError('')} closeLabel={en ? 'Close availability' : 'Fermer la disponibilité'}><div className={s.noticeCopy}><p>{error}</p><Link href={localizedPath(locale, '/contact')}>{en ? 'Contact the Concierge' : 'Contacter la Conciergerie'}</Link></div></CommerceDialog>}
  </CartContext.Provider>
}
