'use client'
import { useState } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }
const BG = 'rgb(252, 250, 247)'

const inputStyle = {
    width: '100%',
    padding: '16px',
    border: '1px solid rgba(0,0,0,0.15)',
    background: BG,
    fontSize: '11px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    outline: 'none',
    color: '#111',
    fontFamily: 'Playfair Display, serif',
}

export default function ContactForm() {
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', country: '', zip: '', city: '', subject: '', message: '', newsletter: false
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    if (sent) return (
        <div style={{ background: BG, padding: '120px 24px', textAlign: 'center' }}>
            <p style={{ ...font, fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Merci, votre message a bien été envoyé.</p>
        </div>
    )

    return (
        <div style={{ background: BG }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

                {/* Colonne gauche — formulaire */}
                <div style={{ padding: '80px 64px 80px 80px' }}>
                    <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 64px)', fontWeight: 500, textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '24px' }}>CONTACTER LA MAISON.</h1>
                    <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.8, opacity: 0.7, marginBottom: '56px' }}>
                        POUR TOUTE DEMANDE, NOS ÉQUIPES SONT À VOTRE DISPOSITION DU LUNDI AU VENDREDI, 10H00–18H00 (HEURE DE PARIS).
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Prénom Nom + Email */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input
                                type="text"
                                placeholder="PRÉNOM NOM *"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={inputStyle}
                            />
                            <input
                                type="email"
                                placeholder="E-MAIL *"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        {/* Pays */}
                        <select
                            required
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23111' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer' }}
                        >
                            <option value="" disabled>PAYS / RÉGION *</option>
                            <option value="FR">France</option>
                            <option value="BE">Belgique</option>
                            <option value="CH">Suisse</option>
                            <option value="LU">Luxembourg</option>
                            <option value="MC">Monaco</option>
                            <option value="OTHER">Autre</option>
                        </select>

                        {/* Code postal + Ville */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input
                                type="text"
                                placeholder="CODE POSTAL *"
                                required
                                value={form.zip}
                                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="VILLE *"
                                required
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        {/* Sujet */}
                        <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23111' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer' }}
                        >
                            <option value="">INFORMATIONS SUR NOS COCKTAILS</option>
                            <option value="commande">Commande personnalisée</option>
                            <option value="evenement">Événement / Privatisation</option>
                            <option value="partenariat">Partenariat</option>
                            <option value="presse">Presse</option>
                            <option value="autre">Autre</option>
                        </select>

                        {/* Message */}
                        <textarea
                            placeholder="VOTRE MESSAGE *"
                            required
                            rows={6}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            style={{ ...inputStyle, resize: 'none' }}
                        />

                        {/* Mentions */}
                        <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, fontStyle: 'italic' }}>
                            LES CHAMPS AVEC UNE * SONT OBLIGATOIRES.
                        </p>
                        <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.7, opacity: 0.7 }}>
                            VOS DONNÉES PERSONNELLES SONT TRAITÉES PAR DYANE PARIS AFIN DE RÉPONDRE À VOTRE DEMANDE.{' '}
                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>POLITIQUE DE CONFIDENTIALITÉ</span>.
                        </p>

                        {/* Checkbox */}
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.newsletter}
                                onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                                style={{ marginTop: '2px', width: '14px', height: '14px', accentColor: '#111', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.7, opacity: 0.7 }}>
                                OUI, JE SOUHAITE RECEVOIR DES COMMUNICATIONS PERSONNALISÉES ET INVITATIONS. DÉSINSCRIPTION À TOUT MOMENT.
                            </span>
                        </label>

                        {/* Bouton */}
                        <button
                            type="submit"
                            style={{ width: '100%', padding: '20px', background: '#111', color: '#fff', border: 'none', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px' }}
                        >
                            ENVOYER
                        </button>

                    </form>
                </div>

                {/* Colonne droite — image */}
                <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                    <img
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445589/Capture_d_ecran_2026-04-26_a_11.55.45_areo1l.png"
                        alt="Dyane Paris"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

            </div>
        </div>
    )
}
