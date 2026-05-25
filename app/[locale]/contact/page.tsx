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
        prenom: '',
        email: '',
        pays: '',
        codePostal: '',
        ville: '',
        sujet: '',
        message: '',
        newsletter: false
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
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        background: 'transparent',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        outline: 'none',
        boxSizing: 'border-box' as const,
        color: '#fff',
    }

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .contact-inner {
                        grid-template-columns: 1fr !important;
                    }

                    .contact-form-col {
                        padding: 40px 24px 60px !important;
                    }

                    .contact-form-row {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }

                    .contact-h1 {
                        font-size: 26px !important;
                    }
                }

                input,
                textarea,
                select {
                    background: transparent !important;
                    color: #fff !important;
                    -webkit-text-fill-color: #fff !important;
                }

                input::placeholder {
                    color: rgba(255,255,255,0.45) !important;
                }

                textarea::placeholder {
                    color: rgba(255,255,255,0.45) !important;
                }

                select option {
                    color: #111 !important;
                    background: #fff !important;
                }

                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                    -webkit-text-fill-color: #fff !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>

            <main
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    overflow: 'hidden'
                }}
            >
                {/* Image de fond plein écran */}
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 0
                    }}
                >
                    <Image
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779719956/Design_sans_titre_62_xo5qpq.png"
                        alt="Dyane Paris Contact"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />

                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.45)'
                        }}
                    />
                </div>

                {/* Contenu */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'stretch'
                    }}
                >
                    <div
                        className="contact-inner"
                        style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr'
                        }}
                    >
                        {/* Colonne gauche */}
                        <div
                            className="contact-form-col"
                            style={{
                                padding: '120px 64px 80px 80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <p
                                style={{
                                    ...lora,
                                    fontSize: '9px',
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.5)',
                                    marginBottom: '16px'
                                }}
                            >
                                Dyane Paris
                            </p>

                            <h1
                                className="contact-h1"
                                style={{
                                    ...font,
                                    fontSize: 'clamp(24px, 3vw, 40px)',
                                    fontWeight: 400,
                                    lineHeight: 1.15,
                                    marginBottom: '12px',
                                    color: '#fff',
                                    textTransform: 'uppercase'
                                }}
                            >
                                CONTACTER LA MAISON.
                            </h1>

                            <p
                                style={{
                                    ...lora,
                                    fontSize: '10px',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.5)',
                                    marginBottom: '48px',
                                    lineHeight: 1.8
                                }}
                            >
                                LUNDI AU VENDREDI — 10H00 À 18H00, HEURE DE PARIS.
                            </p>

                            {sent ? (
                                <p
                                    style={{
                                        ...font,
                                        fontSize: '16px',
                                        lineHeight: 1.8,
                                        color: '#fff',
                                        opacity: 0.9
                                    }}
                                >
                                    {t('merci')}
                                </p>
                            ) : (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    {/* Ligne prénom / email */}
                                    <div
                                        className="contact-form-row"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '24px',
                                            marginBottom: '24px'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="PRÉNOM NOM *"
                                            value={form.prenom}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    prenom: e.target.value
                                                })
                                            }
                                            style={inputStyle}
                                        />

                                        <input
                                            type="email"
                                            placeholder="E-MAIL *"
                                            value={form.email}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value
                                                })
                                            }
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* Le reste de ton formulaire continue ici exactement pareil */}
                                </div>
                            )}
                        </div>

                        {/* Colonne droite */}
                        <div />
                    </div>
                </div>
            </main>
        </>
    )
}
