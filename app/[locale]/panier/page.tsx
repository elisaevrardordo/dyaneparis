import type { Metadata } from 'next'
import Link from 'next/link'
import BrandWordmark from '@/components/BrandWordmark'
import CartPage from '@/components/cart/CartPage'
import { cartFontVariables } from '@/components/cart/fonts'
import { localizedPath } from '@/i18n/paths'
import { configuredManualVat, shopMode } from '@/lib/stripe/config'
import styles from '@/components/cart/CartPage.module.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mon panier', robots: { index: false, follow: false } }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const en = locale === 'en'
  if (shopMode() !== 'closed') return <CartPage locale={en ? 'en' : 'fr'} manualVatEnabled={Boolean(configuredManualVat())} />

  return <div className={`${styles.page} ${cartFontVariables}`}>
    <header className={styles.header}>
      <Link className={styles.menuLink} href={localizedPath(locale, '/boutique')}>{en ? 'Shop' : 'Boutique'}</Link>
      <Link className={styles.logo} href={localizedPath(locale, '/')} aria-label="Dyane Paris"><BrandWordmark /></Link>
    </header>
    <main className={styles.left}>
      <div className={styles.headingRow}><h1>{en ? 'The Concierge' : 'La Conciergerie'}</h1></div>
      <p className={styles.notice}>{en ? 'The Concierge can help you choose and order your creation.' : 'La Conciergerie vous accompagne dans le choix et la commande de votre création.'}</p>
      <Link className={styles.checkout} href={localizedPath(locale, '/contact')}>{en ? 'Contact the Concierge' : 'Contacter la Conciergerie'}</Link>
      <Link className={styles.continue} href={localizedPath(locale, '/boutique')}>{en ? 'Explore the shop' : 'Découvrir la boutique'}</Link>
    </main>
  </div>
}
