const { readFileSync, readdirSync } = require('node:fs')
const { join } = require('node:path')

const siteId = '5590308c-8f1a-4f6a-8f93-42a847daa1d0'
const accountId = 'acct_1UXGZXQrgPr2PM1k'
const catalog = [
  { sku: 'dyane-sculpture-25cl', label: 'Dyane No.1 - 25 cl', price: 'price_1UbNu6QrgPr2PM1kIkS3NHcc', product: 'prod_VcdAUhymruPBpJ', amount: 5500, stock: 0 },
  { sku: 'dyane-sculpture-150cl', label: 'Dyane No.1 - 1,5 L', price: 'price_1UbNvYQrgPr2PM1kBTNt47ND', product: 'prod_VcdBYKI20OIF9o', amount: 18500, stock: 100 },
  { sku: 'dyane-no2-25cl', label: 'Dyane No.2 - 25 cl', price: 'price_1UbNyKQrgPr2PM1kiSy1u40S', product: 'prod_VcdE3fuLHPVTrM', amount: 5500, stock: 0 },
  { sku: 'dyane-no2-150cl', label: 'Dyane No.2 - 1,5 L', price: 'price_1UbNzOQrgPr2PM1kHMBeUmke', product: 'prod_VcdFZtTgX4XFgx', amount: 18500, stock: 100 },
]
const requiredColumns = {
  dyane_checkout_inventory: ['sku', 'label', 'price_id', 'active', 'available', 'preorder_enabled'],
  dyane_checkout_orders: ['id', 'sku', 'quantity', 'locale', 'price_id', 'params', 'status', 'session_id', 'payment_snapshot', 'gift_message', 'gift_options', 'fulfillment'],
  dyane_checkout_order_items: ['order_id', 'sku', 'line_key', 'personalization', 'composition'],
  dyane_checkout_events: ['id', 'order_id'],
  dyane_checkout_test_emails: ['order_id'],
  dyane_checkout_purchase_emails: ['order_id', 'purpose', 'state', 'payload', 'attempt_count'],
}

class ReadinessError extends Error {}

function check(condition, message) {
  if (!condition) throw new ReadinessError(message)
}

function deploymentMode(env) {
  const action = env.DYANE_NETLIFY_ORDER_BOOTSTRAP || ''
  check(['', 'apply', 'verify'].includes(action), 'Invalid order bootstrap action.')
  const liveReady = env.STRIPE_LIVE_READY === 'true'
  const enabled = env.STRIPE_CHECKOUT_ENABLED === 'true'
  if (!action && !liveReady && !enabled) return null
  check(env.NETLIFY === 'true' && env.CONTEXT === 'production' && env.SITE_ID === siteId
    && env.DYANE_DEPLOYMENT_ENV === 'production', 'Order readiness is restricted to the Dyane Netlify production project.')
  check(liveReady === enabled, 'Set the two checkout switches together when opening the shop.')
  if (action === 'apply') {
    check(!enabled, 'Leave both checkout switches off during database initialization.')
    check(env.DYANE_NETLIFY_DB_BACKUP_REFERENCE?.trim(), 'Record the existing production database backup before initialization.')
  }
  return { apply: action === 'apply' }
}

function productionConnection(env) {
  const connectionString = env.STRIPE_DATABASE_URL || env.NETLIFY_DB_URL
  check(connectionString, 'Production database connection is missing from the Netlify build.')
  let url
  try { url = new URL(connectionString) } catch { throw new ReadinessError('The production database connection is invalid.') }
  check(['postgresql:', 'postgres:'].includes(url.protocol) && url.username && url.password && url.pathname.length > 1
    && url.hostname.includes('.') && !/\.(?:local|localhost|internal)$/i.test(url.hostname), 'Expected the hosted Netlify Postgres database.')
  const parameters = Object.fromEntries(url.searchParams)
  check(!['disable', 'allow', 'prefer', 'no-verify'].includes(parameters.sslmode), 'Expected a verified TLS database connection.')
  check(!env.NETLIFY_DB_URL || !env.STRIPE_DATABASE_URL || env.STRIPE_DATABASE_URL === env.NETLIFY_DB_URL,
    'Remove the conflicting explicit production order database override.')
  url.searchParams.set('sslmode', 'verify-full')
  return url.toString()
}

