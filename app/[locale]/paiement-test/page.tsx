import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SandboxCheckout from '@/components/checkout/SandboxCheckout'
import { isProductionDeployment } from '@/lib/deployment'
import { checkoutConfig } from '@/lib/stripe/config'
import { orderPool } from '@/lib/stripe/store'
import { localizedPath } from '@/i18n/paths'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stripe - Sandbox', robots: { index: false, follow: false } }

export default async function SandboxPage({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ result?: string }>
}) {
  if (isProductionDeployment()) notFound()
  const { locale } = await params
  const { result } = await searchParams
  const english = locale === 'en'
  let items: { sku: string; label: string }[] = []
  let configured = false
  try {
    checkoutConfig()
    items = (await orderPool().query<{ sku: string; label: string }>(
      'SELECT sku, label FROM dyane_checkout_inventory WHERE active AND available > 0 ORDER BY label',
    )).rows
    configured = true
  } catch { /* Missing configuration keeps checkout closed. */ }
  return <main style={{ maxWidth: 640, margin: '160px auto 80px', padding: 24 }}>
    <h1>{english ? 'Test payment' : 'Paiement de test'}</h1>
    <p>{english ? 'Stripe sandbox - no real payment or shipment. The final test price and shipping charges are shown on Stripe.' : 'Environnement de test Stripe - aucun paiement réel ni expédition. Le montant de test et les frais de livraison sont affichés sur Stripe.'}</p>
    {result === 'returned' && <p role="status">{english ? 'You have returned from Stripe. Please confirm your test payment status with the Concierge.' : 'Vous êtes de retour de Stripe. La Conciergerie pourra vous confirmer le statut du paiement de test.'}</p>}
    {result === 'cancelled' && <p role="status">{english ? 'Checkout interrupted. Your stock reservation ends when the Stripe session expires.' : 'Paiement interrompu. La réservation du stock prend fin à l’expiration de la session Stripe.'}</p>}
    {configured && items.length > 0
      ? <SandboxCheckout items={items} locale={english ? 'en' : 'fr'} />
      : <p>{english ? 'Test checkout is not configured yet.' : 'Le paiement de test n’est pas encore configuré.'}</p>}
    <p style={{ marginTop: 32 }}><Link href={localizedPath(locale, '/contact')}>{english ? 'Contact the Concierge' : 'Contacter la Conciergerie'}</Link></p>
  </main>
}
