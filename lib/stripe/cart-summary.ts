import 'server-only'
import { cartProducts, cartSubtotal, type CartItem } from '@/components/cart/catalog'
import { shippingAmount } from '@/lib/shipping'
import { orderPool } from './store'
import { assertCheckoutAccount, assertManualVatReady, configuredManualVat, checkoutUsesAutomaticTax, checkoutConfig, commerceCheckoutConfig, stripeClient } from './config'
import { isManualVatCocktail } from './manualVat'
import { isProductionDeployment, orderDatabaseUrl } from '../deployment'
import { fulfillmentForSku, isSingleFulfillment } from '@/lib/orders/fulfillment'

export async function cartSummary(items: CartItem[], commerce = false) {
  const subtotal = cartSubtotal(items)
  const shipping = shippingAmount(subtotal)
  const result: { subtotal: number; shipping: number; total: number; tax: null;
    checkoutAvailable: boolean; stockVerified: boolean; limits: Record<string, number>; mode?: 'test' | 'live' } = {
    subtotal, shipping, total: subtotal + shipping, tax: null, checkoutAvailable: false, stockVerified: false, limits: {},
  }
  const fulfillment = commerce ? fulfillmentForSku(items[0].sku) : undefined
  if (commerce) result.mode = isProductionDeployment() ? 'live' : 'test'
  const manualVat = commerce ? configuredManualVat() : undefined
  if (fulfillment && !isSingleFulfillment(items, fulfillment)) return result
  if (manualVat && !items.every(item => isManualVatCocktail(item.sku))) return result
  if (orderDatabaseUrl()) {
    try {
      const stock = await orderPool().query<{ sku: string; available: number; active: boolean; preorder_enabled?: boolean }>(
        fulfillment === 'preorder'
          ? 'SELECT sku,available,active,preorder_enabled FROM dyane_checkout_inventory WHERE sku=ANY($1::text[])'
          : 'SELECT sku,available,active FROM dyane_checkout_inventory WHERE sku=ANY($1::text[])', [items.map(i => i.sku)])
      result.stockVerified = true
      for (const item of items) {
        const row = stock.rows.find(r => r.sku === item.sku)
        result.limits[item.sku] = row?.active ? (fulfillment === 'preorder' ? (row.preorder_enabled ? 5 : 0) : Math.min(5, row.available)) : 0
      }
    } catch { return result }
  }
  try {
    const config = commerce ? commerceCheckoutConfig() : checkoutConfig()
    if (config.livemode && !commerce) return result
    const stripe = stripeClient(config.key)
    const automaticTax = !manualVat && checkoutUsesAutomaticTax(config.livemode, commerce)
    await assertCheckoutAccount(stripe, config.account, config.livemode, automaticTax)
    if (manualVat) await assertManualVatReady(stripe, manualVat, config.livemode)
    const inventory = await orderPool().query<{ sku: string; price_id: string }>(
      'SELECT sku,price_id FROM dyane_checkout_inventory WHERE sku=ANY($1::text[]) AND active', [items.map(i => i.sku)])
    for (const item of items) {
      const row = inventory.rows.find(r => r.sku === item.sku)
      if (!row) return result
      const price = await stripe.prices.retrieve(row.price_id, { expand: ['product'] })
      const product = typeof price.product === 'string' ? null : price.product
      if (!price.active || price.livemode !== config.livemode || price.type !== 'one_time' || price.currency !== 'eur'
        || price.tax_behavior !== 'inclusive' || price.unit_amount !== cartProducts.find(p => p.sku === item.sku)?.amount
        || !product || product.deleted || !product.active
        || (automaticTax && (!product.tax_code || product.tax_code === 'txcd_00000000'))) return result
    }
    const totals = new Map<string, number>()
    for (const item of items) totals.set(item.sku, (totals.get(item.sku) || 0) + item.quantity)
    result.checkoutAvailable = [...totals].every(([sku, quantity]) => result.limits[sku] >= quantity)
    // An exact Tax breakdown requires the buyer's address, collected by hosted Checkout.
  } catch { /* Keep checkout closed if Stripe or the catalogue cannot be verified. */ }
  return result
}
