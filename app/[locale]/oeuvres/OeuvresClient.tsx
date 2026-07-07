'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

const oeuvres = [
    {
        id: 'no1',
        href: '/oeuvres/dyane-paris-pornstar-martini-70-cl',
        titre: 'DYANE NO.1',
        cle_sous_titre: 'no1_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/3_ijldt6.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/8_lvzjty.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/10_kzmspj.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779635735/1_wstqkf.png',
        ]
    },
    {
        id: 'no2',
        href: '/oeuvres/dyane-no2-moscow-mule',
        titre: 'DYANE NO.2',
        cle_sous_titre: 'no2_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779635739/3_rtyiii.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/7_swv5cg.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/9_a5maeo.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779635735/2_afowta.png',
        ]
    },
    {
        id: 'teo',
        href: '/oeuvres/bouteille-signee-teokaykay',
        titre: 'TEO FOR DYANE',
        cle_sous_titre: 'teo_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443893/Capture_d_ecran_2026-04-02_a_14.01.13_rixjqx.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443930/Capture_d_ecran_2026-04-02_a_13.55.34_lebijo.png',
        ]
    },
]

function MobileCarousel({ images, href, titre }: { images: string[], href: string, titre: string }) {
    const [current, setCurrent] = useState(0)
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Link href={href} style={{ display: 'block', position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <Image src={images[current]} alt={titre} fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </Link>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: i === current ? '20px' : '6px',
                            height: '2px',
                            background: i === current ? '#111' : 'rgba(0,0,0,0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
            {/* Prev/Next */}
            {images.length > 1 && (
                <>
                    <button onClick={() => setCurrent((current - 1 + images.length) % images.length)} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', padding: '8px 12px', fontSize: '16px' }}>‹</button>
                    <button onClick={() => setCurrent((current + 1) % images.length)} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', padding: '8px 12px', fontSize: '16px' }}>›</button>
                </>
            )}
        </div>
    )
}

export default function OeuvresClient() {
    const t = useTranslations('oeuvres')
    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .oeuvres-hero { height: 60vh !important; }
                    .oeuvres-hero-text { left: 24px !important; bottom: 24px !important; }
                    .oeuvres-section-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .oeuvres-desktop-grid { display: none !important; }
                    .oeuvres-mobile-carousel { display: block !important; }
                    .oeuvres-section-pad { padding: 40px 20px !important; }
                }
                @media (min-width: 769px) {
                    .oeuvres-desktop-grid { display: grid !important; }
                    .oeuvres-mobile-carousel { display: none !important; }
                }
            `}</style>
            <main style={{ background: '#fff' }}>
                <section className="oeuvres-hero" style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                    <Image src="/dyane-paris-collection-oeuvres.webp" alt="Collection Dyane Paris — flacons de cocktails de luxe en porcelaine peinte à la main" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                    <div className="oeuvres-hero-text" style={{ position: 'absolute', bottom: '48px', left: '48px' }}>
                        <p style={{ ...font, color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 400 }}>
                            {t('decouvrir_intro')}
                        </p>
                    </div>
                </section>

                {oeuvres.map((oeuvre) => (
                    <section key={oeuvre.id} className="oeuvres-section-pad" style={{ padding: '60px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <div className="oeuvres-section-grid" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px', alignItems: 'start' }}>

                            {/* Texte */}
                            <div>
                                <h2 style={{ ...font, fontSize: '22px', fontWeight: 600, letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase' }}>{oeuvre.titre}</h2>
                                <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, lineHeight: 1.6, margin: '0 0 24px' }}>{t(oeuvre.cle_sous_titre)}</p>
                                <Link href={oeuvre.href} style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.4)', paddingBottom: '4px' }}>
                                    {t('decouvrir')}
                                </Link>
                            </div>

                            {/* Desktop : grille 4 colonnes */}
                            <div className="oeuvres-desktop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {oeuvre.images.map((src, i) => (
                                    <Link key={i} href={oeuvre.href} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', display: 'block' }}>
                                        <Image src={src} alt={`${oeuvre.titre} ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile : carousel */}
                            <div className="oeuvres-mobile-carousel" style={{ display: 'none' }}>
                                <MobileCarousel images={oeuvre.images} href={oeuvre.href} titre={oeuvre.titre} />
                            </div>
                        </div>
                    </section>
                ))}
            </main>
        </>
    )
}
