'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

const slides = [
    {
        images: {
            large: '/CREATION_2.png',
            small: '/10.png',
        },
        labelKey: 'label',
        titreKey: 'titre',
        texteKey: 'texte',
        ctaKey: 'cta',
        ctaHref: '/distillation',
    },
    {
        images: {
            large: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg',
            small: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg',
        },
        labelKey: 'label2',
        titreKey: 'titre2',
        texteKey: 'texte2',
        ctaKey: 'cta',
        ctaHref: '/distillation',
    },
    {
        images: {
            large: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444726/CREATION_m4wcwy.png',
            small: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444782/12_nehhxv.png',
        },
        labelKey: 'label3',
        titreKey: 'titre3',
        texteKey: 'texte3',
        ctaKey: 'cta',
        ctaHref: '/distillation',
    },
]

export default function DualImage() {
    const t = useTranslations('dualimage')
    const [current, setCurrent] = useState(0)
    const [fade, setFade] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length)
                setFade(true)
            }, 400)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const slide = slides[current]

    return (
        <>
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

            <section style={{ background: '#FAF8F5', padding: '68px 24px 72px' }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'grid', gridTemplateColumns: '1.4fr 1fr',
                    gap: '64px', alignItems: 'start',
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}>
                    {/* Images */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
                        <div style={{ position: 'relative', height: '680px' }}>
                            <Image src={slide.images.large} alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ position: 'relative', height: '280px' }}>
                            <Image src={slide.images.small} alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                        </div>
                    </div>

                    {/* Texte */}
                    <div>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 10px' }}>
                            {t(slide.labelKey)}
                        </p>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.05, margin: '0 0 22px', textTransform: 'uppercase' }}>
                            {t(slide.titreKey)}
                        </h2>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '12px', lineHeight: 1.7, opacity: 0.8, maxWidth: '360px' }}>
                            {t(slide.texteKey)}
                        </p>
                        <Link href={slide.ctaHref} style={{ fontFamily: 'Playfair Display, serif', display: 'inline-block', marginTop: '24px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', textDecoration: 'none', color: '#000', paddingBottom: '6px' }}>
                            {t(slide.ctaKey)}
                        </Link>

                        {/* Indicateurs */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true) }, 400) }}
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
                    </div>
                </div>
            </section>
        </>
    )
}
