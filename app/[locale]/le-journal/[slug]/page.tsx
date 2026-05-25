'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

const articles: Record<string, {
    titre: string
    date: string
    image: string
    extrait: string
    contenu: React.ReactNode
    related: { slug: string; titre: string; image: string }[]
}> = {
    'commanderie-ambassadeurs-rungis': {
        titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis',
        date: '24 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png',
        extrait: "Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.",
        contenu: (
            <>
                <p>Dans l'écrin du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.</p>
                <p>Cet événement, réunissant des figures emblématiques du monde gastronomique et des acteurs majeurs de l'excellence française, s'inscrit dans une tradition où savoir-faire, transmission et passion sont célébrés avec exigence et élégance.</p>
                <p>Pour Dyane, cette collaboration a été l'occasion de proposer une lecture contemporaine du rituel de dégustation, en introduisant ses créations comme des objets à part entière, à la croisée du cocktail, de l'art et de l'expérience.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png" alt="Commanderie Rungis" fill style={{ objectFit: 'cover' }} />
                </div>
                <p>Présentées dans des pièces en porcelaine façonnées avec précision, les créations Dyane ont trouvé naturellement leur place dans cet environnement où chaque détail compte.</p>
                <p>Dans ce cadre chargé d'histoire et d'exigence, Dyane affirme sa volonté de s'inscrire dans les codes de l'excellence française tout en y apportant une dimension nouvelle : celle d'une Maison d'Art Liquide.</p>
            </>
        ),
        related: [
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg' },
        ],
    },
    'ritz-paris-fashion-week': {
        titre: 'Dyane Paris au Ritz Paris — Une Fashion Week',
        date: '4 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png',
        extrait: "À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence pensée comme une véritable exposition d'Art Liquide.",
        contenu: (
            <>
                <p>À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence pensée comme une véritable exposition d'Art Liquide.</p>
                <p>Dans ce lieu iconique, où se croisent création, héritage et modernité, Dyane a présenté ses pièces comme des œuvres à part entière, au-delà du simple objet fonctionnel.</p>
                <p>Loin d'un format traditionnel, cette activation s'est insérée dans une approche curatoriale, où les créations étaient mises en scène pour dialoguer avec l'espace, la lumière et le mouvement des invités.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png" alt="Ritz Paris Fashion Week" fill style={{ objectFit: 'cover' }} />
                </div>
                <p>Un moment qui confirme la volonté de Dyane Paris de s'inscrire dans les lieux et les événements où la création, l'élégance et l'art de vivre se rencontrent.</p>
                <p>Cette présence au Ritz Paris marque une étape clé dans le développement de la Maison, affirmant son positionnement à la frontière de l'art, du luxe et de l'expérience.</p>
            </>
        ),
        related: [
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg' },
        ],
    },
    'point-de-vue-distillateur': {
        titre: "Dyane, du point de vue d'un distillateur.",
        date: '22 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg',
        extrait: "Chez Dyane Paris, un cocktail ne commence jamais par un simple mélange d'ingrédients. Il naît d'une recherche autour des arômes, des matières premières et du geste de la distillation.",
        contenu: (
            <>
                <h2>LA DISTILLATION AU CŒUR DES CRÉATIONS DYANE PARIS</h2>
                <p>Chez Dyane Paris, un cocktail ne commence jamais par un simple mélange d'ingrédients. Il naît d'une recherche autour des arômes, des matières premières et du geste de la distillation.</p>
                <p>C'est dans le Vaucluse, au cœur de la Provence, que cette exploration prend forme avec Julien Ducruet, président d'Esprit Distillation.</p>
                <blockquote>« CHAQUE SPIRITUEUX EST IMAGINÉ ET ASSEMBLÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE SUBLIMER LES MATIÈRES PREMIÈRES ET RÉVÉLER LA PURETÉ DES ARÔMES. »</blockquote>
                <h2>UNE RENCONTRE ENTRE AUDACE ET SAVOIR-FAIRE</h2>
                <p>Certaines collaborations naissent d'une évidence. Celle entre Elisa, fondatrice de Dyane Paris, et Julien Ducruet en fait partie.</p>
                <blockquote>« DERRIÈRE LA JEUNESSE D'ELISA, J'AI IMMÉDIATEMENT PERÇU UNE MATURITÉ RARE, UNE ÉNERGIE POSITIVE FOLLE ET CETTE INTUITION JUSTE QUI CARACTÉRISE LES GRANDS CRÉATEURS. »</blockquote>
                <h2>L'INTERPRÉTATION DES MATIÈRES PREMIÈRES</h2>
                <p>La distillation n'est pas qu'un procédé technique : c'est un véritable art d'interprétation. Gingembre, vanille, agrumes ou plantes aromatiques sont choisis pour leur potentiel aromatique.</p>
                <blockquote>« TOUT COMMENCE PAR LA MATIÈRE PREMIÈRE. NOTRE RÔLE EST DE LA COMPRENDRE, DE LA RESPECTER ET D'EN RÉVÉLER LE MEILLEUR. »</blockquote>
                <h2>UNE SIGNATURE FRANÇAISE</h2>
                <p>Cette collaboration entre Dyane Paris et Esprit Distillation est née d'un respect mutuel et d'une ambition partagée : proposer des cocktails premium qui allient authenticité, élégance et modernité.</p>
                <blockquote>« ENSEMBLE, NOUS CRÉONS DES COCKTAILS QUI RACONTENT UNE HISTOIRE : CELLE D'UNE RENCONTRE, D'UNE PASSION COMMUNE ET D'UN ENGAGEMENT TOTAL POUR LA QUALITÉ. »</blockquote>
            </>
        ),
        related: [
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png' },
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg' },
        ],
    },
    'teo-for-dyane': {
        titre: 'TEO FOR DYANE',
        date: '18 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg',
        extrait: "Une collaboration entre Dyane Paris et le peintre Matteo Mengacci, plus connu sous le nom de Teo Kaykay.",
        contenu: (
            <>
                <p>Dyane Paris a noué une collaboration artistique avec Matteo Mengacci, alias Teo Kaykay, peintre dont l'univers visuel se distingue par une énergie brute et une palette audacieuse.</p>
                <p>Cette rencontre entre deux univers — l'Art Liquide de Dyane et la peinture de Teo — a donné naissance à une série de pièces uniques où la bouteille devient toile.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg" alt="Teo for Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
                <p>La collaboration illustre la vision de Dyane Paris : faire du contenant une œuvre à part entière, aussi singulière que le cocktail qu'elle abrite.</p>
                <p>Ce projet s'inscrit dans la démarche de la Maison : inviter des artistes à s'exprimer à travers le prisme de l'Art Liquide, pour créer des éditions limitées qui sont autant des objets de collection que des expériences sensorielles.</p>
            </>
        ),
        related: [
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png' },
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg' },
        ],
    },
    'cocktail-oeuvre-collectionner': {
        titre: 'Quand le Cocktail devient œuvre à Collectionner',
        date: '31 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg',
        extrait: "Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. Dans un paysage du luxe en pleine mutation, la jeune Maison française propose un geste inédit.",
        contenu: (
            <>
                <h2>ET SI UNE OEUVRE POUVAIT SE BOIRE ?</h2>
                <p>Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. Ce que Dyane Paris appelle "Art Liquide" repose sur une idée précise : un cocktail signature haut de gamme présenté dans un contenant artistique unique, pensé pour être conservé.</p>
                <h2>L'APPARITION D'UNE NOUVELLE CATÉGORIE</h2>
                <p>Dyane ne revendique pas l'étiquette de simple marque de Ready-To-Drink. Son positionnement est plus ambitieux : Maison d'Art Liquide.</p>
                <h2>LA BOUTEILLE DEVIENT SCULPTURE</h2>
                <p>Dyane abandonne l'archétype historique de la bouteille en verre pour adopter la porcelaine. Cette matière noble donne à la pièce une présence sculpturale, inspirée de la Vénus de Milo.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg" alt="Cocktail œuvre" fill style={{ objectFit: 'cover' }} />
                </div>
                <h2>UNE RENAISSANCE CONTEMPORAINE DE L'ARTISANAT FRANÇAIS</h2>
                <p>Plus de 70 mains façonnent chaque pièce. La porcelaine est cuite trois fois, à 600°C, 900°C et 1300°C. Le cycle complet prend plus de deux mois.</p>
                <h2>L'OBJET APRÈS LA DÉGUSTATION</h2>
                <p>Une fois vide, la statue devient pièce décorative, souvenir d'un moment, objet de collection. La production est limitée à environ 500 pièces par an.</p>
                <p style={{ ...lora, fontSize: '11px', opacity: 0.5, marginTop: '48px' }}>Crédit : Bethszabée Garner, Oniriq, paru le vendredi 19 février 2026.</p>
            </>
        ),
        related: [
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491786/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.43.00_ocmeeg.png' },
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777449278/f00d9ad4796cd5debc9e8da3c8d5c00d_1_ugpgdf.jpg' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg' },
        ],
    },
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const article = articles[params.slug]

    if (!article) return (
        <main style={{ padding: '120px 24px', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
            <p>Article non trouvé</p>
            <Link href={`/${locale}/le-journal`}>← Retour au journal</Link>
        </main>
    )

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .article-hero { grid-template-columns: 1fr !important; gap: 24px !important; padding: 40px 20px 24px !important; }
                    .article-hero-img { height: 240px !important; }
                    .article-body { padding: 32px 20px !important; }
                    .article-related-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
                    .article-related-img { height: 100px !important; }
                }
                .article-content p { margin-bottom: 24px; font-family: 'Lora', serif; font-size: 16px; line-height: 2; color: #222; }
                .article-content h2 { font-family: 'Playfair Display', serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; margin: 48px 0 20px; opacity: 0.6; }
                .article-content blockquote { border-left: 1px solid #000; padding-left: 28px; margin: 40px 0; }
                .article-content blockquote p { font-family: 'Playfair Display', serif; font-size: 13px; letter-spacing: 0.12em; font-style: italic; line-height: 1.8; opacity: 0.85; }
                .article-content strong { font-weight: 600; }
            `}</style>
            <main style={{ background: '#FAF8F5' }}>

                {/* Hero */}
                <section className="article-hero" style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px 48px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '64px', alignItems: 'start' }}>
                    <div className="article-hero-img" style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                        <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} />
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
                <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ ...lora, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, margin: '48px 0 32px' }}>À LIRE AUSSI</p>
                    <div className="article-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {article.related.map((r) => (
                            <Link key={r.slug} href={`/${locale}/le-journal/${r.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                                <div className="article-related-img" style={{ position: 'relative', height: '140px', overflow: 'hidden', marginBottom: '12px' }}>
                                    <Image src={r.image} alt={r.titre} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <p style={{ ...font, fontSize: '13px', lineHeight: 1.4, marginBottom: '6px' }}>{r.titre}</p>
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
