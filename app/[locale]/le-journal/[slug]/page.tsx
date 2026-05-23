import Image from 'next/image'
import Link from 'next/link'

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
                <p>Présentées dans des pièces en porcelaine façonnées avec précision, les créations Dyane ont trouvé naturellement leur place dans cet environnement où chaque détail compte. Plus qu'un service, elles ont été pensées comme une extension du moment, invitant les convives à vivre une expérience sensorielle différente, mêlant esthétique, plaisir et surprise.</p>
                <p>Dans ce cadre chargé d'histoire et d'exigence, Dyane affirme sa volonté de s'inscrire dans les codes de l'excellence française tout en y apportant une dimension nouvelle : celle d'une Maison d'Art Liquide, où le geste de dégustation devient un moment à contempler autant qu'à savourer.</p>
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
                <p>Dans ce lieu iconique, où se croisent création, héritage et modernité, Dyane a présenté ses pièces comme des œuvres à part entière, au-delà du simple objet fonctionnel. Chaque bouteille, en porcelaine, a été conçue comme une sculpture, une présence visuelle, un point de rencontre entre art et hospitalité.</p>
                <p>Loin d'un format traditionnel, cette activation s'est insérée dans une approche curatoriale, où les créations étaient mises en scène pour dialoguer avec l'espace, la lumière et le mouvement des invités. Le cocktail devient alors un médium, un prolongement de l'expérience esthétique propre à la Fashion Week.</p>
                <p>À travers cette installation, Dyane explore une nouvelle manière d'exister dans les lieux d'exception : non plus uniquement comme produit, mais comme langage visuel et sensoriel.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777491765/Capture_d_e%CC%81cran_2026-04-29_a%CC%80_21.42.39_piph9h.png" alt="Ritz Paris Fashion Week" fill style={{ objectFit: 'cover' }} />
                </div>
                <p>Un moment qui confirme la volonté de Dyane Paris de s'inscrire dans les lieux et les événements où <strong>la création, l'élégance et l'art de vivre se rencontrent</strong>.</p>
                <p>Cette présence au Ritz Paris marque une étape clé dans le développement de la Maison, affirmant son positionnement à la frontière de l'art, du luxe et de l'expérience, et ouvrant la voie à de nouvelles formes d'expression au sein des plus grandes scènes internationales.</p>
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
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', marginTop: '0' }}>LA DISTILLATION AU CŒUR DES CRÉATIONS DYANE PARIS</h2>
                <p>Chez <strong>Dyane Paris</strong>, un cocktail ne commence jamais par un simple mélange d'ingrédients. Il naît d'une <strong>recherche</strong> autour des arômes, des matières premières et du geste de la distillation. L'objectif n'est pas seulement de créer une <strong>boisson</strong>, mais de composer une expérience sensorielle complète, où chaque ingrédient trouve sa place dans un équilibre précis.</p>
                <p>C'est dans le Vaucluse, au cœur de la Provence, que cette exploration prend forme. Entourés d'<strong>agrumes</strong>, de <strong>plantes aromatiques</strong> et d'<strong>ingrédients d'exception</strong>, nous développons nos recettes avec Julien Ducruet, président d'Esprit Distillation et distillateur passionné.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0', fontStyle: 'normal' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« CHAQUE SPIRITUEUX EST IMAGINÉ ET ASSEMBLÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE SUBLIMER LES MATIÈRES PREMIÈRES ET RÉVÉLER LA PURETÉ DES ARÔMES. »</p>
                </blockquote>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>UNE RENCONTRE ENTRE AUDACE ET SAVOIR-FAIRE</h2>
                <p>Certaines collaborations naissent d'une évidence. Celle entre Elisa, fondatrice de Dyane Paris, et Julien Ducruet en fait partie.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« DERRIÈRE LA JEUNESSE D'ELISA, J'AI IMMÉDIATEMENT PERÇU UNE MATURITÉ RARE, UNE ÉNERGIE POSITIVE FOLLE ET CETTE INTUITION JUSTE QUI CARACTÉRISE LES GRANDS CRÉATEURS. »</p>
                </blockquote>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« LORSQUE DYANE PARIS M'A CONFIÉ LA CRÉATION DE SES COCKTAILS, NOUS AVONS RECONNU DANS CE PROJET LA MÊME QUÊTE D'EXCELLENCE, LA MÊME VOLONTÉ DE PROPOSER DES PRODUITS SINCÈRES, ÉLÉGANTS ET PROFONDÉMENT QUALITATIFS. »</p>
                </blockquote>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>L'INTERPRÉTATION DES MATIÈRES PREMIÈRES</h2>
                <p>La distillation n'est pas qu'un procédé technique : c'est un véritable art d'interprétation. Tout commence par la sélection des ingrédients. Gingembre, vanille, agrumes ou plantes aromatiques sont choisis non seulement pour leur qualité, mais aussi pour leur potentiel aromatique.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« TOUT COMMENCE PAR LA MATIÈRE PREMIÈRE. NOTRE RÔLE EST DE LA COMPRENDRE, DE LA RESPECTER ET D'EN RÉVÉLER LE MEILLEUR. »</p>
                </blockquote>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>L'EXPLORATION DES ARÔMES</h2>
                <p>La création d'un cocktail passe par de nombreuses expérimentations. Infusion, macération, distillation partielle ou assemblage : chaque technique permet d'explorer une facette différente d'un ingrédient.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« CE SONT SOUVENT LES NUANCES LES PLUS SUBTILES QUI TRANSFORMENT UNE RECETTE EN SIGNATURE. »</p>
                </blockquote>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>LA DISTILLATION AU SERVICE DE LA MIXOLOGIE</h2>
                <p>Chez Dyane Paris, la distillation est pensée comme un outil au service de la mixologie. Les <strong>arômes</strong> extraits deviennent les fondations des cocktails.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« NOTRE SAVOIR-FAIRE CONSISTE À CONCENTRER LES SAVEURS SANS JAMAIS LES DURCIR, À DONNER DE LA STRUCTURE SANS PERDRE L'ÉLÉGANCE. »</p>
                </blockquote>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>UNE SIGNATURE FRANÇAISE</h2>
                <p>Cette collaboration entre Dyane Paris et Esprit Distillation est née d'un respect mutuel et d'une ambition partagée : proposer des cocktails premium qui allient authenticité, élégance et modernité.</p>
                <blockquote style={{ borderLeft: '2px solid #000', paddingLeft: '24px', margin: '32px 0' }}>
                    <p style={{ ...font, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.8 }}>« ENSEMBLE, NOUS CRÉONS DES COCKTAILS QUI RACONTENT UNE HISTOIRE : CELLE D'UNE RENCONTRE, D'UNE PASSION COMMUNE ET D'UN ENGAGEMENT TOTAL POUR LA QUALITÉ. »</p>
                </blockquote>
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
                <p>Cette rencontre entre deux univers — l'Art Liquide de Dyane et la peinture de Teo — a donné naissance à une série de pièces uniques où la bouteille devient toile. Chaque sculpture en porcelaine a été pensée comme un support d'expression artistique, au croisement du cocktail et de l'œuvre.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777455783/img-40_zkfygu.jpg" alt="Teo for Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
                <p>La collaboration illustre la vision de Dyane Paris : faire du contenant un œuvre à part entière, aussi singulière que le cocktail qu'elle abrite. Teo Kaykay a apporté son geste, sa palette et son énergie à des pièces destinées à traverser le temps bien au-delà de la dégustation.</p>
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
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', marginTop: '0' }}>ET SI UNE OEUVRE POUVAIT SE BOIRE?</h2>
                <p>Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. Dans un paysage du luxe en pleine mutation, la jeune Maison française propose un geste inédit : faire naître une bouteille à la fois gustative et artistique. Ce que Dyane Paris appelle <strong>"Art Liquide"</strong> repose sur une idée précise : <strong>un cocktail signature haut de gamme présenté dans un contenant artistique unique</strong>, pensé pour être conservé.</p>
                <p>Dyane Paris s'impose comme une réponse aux nouvelles attentes des amateurs de spiritueux, qui recherchent aujourd'hui <strong>autant une histoire qu'un goût</strong>. Fondée à Paris en 2025 par Elisa Evrard, la Maison propose une <strong>inversion radicale des codes du spiritueux</strong> : transformer le cocktail en œuvre d'art.</p>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>L'APPARITION D'UNE NOUVELLE CATÉGORIE</h2>
                <p>Dyane ne revendique pas l'étiquette de simple marque de Ready-To-Drink (RTD). Son positionnement est plus ambitieux : <strong>Maison d'Art Liquide</strong>. Dans l'univers du luxe français, le terme "Maison" évoque instantanément l'héritage des maisons de haute couture ou de joaillerie.</p>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>LA BOUTEILLE DEVIENT SCULPTURE</h2>
                <p>La rupture est d'abord visuelle. Dyane abandonne l'archétype historique de la bouteille en verre pour adopter la porcelaine. Cette matière noble donne à la pièce une présence sculpturale. La forme s'inspire de la Vénus de Milo, référence <strong>classique et féminine</strong>.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg" alt="Cocktail œuvre" fill style={{ objectFit: 'cover' }} />
                </div>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>UNE RENAISSANCE CONTEMPORAINE DE L'ARTISANAT FRANÇAIS</h2>
                <p>La Maison décrit son processus artistique par le passage de <strong>plus de 70 mains</strong> avant que chaque pièce ne soit finalisée. La porcelaine est élaborée à partir de trois poudres minérales : feldspath, quartz et kaolin, transformées en barbotine, moulée puis cuite trois fois à 600°C, 900°C et 1300°C. Le cycle complet prend plus de deux mois.</p>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>L'OBJET APRÈS LA DÉGUSTATION</h2>
                <p>Une fois vide, la statue ne disparaît pas : elle devient pièce décorative, souvenir d'un moment, objet de collection. La production est volontairement limitée, environ 500 pièces par an, s'échelonnant de 135 € à 3 500 €.</p>
                <h2 style={{ ...font, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '40px 0 24px' }}>UNE NOUVELLE GÉOGRAPHIE DU LUXE</h2>
                <p>Dyane ne se contente pas d'être un objet de niche : elle est pensée pour être intégrée dans des lieux d'exception. La stratégie de distribution initiale mise sur une présence dans les écrins du luxe : palaces, hôtels iconiques, restaurants gastronomiques et galeries d'art.</p>
                <p style={{ ...lora, fontSize: '11px', opacity: 0.5, marginTop: '48px' }}>Crédit: Bethszabée Garner, Oniriq, paru le vendredi 19 février 2026.</p>
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

