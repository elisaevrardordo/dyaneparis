const { createServer } = require('node:http')
const { randomBytes, timingSafeEqual } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const style = `*{box-sizing:border-box}body{margin:0;background:#f7f7f6;color:#222;font:14px/1.7 Arial,Helvetica,sans-serif}header{background:#fff;border-bottom:1px solid #ddd;padding:26px 6%;display:flex;align-items:center;justify-content:space-between}header img{width:250px;height:40px;object-fit:cover;object-position:center}main{max-width:1100px;margin:45px auto;padding:0 24px}h1{font-size:26px;font-weight:400}p{color:#666}a{color:inherit;text-underline-offset:4px}article{padding:25px;background:#fff;border:1px solid #e5e5e5;margin:16px 0}article h2{font-weight:400;font-size:16px;margin:0}.message{white-space:pre-wrap;overflow-wrap:anywhere;margin:22px 0;color:#333;border-left:1px solid #bbb;padding-left:20px}small{color:#777}button,.button{border:0;border-radius:0;background:#111;color:#fff;cursor:pointer;padding:12px 24px;font:inherit;display:inline-block;text-decoration:none}button:disabled{opacity:.3;cursor:default}input{padding:9px;border:1px solid #aaa;width:100px;font:inherit}label{display:inline-block;margin:5px 20px 12px 0}form{margin:24px 0}.tools{padding:24px;background:#fff;border:1px solid #ddd}.card{background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;overflow:hidden;margin:35px auto;max-width:100%;min-height:300px}.card-logo{position:relative;width:70%;aspect-ratio:6.166667;overflow:hidden;margin-bottom:12%;flex:none}.card-logo img{position:absolute;width:139%;height:auto;max-width:none;left:50%;top:50%;transform:translate(-50%,-50%)}.card-message{white-space:pre;text-align:center;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.65;width:100%;margin:0}.notice{font-size:12px}.empty{padding:30px;background:#fff}@media(max-width:600px){header{padding:20px 24px}header img{width:180px}main{margin:30px auto}.tools label{display:block}.card-message{font-size:16px}}@media print{html,body{background:#fff;margin:0!important;padding:0!important}header,.tools,.notice,.nav,h1{display:none!important}main{margin:0!important;padding:0!important;max-width:none}.card{margin:0!important;max-width:none;min-height:0;break-inside:avoid}.card img{print-color-adjust:exact}.card-message{color:#000}}`
function page(title, body, extraStyle = '', script = false) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} - Dyane Paris</title><style>${style}section dl{display:grid;grid-template-columns:100px 1fr;gap:4px 18px;margin:20px 0;padding:15px;border:1px solid #eee}section dd{margin:0}section dt{color:#666}${extraStyle}</style>${script ? '<script src="/manage.js" defer></script>' : ''}</head><body><header><img src="/logo" alt="DYANE PARIS"><span>Gestion locale · Sandbox</span></header><main>${body}</main></body></html>`
}
function renderOrders(orders) {
  return page('Préparation des commandes', `<h1>Préparation des commandes</h1><p>Commandes payées confirmées par webhook. Retrouvez les initiales et la finition de chaque sculpture personnalisée, ainsi que les éventuels messages cadeaux. Les messages restent dans cet espace de préparation et ne sont pas transmis aux factures Stripe.</p>${orders.length ? orders.map(order => `<article><h2>Commande ${escapeHtml(order.id)}</h2><small>Payée · ${escapeHtml(new Date(order.created_at).toLocaleDateString('fr-FR'))}</small>${Array.isArray(order.personalizations) && order.personalizations.length ? `<section aria-label="Personnalisations"><h3>Sculptures personnalisées</h3>${order.personalizations.map(line => `<dl><dt>Format</dt><dd>${escapeHtml(line.format)}</dd><dt>Quantité</dt><dd>${escapeHtml(line.quantity)}</dd><dt>Initiales</dt><dd>${escapeHtml(line.initials)}</dd><dt>Finition</dt><dd>${escapeHtml(line.finish === 'gold' ? 'Doré' : line.finish === 'black' ? 'Noir' : line.finish === 'red' ? 'Rouge' : line.finish === 'green' ? 'Vert' : line.finish)}</dd></dl>`).join('')}</section>` : ''}${order.gift_options?.isGift ? "<p>Offrir en cadeau · présentation à confirmer</p>" : ""}${!order.gift_message ? "<p>Aucun message à imprimer.</p>" : ""}${order.gift_message ? `<div class="message">${escapeHtml(order.gift_message)}</div><a class="button" href="/orders/${escapeHtml(order.id)}/card">Préparer la carte</a>` : ''}</article>`).join('') : '<p class="empty">Aucune personnalisation ni carte cadeau pour une commande payée.</p>'}<p class="notice">100 dernières commandes avec personnalisation ou message cadeau. Accès réservé à cette session locale ; ne partagez pas son lien d’accès.</p>`)
}
const fulfilmentOrdersSql = `SELECT o.id,o.created_at,o.gift_message,o.gift_options,
  COALESCE((SELECT jsonb_agg(jsonb_build_object(
    'format',CASE i.sku WHEN 'dyane-sculpture-25cl' THEN 'Dyane No.1 · 25 cl' WHEN 'dyane-sculpture-150cl' THEN 'Dyane No.1 · 1,5 L' WHEN 'dyane-no2-25cl' THEN 'Dyane No.2 · 25 cl' WHEN 'dyane-no2-150cl' THEN 'Dyane No.2 · 1,5 L' ELSE i.sku END,
    'quantity',i.quantity,'initials',i.personalization->>'initials','finish',i.personalization->>'finish'
  ) ORDER BY i.line_key) FROM dyane_checkout_order_items i WHERE i.order_id=o.id AND i.personalization IS NOT NULL),'[]'::jsonb) AS personalizations
  FROM dyane_checkout_orders o
  WHERE o.status='paid' AND o.payment_snapshot->>'paymentStatus'='paid'
    AND (o.gift_message <> '' OR o.gift_options->>'isGift'='true' OR EXISTS (SELECT 1 FROM dyane_checkout_order_items i WHERE i.order_id=o.id AND i.personalization IS NOT NULL))
  ORDER BY o.created_at DESC LIMIT 100`
