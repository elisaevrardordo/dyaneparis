'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

export default function ContactPage() {
    const t = useTranslations('contact')
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({
        prenom: '', email: '', pays: '',
        codePostal: '', ville: '', sujet: '',
        message: '', newsletter: false
    })

    function handleSubmit(e: React.MouseEvent) {
        e.preventDefault()
        setSent(true)
    }

    const options = t.raw('options') as string[]

    const inputStyle = {
        ...lora,
        width: '100%',
        padding: '12px 0',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.35)',
        background: 'transparent',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        outline: 'none',
        boxSizing: 'border-box' as const,
        color: '#fff',
        WebkitTextFillColor: '#fff',
    }

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .contact-inner { grid-template-columns: 1fr !important; }
                    .contact-form-col { padding: 100px 24px 60px !important; }
                    .contact-form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
                    .contact-h1 { font-size: 26px !important; }
                }
                input::placeholder { color: rgba(255,255,255,0.4) !important; -webkit-text-fill-color: rgba(255,255,255,0.4) !important; }
                textarea::placeholder { color: rgba(255,255,255,0.4) !important; -webkit-text-fill-color: rgba(255,255,255,0.4) !important; }
                select option { color: #111 !important; background: #fff !important; }
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                    -webkit-text-fill-color: #fff !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                input, textarea, select {
                    color: #fff !important;
                    -webkit-text-fill-color: #fff !important;
                    background: transparent !important;
                }
            `}</style>

            <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

                {/* Fond image fixe */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    <Image
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779719956/Design_sans_titre_62_xo5qpq.png"
                        alt="Dyane Paris Contact"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                </div>

                {/* Contenu */}
                <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
                    <div className="contact-inner" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

                        {/* Colonne gauche — formulaire */}
                        <div className="contact-form-col" style={{ padding: '120px 64px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                            <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '16px' }}>
                                Dyane Paris
                            </p>
                            <h1 className="contact-h1" style={{ ...font, fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400, lineHeight: 1.15, marginBottom: '12px', color: '#fff', textTransform: 'uppercase' }}>
                                CONTACTER LA MAISON.
                            </h1>
                            <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '48px', lineHeight: 1.8 }}>
                                LUNDI AU VENDREDI — 10H00 À 18H00, HEURE DE PARIS.
                            </p>

                            {sent ? (
                                <p style={{ ...font, fontSize: '16px', lineHeight: 1.8, color: '#fff' }}>{t('merci')}</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>

                                    <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                        <input type="text" placeholder="PRÉNOM NOM *" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} style={inputStyle} />
                                        <input type="email" placeholder="E-MAIL *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                                    </div>

                                    <select value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })} style={{ ...inputStyle, marginBottom: '24px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}>
                                        <option value="" disabled style={{ color: '#111' }}>PAYS / RÉGION *</option>
                                        <option value="fr">France</option>
                                        <option value="be">Belgique</option>
                                        <option value="ch">Suisse</option>
                                        <option value="lu">Luxembourg</option>
                                        <option value="other">Autre</option>
                                    </select>

                                    <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                        <input type="text" placeholder="CODE POSTAL *" value={form.codePostal} onChange={e => setForm({ ...form, codePostal: e.target.value })} style={inputStyle} />
                                        <input type="text" placeholder="VILLE *" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} style={inputStyle} />
                                    </div>

                                    <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} style={{ ...inputStyle, marginBottom: '24px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}>
                                        <option value="" disabled style={{ color: '#111' }}>INFORMATIONS SUR NOS COCKTAILS</option>
                                        {options.map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>

                                    <textarea placeholder="VOTRE MESSAGE *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'none', marginBottom: '32px' }} />

                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', lineHeight: 1.8 }}>
                                        LES CHAMPS AVEC UNE * SONT OBLIGATOIRES.
                                    </p>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', lineHeight: 1.8 }}>
                                        VOS DONNÉES PERSONNELLES SONT TRAITÉES PAR DYANE PARIS AFIN DE RÉPONDRE À VOTRE DEMANDE.{' '}
                                        <a href="/confidentialite" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'underline' }}>POLITIQUE DE CONFIDENTIALITÉ</a>.
                                    </p>

                                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '40px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.newsletter} onChange={e => setForm({ ...form, newsletter: e.target.checked })} style={{ marginTop: '2px', cursor: 'pointer', accentColor: '#fff' }} />
                                        <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                                            OUI, JE SOUHAITE RECEVOIR DES COMMUNICATIONS PERSONNALISÉES ET INVITATIONS. DÉSINSCRIPTION À TOUT MOMENT.
                                        </span>
                                    </label>

                                    <button
                                        onClick={handleSubmit}
                                        style={{ ...lora, background: '#fff', color: '#111', border: 'none', padding: '18px 24px', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s ease' }}
                                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                    >
                                        ENVOYER
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Colonne droite vide — laisse voir le fond */}
                        <div />
                    </div>
                </div>
            </main>
        </>
    )
}
