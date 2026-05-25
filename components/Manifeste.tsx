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
        <section style={{ background: '#fff', padding: '80px 64px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                {/* Colonne gauche */}
                <div>
                    {/* Logo */}
                    <img
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779696566/Dyane_Paris_1_k7i9cd.png"
                        alt="Dyane Paris"
                        style={{ width: '280px', height: 'auto', display: 'block', marginBottom: '40px' }}
                    />

                    {/* Trois lignes italiques */}
                    <p style={{ ...lora, fontSize: '14px', fontStyle: 'italic', lineHeight: 1.9, opacity: 0.8, marginBottom: '4px' }}>Cocktails d'exception.</p>
                    <p style={{ ...lora, fontSize: '14px', fontStyle: 'italic', lineHeight: 1.9, opacity: 0.8, marginBottom: '4px' }}>Flacons en porcelaine peints à la main.</p>
                    <p style={{ ...lora, fontSize: '14px', fontStyle: 'italic', lineHeight: 1.9, opacity: 0.8, marginBottom: '32px' }}>Objets de collection.</p>

                    {/* Trait */}
                    <div style={{ width: '40px', height: '1px', background: 'rgba(0,0,0,0.2)', marginBottom: '32px' }} />

                    {/* CTA */}
                    <Link
                        href={`/${locale}/la-maison`}
                        style={{ ...lora, display: 'inline-block', padding: '12px 24px', textDecoration: 'none', color: '#000', border: '1px solid rgba(0,0,0,0.20)', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase' }}
                    >
                        {t('cta')}
                    </Link>
                </div>

                {/* Colonne droite */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                        <p style={{ ...playfair, fontSize: '22px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>HÉRITAGE</p>
                        <p style={{ ...lora, fontSize: '12px', opacity: 0.4, margin: 0 }}>(1)</p>
                    </div>

                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.85, marginBottom: '4px' }}>Dyane Paris</p>
                    <p style={{ ...lora, fontSize: '13px', fontStyle: 'italic', lineHeight: 1.8, opacity: 0.7, marginBottom: '4px' }}>Créée en 2025</p>
                    <p style={{ ...lora, fontSize: '13px', fontStyle: 'italic', lineHeight: 1.8, opacity: 0.7, marginBottom: '28px' }}>Paris, France</p>

                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75, marginBottom: '16px' }}>
                        Dyane Paris est née d'une conviction : le cocktail peut être plus qu'un instant, il peut devenir une œuvre.
                    </p>
                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75, marginBottom: '16px' }}>
                        Inspirée par l'art, le patrimoine et le savoir-faire artisanal, la maison imagine des créations uniques où chaque détail raconte une histoire.
                    </p>
                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.75 }}>
                        Entre tradition et audace, Dyane Paris réinvente l'expérience du luxe à travers des flacons en porcelaine peints à la main, de véritables objets de collection conçus pour traverser le temps.
                    </p>
                </div>

            </div>
        </section>
    )
}
