import Image from 'next/image'
import Link from 'next/link'

const font = { fontFamily: 'Playfair Display, serif' }

const articles = [
    {
        slug: 'commanderie-ambassadeurs-rungis',
        titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis',
        date: '24 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png',
    },
    {
        slug: 'ritz-paris-fashion-week',
        titre: 'Dyane Paris au Ritz Paris — Une Fashion Week',
        date: '12 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png',
    },
    {
        slug: 'point-de-vue-distillateur',
        titre: 'Dyane, du point de vue d\'un distillateur',
        date: '5 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg',
    },
    {
        slug: 'teo-for-dyane',
        titre: 'TEO FOR DYANE',
        date: '18 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg',
    },
    {
        slug: 'cocktail-oeuvre-collectionner',
        titre: 'Quand le Cocktail devient œuvre à Collectionner',
        date: '3 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg',
    },
]

export default function LeJournalPage() {
    return (
        <main style={{ background: '#FAF8F5' }}>
            <section style={{ padding: '60px 24px 40px', textAlign: 'center' }}>
                <h1 style={{ ...font, fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase' }}>RETROUVEZ TOUTES LES ACTUALITÉS DE LA MAISON DYANE</h1>
            </section>
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Link href={`/le-journal/${articles[0].slug}`} style={{ textDecoration: 'none', color: '#000', gridRow: 'span 2' }}>
                        <div style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
                            <Image src={articles[0].image} alt={articles[0].titre} fill style={{ objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.92)', padding: '24px' }}>
                                <h2 style={{ ...font, fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>{articles[0].titre}</h2>
                                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', opacity: 0.6 }}>{articles[0].date}</p>
                            </div>
                        </div>
                    </Link>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {articles.slice(1).map((article) => (
                            <Link key={article.slug} href={`/le-journal/${article.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', marginBottom: '12px' }}>
                                    <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <p style={{ ...font, fontSize: '13px', fontWeight: 500, marginBottom: '6px', lineHeight: 1.4 }}>{article.titre}</p>
                                <p style={{ ...font, fontSize: '10px', letterSpacing: '0.2em', opacity: 0.6 }}>{article.date}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
