'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

export default function ContactPage() {
    const t = useTranslations('contact')
    const locale = useLocale()
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        prenom: '',
        email: '',
        pays: '',
        codePostal: '',
        ville: '',
        sujet: '',
        message: '',
    })

    function updateField(field: keyof typeof form) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setForm({ ...form, [field]: e.target.value })
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSending(true)
        setError('')
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, locale }),
            })
            if (!response.ok) throw new Error('send_failed')
            setSent(true)
        } catch {
            setError(locale === 'en'
                ? 'The message could not be sent. Please try again.'
                : "Le message n'a pas pu être envoyé. Veuillez réessayer.")
        } finally {
            setSending(false)
        }
    }

    const options = t.raw('options') as string[]

    const lineField: React.CSSProperties = {
        ...lora,
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(20,18,15,0.28)',
        padding: '13px 0',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#14120f',
        outline: 'none',
        boxSizing: 'border-box',
        appearance: 'none',
        WebkitAppearance: 'none',
        borderRadius: 0,
    }

    return (
        <>
            <style>{`
                .cf::placeholder { color: rgba(20,18,15,0.4); }
                .cf:focus { border-bottom-color: rgba(20,18,15,0.65) !important; }
                .cf option { background: #faf8f5; color: #14120f; }
                .cf-select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(20,18,15,0.4)' fill='none' stroke-width='1'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0 center;
                    cursor: pointer;
                }
                .cf:-webkit-autofill,
                .cf:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                    -webkit-text-fill-color: #14120f !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                .cf-btn:hover { background: rgba(20,18,15,0.07) !important; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                .cf-content { animation: fadeUp 0.85s ease forwards; }
                @media (max-width: 768px) {
                    .cf-row { grid-template-columns: 1fr !important; gap: 0 !important; }
                    .cf-h1 { font-size: 32px !important; }
                    .cf-wrap { padding: 100px 28px 60px !important; }
                }
            `}</style>

            <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

                {/* Image de fond — le tableau */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    <Image
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1781513624/CONTACTER_LA_CONCIERGERIE_zwmuhm.png"
                        alt="Dyane Paris"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    {/* Voile blanc léger pour lisibilité */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,245,240,0.52)' }} />
                </div>

                {/* Contenu */}
                <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                    <div
                        className="cf-content cf-wrap"
                        style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '120px 40px 80px' }}
                    >
                        <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(20,18,15,0.45)', marginBottom: '16px' }}>
                            Dyane Paris
                        </p>
                        <h1
                            className="cf-h1"
                            style={{ ...font, fontSize: 'clamp(30px, 4vw, 56px)', fontWeight: 400, lineHeight: 1.0, color: '#14120f', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em' }}
                        >
                            Contacter<br />la Maison.
                        </h1>
                        <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(20,18,15,0.45)', marginBottom: '44px', lineHeight: 1.8 }}>
                            Lundi au vendredi — 10h00 à 18h00, heure de Paris.
                        </p>
                        <div style={{ width: '28px', height: '1px', background: 'rgba(20,18,15,0.2)', marginBottom: '44px' }} />

                        {sent ? (
                            <p style={{ ...font, fontSize: '16px', lineHeight: 1.8, color: '#14120f' }}>{t('merci')}</p>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

                                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '4px' }}>
                                    <input className="cf" placeholder="Prénom Nom *" required value={form.prenom} onChange={updateField('prenom')} style={lineField} />
                                    <input className="cf" type="email" placeholder="E-mail *" required value={form.email} onChange={updateField('email')} style={lineField} />
                                </div>

                                <select className="cf cf-select" required value={form.pays} onChange={updateField('pays')} style={{ ...lineField, marginBottom: '4px' }}>
                                    <option value="" disabled>Pays / Région *</option>
                                    <option value="France">France</option>
                                    <option value="Belgique">Belgique</option>
                                    <option value="Suisse">Suisse</option>
                                    <option value="Luxembourg">Luxembourg</option>
                                    <option value="Monaco">Monaco</option>
                                    <option value="Autre">Autre</option>
                                </select>

                                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '4px' }}>
                                    <input className="cf" placeholder="Code postal *" required value={form.codePostal} onChange={updateField('codePostal')} style={lineField} />
                                    <input className="cf" placeholder="Ville *" required value={form.ville} onChange={updateField('ville')} style={lineField} />
                                </div>

                                <select className="cf cf-select" value={form.sujet} onChange={updateField('sujet')} style={{ ...lineField, marginBottom: '4px' }}>
                                    <option value="" disabled>Informations sur nos cocktails</option>
                                    {options.map((opt: string) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>

                                <textarea className="cf" placeholder="Votre message *" required rows={4} value={form.message} onChange={updateField('message')}
                                    style={{ ...lineField, resize: 'none', marginBottom: '28px' }} />

                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(20,18,15,0.35)', lineHeight: 1.9, marginBottom: '14px' }}>
                                    Les champs avec une * sont obligatoires.
                                </p>
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(20,18,15,0.35)', lineHeight: 1.9, marginBottom: '28px' }}>
                                    Vos données personnelles sont traitées par Dyane Paris afin de répondre à votre demande.{' '}
                                    <Link href={`/${locale}/confidentialite`} style={{ color: 'rgba(20,18,15,0.6)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                        Politique de confidentialité
                                    </Link>.
                                </p>

                                {error && (
                                    <p role="alert" style={{ ...lora, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8b2a2a', marginBottom: '18px', lineHeight: 1.8 }}>
                                        {error}
                                    </p>
                                )}

                                <button
                                    className="cf-btn"
                                    type="submit"
                                    disabled={sending}
                                    style={{
                                        ...lora,
                                        background: 'transparent',
                                        color: '#14120f',
                                        border: '1px solid rgba(20,18,15,0.35)',
                                        padding: '18px 24px',
                                        fontSize: '9px',
                                        letterSpacing: '0.32em',
                                        textTransform: 'uppercase',
                                        cursor: sending ? 'wait' : 'pointer',
                                        width: '100%',
                                        transition: 'background 0.3s ease',
                                        opacity: sending ? 0.5 : 1,
                                    }}
                                >
                                    {sending ? (locale === 'en' ? 'Sending…' : 'Envoi…') : t('envoyer')}
                                </button>

                            </form>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
