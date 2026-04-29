'use client'
import Image from 'next/image'
import { useState } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }

const pays = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada', 'États-Unis', 'Royaume-Uni', 'Autre']
const sujets = ['Informations sur nos cocktails', 'Commande professionnelle', 'Partenariat', 'Presse', 'Autre']

export default function ContactPage() {
    const [form, setForm] = useState({ nom: '', email: '', pays: '', codePostal: '', ville: '', sujet: '', message: '', newsletter: false })
    const [sent, setSent] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    if (sent) return (
        <main style={{ background: '#FAF8F5', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>DYANE PARIS</p>
                <h2 style={{ ...font, fontSize: '32px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '16px' }}>Merci pour votre message.</h2>
                <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Notre équipe vous répondra dans les plus brefs délais.</p>
            </div>
        </main>
    )

    return (
        <main style={{ background: '#FAF8F5' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
                {/* Formulaire */}
                <div style={{ padding: '80px 60px' }}>
                    <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1.1 }}>CONTACTER LA MAISON.</h1>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '48px', lineHeight: 1.7 }}>
                        POUR TOUTE DEMANDE, NOS ÉQUIPES SONT À VOTRE DISPOSITION DU LUNDI AU VENDREDI, 10H00–18H00 (HEURE DE PARIS).
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Nom + Email */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input
                                type="text" placeholder="PRÉNOM NOM *" required
                                value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                                style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none' }}
                            />
                            <input
                                type="email" placeholder="E-MAIL *" required
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none' }}
                            />
                        </div>

                        {/* Pays */}
                        <select
                            value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })}
                            style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23000\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                        >
                            <option value="">PAYS / RÉGION *</option>
                            {pays.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>

                        {/* Code postal + Ville */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input
                                type="text" placeholder="CODE POSTAL *"
                                value={form.codePostal} onChange={e => setForm({ ...form, codePostal: e.target.value })}
                                style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none' }}
                            />
                            <input
                                type="text" placeholder="VILLE *"
                                value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })}
                                style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none' }}
                            />
                        </div>

                        {/* Sujet */}
                        <select
                            value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                            style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23000\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                        >
                            <option value="">INFORMATIONS SUR NOS COCKTAILS</option>
                            {sujets.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Message */}
                        <textarea
                            placeholder="VOTRE MESSAGE *" required rows={6}
                            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                            style={{ ...font, padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.12)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', outline: 'none', resize: 'none' }}
                        />

                        <p style={{ ...font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, fontStyle: 'italic' }}>LES CHAMPS AVEC UNE * SONT OBLIGATOIRES.</p>

                        <p style={{ ...font, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, lineHeight: 1.7 }}>
                            VOS DONNÉES PERSONNELLES SONT TRAITÉES PAR DYANE PARIS AFIN DE RÉPONDRE À VOTRE DEMANDE.{' '}
                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>POLITIQUE DE CONFIDENTIALITÉ</span>.
                        </p>

                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.newsletter} onChange={e => setForm({ ...form, newsletter: e.target.checked })}
                                style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0 }}
                            />
                            <span style={{ ...font, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, lineHeight: 1.7 }}>
                                OUI, JE SOUHAITE RECEVOIR DES COMMUNICATIONS PERSONNALISÉES ET INVITATIONS. DÉSINSCRIPTION À TOUT MOMENT.
                            </span>
                        </label>

                        <button
                            type="submit"
                            style={{ ...font, background: '#000', color: '#fff', border: 'none', padding: '18px 24px', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px' }}
                        >
                            ENVOYER
                        </button>
                    </form>
                </div>

                {/* Image */}
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    <Image
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777491991/Capture_d_ecran_2026-04-26_a_11.55.45_1_pallld.png"
                        alt="Dyane Paris"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </main>
    )
}
