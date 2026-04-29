import Image from 'next/image'
import Link from 'next/link'

const font = { fontFamily: 'Playfair Display, serif' }

const articles: Record<string, {
    titre: string
    date: string
    image: string
    contenu: string[]
}> = {
    'commanderie-ambassadeurs-rungis': {
        titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis',
        date: '24 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777448997/IMG_9605_3_nbgdw9.heic',
        contenu: [
            'Dans l\'écrin majestueux du Café de l\'Homme, face à la Tour Eiffel, Dyane Paris a eu l\'honneur de participer à un moment d\'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.',
            'Cet événement, réunissant des figures emblématiques du monde gastronomique et des acteurs majeurs de l\'excellence française, s\'inscrit dans une tradition où savoir-faire, transmission et passion sont célébrés avec exigence et élégance.',
            'Pour Dyane, cette collaboration a été l\'occasion de proposer une lecture contemporaine du rituel de dégustation, en introduisant ses créations comme des objets à part entière, à la croisée du cocktail, de l\'art et de l\'expérience.',
            'Présentées dans des pièces en porcelaine façonnées avec précision, les créations Dyane ont trouvé naturellement leur place dans cet environnement où chaque détail compte. Plus qu\'un service, elles ont été pensées comme une extension du moment, invitant les convives à vivre une expérience sensorielle différente, mêlant esthétique, plaisir et surprise.',
            'Dans ce cadre chargé d\'histoire et d\'exigence, Dyane affirme sa volonté de s\'inscrire dans les codes de l\'excellence française tout en y apportant une dimension nouvelle : celle d\'une Maison d\'Art Liquide, où le geste de dégustation devient un moment à contempler autant qu\'à savourer.',
        ],
    },
    'ritz-paris-fashion-week': {
        titre: 'Dyane Paris au Ritz Paris — Une Fashion Week',
        date: '12 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449054/IMG_0285_1_nwec6u.heic',
        contenu: [
            'À l\'occasion de la Fashion Week de Paris, Dyane Paris a investi les salons dorés du Ritz pour une soirée d\'exception mêlant art, mode et cocktail.',
            'Dans ce palace emblématique de la Place Vendôme, les créations Dyane ont côtoyé les plus grands noms de la mode internationale, affirmant la place de la Maison dans l\'univers du luxe contemporain.',
            'Chaque bouteille-sculpture a été présentée comme une pièce de collection, suscitant la curiosité et l\'admiration des invités. L\'Art Liquide s\'est imposé naturellement dans ce cadre d\'excellence.',
            'Cette soirée marque une étape importante dans le développement de Dyane Paris, confirmant sa vocation à s\'inscrire dans les espaces les plus prestigieux de la capitale.',
        ],
    },
    'point-de-vue-distillateur': {
        titre: 'Dyane, du point de vue d\'un distillateur',
        date: '5 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg',
        contenu: [
            'Rencontre avec Julien Ducruet, chef de conception des recettes Dyane, qui nous livre sa vision de l\'Art Liquide et de l\'exigence qui guide chaque cuvée.',
            '"Chaque cuvée Dyane est pensée comme une évidence : un équilibre si juste qu\'il s\'impose dès la première dégustation."',
            'Formé aux plus grandes maisons de spiritueux françaises, Julien Ducruet apporte à Dyane une expertise rare. Sa méthode : partir de la matière première, la respecter, la sublimer sans jamais la contraindre.',
            'L\'alcool vinique, base de chaque création, est sélectionné pour sa pureté et sa capacité à porter les arômes. Les infusions sont réalisées lentement, sur des durées maîtrisées, pour extraire chaque nuance avec précision.',
            'Le résultat est une signature aromatique unique, identifiable, qui s\'inscrit dans la mémoire dès la première gorgée.',
        ],
    },
    'teo-for-dyane': {
        titre: 'TEO FOR DYANE',
        date: '18 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg',
        contenu: [
            'Collaboration inédite entre Dyane Paris et le peintre Matteo Mengacci, alias Teo KayKay. Une bouteille devient toile. Une œuvre devient cocktail.',
            'Lorsque j\'ai découvert la bouteille Dyane pour la première fois, j\'ai immédiatement ressenti qu\'il s\'agissait d\'un objet porteur d\'une identité visuelle forte, en dialogue avec l\'univers de l\'art contemporain.',
            'J\'ai décidé de peindre la bouteille entièrement à la main, en mêlant les codes raffinés de Dyane avec mes éléments artistiques signatures : motifs floraux, couleurs fluorescentes, diamants et cœurs.',
            'Ces symboles font partie de mon univers depuis de nombreuses années et représentent les valeurs que j\'essaie toujours d\'apporter dans mes créations : amour, bonheur et sérénité.',
            'Une bouteille peut devenir un message, une émotion, une expérience visuelle.',
        ],
    },
    'cocktail-oeuvre-collectionner': {
        titre: 'Quand le Cocktail devient œuvre à Collectionner',
        date: '3 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg',
        contenu: [
            'Dyane Paris réinvente le rapport à la dégustation. Boire n\'est plus un acte éphémère — c\'est le début d\'une collection.',
            'La bouteille en porcelaine, une fois vidée, ne se jette pas. Elle s\'expose, elle se conserve, elle raconte une histoire. C\'est l\'essence même de l\'Art Liquide : créer des objets qui transcendent leur fonction première.',
            'Dans un monde où le luxe se réinvente, Dyane propose une alternative au consumérisme ordinaire. Chaque création est limitée, numérotée, pensée pour durer.',
            'Les collectionneurs de Dyane ne cherchent pas seulement un cocktail d\'exception. Ils recherchent une pièce unique, une sculpture habitée par un spiritueux rare, une œuvre à part entière.',
            'C\'est cette vision qui fonde l\'identité de la Maison : faire du temps de dégustation un moment à contempler autant qu\'à savourer.',
        ],
    },
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = articles[params.slug]
    if (!article) return <div>Article non trouvé</div>

    const autresArticles = Object.entries(articles)
        .filter(([slug]) => slug !== params.slug)
        .slice(0, 4)

    return (
        <main style={{ background: '#FAF8F5' }}>
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', marginBottom: '60px' }}>
                    <div style={{ position: 'relative', height: '500px' }}>
                        <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h1 style={{ ...font, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, marginBottom: '16px', lineHeight: 1.2 }}>{article.titre}</h1>
                        <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', opacity: 0.6, marginBottom: '32px' }}>{article.date}</p>
                        <button style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(0,0,0,0.3)', padding: '10px 20px', cursor: 'pointer' }}>
                            ↑ PARTAGER
                        </button>
                    </div>
                </div>

                {article.contenu.map((paragraphe, i) => (
                    <p key={i} style={{ ...font, fontSize: '14px', lineHeight: 1.9, opacity: 0.85, marginBottom: '24px' }}>{paragraphe}</p>
                ))}
            </section>

            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>À LIRE AUSSI</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {autresArticles.map(([slug, art]) => (
                        <Link key={slug} href={`/le-journal/${slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                            <div style={{ position: 'relative', height: '150px', marginBottom: '12px' }}>
                                <Image src={art.image} alt={art.titre} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <p style={{ ...font, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>BLOG</p>
                            <p style={{ ...font, fontSize: '12px', fontWeight: 500, lineHeight: 1.4 }}>{art.titre}</p>
                        </Link>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link href="/le-journal" style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>→ Retour au blog</Link>
                </div>
            </section>
        </main>
    )
}
