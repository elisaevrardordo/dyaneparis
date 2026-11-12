// Private, read-only fulfilment console. Never mounted on the public Next.js site.
const { loadEnvConfig } = require('@next/env')
const { Pool } = require('pg')
const { mkdirSync, writeFileSync, unlinkSync } = require('node:fs')
const { createManagementServer } = require('../lib/orders/management.cjs')
loadEnvConfig(process.cwd())
if (!process.env.STRIPE_DATABASE_URL) throw new Error('Order database required')
const database = new URL(process.env.STRIPE_DATABASE_URL)
if (!['127.0.0.1', 'localhost'].includes(database.hostname) || database.pathname !== '/dyane_stripe_sandbox') throw new Error('Local sandbox database required')
const schema = process.env.DYANE_ORDERS_SCHEMA
if (schema && !/^dyane_simulation_[0-9a-f]{32}$/.test(schema)) throw new Error('Invalid local simulation schema')
const pool = new Pool({ connectionString: process.env.STRIPE_DATABASE_URL, max: 2, ...(schema ? { options: `-c search_path=${schema}` } : {}) })
const { server, sessionUrl } = createManagementServer({ pool })
server.listen(3041, '127.0.0.1', () => {
  mkdirSync('.stripe-local', { recursive: true, mode: 0o700 })
  writeFileSync('.stripe-local/orders-management-url', sessionUrl, { mode: 0o600 })
  console.log('Gestion des cartes cadeaux disponible sur 127.0.0.1:3041. Accès privé dans .stripe-local/orders-management-url (ne pas partager).')
})
async function stop() { try { unlinkSync('.stripe-local/orders-management-url') } catch {} server.close(); await pool.end(); process.exit(0) }
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
