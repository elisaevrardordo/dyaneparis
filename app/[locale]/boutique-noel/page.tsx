'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const pieces = [
  { id: 'dyane-1-25cl', name: 'DYANE No.1', detail: 'Rouge · 25 cl', price: 55 },
  { id: 'dyane-1-15l', name: 'DYANE No.1', detail: 'Rouge · 1,5 L', price: 185 },
  { id: 'dyane-2-25cl', name: 'DYANE No.2', detail: 'Vert · 25 cl', price: 55 },
  { id: 'dyane-2-15l', name: 'DYANE No.2', detail: 'Vert · 1,5 L', price: 185 },
]

export default function ChristmasBoutiquePage() {
  const params = useParams()
  const query = useSearchParams()
  const locale = params.locale === 'en' ? 'en' : 'fr'
  const en = locale === 'en'
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function buy(productId: string) {
    setBusy(productId)
    setError('')
    try {
      const result = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1, locale }),
      })
      const payload = await result.json()
      if (!result.ok || !payload.url) throw new Error(payload.error || 'Payment unavailable')
      window.location.assign(payload.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment unavailable')
      setBusy(null)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f0e9', color: '#211c18', padding: '120px 24px 80px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p style={{ letterSpacing: 4, fontSize: 12, textAlign: 'center' }}>DYANE PARIS</p>
        <h1 style={{ textAlign: 'center', fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)', margin: '32px 0 16px' }}>
          {en ? 'The Christmas Collection' : 'La Collection de Noël'}
        </h1>
        <p style={{ textAlign: 'center', marginBottom: 60, lineHeight: 1.8 }}>
          {en ? 'Liquid art in hand-painted porcelain.' : 'L’art liquide dans une porcelaine peinte à la main.'}
        </p>
        {query.get('success') && <p role="status" style={{ textAlign: 'center' }}>{en ? 'Thank you. Please check your email for payment confirmation.' : 'Merci. Vérifiez votre e-mail pour la confirmation du paiement.'}</p>}
        {query.get('canceled') && <p role="status" style={{ textAlign: 'center' }}>{en ? 'Payment canceled.' : 'Paiement annulé.'}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24 }}>
          {pieces.map(piece => (
            <article key={piece.id} style={{ border: '1px solid #c8bcae', padding: '40px 24px', textAlign: 'center', background: '#f9f6f0' }}>
              <p style={{ letterSpacing: 2, fontSize: 12 }}>MAISON D’ART LIQUIDE</p>
              <h2 style={{ fontSize: 26, fontWeight: 400, marginTop: 34 }}>{piece.name}</h2>
              <p>{piece.detail}</p>
              <p style={{ fontSize: 23, margin: '24px 0' }}>{piece.price} €</p>
              <button disabled={busy !== null} onClick={() => buy(piece.id)}
                style={{ width: '100%', padding: 16, border: 0, background: '#211c18', color: 'white', cursor: 'pointer', letterSpacing: 1 }}>
                {busy === piece.id ? '…' : en ? 'Secure checkout' : 'Commander'}
              </button>
            </article>
          ))}
        </div>
        {error && <p role="alert" style={{ textAlign: 'center', color: '#a32222' }}>{error}</p>}
        <p style={{ marginTop: 48, textAlign: 'center', fontSize: 12 }}>
          {en ? 'French delivery only. Shipping charges shown before payment. Adults only.' : 'Livraison en France uniquement. Frais de livraison indiqués avant le paiement. Vente réservée aux majeurs.'}
        </p>
      </div>
    </main>
  )
}
