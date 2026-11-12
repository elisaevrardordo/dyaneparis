import 'server-only'
import { Pool } from 'pg'

let pool: Pool | undefined

export function localNewsletterDatabase(request: Request, env = process.env) {
  if (env.NEWSLETTER_MODE !== 'preview' || env.VERCEL) throw new Error('Local newsletter preview required')
  const origin = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || origin.host
  if (!['localhost', '127.0.0.1'].includes(origin.hostname)
    || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) throw new Error('Loopback origin required')
  const database = new URL(env.STRIPE_DATABASE_URL || '')
  if (!['postgres:', 'postgresql:'].includes(database.protocol) || database.hostname !== '127.0.0.1'
    || database.port !== '55432' || database.pathname !== '/dyane_stripe_sandbox'
    || database.search || database.hash) throw new Error('Dedicated local database required')
  return database.href
}

export async function savePreviewSubscription(request: Request, input: { email: string; locale: 'fr' | 'en'; source: string }) {
  const connectionString = localNewsletterDatabase(request)
  pool ??= new Pool({ connectionString, max: 2, connectionTimeoutMillis: 5000 })
  const db = await pool.connect()
  try {
    await db.query('BEGIN')
    // Serialize schema creation and concurrent retries without recording IP addresses.
    await db.query("SELECT pg_advisory_xact_lock(hashtextextended('dyane-newsletter-preview', 0))")
    await db.query(`CREATE TABLE IF NOT EXISTS dyane_newsletter_preview_subscriptions (
      email text PRIMARY KEY CHECK (length(email) <= 180),
      locale text NOT NULL CHECK (locale IN ('fr','en')),
      source text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      consent_at timestamptz NOT NULL DEFAULT now()
    )`)
    await db.query(`INSERT INTO dyane_newsletter_preview_subscriptions (email,locale,source)
      VALUES ($1,$2,$3) ON CONFLICT (email) DO UPDATE
      SET locale=EXCLUDED.locale,source=EXCLUDED.source,consent_at=now()`, [input.email, input.locale, input.source])
    await db.query('COMMIT')
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  } finally { db.release() }
}
