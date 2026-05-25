'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

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
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png',
        extrait: "Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.",
        contenu: (
            <>
                <p>Dans l'écrin du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à un moment d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.</p>
                <p>Cet événement, réunissant des figures emblématiques du monde gastronomique et des acteurs majeurs de l'excellence française, s'inscrit dans une tradition où savoir-faire, transmission et passion sont célébrés avec exigence et élégance.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713796/CAFE_2_wozute.png" alt="Café de l'Homme" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Pour Dyane, cette collaboration a été l'occasion de proposer une lecture contemporaine du rituel de dégustation, en introduisant ses créations comme des objets à part entière, à la croisée du cocktail, de l'art et de l'expérience.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_3_vzlzva.png" alt="Café de l'Homme Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Présentées dans des pièces en porcelaine façonnées avec précision, les créations Dyane ont trouvé naturellement leur place dans cet environnement où chaque détail compte. Dans ce cadre chargé d'histoire et d'exigence, Dyane affirme sa volonté de s'inscrire dans les codes de l'excellence française tout en y apportant une dimension nouvelle : celle d'une Maison d'Art Liquide.</p>
            </>
        ),
        related: [
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png' },
            { slug: 'ingredients-locaux-francais', titre: "L'Exigence des Ingrédients", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png' },
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
        ],
    },
    'ritz-paris-fashion-week': {
        titre: 'Dyane Paris au Ritz Paris — Une Fashion Week',
        date: '4 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png',
        extrait: "À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence pensée comme une véritable exposition d'Art Liquide.",
        contenu: (
            <>
                <p>À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence pensée comme une véritable exposition d'Art Liquide.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_ukrb4s.png" alt="Ritz Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Dans ce lieu iconique, où se croisent création, héritage et modernité, Dyane a présenté ses pièces comme des œuvres à part entière. Chaque bouteille, en porcelaine, a été conçue comme une sculpture, une présence visuelle, un point de rencontre entre art et hospitalité.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_3_eow2t2.png" alt="Ritz Paris Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Loin d'un format traditionnel, cette activation s'est insérée dans une approche curatoriale, où les créations étaient mises en scène pour dialoguer avec l'espace, la lumière et le mouvement des invités.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713796/RITZ_4_c0iyhi.png" alt="Ritz Paris Fashion Week Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Un moment qui confirme la volonté de Dyane Paris de s'inscrire dans les lieux et les événements où la création, l'élégance et l'art de vivre se rencontrent.</p>
            </>
        ),
        related: [
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png' },
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png' },
        ],
    },
    'point-de-vue-distillateur': {
        titre: "Dyane, du point de vue d'un distillateur.",
        date: '22 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png',
        extrait: "Chez Dyane Paris, un cocktail ne commence jamais par un simple mélange d'ingrédients. Il naît d'une recherche autour des arômes, des matières premières et du geste de la distillation.",
        contenu: (
            <>
                <h2>LA DISTILLATION AU CŒUR DES CRÉATIONS DYANE PARIS</h2>
                <p>Chez Dyane Paris, un cocktail ne commence jamais par un simple mélange d'ingrédients. Il naît d'une recherche autour des arômes, des matières premières et du geste de la distillation.</p>
                <p>C'est dans le Vaucluse, au cœur de la Provence, que cette exploration prend forme avec Julien Ducruet, président d'Esprit Distillation.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_yjwtvq.png" alt="Distillation Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <blockquote>« CHAQUE SPIRITUEUX EST IMAGINÉ ET ASSEMBLÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE SUBLIMER LES MATIÈRES PREMIÈRES ET RÉVÉLER LA PURETÉ DES ARÔMES. »</blockquote>
                <h2>UNE RENCONTRE ENTRE AUDACE ET SAVOIR-FAIRE</h2>
                <p>Certaines collaborations naissent d'une évidence. Celle entre Elisa, fondatrice de Dyane Paris, et Julien Ducruet en fait partie.</p>
                <blockquote>« DERRIÈRE LA JEUNESSE D'ELISA, J'AI IMMÉDIATEMENT PERÇU UNE MATURITÉ RARE, UNE ÉNERGIE POSITIVE FOLLE ET CETTE INTUITION JUSTE QUI CARACTÉRISE LES GRANDS CRÉATEURS. »</blockquote>
                <h2>UNE SIGNATURE FRANÇAISE</h2>
                <p>Cette collaboration est née d'un respect mutuel et d'une ambition partagée : proposer des cocktails premium qui allient authenticité, élégance et modernité.</p>
                <blockquote>« ENSEMBLE, NOUS CRÉONS DES COCKTAILS QUI RACONTENT UNE HISTOIRE : CELLE D'UNE RENCONTRE, D'UNE PASSION COMMUNE ET D'UN ENGAGEMENT TOTAL POUR LA QUALITÉ. »</blockquote>
            </>
        ),
        related: [
            { slug: 'ingredients-locaux-francais', titre: "L'Exigence des Ingrédients", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png' },
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png' },
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
        ],
    },
    'ingredients-locaux-francais': {
        titre: "L'Exigence des Ingrédients : Alcool Vinique et Filières Françaises",
        date: '10 FÉVRIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png',
        extrait: "Chez Dyane Paris, chaque ingrédient est une décision. L'alcool vinique élaboré en France, les fruits, les plantes — rien n'est laissé au hasard.",
        contenu: (
            <>
                <h2>LE CHOIX DE L'ALCOOL VINIQUE</h2>
                <p>Chez Dyane Paris, tout commence par la base. L'alcool vinique — issu de la fermentation puis de la distillation du vin — constitue le fondement de chacune de nos créations. Contrairement aux alcools neutres de grain, l'alcool vinique apporte une profondeur aromatique naturelle et une rondeur qui subliment chaque ingrédient qu'il accueille.</p>
                <p>Élaboré exclusivement en France, dans la région d'Avignon, cet alcool est sélectionné pour sa pureté à 96%, sa neutralité aromatique maîtrisée et sa capacité à porter les ingrédients sans les écraser.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDINETS_b7p9za.png" alt="Ingrédients Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>DES FRUITS ET PLANTES D'EXCEPTION</h2>
                <p>Le fruit de la passion provient de filières sélectionnées pour leur maturité et leur intensité. La vanille est une Madagascar Bourbon Gold, reconnue pour sa rondeur exceptionnelle. Le gingembre, issu de producteurs français, libère une chaleur nette et précise.</p>
                <p>Chaque ingrédient fait l'objet d'une sélection rigoureuse. Nous travaillons uniquement avec des filières capables de garantir une constance qualitative d'un batch à l'autre.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/INGREDIENTS_2_giygrp.png" alt="Ingrédients locaux Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>UN ENGAGEMENT POUR LE TERROIR FRANÇAIS</h2>
                <p>Dyane Paris est une Maison profondément ancrée dans le terroir français. Nos cocktails ne sont pas seulement fabriqués en France — ils sont pensés, élaborés et assemblés avec des ingrédients qui racontent une géographie, une saison, un geste artisanal.</p>
                <blockquote>« NOUS NE FAISONS PAS DES COCKTAILS. NOUS FAISONS DES INTERPRÉTATIONS D'UN TERRITOIRE ET D'UNE SAISON, CAPTURÉES DANS UN FLACON. »</blockquote>
            </>
        ),
        related: [
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png' },
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png' },
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png' },
        ],
    },
    'teo-for-dyane': {
        titre: 'TEO FOR DYANE',
        date: '18 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png',
        extrait: "Une collaboration entre Dyane Paris et le peintre Matteo Mengacci, plus connu sous le nom de Teo Kaykay.",
        contenu: (
            <>
                <p>Dyane Paris a noué une collaboration artistique avec Matteo Mengacci, alias Teo Kaykay, peintre dont l'univers visuel se distingue par une énergie brute et une palette audacieuse.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_2_whlyb1.png" alt="Teo Kaykay Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Cette rencontre entre deux univers — l'Art Liquide de Dyane et la peinture de Teo — a donné naissance à une série de pièces uniques où la bouteille devient toile. Chaque sculpture en porcelaine a été pensée comme un support d'expression artistique, au croisement du cocktail et de l'œuvre.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_mcxbuu.png" alt="Teo for Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>La collaboration illustre la vision de Dyane Paris : faire du contenant une œuvre à part entière, aussi singulière que le cocktail qu'elle abrite. Ce projet s'inscrit dans la démarche de la Maison : inviter des artistes à s'exprimer à travers le prisme de l'Art Liquide, pour créer des éditions limitées qui sont autant des objets de collection que des expériences sensorielles.</p>
            </>
        ),
        related: [
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
            { slug: 'ritz-paris-fashion-week', titre: 'Dyane Paris au Ritz Paris — Une Fashion Week', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png' },
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png' },
            { slug: 'commanderie-ambassadeurs-rungis', titre: 'Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png' },
        ],
    },
    'art-de-la-porcelaine': {
        titre: "L'Art de la Porcelaine : Quand le Contenant devient Œuvre",
        date: '5 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png',
        extrait: "La porcelaine de Dyane Paris n'est pas un emballage. C'est une sculpture habitée, façonnée par plus de 70 mains, cuite trois fois, pensée pour traverser le temps.",
        contenu: (
            <>
                <h2>UNE MATIÈRE NOBLE, UN GESTE ANCIEN</h2>
                <p>La porcelaine de Dyane Paris n'est pas un emballage. C'est une sculpture habitée, façonnée par plus de 70 mains, cuite trois fois, pensée pour traverser le temps bien au-delà de la dégustation.</p>
                <p>Élaborée à partir de trois poudres minérales — feldspath, quartz et kaolin — la barbotine est moulée, travaillée, puis soumise à trois cuissons successives : à 600°C, à 900°C, et à 1300°C pour la vitrification finale qui lui confère son éclat caractéristique.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/PORCELAINE_2_o6ut9l.png" alt="Porcelaine Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>LA VÉNUS DE MILO COMME RÉFÉRENCE</h2>
                <p>La forme de la bouteille Dyane s'inspire librement de la Vénus de Milo — symbole intemporel de féminité, de beauté classique et de mystère. Chaque courbe, chaque proportion a été pensée pour que la sculpture existe pleinement, même vide.</p>
                <p>L'objet ne disparaît pas après la dégustation — il commence une nouvelle vie décorative, mémorielle, affective.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/PORCELAINE_genaol.png" alt="Porcelaine art Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>PLUS DE 70 MAINS, DEUX MOIS DE TRAVAIL</h2>
                <p>Le cycle complet de fabrication d'une pièce Dyane prend plus de deux mois. De la préparation de la barbotine à la peinture finale, chaque étape mobilise des artisans spécialisés dont le geste est irremplaçable.</p>
                <blockquote>« UN OBJET QUI TRAVERSE LE TEMPS DOIT ÊTRE PENSÉ POUR LE TEMPS. C'EST POURQUOI CHAQUE PIÈCE DYANE EST CONÇUE AUTANT POUR ÊTRE REGARDÉE QUE POUR ÊTRE BUE. »</blockquote>
            </>
        ),
        related: [
            { slug: 'cocktail-oeuvre-collectionner', titre: 'Quand le Cocktail devient œuvre à Collectionner', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png' },
            { slug: 'ingredients-locaux-francais', titre: "L'Exigence des Ingrédients", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png' },
        ],
    },
    'cocktail-oeuvre-collectionner': {
        titre: 'Quand le Cocktail devient œuvre à Collectionner',
        date: '31 JANVIER 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/ART_pq1nvz.png',
        extrait: "Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. Dans un paysage du luxe en pleine mutation, la jeune Maison française propose un geste inédit.",
        contenu: (
            <>
                <h2>ET SI UNE OEUVRE POUVAIT SE BOIRE ?</h2>
                <p>Avec Dyane Paris, le cocktail quitte le verre pour investir la sculpture. Ce que Dyane Paris appelle "Art Liquide" repose sur une idée précise : un cocktail signature haut de gamme présenté dans un contenant artistique unique, pensé pour être conservé.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/ART_2_akhiva.png" alt="Art Liquide Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>L'APPARITION D'UNE NOUVELLE CATÉGORIE</h2>
                <p>Dyane ne revendique pas l'étiquette de simple marque de Ready-To-Drink. Son positionnement est plus ambitieux : Maison d'Art Liquide. Dans l'univers du luxe français, le terme "Maison" évoque instantanément l'héritage des maisons de haute couture ou de joaillerie.</p>
                <h2>LA BOUTEILLE DEVIENT SCULPTURE</h2>
                <p>Dyane abandonne l'archétype historique de la bouteille en verre pour adopter la porcelaine. Cette matière noble donne à la pièce une présence sculpturale, inspirée de la Vénus de Milo — référence classique et féminine.</p>
                <h2>L'OBJET APRÈS LA DÉGUSTATION</h2>
                <p>Une fois vide, la statue devient pièce décorative, souvenir d'un moment, objet de collection. La production est volontairement limitée, environ 500 pièces par an.</p>
                <p style={{ ...lora, fontSize: '11px', opacity: 0.5, marginTop: '48px' }}>Crédit : Bethszabée Garner, Oniriq, paru le vendredi 19 février 2026.</p>
            </>
        ),
        related: [
            { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
            { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png' },
            { slug: 'point-de-vue-distillateur', titre: "Dyane, du point de vue d'un distillateur", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_2_r6oj8w.png' },
            { slug: 'ingredients-locaux-francais', titre: "L'Exigence des Ingrédients", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png' },
        ],
    },
}

export default function ArticlePage({ params }: { params: { slug: string; locale: string } }) {
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const article = articles[params.slug]

    if (!article) return (
        <main style={{ background: '#FAF8F5', padding: '140px 24px 80px', textAlign: 'center', fontFamily: 'var(--font-playfair), serif' }}>
            <p>Article non trouvé</p>
            <Link href={`/${locale}/le-journal`}>← Retour au journal</Link>
        </main>
    )

    return (
        <>
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
                .article-content p { margin-bottom: 24px; font-family: var(--font-lora), serif; font-size: 16px; line-height: 2; color: #222; }
                .article-content h2 { font-family: var(--font-playfair), serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; margin: 48px 0 20px; opacity: 0.6; }
                .article-content blockquote { border-left: 1px solid #000; padding-left: 28px; margin: 40px 0; }
                .article-content blockquote p { font-family: var(--font-playfair), serif; font-size: 13px; letter-spacing: 0.12em; font-style: italic; line-height: 1.8; opacity: 0.85; }
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
