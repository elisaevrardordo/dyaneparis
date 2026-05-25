'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const products = [
    { name: 'Dyane No.1 — Pornstar Martini', href: '/oeuvres/dyane-paris-pornstar-martini-70-cl', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/3_ijldt6.png' },
    { name: 'Dyane No.2 — Moscow Mule', href: '/oeuvres/dyane-no2-moscow-mule', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/4_os0a6z.png' },
    { name: 'Teo for Dyane Paris', href: '/oeuvres/bouteille-signee-teokaykay', image: '/dyane-teo.webp' },
]

export default function ProductGrid() {
    const t = useTranslations('products')
    return (
        <section style={{ background: '#fff', padding: '0 24px 60px' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
                {products.map((p) => (
                    <div key={p.name} style={{ flex: '1', minWidth: '260px', maxWidth: '360px', textAlign: 'center' }}>
                        <Link href={p.href} style={{ display: 'block', width: '100%', aspectRatio: '3/4', position: 'relative', marginBottom: '12px', overflow: 'hidden', textDecoration: 'none' }}>
                            <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 360px" style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                        </Link>
                        <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>{p.name}</p>
                        <Link href="/contact" style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>{t('cta')}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
