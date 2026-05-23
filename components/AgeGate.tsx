'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const cormorant = 'Cormorant Garamond, Garamond, serif'
const lora = 'Lora, serif'

export default function AgeGate({ currentLocale }: { currentLocale: string }) {
    const [visible, setVisible] = useState(false)
    const [lang, setLang] = useState<'fr' | 'en'>(currentLocale === 'en' ? 'en' : 'fr')
    const [langOpen, setLangOpen] = useState(false)
    const [hovering, setHovering] = useState<string | null>(null)

    const pathname = usePathname()

    useEffect(() => {
        const confirmed = sessionStorage.getItem('age-confirmed')
        const savedLang = sessionStorage.getItem('age-lang') as 'fr' | 'en' | null

        if (confirmed && savedLang) {
            const currentLocaleFromPath = pathname.split('/')[1]

            if (savedLang !== currentLocaleFromPath) {
                window.location.href = '/' + savedLang
            }

            return
        }

        if (!confirmed) setVisible(true)

        setLang(currentLocale === 'en' ? 'en' : 'fr')
    }, [pathname, currentLocale])

    function confirm() {
        sessionStorage.setItem('age-confirmed', 'true')
        sessionStorage.setItem('age-lang', lang)

        setVisible(false)

        window.location.href = '/' + lang
    }

    function deny() {
        window.location.href = 'https://www.google.com'
    }

    if (!visible) return null

    const t = {
        eyebrow:
            lang === 'fr'
                ? 'Réservé aux initiés'
                : 'Reserved for the initiated',

        headline:
            lang === 'fr'
                ? (
                    <span>
                        Cette Maison est réservée
                        <br />
                        aux personnes majeures.
                    </span>
                )
                : (
                    <span>
                        This Maison is reserved
                        <br />
                        for those of legal age.
                    </span>
                ),

        sub:
            lang === 'fr'
                ? 'Veuillez confirmer pour continuer.'
                : 'Please confirm to continue.',

        yes:
            lang === 'fr'
                ? "J'ai l'âge légal"
                : 'I Am of Legal Age',

        no:
            lang === 'fr'
                ? "Je n'ai pas l'âge légal"
                : 'I Am Not of Legal Age',

        legal:
            lang === 'fr'
                ? (
                    <>
                        En accédant, vous confirmez être majeur et acceptez nos{' '}
                        <a
                            href="/confidentialite"
                            style={{
                                color: '#9f8a5c',
                                textDecoration: 'underline',
                            }}
                        >
                            Conditions d'utilisation
                        </a>.
                    </>
                )
                : (
                    <>
                        By entering, you confirm you are of legal drinking age and agree to our{' '}
                        <a
                            href="/confidentialite"
                            style={{
                                color: '#9f8a5c',
                                textDecoration: 'underline',
                            }}
                        >
                            Terms of Use and Privacy Policy
                        </a>.
                    </>
                ),

        langLabel:
            lang === 'fr'
                ? 'Langue'
                : 'Language',

        langName:
            lang === 'fr'
                ? 'Français'
                : 'English',
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url(/hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.62), rgba(0,0,0,0.68))',
                    backdropFilter: 'blur(2px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '520px',
                    background: '#f9f6f1',
                    padding: '58px 48px 42px',
                    textAlign: 'center',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                <div style={{ marginBottom: '36px' }}>
                    <img
                        src="/LogoDYANE_noir.png"
                        alt="Dyane Paris"
                        style={{
                            height: '64px',
                            width: 'auto',
                            display: 'inline-block',
                        }}
                    />
                </div>

                <div
                    style={{
                        marginBottom: '42px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ position: 'relative', width: '230px' }}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: '1px solid #d8c7a0',
                                padding: '14px 18px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    marginBottom: '4px',
                                    fontFamily: lora,
                                    fontSize: '9px',
                                    letterSpacing: '0.24em',
                                    textTransform: 'uppercase',
                                    color: '#b8a98a',
                                }}
                            >
                                {t.langLabel}
                            </span>

                            <span
                                style={{
                                    fontFamily: lora,
                                    fontSize: '13px',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: '#111',
                                }}
                            >
                                {t.langName}
                            </span>

                            <span
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: langOpen
                                        ? 'translateY(-50%) rotate(180deg)'
                                        : 'translateY(-50%)',
                                    color: '#b8a98a',
                                    transition: 'transform 0.2s ease',
                                }}
                            >
                                ▾
                            </span>
                        </button>

                        {langOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    width: '100%',
                                    background: '#f9f6f1',
                                    border: '1px solid #d8c7a0',
                                    borderTop: 'none',
                                    zIndex: 10,
                                }}
                            >
                                {(['fr', 'en'] as const).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => {
                                            setLang(l)
                                            setLangOpen(false)
                                        }}
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '14px 18px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontFamily: lora,
                                            fontSize: '12px',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: lang === l ? '#111' : '#9f9f9f',
                                        }}
                                    >
                                        {l === 'fr' ? 'Français' : 'English'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        width: '42px',
                        height: '1px',
                        background: '#d8c7a0',
                        margin: '0 auto 26px',
                    }}
                />

                <p
                    style={{
                        fontFamily: lora,
                        fontSize: '10px',
                        letterSpacing: '0.36em',
                        textTransform: 'uppercase',
                        color: '#b89b67',
                        marginBottom: '18px',
                    }}
                >
                    {t.eyebrow}
                </p>

                <h1
                    style={{
                        fontFamily: cormorant,
                        fontSize: 'clamp(34px, 4vw, 56px)',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: '#111',
                        marginBottom: '18px',
                    }}
                >
                    {t.headline}
                </h1>

                <p
                    style={{
                        fontFamily: lora,
                        fontSize: '13px',
                        letterSpacing: '0.08em',
                        color: '#8e8b84',
                        marginBottom: '42px',
                    }}
                >
                    {t.sub}
                </p>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                    }}
                >
                    <button
                        onClick={confirm}
                        onMouseEnter={() => setHovering('yes')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            width: '100%',
                            padding: '18px 24px',
                            background:
                                hovering === 'yes'
                                    ? '#111'
                                    : 'linear-gradient(to right, #111, #1d1d1d)',
                            color: '#f1e2b8',
                            border: '1px solid #b89b67',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: lora,
                            fontSize: '11px',
                            letterSpacing: '0.34em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {t.yes}
                    </button>

                    <button
                        onClick={deny}
                        onMouseEnter={() => setHovering('no')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            width: '100%',
                            padding: '18px 24px',
                            background: 'transparent',
                            color: hovering === 'no' ? '#111' : '#b7b0a3',
                            border: '1px solid #ddd4c5',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: lora,
                            fontSize: '11px',
                            letterSpacing: '0.34em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {t.no}
                    </button>
                </div>

                <p
                    style={{
                        marginTop: '34px',
                        fontFamily: lora,
                        fontSize: '10px',
                        lineHeight: 1.9,
                        color: '#a7a29a',
                    }}
                >
                    {t.legal}
                </p>
            </div>
        </div>
    )
}