function dimensions(params) {
  const width = params.get('width'), height = params.get('height')
  if (!width && !height) return null
  if (!/^\d{2,3}(\.\d)?$/.test(width || '') || !/^\d{2,3}(\.\d)?$/.test(height || '')) return false
  const size = { width: Number(width), height: Number(height) }
  return size.width >= 40 && size.width <= 300 && size.height >= 40 && size.height <= 300 ? size : false
}
function renderCard(order, size) {
  const printable = Array.from(order.gift_message).length <= 300 && order.gift_message.split('\n').length <= 6
  return page('Carte cadeau', `<p class="nav"><a href="/">← Messages cadeaux</a></p><h1>Préparer la carte</h1><div class="tools"><p>Dimensions physiques non fournies. Cet aperçu ne définit ni le papier, ni le grammage, ni les marges techniques de votre imprimeur.</p><form method="get"><label>Largeur (mm)<br><input required type="number" min="40" max="300" step="0.1" name="width" value="${size?.width ?? ''}"></label><label>Hauteur (mm)<br><input required type="number" min="40" max="300" step="0.1" name="height" value="${size?.height ?? ''}"></label><button type="submit">Appliquer le format</button></form><button id="print-card" type="button" ${!size || !printable ? 'disabled' : ''}>Imprimer la carte</button><p>${!printable ? 'Message historique hors limites : vérifier manuellement avant impression.' : size ? 'Format saisi pour cette impression uniquement. Vérifiez l’aperçu et imprimez à 100 %, sans en-têtes ni pieds de page.' : 'Aperçu provisoire - renseignez le format réel pour activer l’impression.'}</p><p class="notice" id="fit-notice" role="status"></p></div><p class="notice">Commande ${escapeHtml(order.id)} · Confirmée payée · Le numéro de commande ne sera pas imprimé.</p><div class="card" id="gift-card" data-printable="${Boolean(size && printable)}"><div class="card-logo"><img src="/logo" alt="DYANE PARIS"></div><p class="card-message" id="card-message">${escapeHtml(order.gift_message)}</p></div>`, size ? `@page{size:${size.width}mm ${size.height}mm;margin:0}.card{width:${size.width}mm;height:${size.height}mm;min-height:0}` : '@media print{body{display:none}}', true)
}
const browserScript = `function fit(){const card=document.getElementById('gift-card'),message=document.getElementById('card-message'),button=document.getElementById('print-card');if(!card||!message||card.dataset.printable!=='true')return;button.disabled=false;document.getElementById('fit-notice').textContent='';let size=22;message.style.fontSize=size+'px';while(size>8&&(message.scrollWidth>message.clientWidth+1||card.scrollHeight>card.clientHeight+1)){size-=.5;message.style.fontSize=size+'px'}if(message.scrollWidth>message.clientWidth+1||card.scrollHeight>card.clientHeight+1){button.disabled=true;document.getElementById('fit-notice').textContent='Ce message ne tient pas dans le format choisi. Vérifiez la mise en page avant impression.'}}window.addEventListener('load',fit);window.addEventListener('resize',fit);window.addEventListener('beforeprint',fit);document.getElementById('print-card')?.addEventListener('click',()=>window.print());`
function secureEqual(a, b) { const left = Buffer.from(a), right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right) }

