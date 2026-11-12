'use client'

import { useRef, useState } from 'react'

export default function SandboxCheckout({ items, locale }: {
  items: { sku: string; label: string }[]; locale: 'fr' | 'en'
}) {
  const english = locale === 'en'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const attempt = useRef<string | null>(null)
  const fingerprint = useRef('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const sku = String(form.get('sku'))
    const quantity = Number(form.get('quantity'))
    const next = `${sku}/${quantity}`
    if (fingerprint.current !== next || !attempt.current) {
      attempt.current = crypto.randomUUID()
      fingerprint.current = next
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, quantity, locale, attemptId: attempt.current, adultConfirmed: form.get('adult') === 'on' }),
      })
      const data = await response.json()
      if (!response.ok || typeof data.url !== 'string') {
        if (response.status === 409) attempt.current = null
        throw new Error('Checkout unavailable')
      }
      window.location.assign(data.url)
    } catch {
      setError(english ? 'Payment unavailable. Please try again or contact the Concierge.' : 'Paiement indisponible. Réessayez ou contactez la Conciergerie.')
      setBusy(false)
    }
  }
  return <form onSubmit={submit} style={{ display: 'grid', gap: 20, marginTop: 32 }}>
    <label>{english ? 'Test item' : 'Article de test'}
      <select name="sku" required disabled={busy} style={{ display: 'block', padding: 12, width: '100%' }}>
        {items.map(item => <option key={item.sku} value={item.sku}>{item.label}</option>)}
      </select>
    </label>
    <label>{english ? 'Quantity' : 'Quantité'} <input name="quantity" type="number" min={1} max={5} defaultValue={1} required disabled={busy} /></label>
    <label><input name="adult" type="checkbox" required disabled={busy} /> {english ? 'I confirm that I am of legal drinking age.' : 'Je confirme être majeur(e).'}</label>
    <button type="submit" disabled={busy || items.length === 0} style={{ background: '#111', color: '#fff', padding: 16 }}>
      {busy ? (english ? 'Loading…' : 'Chargement…') : (english ? 'Open test checkout' : 'Ouvrir le paiement de test')}
    </button>
    {error && <p role="alert">{error}</p>}
  </form>
}
