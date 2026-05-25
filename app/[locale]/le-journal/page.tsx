'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

const articles = [
    { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', date: '24 MARS 2026', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png' },
    { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', date: '12 MARS 2026', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png' },
    { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", date: '5 FÉVRIER 2026', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg' },
    { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', date: '18 JANVIER 2026', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg' },
    { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', date: '3 JANVIER 2026', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg' },
]

export default function LeJournalPage() {
    const t = useTranslations('journal')
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const [hovered, setHovered] = useState<string | null>(null)

    const hoveredArticle = articles.find(a => a.slug === hovered)
    const previewImages = hoveredArticle
        ? [hoveredArticle.image, articles.find(a => a.slug !== hovered)?.image || articles[1].image]
        : [articles[0].image, articles[1].image]

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .journal-layout { flex-direction: column !important; }
                    .journal-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 24px 20px !important; }
                    .journal-preview { display: none !important; }
                    .journal-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px 20px !important; }
                    .journal-featured-img { height: 280px !important; }
                    .journal-small-img { height: 160px !important; }
                    .journal-small-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                }
            `}</style>
            <main style={{ background: '#FAF8F5', minHeight: '100vh' }}>

                {/* Header */}
                <div style={{ padding: '80px 24px 0', textAlign: 'center' }}>
                    <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.45, marginBottom: '12px' }}>Dyane Paris</p>
                    <h1 style={{ ...font, fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 400, letterSpacing: '0.02em', margin: 0 }}>{t('titre')}</h1>
                </div>

                {/* Menu Jacquemus-style */}
                <div className="journal-layout" style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: '48px' }}>

                    {/* Sidebar — titres */}
                    <div className="journal-sidebar" style={{ width: '320px', flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.08)', padding: '40px 40px' }}>
                        {articles.map((article, i) => (
                            <Link
                                key={article.slug}
                                href={`/${locale}/le-journal/${article.slug}`}
                                onMouseEnter={() => setHovered(article.slug)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    color: '#000',
                                    padding: '18px 0',
                                    borderBottom: i < articles.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                    transition: 'opacity 0.2s ease',
                                    opacity: hovered && hovered !== article.slug ? 0.35 : 1,
                                }}
                            >
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.45, marginBottom: '6px' }}>{article.date}</p>
                                <p style={{ ...font, fontSize: '15px', fontWeight: 400, lineHeight: 1.35, margin: 0 }}>{article.titre}</p>
                            </Link>
                        ))}
                    </div>

                    {/* Preview images */}
                    <div className="journal-preview" style={{ flex: 1, display: 'flex', gap: '12px', padding: '40px', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', flex: '1.2', height: '480px', overflow: 'hidden' }}>
                            <Image
                                src={previewImages[0]}
                                alt="Journal Dyane"
                                fill
                                style={{ objectFit: 'cover', transition: 'opacity 0.4s ease' }}
                            />
                        </div>
                        <div style={{ position: 'relative', flex: '1', height: '360px', overflow: 'hidden', marginTop: '80px' }}>
                            <Image
                                src={previewImages[1] || articles[1].image}
                                alt="Journal Dyane"
                                fill
                                style={{ objectFit: 'cover', transition: 'opacity 0.4s ease' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Grille articles en dessous */}
                <section style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '64px 48px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '40px' }}>TOUS LES ARTICLES</p>

                    {/* Article featured */}
                    <Link href={`/${locale}/le-journal/${articles[0].slug}`} style={{ textDecoration: 'none', color: '#000', display: 'block', marginBottom: '64px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                            <div className="journal-featured-img" style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
                                <Image src={articles[0].image} alt={articles[0].titre} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>{articles[0].date}</p>
                                <h2 style={{ ...font, fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '20px' }}>{articles[0].titre}</h2>
                                <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.7, marginBottom: '32px' }}>
                                    Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.
                                </p>
                                <span style={{ ...lora, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', paddingBottom: '4px' }}>Lire l'article →</span>
                            </div>
                        </div>
                    </Link>

                    {/* Petits articles */}
                    <div className="journal-small-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {articles.slice(1).map((article) => (
                            <Link key={article.slug} href={`/${locale}/le-journal/${article.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                                <div className="journal-small-img" style={{ position: 'relative', height: '260px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '8px' }}>{article.date}</p>
                                <p style={{ ...font, fontSize: '15px', fontWeight: 400, lineHeight: 1.35, marginBottom: '12px' }}>{article.titre}</p>
                                <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, borderBottom: '1px solid rgba(0,0,0,0.25)', paddingBottom: '2px' }}>Lire →</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}
