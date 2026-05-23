'use client'
import { useState, useEffect } from 'react'

export default function AgeGate() {
    const [visible, setVisible] = useState(false)
    const [hovering, setHovering] = useState<string | null>(null)

    useEffect(() => {
        const confirmed = sessionStorage.getItem('age-confirmed')
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

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

            <div style={{
                position: 'relative',
                background: '#fff',
                width: '100%',
                maxWidth: '480px',
                padding: '56px 48px 44px',
                textAlign: 'center',
                boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px', height: '1px',
                    background: '#c8a96e'
                }} />

                <div style={{ marginBottom: '36px' }}>
                    <img
                        src="/LogoDYANE_noir.png"
                        alt="Dyane Paris"
                        style={{ height: '64px', width: 'auto', display: 'inline-block' }}
                        onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = '/LogoDYANE_blanc.png'
                            img.style.filter = 'invert(1)'
                        }}
                    />
                </div>

                <p style={{
                    fontFamily: 'Cormorant Garamond, Garamond, serif',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#c8a96e',
                    marginBottom: '20px',
                }}>
                    Private Reserve
                </p>

                <h1 style={{
                    fontFamily: 'Cormorant Garamond, Garamond, serif',
                    fontSize: 'clamp(22px, 3.5vw, 28px)',
                    fontWeight: 400,
                    lineHeight: 1.45,
                    color: '#111',
                    marginBottom: '10px',
                    letterSpacing: '0.02em',
                }}>
                    This Maison is reserved<br />for those of legal age.
                </h1>

                <p style={{
                    fontFamily: 'Cormorant Garamond, Garamond, serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: '#888',
                    marginBottom: '40px',
                    lineHeight: 1.6,
                }}>
                    Please confirm to continue.
                </p>

                <div style={{
                    width: '32px', height: '1px',
                    background: '#ddd',
                    margin: '0 auto 36px'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={confirm}
                        onMouseEnter={() => setHovering('yes')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            fontFamily: 'Cormorant Garamond, Garamond, serif',
                            background: hovering === 'yes' ? '#111' : 'transparent',
                            color: hovering === 'yes' ? '#fff' : '#111',
                            border: '1px solid #111',
                            padding: '15px 24px',
                            fontSize: '11px',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            width: '100%',
                        }}
                    >
                        I Am of Legal Age
                    </button>

                    <button
                        onClick={deny}
                        onMouseEnter={() => setHovering('no')}
                        onMouseLeave={() => setHovering(null)}
                        style={{
                            fontFamily: 'Cormorant Garamond, Garamond, serif',
                            background: 'transparent',
                            color: hovering === 'no' ? '#555' : '#aaa',
                            border: '1px solid #e0e0e0',
                            padding: '15px 24px',
                            fontSize: '11px',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            width: '100%',
                        }}
                    >
                        I Am Not of Legal Age
                    </button>
                </div>

                <p style={{
                    fontFamily: 'Cormorant Garamond, Garamond, serif',
                    color: '#bbb',
                    fontSize: '11px',
                    lineHeight: 1.8,
                    marginTop: '32px',
                }}>
                    By entering, you confirm you are of legal drinking age<br />
                    and agree to our{' '}
                    <a href="/confidentialite" style={{ color: '#999', textDecoration: 'underline' }}>
                        Terms of Use and Privacy Policy
                    </a>.
                </p>

                <div style={{
                    position: 'absolute', bottom: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px', height: '1px',
                    background: '#c8a96e'
                }} />
            </div>
        </div>
    )
}
