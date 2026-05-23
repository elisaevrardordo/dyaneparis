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
        headline: lang === 'fr'
            ? <span>Cette Maison est réservée<br />aux personnes majeures.</span>
            : <span>This Maison is reserved<br />for those of legal age.</span>,
        sub: lang === 'fr' ? 'Veuillez confirmer pour continuer.' : 'Please confirm to continue.',
        yes: lang === 'fr' ? "J'ai l'âge légal" : 'I Am of Legal Age',
        no: lang === 'fr' ? "Je n'ai pas l'âge légal" : 'I Am Not of Legal Age',
        legal: lang === 'fr'
            ? <>En accédant, vous confirmez être majeur et acceptez nos <a href="/confidentialite" style={{ color: '#999', textDecoration: 'underline' }}>Conditions d'utilisation</a>.</>
            : <>By entering, you confirm you are of legal drinking age and agree to our <a href="/confidentialite" style={{ color: '#999', textDecoration: 'underline' }}>Terms of Use and Privacy Policy</a>.</>,
        langLabel: lang === 'fr' ? 'Langue' : 'Language',
        langName: lang === 'fr' ? 'Français' : 'English',
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

            <div style={{
                position: 'relative',
                background: '#fff',
                width: '100%',
                maxWidth: '460px',
                padding: '48px 44px 36px',
                textAlign: 'center',
                boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '28px' }}>
                    <img
                        src="/LogoDYANE_noir.png"
                        alt="Dyane Paris"
                        style={{ height: '80px', width: 'auto', display: 'inline-block' }}
                        onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = '/LogoDYANE_blanc.png'
                            img.style.filter = 'invert(1)'
                        }}
                    />
                </div>

                {/* Language selector */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '200px' }}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            style={{
                                width: '100%',
                                fontFamily: lora,
                                fontSize: '9px',
                                letterSpacing: '0.28em',
                                textTransform: 'uppercase',
                                color: '#111',
                                background: 'transparent',
                                border: '1px solid #ddd',
                                padding: '11px 36px 11px 14px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                transition: 'border-color 0.2s ease',
                            }}
                        >
                            <span style={{
                                fontFamily: lora,
                                fontSize: '8px',
                                letterSpacing: '0.2em',
                                color: '#bbb',
                                display: 'block',
                                marginBottom: '3px',
                                textTransform: 'uppercase',
                            }}>
                                {t.langLabel}
                            </span>
                            {t.langName}
                            <span style={{
                                position: 'absolute',
                                right: '14px',
                                top: '50%',
                                transform: langOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
                                transition: 'transform 0.2s ease',
                                fontSize: '9px',
                                color: '#bbb',
                            }}>▾</span>
                        </button>

                        {langOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderTop: 'none',
                                zIndex: 10,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                            }}>
                                {(['fr', 'en'] as const).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => { setLang(l); setLangOpen(false) }}
                                        style={{
                                            width: '100%',
                                            fontFamily: lora,
                                            fontSize: '9px',
                                            letterSpacing: '0.25em',
                                            textTransform: 'uppercase',
                                            color: lang === l ? '#111' : '#aaa',
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '12px 14px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'color 0.15s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#111')}
                                        onMouseLeave={e => (e.currentTarget.style.color = lang === l ? '#111' : '#aaa')}
                                    >
                                        <span style={{ width: '14px', display: 'inline-block' }} />
                                        {l === 'fr' ? 'Français' : 'English'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontFamily: cormorant,
                    fontSize: 'clamp(22px, 3.5vw, 28px)',
                    fontWeight: 400,
                    lineHeight: 1.45,
                    color: '#111',
                    marginBottom: '10px',
                    letterSpacing: '0.02em',
                }}>
                    {t.headline}
                </h1>

                {/* Subline */}
                <p style={{
                    fontFamily: lora,
                    fontSize: '12px',
                    color: '#aaa',
                    marginBottom: '32px',
                    lineHeight: 1.6,
                }}>
                    {t.sub}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
    onClick={confirm}
    onMouseEnter={() => setHovering('yes')}
    onMouseLeave={() => setHovering(null)}
    style={{
        fontFamily: 'Playfair Display, serif',
        background: hovering === 'yes' ? '#6B1A2A' : 'transparent',
        color: hovering === 'yes' ? '#fff' : '#6B1A2A',
        border: '1px solid #6B1A2A',
        padding: '15px 24px',
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        width: '100%',
        fontStyle: 'italic',
    }}
>
    {t.yes}
</button>

<button
    onClick={deny}
    onMouseEnter={() => setHovering('no')}
    onMouseLeave={() => setHovering(null)}
    style={{
        fontFamily: 'Playfair Display, serif',
        background: 'transparent',
        color: hovering === 'no' ? '#6B1A2A' : '#ccc',
        border: '1px solid #eee',
        padding: '15px 24px',
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        width: '100%',
        fontStyle: 'italic',
    }}
>
    {t.no}
</button>
                </div>

                {/* Legal */}
                <p style={{
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
    )
}