function createManagementServer({ pool, port = 3041, token = randomBytes(32).toString('hex') }) {
  const host = `127.0.0.1:${port}`
  const cookie = randomBytes(32).toString('hex')
  const server = createServer(async (req, res) => {
    const headers = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" }
    const send = (status, body, type = 'text/html; charset=utf-8', extra = {}) => { res.writeHead(status, { ...headers, 'Content-Type': type, ...extra }); res.end(body) }
    if (req.headers.host !== host || !['127.0.0.1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return send(403, 'Accès refusé.')
    if (req.method !== 'GET' || (req.headers.origin && req.headers.origin !== `http://${host}`)) return send(403, 'Accès refusé.')
    const url = new URL(req.url, `http://${host}`)
    if (url.pathname === '/session' && secureEqual(url.searchParams.get('token') || '', token)) {
      return send(303, '', 'text/plain', { Location: '/', 'Set-Cookie': `dyane_orders_session=${cookie}; HttpOnly; SameSite=Strict; Path=/` })
    }
    const supplied = (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith('dyane_orders_session='))?.slice('dyane_orders_session='.length) || ''
    if (!secureEqual(supplied, cookie)) return send(401, 'Session locale requise.', 'text/plain; charset=utf-8')
    try {
      if (url.pathname === '/logo') return send(200, readFileSync(resolve('public/images/brand/dyane-paris-horizontal-v2.png')), 'image/png')
      if (url.pathname === '/manage.js') return send(200, browserScript, 'application/javascript')
      if (url.pathname === '/') {
        const orders = await pool.query(fulfilmentOrdersSql)
        return send(200, renderOrders(orders.rows))
      }
      const match = url.pathname.match(/^\/orders\/([^/]+)\/card$/)
      if (match && uuid.test(match[1])) {
        const size = dimensions(url.searchParams)
        if (size === false) return send(400, 'Dimensions invalides.', 'text/plain; charset=utf-8')
        const orders = await pool.query(`SELECT id,created_at,gift_message FROM dyane_checkout_orders WHERE id=$1
          AND status='paid' AND payment_snapshot->>'paymentStatus'='paid' AND gift_message <> ''`, [match[1]])
        if (orders.rows[0]) return send(200, renderCard(orders.rows[0], size))
      }
      return send(404, 'Carte indisponible.', 'text/plain; charset=utf-8')
    } catch { return send(503, 'La gestion des commandes est momentanément indisponible.', 'text/plain; charset=utf-8') }
  })
  return { server, sessionUrl: `http://${host}/session?token=${token}` }
}
module.exports = { createManagementServer, renderOrders, renderCard, dimensions, fulfilmentOrdersSql }
