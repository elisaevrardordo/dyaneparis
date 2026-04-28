import Link from 'next/link'
import Image from 'next/image'

export default function DualImage() {
    return (
        <>
            {/* Image pleine page */}
            <section style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

            {/* Section texte + images */}
            <section style={{ background: '#fff', padding: '68px 24px 72px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '64px', alignItems: 'start' }}>
                    {/* Images à gauche */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
                        <div style={{ position: 'relative', height: '680px' }}>
                            <Image src="/CREATION_2.png" alt="Dyane Paris Distillation" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ position: 'relative', height: '280px' }}>
                            <Image src="/10.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                    {/* Texte à droite */}
                    <div>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 10px' }}>DYANE CUVÉE PRESTIGE</p>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.05, margin: '0 0 22px', textTransform: 'uppercase' }}>LA DISTILLATION ARTISANALE FRANÇAISE</h2>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '12px', lineHeight: 1.7, opacity: 0.8, maxWidth: '360px' }}>Notre distillation en France incarne l&apos;exigence de la Maison : précision, pureté, constance.</p>
                        <Link href="/distillation" style={{ fontFamily: 'Playfair Display, serif', display: 'inline-block', marginTop: '24px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', textDecoration: 'none', color: '#000', paddingBottom: '6px' }}>EN LIRE PLUS</Link>
                    </div>
                </div>
            </section>
        </>
    )
}
