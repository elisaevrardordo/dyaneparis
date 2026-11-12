import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { finishLabel, personalizationNotice } from '@/lib/personalization/catalog'
import { localizedPath } from '@/i18n/paths'
import { fulfillmentForSku, preorderTerms } from '@/lib/orders/fulfillment'
import ProductPageClosing from '@/components/product/ProductPageClosing'
import { PersonalizeButton, SculpturePreview, type PersonalizableProduct as Product } from './PersonalizationDrawer'
import s from './PersonalizableCollection.module.css'

export default function PersonalizableProduct({ product, locale, sandboxCartEnabled, liveCartEnabled = false }: {
  product: Product; locale: 'fr' | 'en'; sandboxCartEnabled: boolean; liveCartEnabled?: boolean
}) {
  const en = locale === 'en'
  const canPurchase = sandboxCartEnabled || liveCartEnabled
  const preorder = fulfillmentForSku(product.sku) === 'preorder'
  const path = (value: string) => localizedPath(locale, value)
  return <main className={s.page}><div className={s.detail}>
    <div className={s.detailPhoto}><SculpturePreview product={product} example={false} locale={locale} priority /></div>
    <div className={s.detailInfo}>
      <Link className={s.breadcrumb} href={path('/personnalisables')}>{en ? 'THE PERSONALISABLES' : 'LES PERSONNALISABLES'}</Link>
      <h1>{product.name.toUpperCase()}</h1><p className={s.format}>{product.format}</p>
      <p className={s.price}>{product.amount === null ? (en ? 'On request' : 'Sur demande') : formatPrice(product.amount, locale)}{preorder && <small> {en ? 'incl. VAT' : 'TTC'}</small>}</p>
      {preorder && <p className={s.detailNotice}>{preorderTerms(locale, canPurchase)}</p>}
      <p className={s.detailDescription}>{en ? 'The Dyane silhouette, with your signature. Choose up to three initials in the finish of your choice to make your porcelain sculpture a personal gift.' : 'La silhouette Dyane, votre signature. Jusqu’à trois initiales, dans la finition de votre choix, pour faire de votre sculpture en porcelaine une attention personnelle.'}</p>
      <PersonalizeButton sku={product.sku} locale={locale} showPreorderTerms={preorder} conciergeOnly={!canPurchase} />
      <p className={s.detailNotice}>{personalizationNotice(locale)}</p>
      {!liveCartEnabled && <p className={s.detailNotice}>{sandboxCartEnabled
        ? (en ? 'Online purchasing is not open yet. Your selection can be saved in your bag.' : 'L’achat en ligne n’est pas encore ouvert. Votre sélection peut être conservée dans le panier.')
        : <Link href={path('/contact')}>{en ? 'Contact the Concierge' : 'Contacter la Conciergerie'}</Link>}</p>}
      <dl className={s.details}><div><dt>{en ? 'Initials' : 'Initiales'}</dt><dd>{en ? '1 to 3 letters' : '1 à 3 lettres'}</dd></div><div><dt>{en ? 'Finish' : 'Finition'}</dt><dd>{product.personalization.finishes.map(finish => finishLabel(finish, locale)).join(' / ')}</dd></div><div><dt>{en ? 'Personalisation' : 'Personnalisation'}</dt><dd>{product.amount === null ? (en ? 'On request' : 'Sur demande') : (en ? 'Included' : 'Offerte')}</dd></div></dl>
      <div className={s.bespokeInvite}><h2>{en ? 'ONE WORK, A THOUSAND POSSIBILITIES' : 'UNE ŒUVRE, MILLE POSSIBILITÉS'}</h2><p>{en ? 'What if we imagined your dream Christmas gift together?' : 'Et si nous imaginions ensemble votre cadeau de Noël rêvé ?'}</p><Link className={s.outline} href={path('/votre-cadeau-de-noel-reve')}>{en ? 'CREATE MY BESPOKE GIFT' : 'CRÉER MON CADEAU SUR MESURE'}</Link></div>
    </div>
  </div>
    <ProductPageClosing locale={locale} currentSku={product.sku} />
  </main>
}
