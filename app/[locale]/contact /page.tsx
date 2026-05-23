'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

export default function ContactPage() {
    const t = useTranslations('contact')
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })

    function handleSubmit(e: React.MouseEvent) {
        e.preventDefault()
        setSent(true)
    }

    const options = t.raw('options') as string[]

    return (
        <main style={{ background: '#FAF8F5', minHeight: '80vh' }}>
            <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>{t('kicker')}</p>
                <h1 style={{ ...font, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '24px' }}>{t('titre')}</h1>
                <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.7 }}>{t('intro')}</p>
            </section>

            <section style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 100px' }}>
                {sent ? (
                    <p style={{ ...font, textAlign: 'center', fontSize: '14px', lineHeight: 1.8, opacity: 0.8, padding: '48px 0' }}>{t('merci')}</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input
                            type="text"
                            placeholder={t('nom')}
                            value={form.nom}
                            onChange={e => setForm({ ...form, nom: e.target.value })}
                            style={{ ...lora, width: '100%', padding: '14px 16px', border: '1px solid #ddd', background: '#fff', fontSize: '12px', letterSpacing: '0.1em', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <input
                            type="email"
                            placeholder={t('email')}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={{ ...lora, width: '100%', padding: '14px 16px', border: '1px solid #ddd', background: '#fff', fontSize: '12px', letterSpacing: '0.1em', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <select
                            value={form.sujet}
                            onChange={e => setForm({ ...form, sujet: e.target.value })}
                            style={{ ...lora, width: '100%', padding: '14px 16px', border: '1px solid #ddd', background: '#fff', fontSize: '12px', letterSpacing: '0.1em', outline: 'none', boxSizing: 'border-box', color: form.sujet ? '#111' : '#aaa' }}
                        >
                            <option value="" disabled>{t('sujet')}</option>
                            {options.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder={t('message')}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            rows={6}
                            style={{ ...lora, width: '100%', padding: '14px 16px', border: '1px solid #ddd', background: '#fff', fontSize: '12px', letterSpacing: '0.1em', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                        <button
                            onClick={handleSubmit}
                            style={{ ...lora, background: '#111', color: '#fff', border: 'none', padding: '16px 24px', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            {t('envoyer')}
                        </button>
                    </div>
                )}
            </section>
        </main>
    )
}
