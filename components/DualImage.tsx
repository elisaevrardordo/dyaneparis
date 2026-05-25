'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

const bodoni = { fontFamily: '"Bodoni Moda", "Playfair Display", serif' }
const lora = { fontFamily: 'Lora, serif' }

export default function DualImage() {
    const t = useTranslations('dualimage')
    const [current, setCurrent] = useState(0)
    const [fade, setFade] = useState(true)

    const total = 3

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % total)
                setFade(true)
            }, 400)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .dual-slide1-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 24px !important; }
                    .dual-slide1-images { grid-template-columns: 1fr !important; }
                    .dual-slide1-img-small { display: none !important; }
                    .dual-slide2-text { left: 24px !important; top: 32px !important; max-width: 90% !important; font-size: 13px !important; }
                    .dual-slide3-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 24px !important; }
                }
            `}</style>

            {/* Image du haut */}
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image
                    src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779745931/Design_sans_titre_63_nbwcnv.png"
                    alt="Dyane Paris"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
            </section>

            {/* Section carousel — hauteur fixe uniforme */}
            <section style={{ background: '#FAF8F5', overflow: 'hidden', position: 'relative' }}>

                <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>

                    {/* SLIDE 1 */}
                    {current === 0 && (
                        <div className="dual-slide1-grid" style={{ padding: '80px 100px', minHeight: '800px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '80px', alignItems: 'center' }}>
                                <div className="dual-slide1-images" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
                                    <div className="dual-slide1-img-large" style={{ position: 'relative', height: '600px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779745940/CREATION_2_bwk7r0.png"
                                            alt="Dyane Paris Distillation"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 56vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="dual-slide1-img-small" style={{ position: 'relative', height: '600px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779745953/10_fl8iqj.png"
                                            alt="Dyane Paris"
                                            fill
                                            sizes="20vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, margin: '0 0 16px' }}>{t('label')}</p>
                                    <h2 style={{ ...bodoni, fontWeight: 400, fontSize: 'clamp(22px, 2.8vw, 40px)', lineHeight: 1.15, margin: '0 0 24px', textTransform: 'uppercase' }}>{t('titre')}</h2>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7, marginBottom: '28px' }}>{t('texte')}</p>
                                    <Link href="/distillation" style={{ ...lora, display: 'inline-block', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.35)', textDecoration: 'none', color: '#000', paddingBottom: '5px' }}>{t('cta')}</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 2 */}
{current === 1 && (
    <div style={{ position: 'relative', width: '100%', height: '800px' }}>
        <Image
            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779747067/Apre%CC%80s_les_vendanges_bordelaines_2_e0i2dx.png"
            alt="Distillation Dyane"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
        />
    </div>
)}
                    {/* SLIDE 3 */}
                    {current === 2 && (
                        <div className="dual-slide3-grid" style={{ padding: '80px 100px', minHeight: '800px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                                <div>
                                    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg"
                                            alt="Infusion"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '24px 0 12px', opacity: 0.45 }}>Infusion</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7 }}>Nos créations reposent sur une infusion lente d'ingrédients nobles : gingembre frais, vanille, fruits et épices, dans un alcool vinique d'exception, révélant une profondeur aromatique intense et raffinée.</p>
                                </div>
                                <div>
                                    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626279/ChatGPT_Image_24_mai_2026_14_09_25_rfymiu.png"
                                            alt="Assemblage"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '24px 0 12px', opacity: 0.45 }}>Assemblage</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7 }}>Chaque cocktail est minutieusement assemblé comme une œuvre d'art, équilibrant puissance, texture et élégance.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
