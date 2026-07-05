import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { articles } from '@/components/data/articles'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params
    const article = articles[slug]
    if (!article) return {}
    const path = locale === 'fr' ? `/le-journal/${slug}` : `/${locale}/le-journal/${slug}`
    return {
        title: article.titre,
        description: article.extrait,
        alternates: { canonical: `https://www.dyaneparis.com${path}` },
        openGraph: {
            title: article.titre,
            description: article.extrait,
            url: `https://www.dyaneparis.com${path}`,
            type: 'article',
            images: [{ url: article.image, width: 1200, height: 630, alt: article.titre }],
        },
    }
}

export async function generateStaticParams() {
    return Object.keys(articles).map((slug) => ({ slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const article = articles[slug]

    if (!article) return (
        <main style={{ background: '#FAF8F5', padding: '140px 24px 80px', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
            <p>Article non trouvé</p>
            <Link href={`/${locale}/le-journal`}>← Retour au journal</Link>
        </main>
    )

    const path = locale === 'fr' ? `/le-journal/${slug}` : `/${locale}/le-journal/${slug}`
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.titre,
        description: article.extrait,
        image: [article.image],
        author: { '@type': 'Organization', name: 'Dyane Paris' },
        publisher: { '@id': 'https://www.dyaneparis.com/#organization' },
        mainEntityOfPage: `https://www.dyaneparis.com${path}`,
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <style>{`
                @media (max-width: 768px) {
                    .slug-banner { height: 35vh !important; padding-top: 80px !important; }
                    .slug-banner-text { left: 24px !important; bottom: 20px !important; }
                    .slug-banner-title { font-size: 13px !important; }
                    .article-hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; padding: 32px 20px 24px !important; }
                    .article-hero-img { height: 220px !important; }
                    .article-body { padding: 32px 20px !important; }
                    .article-related-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
                    .article-related-img { height: 100px !important; }
                    .article-related-section { padding: 0 20px 60px !important; }
                }
                .article-content p { margin-bottom: 24px; font-family: 'Lora', serif; font-size: 16px; line-height: 2; color: #222; }
                .article-content h2 { font-family: 'Playfair Display', serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; margin: 48px 0 20px; opacity: 0.6; }
                .article-content blockquote { border-left: 1px solid #000; padding-left: 28px; margin: 40px 0; }
                .article-content blockquote p { font-family: 'Playfair Display', serif; font-size: 13px; letter-spacing: 0.12em; font-style: italic; line-height: 1.8; opacity: 0.85; margin-bottom: 0; }
                .article-content strong { font-weight: 600; }
            `}</style>

            <main style={{ background: '#FAF8F5' }}>

                {/* Bannière journal cliquable */}
                <Link href={`/${locale}/le-journal`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="slug-banner" style={{
                        position: 'relative',
                        width: '100%',
                        height: '45vh',
                        overflow: 'hidden',
                        paddingTop: '140px',
                        boxSizing: 'border-box',
                    }}>
                        <Image
                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779701616/Sans_titre_1920_x_550_px_amjdym.png"
                            alt="Le Journal Dyane Paris"
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                        <div className="slug-banner-text" style={{ position: 'absolute', bottom: '40px', left: '48px' }}>
                            <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Dyane Paris</p>
                            <p className="slug-banner-title" style={{ ...font, fontSize: 'clamp(16px, 2vw, 26px)', fontWeight: 400, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, lineHeight: 1.3 }}>
                                RETROUVEZ TOUTES LES ACTUALITÉS DE LA MAISON DYANE
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Hero article */}
                <section className="article-hero-grid" style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px 48px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '64px', alignItems: 'start' }}>
                    <div className="article-hero-img" style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                        <Image src={article.image} alt={article.titre} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ paddingTop: '16px' }}>
                        <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '20px' }}>{article.date}</p>
                        <h1 style={{ ...font, fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '24px' }}>{article.titre}</h1>
                        <p style={{ ...lora, fontSize: '14px', lineHeight: 1.8, opacity: 0.65, marginBottom: '32px', fontStyle: 'italic' }}>{article.extrait}</p>
                        <span style={{ ...lora, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.5 }}>↑ PARTAGER</span>
                    </div>
                </section>

                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                </div>

                {/* Contenu */}
                <section className="article-body" style={{ maxWidth: '700px', margin: '0 auto', padding: '64px 24px 80px' }}>
                    <div className="article-content">
                        {article.contenu}
                    </div>
                </section>

                {/* Articles liés */}
                <section className="article-related-section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, margin: '48px 0 32px' }}>À LIRE AUSSI</p>
                    <div className="article-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {article.related.map((r) => (
                            <Link key={r.slug} href={`/${locale}/le-journal/${r.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                                <div className="article-related-img" style={{ position: 'relative', height: '140px', overflow: 'hidden', marginBottom: '12px' }}>
                                    <Image src={r.image} alt={r.titre} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <p style={{ ...font, fontSize: '13px', lineHeight: 1.4 }}>{r.titre}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Retour */}
                <section style={{ textAlign: 'center', padding: '0 0 80px' }}>
                    <Link href={`/${locale}/le-journal`} style={{ ...lora, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.3)', paddingBottom: '4px' }}>
                        ← Retour au journal
                    </Link>
                </section>
            </main>
        </>
    )
}
