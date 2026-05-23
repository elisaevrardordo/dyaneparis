'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const cormorant = 'Cormorant Garamond, Garamond, serif'
const lora = 'Lora, serif'

export default function AgeGate({
    currentLocale
}: {
    currentLocale: string
}) {
    const [visible, setVisible] = useState(false)
    const [lang, setLang] = useState<'fr' | 'en'>(
        currentLocale === 'en' ? 'en' : 'fr'
    )

    const router = useRouter()

    useEffect(() => {
        const confirmed = sessionStorage.getItem('age-confirmed')

        if (!confirmed) {
            setVisible(true)
        }
    }, [])

    function confirm() {
        sessionStorage.setItem('age-confirmed', 'true')

        if (lang === 'en') {
            router.push('/en')
        } else {
            router.push('/fr')
        }

        setVisible(false)
    }

    function deny() {
        window.location.href = 'https://google.com'
    }

    if (!visible) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                style={{
                    background: '#fff',
                    width: '100%',
                    maxWidth: '460px',
                    padding: '60px 50px',
                    textAlign: 'center',
                    position: 'relative'
                }}
            >
                {/* LANG */}
                <div
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        display: 'flex',
                        gap: '10px'
                    }}
                >
                    <button
                        onClick={() => setLang('fr')}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontFamily: lora,
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: lang === 'fr' ? '#111' : '#bbb'
                        }}
                    >
                        FR
                    </button>

                    <button
                        onClick={() => setLang('en')}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontFamily: lora,
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: lang === 'en' ? '#111' : '#bbb'
                        }}
                    >
                        EN
                    </button>
                </div>

                {/* LOGO */}
                <img
                    src="/LogoDYANE_noir.png"
                    alt="Dyane Paris"
                    style={{
                        height: '70px',
                        marginBottom: '34px'
                    }}
                />

                {/* TEXT */}
                <p
                    style={{
                        fontFamily: lora,
                        fontSize: '10px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: '#999',
                        marginBottom: '18px'
                    }}
                >
                    {lang === 'fr'
                        ? 'Maison Privée'
                        : 'Private Maison'}
                </p>

                <h1
                    style={{
                        fontFamily: cormorant,
                        fontSize: '40px',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: '20px'
                    }}
                >
                    {lang === 'fr'
                        ? 'Cette Maison est réservée aux personnes majeures.'
                        : 'This Maison is reserved for those of legal age.'}
                </h1>

                <p
                    style={{
                        fontFamily: lora,
                        fontSize: '13px',
                        color: '#777',
                        marginBottom: '36px'
                    }}
                >
                    {lang === 'fr'
                        ? 'Veuillez confirmer pour continuer.'
                        : 'Please confirm to continue.'}
                </p>

                {/* BUTTON */}
                <button
                    onClick={confirm}
                    style={{
                        width: '100%',
                        border: '1px solid #111',
                        background: '#111',
                        color: '#fff',
                        padding: '16px',
                        fontFamily: lora,
                        fontSize: '10px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}
                >
                    {lang === 'fr' ? 'Entrer' : 'Enter'}
                </button>

                <button
                    onClick={deny}
                    style={{
                        width: '100%',
                        border: '1px solid #ddd',
                        background: 'transparent',
                        color: '#999',
                        padding: '16px',
                        marginTop: '10px',
                        fontFamily: lora,
                        fontSize: '10px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}
                >
                    {lang === 'fr' ? 'Quitter' : 'Exit'}
                </button>
            </div>
        </div>
    )
}
