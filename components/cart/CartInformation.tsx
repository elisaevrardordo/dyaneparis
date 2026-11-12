'use client'
import { formatPrice } from '@/lib/formatPrice'
import { preorderTerms, type Fulfillment } from '@/lib/orders/fulfillment'
import { shippingDeliveryDescription } from '@/lib/shipping'
import Image from 'next/image'
import Link from 'next/link'
import { cartProducts } from './catalog'
import { localizedPath } from '@/i18n/paths'
import CommerceDialog from '@/components/commerce/CommerceDialog'
import s from '@/components/commerce/Commerce.module.css'

export function ProductDetailsModal({ sku, locale, onClose }: { sku: string; locale: 'fr' | 'en'; onClose: () => void }) {
  const product = cartProducts.find(p => p.sku === sku)
  if (!product) return null
  const en = locale === 'en'
  return <CommerceDialog title={en ? 'Product details' : 'Détails de la sculpture'} kind="product" closeLabel={en ? 'Close product details' : 'Fermer les détails produit'} onClose={onClose}><div className={s.productGrid}><div className={s.productVisual}><Image src={product.image} alt={`${product.name} - ${product.format}`} fill sizes="(max-width: 760px) 100vw, 30vw" priority /></div><div className={s.productCopy}><h3>{product.name}</h3><p className={s.productPrice}>{formatPrice(product.amount, locale)}</p><div className={s.productFacts}><dl><div><dt>{en ? 'Size' : 'Format'}</dt><dd>{product.format}</dd></div><div><dt>{en ? 'Creation' : 'Création'}</dt><dd>{product.name} - {product.sku.startsWith('dyane-no2-') ? 'Basil Smash' : (en ? 'Inspired by the Pornstar Martini, 24% vol.' : 'Inspiré du Pornstar Martini, 24 % vol.')}</dd></div></dl><ul><li>{en ? 'Hand-painted porcelain sculpture' : 'Sculpture en porcelaine peinte à la main'}</li><li>{en ? 'Ready-to-serve cocktail, crafted and bottled in France' : 'Cocktail prêt à servir, élaboré et embouteillé en France'}</li><li>{product.sku.startsWith('dyane-no2-') ? (en ? 'Gin, basil and yuzu, wild elderflower, house-made sour' : 'Gin, basilic et yuzu, sureau sauvage, sour maison') : (en ? 'French artisanal vodka, vanilla and passion fruit' : 'Vodka artisanale française, vanille et fruit de la passion')}</li><li>{en ? 'A piece to keep after tasting' : 'Une œuvre à conserver après la dégustation'}</li></ul><p className={s.status}>{en ? 'Test catalogue. Photographs from the Maison. See the product page for details.' : 'Catalogue de test. Photographies de la Maison. Retrouvez les informations sur la fiche produit.'}</p></div><Link className={s.primary} href={localizedPath(locale, product.href)}>{en ? 'View product page' : 'Voir la page produit'}</Link></div></div></CommerceDialog>
}
export function AvailabilityModal({ locale, fulfillment, verified, limit, refreshing, onRefresh, onClose }: {
  locale: 'fr' | 'en'; fulfillment: Fulfillment; verified: boolean; limit?: number
  refreshing: boolean; onRefresh: () => void; onClose: () => void
}) {
  const en = locale === 'en'
  const preorder = fulfillment === 'preorder'
  const available = verified && (limit ?? 0) > 0
  const status = !verified
    ? (en ? 'Availability cannot currently be confirmed.' : 'La disponibilité ne peut pas être confirmée pour le moment.')
    : available
      ? (en ? 'This size is in stock. Stock is reserved when your payment session is opened.' : 'Ce format est en stock. La réservation intervient à l’ouverture du paiement.')
      : (en ? 'This size cannot be ordered at the moment.' : 'Ce format ne peut pas être commandé pour le moment.')

  return <CommerceDialog title={en ? 'Availability of this item' : 'Disponibilité de cette création'} onClose={onClose} closeLabel={en ? 'Close availability' : 'Fermer la disponibilité'}>
    <div className={s.noticeCopy}>
      {(!preorder || !available) && <p>{status}</p>}
      <p className={s.status}>{preorder ? preorderTerms(locale) : shippingDeliveryDescription(locale, false)}</p>
      <div className={s.noticeActions}>
        <button type="button" className={s.textButton} onClick={onRefresh} disabled={refreshing}>{refreshing ? (en ? 'Checking…' : 'Vérification…') : (en ? 'Check again' : 'Vérifier à nouveau')}</button>
        <Link href={localizedPath(locale, '/contact')}>{en ? 'Contact the Concierge' : 'Contacter la Conciergerie'}</Link>
      </div>
    </div>
  </CommerceDialog>
}
