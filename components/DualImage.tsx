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
        }, 5000)
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
                <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>

                    {/* SLIDE 1 */}
                    {current === 0 && (
                        <div style={{ padding: '80px 80px 100px' }}>
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
                                    <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, margin: '0 0 16px' }}>{t('label')}</p>
                                    <h2 style={{ ...font, fontWeight: 500, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.1, margin: '0 0 28px', textTransform: 'uppercase' }}>{t('titre')}</h2>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75, maxWidth: '360px', marginBottom: '32px' }}>{t('texte')}</p>
                                    <Link href="/distillation" style={{ ...lora, display: 'inline-block', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', textDecoration: 'none', color: '#000', paddingBottom: '6px' }}>{t('cta')}</Link>
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
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
                            <div style={{ position: 'absolute', top: '60px', left: '60px', maxWidth: '660px' }}>
                                <p style={{ ...lora, color: '#fff', fontSize: '15px', lineHeight: 2.1, fontWeight: 400, opacity: 0.92 }}>
                                    Après les vendanges à Bordeaux, le raisin est fermenté pour transformer les sucres naturels en vin.<br />
                                    Ce vin est ensuite distillé afin d'obtenir un alcool vinique pur, issu exclusivement du raisin.<br />
                                    L'alcool est enfin retravaillé et assemblé pour créer la base de nos cocktails premium.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 3 */}
                    {current === 2 && (
                        <div style={{ padding: '100px 80px 120px', maxWidth: '1400px', margin: '0 auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                                <div>
                                    <div style={{ position: 'relative', height: '520px', marginBottom: '36px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg"
                                            alt="Infusion"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h3 style={{ ...lora, fontSize: '11px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '20px' }}>Infusion</h3>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75 }}>
                                        Nos créations reposent sur une infusion lente d'ingrédients nobles : gingembre frais, vanille, fruits et épices, dans un alcool vinique d'exception, révélant une profondeur aromatique intense et raffinée.
                                    </p>
                                </div>
                                <div>
                                    <div style={{ position: 'relative', height: '520px', marginBottom: '36px' }}>
                                        <Image
                                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779626279/ChatGPT_Image_24_mai_2026_14_09_25_rfymiu.png"
                                            alt="Assemblage"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h3 style={{ ...lora, fontSize: '11px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '20px' }}>Assemblage</h3>
                                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75 }}>
                                        Chaque cocktail est minutieusement assemblé comme une œuvre d'art, équilibrant puissance, texture et élégance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
