'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

const articles = [
    {
        slug: 'commanderie-ambassadeurs-rungis',
        titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis.',
        date: '24 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png',
        extrait: "Dans l'écrin du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a participé à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.",
    },
    {
        slug: 'ritz-paris-fashion-week',
        titre: 'Dyane Paris au Ritz Paris — Une Fashion Week',
        date: '12 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png',
        extrait: "À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence pensée comme une exposition d'Art Liquide.",
    },
    {
        slug: 'point-de-vue-distillateur',
        titre: "Dyane, du point de vue d'un distillateur",
        date: '5 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png',
        extrait: "Chez Dyane Paris, un cocktail ne commence jamais par un simple mélange. Il naît d'une recherche autour des arômes et du geste de la distillation.",
    },
    {
        slug: 'ingredients-locaux-francais',
        titre: "L'Exigence des Ingrédients : Alcool Vinique et Filières Françaises",
        date: '10 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png',
        extrait: "Chez Dyane Paris, chaque ingrédient est une décision. L'alcool vinique élaboré en France, les fruits, les plantes — rien n'est laissé au hasard.",
    },
    {
        slug: 'teo-for-dyane',
        titre: 'TEO FOR DYANE',
        date: '18 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png',
        extrait: "Une collaboration entre Dyane Paris et le peintre Matteo Mengacci, plus connu sous le nom de Teo Kaykay.",
    },
    {
        slug: 'art-de-la-porcelaine',
        titre: "L'Art de la Porcelaine : Quand le Contenant devient Œuvre",
        date: '5 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png',
        extrait: "La porcelaine de Dyane Paris n'est pas un emballage. C'est une sculpture habitée, façonnée par plus de 70 mains, cuite trois fois.",
    },
    {
        slug: 'cocktail-oeuvre-collectionner',
        titre: 'Quand le Cocktail devient œuvre à Collectionner',
        date: '3 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png',
        extrait: "Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. La jeune Maison française propose un geste inédit.",
    },
]

export default function LeJournalPage() {
    const t = useTranslations('journal')
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const [hovered, setHovered] = useState<string | null>(null)

    const hoveredArticle = articles.find(a => a.slug === hovered)
    const img1 = hoveredArticle ? hoveredArticle.image : articles[0].image
    const img2 = hoveredArticle
        ? (articles.find(a => a.slug !== hovered)?.image || articles[1].image)
        : articles[1].image

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .journal-hero { height: 45vh !important; }
                    .journal-hero-text { left: 24px !important; bottom: 24px !important; }
                    .journal-hero-h1 { font-size: 14px !important; }
                    .journal-layout { flex-direction: column !important; }
                    .journal-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.08) !important; padding: 24px 20px !important; }
                    .journal-preview { display: none !important; }
                    .journal-featured-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .journal-featured-img { height: 260px !important; }
                    .journal-small-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
                    .journal-small-img { height: 160px !important; }
                    .journal-bottom { padding: 32px 20px 60px !important; }
                }
            `}</style>
            <main style={{ background: '#FAF8F5', minHeight: '100vh' }}>

                {/* Hero image */}
<div className="journal-hero" style={{ position: 'relative', width: '100%', height: '35vh', overflow: 'hidden' }}>
    <Image
        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779701616/Sans_titre_1920_x_550_px_amjdym.png"
        alt="Le Journal Dyane Paris"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
    />
    <div className="journal-hero-text" style={{ position: 'absolute', bottom: '48px', left: '48px' }}>
        <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>Dyane Paris</p>
        <h1 className="journal-hero-h1" style={{ ...font, fontSize: 'clamp(18px, 2.2vw, 30px)', fontWeight: 400, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, maxWidth: '560px', lineHeight: 1.3 }}>
            {t('titre')}
        </h1>
    </div>
</div>

                {/* Layout Jacquemus */}
                <div className="journal-layout" style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.08)', minHeight: '560px' }}>

                    {/* Sidebar titres */}
                    <div className="journal-sidebar" style={{ width: '340px', flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.08)', padding: '40px' }}>
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
                                    padding: '16px 0',
                                    borderBottom: i < articles.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                    opacity: hovered && hovered !== article.slug ? 0.3 : 1,
                                    transition: 'opacity 0.25s ease',
                                }}
                            >
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.4, margin: '0 0 6px' }}>{article.date}</p>
                                <p style={{ ...font, fontSize: '14px', fontWeight: 400, lineHeight: 1.35, margin: 0 }}>{article.titre}</p>
                            </Link>
                        ))}
                    </div>

                {/* Images preview */}
<div className="journal-preview" style={{ flex: 1, display: 'flex', gap: '16px', padding: '40px 48px', alignItems: 'flex-start' }}>
    <div style={{ position: 'relative', width: '55%', height: '480px', overflow: 'hidden' }}>
        <Image key={img1} src={img1} alt="Journal" fill style={{ objectFit: 'cover' }} />
    </div>
    <div style={{ position: 'relative', width: '45%', height: '480px', overflow: 'hidden' }}>
        <Image key={img2} src={img2} alt="Journal" fill style={{ objectFit: 'cover' }} />
    </div>
</div>
                </div>

                {/* Grille articles */}
                <section className="journal-bottom" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '64px 48px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '48px' }}>TOUS LES ARTICLES</p>

                    {/* Featured */}
                    <Link href={`/${locale}/le-journal/${articles[0].slug}`} style={{ textDecoration: 'none', color: '#000', display: 'block', marginBottom: '72px' }}>
                        <div className="journal-featured-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
                            <div className="journal-featured-img" style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
                                <Image src={articles[0].image} alt={articles[0].titre} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '20px' }}>{articles[0].date}</p>
                                <h2 style={{ ...font, fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '24px' }}>{articles[0].titre}</h2>
                                <p style={{ ...lora, fontSize: '14px', lineHeight: 1.9, opacity: 0.65, marginBottom: '36px', fontStyle: 'italic' }}>
                                    {articles[0].extrait}
                                </p>
                                <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.35)', paddingBottom: '4px' }}>Lire l'article →</span>
                            </div>
                        </div>
                    </Link>

                    {/* Grille autres articles */}
                    <div className="journal-small-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
                        {articles.slice(1).map((article) => (
                            <Link key={article.slug} href={`/${locale}/le-journal/${article.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                                <div className="journal-small-img" style={{ position: 'relative', height: '280px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <Image src={article.image} alt={article.titre} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>{article.date}</p>
                                <p style={{ ...font, fontSize: '15px', fontWeight: 400, lineHeight: 1.35, marginBottom: '14px' }}>{article.titre}</p>
                                <p style={{ ...lora, fontSize: '12px', lineHeight: 1.7, opacity: 0.6, marginBottom: '16px', fontStyle: 'italic' }}>{article.extrait}</p>
                                <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.45, borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '2px' }}>Lire →</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}
