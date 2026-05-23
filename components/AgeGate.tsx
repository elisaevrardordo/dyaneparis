'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const cormorant = 'Cormorant Garamond, Garamond, serif'
const lora = 'Lora, serif'

export default function AgeGate() {
    const [visible, setVisible] = useState(false)
    const [lang, setLang] = useState<'fr' | 'en'>('fr')
    const [langOpen, setLangOpen] = useState(false)
    const [hovering, setHovering] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const confirmed = sessionStorage.getItem('age-confirmed')
        if (!confirmed) setVisible(true)
        setLang(pathname.startsWith('/en') ? 'en' : 'fr')
    }, [pathname])

    function confirm() {
        sessionStorage.setItem('age-confirmed', 'true')
        if (lang === 'en' && !pathname.startsWith('/en')) router.push('/en')
        else if (lang === 'fr' && pathname.startsWith('/en')) router.push('/')
        setVisible(false)
    }

    function deny() {
        window.location.href = 'https://www.google.com'
    }

    if (!visible) return null

    const t = {
        eyebrow: lang === 'fr' ? 'Réservé aux Initiés' : 'Private Reserve',
        headline: lang === 'fr'
            ? <span>Cette Maison est réservée<br />aux personnes majeures.</span>
            : <span>This Maison is reserved<br />for those of legal age.</span>,
        sub: lang === 'fr' ? 'Veuillez confirmer pour continuer.' : 'Please confirm to continue.',
        yes: lang === 'fr' ? "J'ai l'âge légal" : 'I Am of Legal Age',
        no: lang === 'fr' ? "Je n'ai pas l'âge légal" : 'I Am Not of Legal Age',
        legal: lang === 'fr'
            ? <>En accédant, vous confirmez être majeur et acceptez nos <a href="/confidentialite" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Conditions d'utilisation</a>.</>
            : <>By entering, you confirm you are of legal drinking age and agree to our <a href="/confidentialite" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Terms of Use and Privacy Policy</a>.</>,
        langLabel: lang === 'fr' ? 'Langue' : 'Language',
        langName: lang === 'fr' ? 'Français' : 'English',
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)' }} />

            {/* Logo */}
            <div style={{ position: 'relative', marginBottom: '48px', textAlign: 'center' }}>
                <img
                    src="/LogoDYANE_blanc.png"
                    alt="Dyane Paris"
                    style={{ height: '72px', width: 'auto', display: 'inline-block' }}
                />
            </div>

            {/* Center content */}
            <div style={{ position: 'relative', textAlign: 'center', maxWidth: '560px', padding: '0 24px' }}>

                <p style={{
                    fontFamily: lora,
                    fontSize: '9px',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '20px',
                }}>
                    {t.eyebrow}
                </p>

                <h1 style={{
                    fontFamily: cormorant,
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 400,
                    lineHeight: 1.35,
                    color: '#fff',
                    marginBottom: '16px',
                    letterSpacing: '0.02em',
                }}>
                    {t.headline}
                </h1>

                <p style={{
                    fontFamily: lora,
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '48px',
                    lineHeight: 1.6,
                }}>
                    {t.sub}
                </p>

                {/* Language selector */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '240px' }}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            style={{
                                width: '100%',
                                fontFamily: lora,
                                fontSize: '11px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#fff',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '14px 40px 14px 16px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            <span style={{
                                fontFamily: lora,
                                fontSize: '9px',
                                letterSpacing: '0.25em',
                                color: 'rgba(255,255,255,0.4)',
                                display: 'block',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                            }}>
                                {t.langLabel}
                            </span>
                            {t.langName}
                            <span style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: langOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
                                transition: 'transform 0.2s ease',
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.5)',
                            }}>▾</span>
                        </button>

                        {langOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                background: '#1a1a1a',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderTop: 'none',
                                zIndex: 10,
                            }}>
                                {(['fr', 'en'] as const).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => { setLang(l); setLangOpen(false) }}
                                        style={{
                                            width: '100%',
                                            fontFamily: lora,
                                            fontSize: '11px',
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: lang === l ? '#fff' : 'rgba(255,255,255,0.5)',
                                            background: lang === l ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            border: 'none',
                                            padding: '14px 16px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = lang === l ? 'rgba(255,255,255,0.1)' : 'transparent')}
                                    >
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', width: '16px' }}>
                                            {lang === l ? '✓' : ''}
                                        </span>
                                        {l === 'fr' ? 'Français' : 'English'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
                    <button
                        onClick={confirm}
                        onMouseEnter={() => setHovering('yes')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            fontFamily: lora,
                            background: hovering === 'yes' ? '#fff' : 'transparent',
                            color: hovering === 'yes' ? '#111' : '#fff',
                            border: '1px solid rgba(255,255,255,0.7)',
                            padding: '16px 24px',
                            fontSize: '11px',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            width: '100%',
                        }}
                    >
                        {t.yes}
                    </button>

                    <button
                        onClick={deny}
                        onMouseEnter={() => setHovering('no')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            fontFamily: lora,
                            background: 'transparent',
                            color: hovering === 'no' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '16px 24px',
                            fontSize: '11px',
                            letterSpacing: '0.28em',
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
                <p style={{
                    fontFamily: lora,
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '10px',
                    lineHeight: 1.9,
                    marginTop: '32px',
                    letterSpacing: '0.05em',
                }}>
                    {t.legal}
                </p>
            </div>
        </div>
    )
}
