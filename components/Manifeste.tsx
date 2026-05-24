'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

const lora = { fontFamily: 'Lora, serif' }
const playfair = { fontFamily: 'Playfair Display, serif' }

export default function Manifeste() {
    const t = useTranslations('manifeste')
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    return (
        <section style={{ background: '#fff', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, margin: '0 0 40px' }}>{t('label')}</p>
                <p style={{ ...lora, fontSize: '14px', lineHeight: 1.9, opacity: 0.75, marginBottom: '24px' }}>
                    À la frontière entre l'art et les spiritueux, Dyane Paris transforme le cocktail en objet de collection.
                    Chaque création est pensée comme une œuvre : des recettes haut de gamme infusées à partir d'ingrédients nobles, enfermées dans des bouteilles en porcelaine peintes à la main, conçues pour être conservées bien après la dégustation.
                </p>
                <p style={{ ...lora, fontSize: '14px', lineHeight: 1.9, opacity: 0.75, marginBottom: '24px' }}>
                    Née du désir de faire vivre le luxe autrement, Dyane Paris ne vend pas seulement des cocktails, la marque raconte des histoires, capture des lieux, des émotions et des nuits parisiennes dans des flacons sculpturaux.
                </p>
                <p style={{ ...playfair, fontSize: '15px', lineHeight: 1.8, opacity: 0.9, marginBottom: '48px', fontStyle: 'italic' }}>
                    Parce que chez Dyane Paris, désormais, l'art se boit.
                </p>
                <Link
                    href={`/${locale}/la-maison`}
                    style={{ ...lora, display: 'inline-block', padding: '12px 24px', textDecoration: 'none', color: '#000', border: '1px solid rgba(0,0,0,0.20)', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase' }}
                >
                    {t('cta')}
                </Link>
            </div>
        </section>
    )
}
