'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const font = { fontFamily: 'var(--font-playfair), serif' }

type Status = 'idle' | 'loading' | 'success' | 'error'

const copy = {
    fr: {
        label: 'NEWSLETTER',
        title: "S'ABONNER À NOS E-MAILS",
        description:
            'Faites partie des premières personnes à être informées des nouvelles collections et des offres exclusives.',
        placeholder: 'VOTRE ADRESSE E-MAIL *',
        submit: "S'INSCRIRE À LA NEWSLETTER",
        loading: 'INSCRIPTION EN COURS…',
        success: 'Merci pour votre inscription.',
        error: 'Une erreur est survenue. Veuillez réessayer.',
    },
    en: {
        label: 'NEWSLETTER',
        title: 'SUBSCRIBE TO OUR EMAILS',
        description:
            'Be among the first to hear about new collections and exclusive offers.',
        placeholder: 'YOUR EMAIL ADDRESS *',
        submit: 'SUBSCRIBE TO THE NEWSLETTER',
        loading: 'SUBSCRIBING…',
        success: 'Thank you for subscribing.',
        error: 'Something went wrong. Please try again.',
    },
} as const

export default function NewsletterForm() {
    const pathname = usePathname()
    const locale: 'fr' | 'en' = pathname?.startsWith('/en') ? 'en' : 'fr'
    const t = copy[locale]

    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<Status>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (status === 'loading') return
        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, locale, source: 'newsletter_section' }),
            })
            if (!res.ok) throw new Error('request failed')
            setStatus('success')
            setEmail('')
        } catch {
            setStatus('error')
        }
    }

    return (
        <section style={{ background: '#0d0d0d', padding: '100px 24px' }}>
            <div style={{ maxWidth: '600px' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>{t.label}</p>
                <h2 style={{ ...font, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, color: '#fff', marginBottom: '16px' }}>{t.title}</h2>
                <p style={{ ...font, fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: '48px' }}>
                    {t.description}
                </p>
                {status === 'success' ? (
                    <p style={{ ...font, fontSize: '13px', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em' }}>{t.success}</p>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.3)', marginBottom: '32px' }}>
                            <input
                                type="email"
                                placeholder={t.placeholder}
                                required
                                value={email}
                                onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                                className="newsletter-input"
                                style={{ ...font, flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '12px 0', outline: 'none' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            style={{ ...font, background: 'none', border: 'none', color: '#fff', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', cursor: status === 'loading' ? 'default' : 'pointer', opacity: status === 'loading' ? 0.5 : 1, borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '4px', alignSelf: 'flex-start' }}
                        >
                            {status === 'loading' ? t.loading : t.submit}
                        </button>
                        {status === 'error' && (
                            <p style={{ ...font, fontSize: '12px', color: '#e6a4a4', letterSpacing: '0.08em', marginTop: '20px' }}>{t.error}</p>
                        )}
                    </form>
                )}
            </div>
        </section>
    )
}
