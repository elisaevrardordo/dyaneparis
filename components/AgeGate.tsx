'use client'
import { useState, useEffect } from 'react'

const cormorant = 'Cormorant Garamond, Garamond, serif'
const lora = 'Lora, serif'
const playfair = 'Playfair Display, serif'
const bordeaux = '#6B1A2A'

export default function AgeGate({ currentLocale }: { currentLocale: string }) {
    const [visible, setVisible] = useState(false)
    const [hovering, setHovering] = useState<string | null>(null)
    const lang = currentLocale === 'en' ? 'en' : 'fr'

    useEffect(() => {
        const confirmed = sessionStorage.getItem('age-confirmed')
        sessionStorage.removeItem('age-lang')
        if (!confirmed) setVisible(true)
    }, [])

    function confirm() {
        sessionStorage.setItem('age-confirmed', 'true')
        setVisible(false)
    }

    function deny() {
        window.location.href = 'https://www.google.com'
    }

    if (!visible) return null

    const t = {
        headline: lang === 'fr'
            ? <span>Cette Maison est réservée<br />aux personnes majeures.</span>
            : <span>This Maison is reserved<br />for those of legal age.</span>,
        sub: lang === 'fr' ? 'Veuillez confirmer pour continuer.' : 'Please confirm to continue.',
        yes: lang === 'fr' ? "J'ai l'âge légal" : 'I Am of Legal Age',
        no: lang === 'fr' ? "Je n'ai pas l'âge légal" : 'I Am Not of Legal Age',
        legal: lang === 'fr'
            ? <>En accédant, vous confirmez être majeur et acceptez nos <a href={`/${lang}/confidentialite`} style={{ color: '#999', textDecoration: 'underline' }}>Conditions d'utilisation</a>.</>
            : <>By entering, you confirm you are of legal drinking age and agree to our <a href={`/${lang}/confidentialite`} style={{ color: '#999', textDecoration: 'underline' }}>Terms of Use and Privacy Policy</a>.</>,
    }

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .agegate-card {
                        padding: 28px 24px 24px !important;
                        margin: 16px !important;
                        width: calc(100% - 32px) !important;
                    }
                    .agegate-logo { height: 70px !important; margin-bottom: 20px !important; }
                    .agegate-headline { font-size: 20px !important; margin-bottom: 8px !important; }
                    .agegate-sub { font-size: 11px !important; margin-bottom: 20px !important; }
                    .agegate-btn { padding: 12px 16px !important; font-size: 10px !important; }
                    .agegate-legal { font-size: 9px !important; margin-top: 18px !important; }
                }
            `}</style>
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'url(/hero.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

                <div className="agegate-card" style={{
                    position: 'relative',
                    background: '#fff',
                    width: '100%',
                    maxWidth: '480px',
                    padding: '48px 44px 36px',
                    textAlign: 'center',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                }}>
                    {/* Logo */}
                    <div style={{ marginBottom: '36px' }}>
                        <img
                            className="agegate-logo"
                            src="/LogoDYANE_noir.png"
                            alt="Dyane Paris"
                            style={{ height: '110px', width: 'auto', display: 'inline-block' }}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement
                                img.src = '/LogoDYANE_blanc.png'
                                img.style.filter = 'invert(1)'
                            }}
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="agegate-headline" style={{
                        fontFamily: cormorant,
                        fontSize: 'clamp(20px, 3.5vw, 28px)',
                        fontWeight: 400,
                        lineHeight: 1.45,
                        color: '#111',
                        marginBottom: '12px',
                        letterSpacing: '0.02em',
                    }}>
                        {t.headline}
                    </h1>

                    {/* Subline */}
                    <p className="agegate-sub" style={{
                        fontFamily: lora,
                        fontSize: '12px',
                        color: '#aaa',
                        marginBottom: '28px',
                        lineHeight: 1.6,
                    }}>
                        {t.sub}
                    </p>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            className="agegate-btn"
                            onClick={confirm}
                            onMouseEnter={() => setHovering('yes')}
                            onMouseLeave={() => setHovering(null)}
                            style={{
                                fontFamily: playfair,
                                background: hovering === 'yes' ? bordeaux : 'transparent',
                                color: hovering === 'yes' ? '#fff' : bordeaux,
                                border: `1px solid ${bordeaux}`,
                                padding: '15px 24px',
                                fontSize: '11px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                width: '100%',
                            }}
                        >
                            {t.yes}
                        </button>

                        <button
                            className="agegate-btn"
                            onClick={deny}
                            onMouseEnter={() => setHovering('no')}
                            onMouseLeave={() => setHovering(null)}
                            style={{
                                fontFamily: playfair,
                                background: 'transparent',
                                color: hovering === 'no' ? '#555' : '#ccc',
                                border: '1px solid #eee',
                                padding: '15px 24px',
                                fontSize: '11px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                width: '100%',
                            }}
                        >
                            {t.no}
                        </button>
                    </div>

                    {/* Legal */}
                    <p className="agegate-legal" style={{
                        fontFamily: lora,
                        color: '#ccc',
                        fontSize: '10px',
                        lineHeight: 1.9,
                        marginTop: '28px',
                        letterSpacing: '0.03em',
                    }}>
                        {t.legal}
                    </p>
                </div>
            </div>
        </>
    )
}
