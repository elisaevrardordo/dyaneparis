import EmbeddedPostgres from 'embedded-postgres'
import { Pool } from 'pg'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const directory = resolve('.stripe-local')
mkdirSync(directory, { recursive: true, mode: 0o700 })
const credentialsFile = resolve(directory, 'postgres.json')
const credentials = existsSync(credentialsFile)
  ? JSON.parse(readFileSync(credentialsFile, 'utf8'))
  : { password: randomBytes(24).toString('hex'), port: 55432 }
if (!existsSync(credentialsFile)) writeFileSync(credentialsFile, JSON.stringify(credentials), { mode: 0o600, flag: 'wx' })
const cluster = new EmbeddedPostgres({
  databaseDir: resolve(directory, 'postgres'), user: 'dyane_sandbox', password: credentials.password,
  port: credentials.port, authMethod: 'scram-sha-256', persistent: true,
  postgresFlags: ['-h', '127.0.0.1', '-k', directory, '-c', 'max_connections=20', '-c', 'shared_buffers=16MB'],
  onLog() {}, onError() {},
})
if (!existsSync(resolve(directory, 'postgres/PG_VERSION'))) await cluster.initialise()
await cluster.start()
const admin = cluster.getPgClient('postgres', '127.0.0.1')
await admin.connect()
if (!(await admin.query("SELECT 1 FROM pg_database WHERE datname='dyane_stripe_sandbox'")).rowCount) {
  await admin.query('CREATE DATABASE dyane_stripe_sandbox')
}
await admin.end()
const url = `postgresql://dyane_sandbox:${credentials.password}@127.0.0.1:${credentials.port}/dyane_stripe_sandbox`
const pool = new Pool({ connectionString: url, max: 5 })
try {
  const { rowCount: compositionMigrationApplied } = await pool.query(`SELECT 1 FROM information_schema.columns
    WHERE table_schema=current_schema() AND table_name='dyane_checkout_order_items' AND column_name='composition'`)
  for (const file of readdirSync('database/stripe').filter(f => /^\d+.*\.sql$/.test(f)).sort()) {
    // Earlier migrations define a line constraint that predates the Teo recipe choices.
    if (compositionMigrationApplied && Number(file.slice(0, 3)) < 13) continue
    await pool.query(readFileSync(resolve('database/stripe', file), 'utf8'))
  }
  const catalog = JSON.parse(readFileSync('data/stripe-sandbox-catalog.json', 'utf8'))
  for (const item of catalog.products) {
    // Ten simulated units per format, never a statement about the commercial stock.
    // Re-running setup preserves stock already consumed by test orders.
    await pool.query(`INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active)
      VALUES ($1,$2,$3,10,true) ON CONFLICT (sku) DO UPDATE SET label=EXCLUDED.label,price_id=EXCLUDED.price_id`,
    [item.sku, item.label, item.priceId])
  }
  // Local bag fixtures only: these identifiers are not Stripe prices.
  // Checkout still requires real sandbox prices and validates every amount with Stripe.
  if (process.env.DYANE_CART_PREVIEW === 'true' && process.env.STRIPE_CHECKOUT_ENABLED !== 'true') {
    for (const [sku, label] of [
      ['dyane-no2-25cl', 'Dyane No.2 - 25 cl'],
      ['dyane-no2-150cl', 'Dyane No.2 - 1,5 L'],
    ]) await pool.query(`INSERT INTO dyane_checkout_inventory (sku,label,price_id,available,active)
      VALUES ($1,$2,$3,10,true) ON CONFLICT (sku) DO NOTHING`, [sku, label, `price_local_preview_${sku.replaceAll('-', '_')}`])
  }
  const localFile = resolve('.env.local')
  const current = existsSync(localFile) ? readFileSync(localFile, 'utf8') : ''
  const defaults = {
    STRIPE_CHECKOUT_ENABLED: 'false', STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '',
    STRIPE_ACCOUNT_ID: catalog.account, STRIPE_SITE_URL: 'http://localhost:3000',
    STRIPE_DATABASE_URL: url,
  }
  let content = current
  for (const [name, value] of Object.entries(defaults)) {
    if (!new RegExp(`^${name}=`, 'm').test(content)) content += `\n${name}=${value}\n`
  }
  if (content !== current) writeFileSync(localFile, content, { mode: 0o600 })
  console.log('PostgreSQL sandbox ready on 127.0.0.1:55432. Catalogue prepared. Checkout remains disabled.')
  console.log('Credentials are stored only in ignored local files. Keep this process running while testing.')
} finally { await pool.end() }
let stopping = false
async function stop() { if (stopping) return; stopping = true; await cluster.stop(); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
setInterval(() => {}, 60_000)
