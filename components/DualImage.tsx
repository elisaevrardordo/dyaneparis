'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }
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

    return (
        <>
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

            <section style={{ background: '#FAF8F5', overflow: 'hidden', position: 'relative' }}>

                {/* Flèches navigation */}
                <button
                    onClick={prev}
                    style={{
                        position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 10, background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        opacity: 0.6, transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                >
                    <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.2em', color: '#111', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Précédent</span>
                    <svg width="1" height="48" viewBox="0 0 1 48" fill="none"><line x1="0.5" y1="0" x2="0.5" y2="48" stroke="#111" strokeOpacity="0.4"/></svg>
                </button>

                <button
                    onClick={next}
                    style={{
                        position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 10, background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        opacity: 0.6, transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                >
                    <svg width="1" height="48" viewBox="0 0 1 48" fill="none"><line x1="0.5" y1="0" x2="0.5" y2="48" stroke="#111" strokeOpacity="0.4"/></svg>
                    <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.2em', color: '#111', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Suivant</span>
                </button>

                <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>

                    {/* SLIDE 1 */}
                    {current === 0 && (
                        <div style={{ padding: '80px 100px 100px' }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '80px', alignItems: 'start' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
                                    <div style={{ position: 'relative', height: '680px' }}>
                                        <Image src="/CREATION_2.png" alt="Dyane Paris Distillation" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ position: 'relative', height: '280px' }}>
                                        <Image src="/10.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div style={{ paddingTop: '40px' }}>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.45, margin: '0 0 14px' }}>{t('label')}</p>
                                    <h2 style={{ ...bodoni, fontWeight: 400, fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.15, margin: '0 0 24px', textTransform: 'uppercase' }}>{t('titre')}</h2>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.75, opacity: 0.7, maxWidth: '340px', marginBottom: '28px' }}>{t('texte')}</p>
                                    <Link href="/distillation" style={{ ...lora, display: 'inline-block', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.35)', textDecoration: 'none', color: '#000', paddingBottom: '5px' }}>{t('cta')}</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 2 */}
                    {current === 1 && (
                        <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden' }}>
                            <Image
                                src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626200/0512eec9ef31ff0016ded898d96b2001_ltf2yr.jpg"
                                alt="Distillation Dyane"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
                            <div style={{ position: 'absolute', top: '60px', left: '80px', maxWidth: '580px' }}>
                                <p style={{ ...bodoni, color: '#fff', fontSize: '16px', lineHeight: 1.85, fontWeight: 400, opacity: 0.95, fontStyle: 'italic' }}>
                                    Après les vendanges bordelaises, le raisin est fermenté puis distillé afin d'obtenir un alcool vinique pur.<br /><br />
                                    Retravaillé et assemblé avec précision, il devient la base de nos cocktails Dyane.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 3 */}
                    {current === 2 && (
                        <div style={{ padding: '80px 100px 100px' }}>
                            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                                <div>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg"
                                            alt="Infusion"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '28px 0 14px', opacity: 0.5 }}>Infusion</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.75, opacity: 0.72, maxWidth: '480px' }}>
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
                                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '28px 0 14px', opacity: 0.5 }}>Assemblage</p>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.75, opacity: 0.72, maxWidth: '480px' }}>
                                        Chaque cocktail est minutieusement assemblé comme une œuvre d'art, équilibrant puissance, texture et élégance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compteur discret */}
                <div style={{ textAlign: 'center', padding: '0 0 32px' }}>
                    <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', color: '#111', opacity: 0.35 }}>
                        0{current + 1} — 0{total}
                    </span>
                </div>
            </section>
        </>
    )
}