async function verifyStripe(env, apply) {
  check(env.STRIPE_MODE === 'live' && env.STRIPE_SITE_URL === 'https://www.dyaneparis.com' && env.STRIPE_ACCOUNT_ID === accountId,
    'The production Stripe account, mode and checkout origin must match Dyane Paris.')
  check(/^(sk|rk)_live_\S+$/.test(env.STRIPE_SECRET_KEY || ''), 'The Stripe production server key is missing.')
  if (!apply) {
    check(/^pk_live_\S+$/.test(env.STRIPE_PUBLISHABLE_KEY || '') && /^whsec_\S+$/.test(env.STRIPE_WEBHOOK_SECRET || '')
      && env.RESEND_API_KEY, 'Production checkout and email settings are incomplete.')
  }
  const jurisdictions = [
    { country: 'FR', rate: 'txr_1UauiaQrgPr2PM1kLbtgn2eN', configured: env.STRIPE_MANUAL_VAT_FR },
    { country: 'MC', rate: 'txr_1UaukWQrgPr2PM1k0tQwZkj3', configured: env.STRIPE_MANUAL_VAT_MC },
  ]
  check(jurisdictions.every(({ rate, configured }) => configured === rate), 'The two verified production VAT rates are required.')
  const Stripe = require('stripe')
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-10-28.endive', timeout: 10000, maxNetworkRetries: 1 })
  const [account, prices, taxRates] = await Promise.all([
    stripe.accounts.retrieve(null),
    Promise.all(catalog.map(({ price }) => stripe.prices.retrieve(price, { expand: ['product'] }))),
    Promise.all(jurisdictions.map(({ rate }) => stripe.taxRates.retrieve(rate))),
  ])
  check(account.id === accountId && account.charges_enabled === true, 'Stripe has not enabled payments for the expected account.')
  for (const [index, price] of prices.entries()) {
    const item = catalog[index]
    check(price.id === item.price && price.product?.id === item.product && price.product.active === true
      && price.active && price.livemode === true && price.type === 'one_time' && price.currency === 'eur'
      && price.unit_amount === item.amount && price.tax_behavior === 'inclusive', `Unexpected Stripe price for ${item.sku}.`)
  }
  for (const [index, tax] of taxRates.entries()) {
    const { rate, country } = jurisdictions[index]
    check(tax.id === rate && tax.livemode === true && tax.active && tax.inclusive && tax.percentage === 20 && tax.country === country,
      `Unexpected Stripe VAT rate for ${country}.`)
  }
}

function migrations() {
  const folder = join(__dirname, '..', 'database', 'stripe')
  const filenames = readdirSync(folder).filter(name => /^\d{3}_[a-z0-9_]+\.sql$/.test(name)).sort()
  check(filenames.length === 13 && filenames.every((name, index) => Number(name.slice(0, 3)) === index + 1),
    'Expected 13 ordered checkout migrations.')
  return filenames.map(name => {
    const sql = readFileSync(join(folder, name), 'utf8').trimEnd()
    const start = /^(\s*(?:--[^\n]*\n\s*)*)BEGIN;\s*/
    const end = /\nCOMMIT;$/
    check(start.test(sql) && end.test(sql), 'Unexpected checkout migration transaction wrapper.')
    return sql.replace(start, '$1').replace(end, '')
  })
}

async function verifyDatabase(db) {
  const { rows: columns } = await db.query(`SELECT table_schema, table_name, column_name FROM information_schema.columns
    WHERE left(table_name, 15) = 'dyane_checkout_'`)
  const { rows: routines } = await db.query(`SELECT routine_schema FROM information_schema.routines
    WHERE routine_name = 'dyane_validate_gift_message'`)
  if (!columns.length && !routines.length) return false
  check(routines.length === 1 && routines[0].routine_schema === 'public'
    && columns.every(row => row.table_schema === 'public' && Object.hasOwn(requiredColumns, row.table_name)),
  'Unexpected objects in the checkout schema.')
  for (const [table, names] of Object.entries(requiredColumns)) {
    check(names.every(name => columns.some(row => row.table_name === table && row.column_name === name)),
      `Checkout table ${table} is incomplete.`)
  }
  const { rows: inventory } = await db.query(`SELECT sku, price_id, active, available, preorder_enabled FROM public.dyane_checkout_inventory`)
  check(inventory.length === catalog.length && catalog.every(item => inventory.some(row => row.sku === item.sku
    && row.price_id === item.price && row.active && row.available >= 0
    && row.preorder_enabled === (item.stock === 0) && (item.stock > 0 || row.available === 0))),
  'Existing order inventory does not match the four production references.')
  return true
}

async function prepareDatabase(db, apply, executeMigration = sql => db.query(sql)) {
  await db.query(apply ? 'BEGIN' : 'BEGIN READ ONLY')
  try {
    await db.query('SET LOCAL search_path = public')
    if (apply) await db.query("SELECT pg_advisory_xact_lock(hashtext('dyane_checkout_bootstrap'))")
    let initialized = false
    if (!await verifyDatabase(db)) {
      check(apply, 'Production order database has not been initialized.')
      for (const sql of migrations()) await executeMigration(sql)
      for (const item of catalog) {
        await db.query(`INSERT INTO public.dyane_checkout_inventory
          (sku, label, price_id, available, active, preorder_enabled) VALUES ($1,$2,$3,$4,true,$5)`,
        [item.sku, item.label, item.price, item.stock, item.stock === 0])
      }
      check(await verifyDatabase(db), 'Checkout database did not initialize.')
      initialized = true
    }
    await db.query('COMMIT')
    return initialized
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

async function main(env) {
  const mode = deploymentMode(env)
  if (!mode) return
  await verifyStripe(env, mode.apply)
  console.log('Production Stripe account, four prices and both VAT rates verified.')
  const connectionString = productionConnection(env)
  const { Client } = require('pg')
  const db = new Client({ connectionString, connectionTimeoutMillis: 10000, statement_timeout: 20000 })
  await db.connect()
  try {
    const initialized = await prepareDatabase(db, mode.apply)
    console.log(initialized ? 'Production order database initialized and checked.' : 'Production order database checked without changes.')
  } finally { await db.end() }
}

if (require.main === module) {
  main(process.env).catch(error => {
    console.error(error instanceof ReadinessError ? error.message : 'Production order readiness failed. Check provider activity securely.')
    process.exitCode = 1
  })
}

module.exports = { deploymentMode, migrations, prepareDatabase, productionConnection }
