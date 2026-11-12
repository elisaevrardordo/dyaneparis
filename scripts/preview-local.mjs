import { spawn } from 'node:child_process'
import { createConnection } from 'node:net'
import { existsSync } from 'node:fs'

// Keep the Next hostname identical to the browser origin: otherwise locale rewrites become external self-proxies.
// The server binds to localhost only; PostgreSQL stays on 127.0.0.1.
const children = new Set()
const env = { ...process.env, STRIPE_CHECKOUT_ENABLED: 'false', RESEND_API_KEY: '', DYANE_CART_PREVIEW: 'true', NEWSLETTER_MODE: 'preview' }
function listening(port) {
  return new Promise(resolve => {
    const socket = createConnection({ host: port === 3000 ? 'localhost' : '127.0.0.1', port })
    socket.setTimeout(500)
    const finish = result => { socket.destroy(); resolve(result) }
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
    socket.once('timeout', () => finish(false))
  })
}
function run(args) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env })
  children.add(child)
  child.on('exit', () => children.delete(child))
  return child
}
function stop() { for (const child of children) child.kill('SIGTERM') }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
if (!existsSync('.next/BUILD_ID')) throw new Error('Exécutez npm run build avant de lancer cet aperçu.')
if (!await listening(55432)) {
  const db = run(['scripts/stripe-local-db.mjs'])
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (db.exitCode !== null) break
    if (await listening(55432)) { ready = true; break }
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  if (!ready) { stop(); throw new Error('La base locale ne démarre pas ; consultez le message ci-dessus.') }
}
if (await listening(3000)) console.log('Un serveur est déjà ouvert sur http://localhost:3000 — vérifiez son contenu.')
else {
  const site = run(['node_modules/next/dist/bin/next', 'start', '--hostname', 'localhost', '--port', '3000'])
  site.on('exit', stop)
}
console.log('Site complet : http://localhost:3000/personnalisables\nPanier : http://localhost:3000/panier\nPaiement et envois e-mail désactivés. Gardez ce terminal ouvert.')
