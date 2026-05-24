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
        prenom: '', nom: '', email: '',
        pays: '', codePostal: '', ville: '',
        sujet: '', message: '', newsletter: false
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
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        background: 'transparent',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        outline: 'none',
        boxSizing: 'border-box' as const,
        color: '#111',
    }

    return (
        <main style={{ background: '#FAF8F5', minHeight: '100vh' }}>

            {/* Bloc noir 20vh */}
            <div style={{ background: '#0d0d0d', height: '20vh' }} />

            {/* Layout deux colonnes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh' }}>

                {/* Colonne gauche — formulaire */}
                <div style={{ padding: '80px 64px 100px 80px' }}>
                    <h1 style={{ ...font, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 500, lineHeight: 1.1, marginBottom: '16px' }}>
                        CONTACTER LA MAISON.
                    </h1>
                    <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '56px', lineHeight: 1.8 }}>
                        POUR TOUTE DEMANDE, NOS ÉQUIPES SONT À VOTRE DISPOSITION DU LUNDI AU VENDREDI, 10H00–18H00 (HEURE DE PARIS).
                    </p>

                    {sent ? (
                        <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>{t('merci')}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <input type="text" placeholder="PRÉNOM NOM *" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} style={inputStyle} />
                                <input type="email" placeholder="E-MAIL *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                            </div>

                            <select value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })} style={{ ...inputStyle, marginBottom: '24px', color: form.pays ? '#111' : 'rgba(0,0,0,0.35)', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}>
                                <option value="" disabled>PAYS / RÉGION *</option>
                                <option value="fr">France</option>
                                <option value="be">Belgique</option>
                                <option value="ch">Suisse</option>
                                <option value="lu">Luxembourg</option>
                                <option value="other">Autre</option>
                            </select>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <input type="text" placeholder="CODE POSTAL *" value={form.codePostal} onChange={e => setForm({ ...form, codePostal: e.target.value })} style={inputStyle} />
                                <input type="text" placeholder="VILLE *" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} style={inputStyle} />
                            </div>

                            <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} style={{ ...inputStyle, marginBottom: '24px', color: form.sujet ? '#111' : 'rgba(0,0,0,0.35)', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}>
                                <option value="" disabled>INFORMATIONS SUR NOS COCKTAILS</option>
                                {options.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>

                            <textarea placeholder="VOTRE MESSAGE *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{ ...inputStyle, resize: 'vertical', marginBottom: '32px' }} />

                            <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px', lineHeight: 1.8 }}>
                                LES CHAMPS AVEC UNE * SONT OBLIGATOIRES.
                            </p>
                            <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '24px', lineHeight: 1.8 }}>
                                VOS DONNÉES PERSONNELLES SONT TRAITÉES PAR DYANE PARIS AFIN DE RÉPONDRE À VOTRE DEMANDE.{' '}
                                <a href="/confidentialite" style={{ color: '#000', textDecoration: 'underline' }}>POLITIQUE DE CONFIDENTIALITÉ</a>.
                            </p>

                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '40px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.newsletter} onChange={e => setForm({ ...form, newsletter: e.target.checked })} style={{ marginTop: '2px', cursor: 'pointer' }} />
                                <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.4, lineHeight: 1.8 }}>
                                    OUI, JE SOUHAITE RECEVOIR DES COMMUNICATIONS PERSONNALISÉES ET INVITATIONS. DÉSINSCRIPTION À TOUT MOMENT.
                                </span>
                            </label>

                            <button
                                onClick={handleSubmit}
                                style={{ ...lora, background: '#111', color: '#fff', border: 'none', padding: '18px 24px', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s ease' }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                ENVOYER
                            </button>
                        </div>
                    )}
                </div>

                {/* Colonne droite — image petite + texte bas */}
                <div style={{ padding: '80px 80px 100px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
                        <Image
                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777491991/Capture_d_ecran_2026-04-26_a_11.55.45_1_pallld.png"
                            alt="Dyane Paris"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '48px' }}>
                        <p style={{ ...font, fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 500, lineHeight: 1, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#111', opacity: 0.08 }}>
                            CONTACTER<br />LA CONCIERGERIE
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
