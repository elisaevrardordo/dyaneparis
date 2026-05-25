'use client'
import { useTranslations } from 'next-intl'

export default function HeroVideo() {
    const t = useTranslations('hero')
    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .hero-text { left: 24px !important; bottom: 40px !important; max-width: 90% !important; }
                    .hero-titre { font-size: clamp(22px, 6vw, 32px) !important; }
                    .hero-sous-titre { font-size: 11px !important; }
                }
            `}</style>
            <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0d0d0d' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="https://res.cloudinary.com/dazhkrimv/video/upload/f_jpg,q_auto,w_1920/v1777381608/0315_1_5_wghim4.jpg"
                    aria-hidden="true"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                >
                    <source src="https://res.cloudinary.com/dazhkrimv/video/upload/f_mp4,q_auto/v1777381608/0315_1_5_wghim4.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
                <div className="hero-text" style={{ position: 'absolute', bottom: '60px', left: '48px', textAlign: 'left', color: '#fff', maxWidth: '600px' }}>
                    <p style={{ fontFamily: 'var(--font-lora), serif', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 12px' }}>{t('kicker')}</p>
                    <h1 className="hero-titre" style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(16px, 2vw, 28px)', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2, margin: '0 0 16px' }}>{t('titre')}</h1>
                    <p className="hero-sous-titre" style={{ fontFamily: 'var(--font-lora), serif', fontSize: '12px', letterSpacing: '0.06em', lineHeight: 1.7, opacity: 0.75, margin: 0 }}>{t('sous_titre')}</p>
                </div>
            </section>
        </>
    )
}