export default function ArticlePage({ params }: { params: { slug: string; locale: string } }) {
    const article = articles[params.slug]
    if (!article) return <div>Article non trouvé</div>

    return (
        <main style={{ background: '#FAF8F5' }}>
            {/* Hero */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'start' }}>
                <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
                    <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <h1 style={{ ...font, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '20px' }}>{article.titre}</h1>
                    <p style={{ ...lora, fontSize: '13px', lineHeight: 1.7, opacity: 0.7, marginBottom: '20px' }}>{article.extrait}</p>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '20px' }}>{article.date}</p>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>↑ PARTAGER</p>
                </div>
            </section>

            {/* Divider */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)' }} />
            </div>

            {/* Contenu */}
            <section style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
                <div style={{
                    ...lora,
                    fontSize: '13px',
                    lineHeight: 1.9,
                    color: '#222',
                }}>
                    <style>{`
                        .article-content p { margin-bottom: 20px; }
                        .article-content h2 { font-family: 'Playfair Display', serif; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; margin: 40px 0 20px; }
                        .article-content blockquote { border-left: 2px solid #000; padding-left: 24px; margin: 32px 0; }
                        .article-content blockquote p { font-family: 'Playfair Display', serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; line-height: 1.8; }
                        .article-content strong { font-weight: 600; }
                    `}</style>
                    <div className="article-content">
                        {article.contenu}
                    </div>
                </div>
            </section>

            {/* Related */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5, margin: '40px 0 24px' }}>À LIRE AUSSI</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {article.related.map((r) => (
                        <Link key={r.slug} href={`/le-journal/${r.slug}`} style={{ textDecoration: 'none', color: '#000' }}>
                            <div style={{ position: 'relative', height: '120px', overflow: 'hidden', marginBottom: '10px' }}>
                                <Image src={r.image} alt={r.titre} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>BLOG</p>
                            <p style={{ ...font, fontSize: '12px', lineHeight: 1.4 }}>{r.titre}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Retour */}
            <section style={{ textAlign: 'center', padding: '0 0 80px' }}>
                <Link href="/le-journal" style={{ ...lora, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>
                    → Retour au blog
                </Link>
            </section>
        </main>
    )
}
