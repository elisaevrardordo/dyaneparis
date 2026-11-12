import nextEnv from '@next/env'
import Stripe from 'stripe'
import { Pool } from 'pg'
import { readFileSync } from 'node:fs'
import stripeModules from '../tests/helpers/load-stripe.cjs'

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} })
const catalog = JSON.parse(readFileSync('data/stripe-sandbox-catalog.json', 'utf8'))
const report = { mode: 'sandbox', application: {}, stripe: {}, database: {} }
const { shippingAmount } = stripeModules.load('lib/shipping.ts')
report.application.shipping = {
  country: 'FR', currency: 'eur', taxBehavior: 'inclusive', source: 'checkout_session',
  amountCentsAt200Euros: shippingAmount(20_000), amountCentsAboveThreshold: shippingAmount(20_001),
  remoteCheckoutVerified: false,
}
const key = process.env.STRIPE_SECRET_KEY || ''
report.application.testKeyPresent = /^(rk|sk)_test_\S+$/.test(key)
report.application.webhookSecretPresent = /^whsec_\S+$/.test(process.env.STRIPE_WEBHOOK_SECRET || '')
report.application.checkoutEnabled = process.env.STRIPE_CHECKOUT_ENABLED === 'true'
if (report.application.testKeyPresent) {
  const stripe = new Stripe(key, { apiVersion: '2026-10-28.endive', maxNetworkRetries: 0, timeout: 10_000 })
  for (const [name, operation] of Object.entries({
    account: async () => ({ matches: (await stripe.accounts.retrieve(null)).id === catalog.account }),
    tax: async () => {
      const settings = await stripe.tax.settings.retrieve()
      const regs = await stripe.tax.registrations.list({ status: 'active', limit: 100 })
      return { status: settings.status, headOfficePresent: !!settings.head_office,
        activeFrenchRegistration: regs.data.some(r => r.country === 'FR' && !r.livemode) }
    },
    prices: async () => Promise.all(catalog.products.map(async item => {
      const p = await stripe.prices.retrieve(item.priceId, { expand: ['product'] })
      return { sku: item.sku, matches: !p.livemode && p.active && p.currency === 'eur' && p.unit_amount === item.unitAmount
        && p.tax_behavior === 'inclusive', taxCodePresent: !!p.product.tax_code }
    })),
  })) {
    try { report.stripe[name] = await operation() }
    catch { report.stripe[name] = { verified: false, reason: 'API access failed; inspect Stripe request logs' } }
  }
} else report.stripe = { verified: false, reason: 'Test API key missing; no network request attempted' }
if (process.env.STRIPE_DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.STRIPE_DATABASE_URL, connectionTimeoutMillis: 5000 })
  try {
    report.database = { connected: true, inventory: (await pool.query(
      'SELECT sku,label,available,active FROM dyane_checkout_inventory ORDER BY sku')).rows }
  } catch { report.database = { connected: false } }
  finally { await pool.end() }
} else report.database = { connected: false, reason: 'Database URL missing' }
// This report intentionally contains no key, connection URL, address or customer data.
console.log(JSON.stringify(report, null, 2))
