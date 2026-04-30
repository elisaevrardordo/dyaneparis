'use client'
import { useState, useEffect } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }

export default function AgeGate() {
    const [visible, setVisible] = useState(false)

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
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
            <div style={{ position: 'relative', textAlign: 'center', padding: '40px 24px', maxWidth: '600px', width: '100%' }}>
                <div style={{ marginBottom: '48px' }}>
                    <img src="/LogoDYANE_blanc.png" alt="Dyane Paris" style={{ height: '70px', width: 'auto', display: 'inline-block' }} />
                </div>
                <h1 style={{ ...font, color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '48px' }}>
                    You must be of legal drinking age<br />to visit this site
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto 40px' }}>
                    <button onClick={confirm} style={{ ...font, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.6)', padding: '16px 24px', fontSize: '12px', letterSpacing: '0.26em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        I'M OF LEGAL AGE
                    </button>
                    <button onClick={deny} style={{ ...font, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '16px 24px', fontSize: '12px', letterSpacing: '0.26em', textTransform: 'uppercase', cursor: 'pointer', opacity: 0.7 }}>
                        I'M NOT OF LEGAL AGE
                    </button>
                </div>
                <p style={{ ...font, color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: 1.7 }}>
                    By accessing this website you acknowledge that you accept its terms and conditions of use.{' '}
                    <a href="/confidentialite" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>See privacy policy</a>
                </p>
            </div>
        </div>
    )
}
