'use client'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const font = { fontFamily: 'var(--font-playfair), serif' }

export default function ContactForm() {
    const pathname = usePathname()
    const locale: 'fr' | 'en' = pathname?.startsWith('/en') ? 'en' : 'fr'
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', country: '', zip: '', city: '', subject: '', message: '', newsletter: false
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (form.newsletter && form.email) {
            const [firstName] = form.name.trim().split(/\s+/)
            // Best-effort newsletter opt-in; do not block the contact confirmation on it.
            fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, firstName, locale, source: 'contact_form' }),
            }).catch(() => {})
        }
        setSent(true)
    }

    if (sent) return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
            <p style={{ ...font, fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#f5f0e8', opacity: 0.7 }}>
                Votre message a bien été transmis à la Maison.
            </p>
        </div>
    )

    const lineField: React.CSSProperties = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(245,240,232,0.25)',
        padding: '14px 0',
        fontSize: '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#f5f0e8',
        fontFamily: 'var(--font-playfair), serif',
        outline: 'none',
        boxSizing: 'border-box',
        appearance: 'none',
        WebkitAppearance: 'none',
        borderRadius: 0,
    }

    return (
        <>
            <style>{`
                .dyane-line::placeholder { color: rgba(245,240,232,0.45); }
                .dyane-line:focus { border-bottom-color: rgba(245,240,232,0.75); }
                .dyane-line option { background: #0f0f0f; color: #f5f0e8; }
                .dyane-select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(245,240,232,0.45)' fill='none' stroke-width='1'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0 center;
                    cursor: pointer;
                }
                .dyane-submit:hover { background: rgba(245,240,232,0.12); }
                .dyane-check-label:hover { opacity: 1 !important; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .dyane-form-content { animation: fadeIn 0.9s ease forwards; }
            `}</style>

            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Image
                    src="https://res.cloudinary.com/dazhkrimv/image/upload/v1781513624/CONTACTER_LA_CONCIERGERIE_zwmuhm.png"
                    alt="La Conciergerie de la Maison Dyane Paris"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.82) 0%, rgba(8,8,8,0.55) 60%, rgba(8,8,8,0.3) 100%)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 0' }}>
                <div className="dyane-form-content" style={{ width: '100%', maxWidth: '520px', margin: '0 auto 0 max(80px, 8vw)', padding: '0 24px' }}>

                    <p style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginBottom: '20px' }}>
                        Dyane Paris
                    </p>
                    <h1 style={{ ...font, fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 400, color: '#f5f0e8', lineHeight: 1.0, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.02em' }}>
                        Contacter<br />la Maison.
                    </h1>
                    <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '52px', lineHeight: 1.8 }}>
                        Lundi au vendredi — 10h00 à 18h00, heure de Paris.
                    </p>
                    <div style={{ width: '32px', height: '1px', background: 'rgba(245,240,232,0.3)', marginBottom: '48px' }} />

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '8px' }}>
                            <input className="dyane-line" type="text" placeholder="Prénom Nom *" required value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} style={lineField} />
                            <input className="dyane-line" type="email" placeholder="E-mail *" required value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} style={lineField} />
                        </div>

                        <select className="dyane-line dyane-select" required value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            style={{ ...lineField, marginBottom: '8px' }}>
                            <option value="" disabled>Pays / Région *</option>
                            <option value="FR">France</option>
                            <option value="BE">Belgique</option>
                            <option value="CH">Suisse</option>
                            <option value="LU">Luxembourg</option>
                            <option value="MC">Monaco</option>
                            <option value="OTHER">Autre</option>
                        </select>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '8px' }}>
                            <input className="dyane-line" type="text" placeholder="Code postal *" required value={form.zip}
                                onChange={(e) => setForm({ ...form, zip: e.target.value })} style={lineField} />
                            <input className="dyane-line" type="text" placeholder="Ville *" required value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })} style={lineField} />
                        </div>

                        <select className="dyane-line dyane-select" value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            style={{ ...lineField, marginBottom: '8px' }}>
                            <option value="">Informations sur nos cocktails</option>
                            <option value="commande">Commande personnalisée</option>
                            <option value="evenement">Événement / Privatisation</option>
                            <option value="partenariat">Partenariat</option>
                            <option value="presse">Presse</option>
                            <option value="autre">Autre</option>
                        </select>

                        <textarea className="dyane-line" placeholder="Votre message *" required rows={4} value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            style={{ ...lineField, resize: 'none', marginBottom: '32px' }} />

                        <p style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', lineHeight: 1.8, marginBottom: '16px' }}>
                            Les champs avec une * sont obligatoires.
                        </p>
                        <p style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', lineHeight: 1.9, marginBottom: '24px' }}>
                            Vos données personnelles sont traitées par Dyane Paris afin de répondre à votre demande.{' '}
                            <span style={{ color: 'rgba(245,240,232,0.55)', textDecoration: 'underline', cursor: 'pointer', textUnderlineOffset: '3px' }}>
                                Politique de confidentialité
                            </span>.
                        </p>

                        <label className="dyane-check-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', marginBottom: '40px', opacity: 0.6 }}>
                            <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                                style={{ marginTop: '2px', width: '12px', height: '12px', accentColor: '#f5f0e8', flexShrink: 0, cursor: 'pointer' }} />
                            <span style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f5f0e8', lineHeight: 1.9 }}>
                                Oui, je souhaite recevoir des communications personnalisées et invitations. Désinscription à tout moment.
                            </span>
                        </label>

                        <button className="dyane-submit" type="submit" style={{
                            width: '100%', padding: '18px', background: 'transparent', color: '#f5f0e8',
                            border: '1px solid rgba(245,240,232,0.35)', fontSize: '9px', letterSpacing: '0.28em',
                            textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-playfair), serif',
                            transition: 'background 0.3s ease',
                        }}>
                            Envoyer
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}
