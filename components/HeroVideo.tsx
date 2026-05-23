'use client'
import { useTranslations } from 'next-intl'

export default function HeroVideo() {
    const t = useTranslations('home')
    return (
        <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0d0d0d' }}>
            <video
                autoPlay
                muted
                loop
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            >
                <source src="https://res.cloudinary.com/dazhkrimv/video/upload/v1777381608/0315_1_5_wghim4.mov" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: '#fff', whiteSpace: 'nowrap' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.75, margin: 0 }}>{t('kicker')}</p>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1, margin: '16px 0' }}>{t('titre')}</h1>
            </div>
        </section>
    )
}
