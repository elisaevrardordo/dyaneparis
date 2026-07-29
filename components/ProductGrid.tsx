'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { products } from '@/components/data/products'
import { localizedPath } from '@/i18n/paths'

export default function ProductGrid() {
    const t = useTranslations('products')
    const locale = useLocale()
    return (
        <section style={{ background: '#fff', padding: '0 24px 60px' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
                {products.map((p) => (
                    <div key={p.name} style={{ flex: '1', minWidth: '260px', maxWidth: '360px', textAlign: 'center' }}>
                        <Link href={localizedPath(locale, `/oeuvres/${p.slug}`)} style={{ display: 'block', width: '100%', aspectRatio: '3/4', position: 'relative', marginBottom: '12px', overflow: 'hidden', textDecoration: 'none' }}>
                            <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) calc(100vw - 48px), 360px" style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                        </Link>
                        <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>{p.name}</p>
                        <Link href={localizedPath(locale, '/contact')} style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>{t('cta')}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
