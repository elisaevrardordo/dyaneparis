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
        newsletter: false,
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    const options = t.raw('options') as string[]

    const inputStyle = {
        ...lora,
        width: '100%',
        padding: '16px 18px',
        border: '1px solid rgba(255,255,255,0.72)',
        background: 'transparent',
        fontSize: '11px',
        letterSpacing: '0.18em',
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
                    .contact-inner {
                        grid-template-columns: 1fr !important;
                    }

                    .contact-form-col {
                        padding: 96px 20px 56px !important;
                    }

                    .contact-card {
                        padding: 34px 22px !important;
                    }

                    .contact-form-row {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }

                    .contact-h1 {
                        font-size: 28px !important;
                    }
                }

                input.contact-field,
                textarea.contact-field,
                select.contact-field {
                    background: transparent !important;
                    background-color: transparent !important;
                    color: #fff !important;
                    -webkit-text-fill-color: #fff !important;
                    border: 1px solid rgba(255,255,255,0.72) !important;
                    border-radius: 0 !important;
                }

                .contact-field::placeholder {
                    color: #fff !important;
                    -webkit-text-fill-color: #fff !important;
                    opacity: 1 !important;
                }

                select option {
                    color: #111 !important;
                    background: #fff !important;
                }

                .contact-field:focus {
                    border-color: #fff !important;
                }

                .contact-field:-webkit-autofill,
                .contact-field:-webkit-autofill:hover,
                .contact-field:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                    -webkit-text-fill-color: #fff !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>

            <main
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    background: '#000',
                }}
            >
                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    <Image
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779719956/Design_sans_titre_62_xo5qpq.png"
                        alt="Dyane Paris Contact"
                        fill
                        priority
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.58) 46%, rgba(0,0,0,0.18) 100%)',
                        }}
                    />
                </div>

                <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
                    <div
                        className="contact-inner"
                        style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '52% 48%',
                            minHeight: '100vh',
                        }}
                    >
                        <div
                            className="contact-form-col"
                            style={{
                                padding: '140px 72px 80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <section
                                className="contact-card"
                                style={{
                                    width: '100%',
                                    maxWidth: '720px',
                                    padding: '52px 56px',
                                    background: 'transparent',
                                    border: 'none',
                                    backdropFilter: 'none',
                                    WebkitBackdropFilter: 'none',
                                    boxShadow: 'none',
                                }}
                            >
                                <p
                                    style={{
                                        ...lora,
                                        fontSize: '9px',
                                        letterSpacing: '0.35em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.72)',
                                        marginBottom: '18px',
                                    }}
                                >
                                    Dyane Paris
                                </p>

                                <h1
                                    className="contact-h1"
                                    style={{
                                        ...font,
                                        fontSize: 'clamp(28px, 3.2vw, 48px)',
                                        fontWeight: 400,
                                        lineHeight: 0.95,
                                        marginBottom: '18px',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Contacter la Maison.
                                </h1>

                                <p
                                    style={{
                                        ...lora,
                                        fontSize: '10px',
                                        letterSpacing: '0.24em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.62)',
                                        marginBottom: '44px',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    Lundi au vendredi — 10h00 à 18h00, heure de Paris.
                                </p>

                                {sent ? (
                                    <p style={{ ...font, fontSize: '20px', lineHeight: 1.8, color: '#fff' }}>
                                        {t('merci')}
                                    </p>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div
                                            className="contact-form-row"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '32px',
                                                marginBottom: '24px',
                                            }}
                                        >
                                            <input className="contact-field" placeholder="PRÉNOM NOM *" style={inputStyle} />
                                            <input className="contact-field" type="email" placeholder="E-MAIL *" style={inputStyle} />
                                        </div>

                                        <select className="contact-field" style={{ ...inputStyle, marginBottom: '24px' }}>
                                            <option value="" disabled>
                                                PAYS / RÉGION *
                                            </option>
                                            <option value="fr">France</option>
                                            <option value="be">Belgique</option>
                                            <option value="ch">Suisse</option>
                                            <option value="lu">Luxembourg</option>
                                            <option value="other">Autre</option>
                                        </select>

                                        <div
                                            className="contact-form-row"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '32px',
                                                marginBottom: '24px',
                                            }}
                                        >
                                            <input className="contact-field" placeholder="CODE POSTAL *" style={inputStyle} />
                                            <input className="contact-field" placeholder="VILLE *" style={inputStyle} />
                                        </div>

                                        <select className="contact-field" style={{ ...inputStyle, marginBottom: '24px' }}>
                                            <option value="" disabled>
                                                INFORMATIONS SUR NOS COCKTAILS
                                            </option>
                                            {options.map((opt: string) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>

                                        <textarea
                                            className="contact-field"
                                            placeholder="VOTRE MESSAGE *"
                                            rows={4}
                                            style={{
                                                ...inputStyle,
                                                resize: 'none',
                                                marginBottom: '30px',
                                            }}
                                        />

                                        <p
                                            style={{
                                                ...lora,
                                                fontSize: '9px',
                                                letterSpacing: '0.16em',
                                                textTransform: 'uppercase',
                                                color: 'rgba(255,255,255,0.54)',
                                                marginBottom: '18px',
                                                lineHeight: 1.9,
                                            }}
                                        >
                                            Les champs avec une * sont obligatoires.
                                        </p>

                                        <p
                                            style={{
                                                ...lora,
                                                fontSize: '9px',
                                                letterSpacing: '0.16em',
                                                textTransform: 'uppercase',
                                                color: 'rgba(255,255,255,0.54)',
                                                marginBottom: '28px',
                                                lineHeight: 1.9,
                                            }}
                                        >
                                            Vos données personnelles sont traitées par Dyane Paris afin de répondre à votre demande.{' '}
                                            <a
                                                href="/confidentialite"
                                                style={{
                                                    color: '#fff',
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                Politique de confidentialité
                                            </a>
                                            .
                                        </p>

                                        <button
                                            type="submit"
                                            style={{
                                                ...lora,
                                                background: 'rgba(255,255,255,0.92)',
                                                color: '#111',
                                                border: '1px solid rgba(255,255,255,0.5)',
                                                padding: '18px 24px',
                                                fontSize: '10px',
                                                letterSpacing: '0.35em',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                width: '100%',
                                            }}
                                        >
                                            Envoyer
                                        </button>
                                    </form>
                                )}
                            </section>
                        </div>

                        <div />
                    </div>
                </div>
            </main>
        </>
    )
}
