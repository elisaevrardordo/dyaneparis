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

    function goTo(i: number) {
        setFade(false)
        setTimeout(() => { setCurrent(i); setFade(true) }, 400)
    }

    function prev() { goTo((current - 1 + total) % total) }
    function next() { goTo((current + 1) % total) }

    const navBtn = {
        position: 'absolute' as const,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        opacity: 0.45,
        transition: 'opacity 0.2s ease',
        padding: '0',
    }

    return (
        <>
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

            <section style={{ background: '#FAF8F5', overflow: 'hidden', position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* Flèche gauche */}
                <button
                    onClick={prev}
                    style={{ ...navBtn, left: '28px' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
                >
                    <span style={{ ...lora, fontSize: '8px', letterSpacing: '0.25em', color: '#111', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'block' }}>Précédent</span>
                </button>

                {/* Flèche droite */}
                <button
                    onClick={next}
                    style={{ ...navBtn, right: '28px' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
                >
                    <span style={{ ...lora, fontSize: '8px', letterSpacing: '0.25em', color: '#111', textTransform: 'uppercase', writingMode: 'vertical-rl', display: 'block' }}>Suivant</span>
                </button>

                <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease', flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* SLIDE 1 */}
                    {current === 0 && (
                        <div style={{ padding: '80px 100px', flex: 1, display: 'flex', alignItems: 'center' }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '80px', alignItems: 'center' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
                                    <div style={{ position: 'relative', height: '600px' }}>
                                        <Image src="/CREATION_2.png" alt="Dyane Paris Distillation" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ position: 'relative', height: '260px' }}>
                                        <Image src="/10.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, margin: '0 0 16px' }}>{t('label')}</p>
                                    <h2 style={{ ...bodoni, fontWeight: 400, fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.15, margin: '0 0 24px', textTransform: 'uppercase' }}>{t('titre')}</h2>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7, maxWidth: '340px', marginBottom: '28px' }}>{t('texte')}</p>
                                    <Link href="/distillation" style={{ ...lora, display: 'inline-block', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.35)', textDecoration: 'none', color: '#000', paddingBottom: '5px' }}>{t('cta')}</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 2 — full screen */}
                    {current === 1 && (
                        <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '100vh' }}>
                            <Image
                                src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626200/0512eec9ef31ff0016ded898d96b2001_ltf2yr.jpg"
                                alt="Distillation Dyane"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
                            <div style={{ position: 'absolute', top: '60px', left: '80px', maxWidth: '580px' }}>
                                <p style={{ ...bodoni, color: '#fff', fontSize: '16px', lineHeight: 1.7, fontWeight: 400, opacity: 0.95 }}>
                                    Après les vendanges bordelaises, le raisin est fermenté puis distillé afin d'obtenir un alcool vinique pur.<br /><br />
                                    Retravaillé et assemblé avec précision, il devient la base de nos cocktails Dyane.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 3 */}
                    {current === 2 && (
                        <div style={{ padding: '80px 100px', flex: 1, display: 'flex', alignItems: 'center' }}>
                            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                                <div>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg"
                                            alt="Infusion"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '24px 0 12px', opacity: 0.45 }}>Infusion</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7 }}>
                                        Nos créations reposent sur une infusion lente d'ingrédients nobles : gingembre frais, vanille, fruits et épices, dans un alcool vinique d'exception, révélant une profondeur aromatique intense et raffinée.
                                    </p>
                                </div>
                                <div>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626279/ChatGPT_Image_24_mai_2026_14_09_25_rfymiu.png"
                                            alt="Assemblage"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '24px 0 12px', opacity: 0.45 }}>Assemblage</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7 }}>
                                        Chaque cocktail est minutieusement assemblé comme une œuvre d'art, équilibrant puissance, texture et élégance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compteur */}
                {current !== 1 && (
                    <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
                        <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', color: '#111', opacity: 0.3 }}>
                            0{current + 1} — 0{total}
                        </span>
                    </div>
                )}
            </section>
        </>
    )
}
