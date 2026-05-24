'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }
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
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    function goTo(i: number) {
        setFade(false)
        setTimeout(() => { setCurrent(i); setFade(true) }, 400)
    }

    return (
        <>
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

            <section style={{ background: '#FAF8F5', overflow: 'hidden' }}>
                <div style={{
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}>

                    {/* SLIDE 1 — images + texte */}
                    {current === 0 && (
                        <div style={{ padding: '68px 24px 72px' }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '64px', alignItems: 'start' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
                                    <div style={{ position: 'relative', height: '680px' }}>
                                        <Image src="/CREATION_2.png" alt="Dyane Paris Distillation" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ position: 'relative', height: '280px' }}>
                                        <Image src="/10.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div>
                                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 10px' }}>{t('label')}</p>
                                    <h2 style={{ ...font, fontWeight: 500, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.05, margin: '0 0 22px', textTransform: 'uppercase' }}>{t('titre')}</h2>
                                    <p style={{ ...font, fontSize: '12px', lineHeight: 1.7, opacity: 0.8, maxWidth: '360px' }}>{t('texte')}</p>
                                    <Link href="/distillation" style={{ ...font, display: 'inline-block', marginTop: '24px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', textDecoration: 'none', color: '#000', paddingBottom: '6px' }}>{t('cta')}</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 2 — image plein écran + texte blanc en haut */}
                    {current === 1 && (
                        <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden' }}>
                            <Image
                                src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626200/0512eec9ef31ff0016ded898d96b2001_ltf2yr.jpg"
                                alt="Distillation Dyane"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                            <div style={{ position: 'absolute', top: '48px', left: '48px', maxWidth: '700px' }}>
                                <p style={{ ...lora, color: '#fff', fontSize: '14px', lineHeight: 2, fontWeight: 500 }}>
                                    Après les vendanges à Bordeaux, le raisin est fermenté pour transformer les sucres naturels en vin.<br />
                                    Ce vin est ensuite distillé afin d'obtenir un alcool vinique pur, issu exclusivement du raisin.<br />
                                    L'alcool est enfin retravaillé et assemblé pour créer la base de nos cocktails premium.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 3 — deux images + deux blocs texte */}
                    {current === 2 && (
                        <div style={{ padding: '68px 80px 72px', maxWidth: '1400px', margin: '0 auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                                {/* Infusion */}
                                <div>
                                    <div style={{ position: 'relative', height: '460px', marginBottom: '24px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg"
                                            alt="Infusion"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h3 style={{ ...font, fontSize: '18px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '16px' }}>INFUSION</h3>
                                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>
                                        Nos créations reposent sur une infusion lente d'ingrédients nobles : gingembre frais, vanille, fruits et épices, dans un alcool vinique d'exception, révélant une profondeur aromatique intense et raffinée.
                                    </p>
                                </div>
                                {/* Assemblage */}
                                <div>
                                    <div style={{ position: 'relative', height: '460px', marginBottom: '24px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626279/ChatGPT_Image_24_mai_2026_14_09_25_rfymiu.png"
                                            alt="Assemblage"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h3 style={{ ...font, fontSize: '18px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '16px' }}>ASSEMBLAGE</h3>
                                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>
                                        Chaque cocktail est minutieusement assemblé comme une œuvre d'art, équilibrant puissance, texture et élégance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Indicateurs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 0 40px' }}>
                    {Array.from({ length: total }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === current ? '24px' : '6px',
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
            </section>
        </>
    )
}
