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
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_rzj5qf.png',
        extrait: "Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à une soirée d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.",
        contenu: (
            <>
                <p>Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à une soirée d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.</p>
                <p>Réunissant des figures emblématiques de la gastronomie française, des artisans du goût et des acteurs majeurs de l'excellence française, cet événement célébrait la transmission, le savoir-faire et la passion avec une élégance rare.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713796/CAFE_2_wozute.png" alt="Café de l'Homme" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Dans ce décor suspendu au-dessus de Paris, Dyane a présenté ses créations comme des objets à part entière, à la frontière du cocktail, de l'art et de l'expérience sensorielle. Les pièces en porcelaine, façonnées avec précision, trouvaient naturellement leur place dans cet univers où chaque détail porte une intention et où l'exigence devient une signature.</p>
                <p>Cette collaboration fut l'occasion pour la Maison de proposer une lecture contemporaine du rituel de dégustation. Chez Dyane, le cocktail ne se limite pas à un instant de consommation : il devient un geste esthétique, une émotion visuelle, une œuvre pensée pour prolonger l'expérience bien au-delà du verre.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/CAFE_3_vzlzva.png" alt="Café de l'Homme Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Présentées dans un cadre chargé d'histoire et de symboles, les créations Dyane ont dialogué avec l'esprit du lieu, mêlant héritage gastronomique français et vision contemporaine du luxe. À travers cette présence au Café de l'Homme, Dyane Paris poursuit son inscription dans les cercles de l'excellence française tout en affirmant une vision singulière : celle d'une Maison d'Art Liquide où la création, l'émotion et le savoir-faire se rencontrent.</p>
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
        titre: 'Dyane Paris au Ritz Paris, Fashion Week',
        date: '4 MARS 2026',
        image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png',
        extrait: "À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence imaginée comme une véritable exposition d'Art Liquide.",
        contenu: (
            <>
                <p>À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence imaginée comme une véritable exposition d'Art Liquide.</p>
                <p>Dans ce lieu emblématique de la place Vendôme, où se croisent héritage, création et art de vivre à la française, la Maison a dévoilé ses créations en porcelaine comme des œuvres sculpturales à part entière.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_ukrb4s.png" alt="Ritz Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Loin d'une approche traditionnelle de la dégustation, cette présence s'apparentait davantage à une installation curatoriale qu'à une simple activation événementielle. Les cocktails devenaient objets d'expression, silhouettes à contempler, signatures visuelles incarnant une vision nouvelle du luxe contemporain.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_3_eow2t2.png" alt="Ritz Paris Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Présentées dans les salons du Ritz Paris, les créations Dyane ont trouvé naturellement leur place dans cet univers où chaque détail raconte une histoire. La porcelaine, travaillée comme une matière d'art, faisait écho à l'atmosphère intemporelle du lieu, entre raffinement classique et modernité discrète.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713796/RITZ_4_c0iyhi.png" alt="Ritz Paris Fashion Week Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>À travers cette apparition durant la Fashion Week, Dyane Paris affirme sa volonté d'inscrire l'Art Liquide dans les lieux où la mode, la culture et l'excellence française se rencontrent avec évidence. Une présence qui traduit l'ambition de la Maison : faire du cocktail un objet de collection, de contemplation et d'émotion.</p>
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
        extrait: "Chez Dyane Paris, un cocktail ne naît jamais d'un simple assemblage. Il prend forme à travers une recherche exigeante autour des arômes, des matières premières et du geste précis de la distillation.",
        contenu: (
            <>
                <p>Chez Dyane Paris, un cocktail ne naît jamais d'un simple assemblage. Il prend forme à travers une recherche exigeante autour des arômes, des matières premières et du geste précis de la distillation.</p>
                <p>C'est au cœur du Vaucluse, entre lumière provençale et savoir-faire artisanal, que cette exploration se construit aux côtés de Julien Ducruet, président d'Esprit Distillation.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_yjwtvq.png" alt="Distillation Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <blockquote>« CHAQUE SPIRITUEUX EST IMAGINÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE RÉVÉLER LA PURETÉ DES ARÔMES ET LA COMPLEXITÉ DES MATIÈRES PREMIÈRES. »</blockquote>
                <p>Certaines collaborations naissent d'une évidence. Celle entre Elisa Evrard Ordonez, fondatrice de Dyane Paris, et Julien Ducruet s'est imposée autour d'une ambition commune : créer des cocktails capables de conjuguer exigence technique, émotion et sophistication contemporaine.</p>
                <blockquote>« DERRIÈRE LA JEUNESSE D'ELISA, J'AI IMMÉDIATEMENT PERÇU UNE MATURITÉ RARE, UNE ÉNERGIE POSITIVE FOLLE ET CETTE INTUITION JUSTE QUI CARACTÉRISE LES GRANDS CRÉATEURS. »</blockquote>
                <p>Au-delà de la maîtrise des procédés, cette rencontre traduit une vision commune du luxe français : un luxe fondé sur le temps, le détail et l'authenticité du geste. Chez Dyane, la création d'un cocktail s'apparente davantage au travail d'un parfumeur ou d'un artisan d'art qu'à une simple production de boissons.</p>
                <blockquote>« ENSEMBLE, NOUS CRÉONS DES COCKTAILS QUI RACONTENT UNE HISTOIRE : CELLE D'UNE RENCONTRE, D'UNE PASSION COMMUNE ET D'UN ENGAGEMENT TOTAL POUR LA QUALITÉ. »</blockquote>
                <p>Chaque création raconte ainsi une histoire singulière — celle d'une rencontre entre artisanat, création et passion — portée par une volonté absolue de qualité. Une approche où la distillation devient un langage, et où chaque note aromatique participe à la signature émotionnelle de la Maison.</p>
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
        extrait: "Chez Dyane Paris, chaque ingrédient est un choix délibéré. De l'alcool vinique élaboré en France aux fruits, plantes et épices sélectionnés avec précision, rien n'est laissé au hasard.",
        contenu: (
            <>
                <p>Chez Dyane Paris, chaque ingrédient est un choix délibéré. De l'alcool vinique élaboré en France aux fruits, plantes et épices sélectionnés avec précision, rien n'est laissé au hasard. Chaque composant est pensé pour apporter équilibre, profondeur et signature aromatique à nos créations.</p>
                <h2>LE CHOIX DE L'ALCOOL VINIQUE</h2>
                <p>Nous avons choisi un alcool vinique issu de la fermentation puis de la distillation du vin, élaboré exclusivement en France, dans la région d'Avignon, après les vendanges bordelaises. Plus noble et plus complexe qu'un alcool neutre de grain, il apporte une texture plus ronde, une longueur plus élégante et une profondeur naturelle qui sublime les ingrédients sans jamais les dominer.</p>
                <p>Sélectionné pour sa pureté à 96%, cet alcool se distingue par sa neutralité aromatique maîtrisée : suffisamment discrète pour laisser s'exprimer chaque note, suffisamment structurée pour donner de la tenue et du relief à l'ensemble.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDINETS_b7p9za.png" alt="Ingrédients Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>DES FRUITS ET PLANTES D'EXCEPTION</h2>
                <p>Le fruit de la passion provient de filières sélectionnées pour la richesse de leur maturité et l'intensité naturelle de leurs arômes. La vanille utilisée dans nos créations est une Bourbon Gold de La Réunion, reconnue pour sa rondeur profonde et ses notes chaudes et enveloppantes. Le gingembre, issu de producteurs français, révèle une chaleur vive, nette et parfaitement équilibrée.</p>
                <p>Chaque ingrédient fait l'objet d'une sélection rigoureuse. Nous travaillons exclusivement avec des partenaires capables de garantir une qualité irréprochable d'un batch à l'autre, afin de préserver l'identité sensorielle de chaque création Dyane Paris.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/INGREDIENTS_2_giygrp.png" alt="Ingrédients locaux Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>UN ENGAGEMENT POUR LE TERROIR FRANÇAIS</h2>
                <p>Dyane Paris est une Maison profondément ancrée dans le terroir français. Nos cocktails ne sont pas seulement fabriqués en France : ils sont pensés, élaborés et assemblés avec des ingrédients qui racontent une géographie, une saison, un geste artisanal.</p>
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
        extrait: "Dyane Paris dévoile une collaboration artistique avec Matteo Mengacci, plus connu sous le nom de Teo Kaykay, peintre dont l'univers visuel se distingue par une énergie instinctive et une écriture contemporaine immédiatement reconnaissable.",
        contenu: (
            <>
                <p>Dyane Paris dévoile une collaboration artistique avec Matteo Mengacci, plus connu sous le nom de Teo Kaykay, peintre italien dont l'univers visuel se distingue par une énergie instinctive, des contrastes affirmés et une écriture contemporaine immédiatement reconnaissable.</p>
                <p>À travers cette rencontre entre l'Art Liquide de Dyane et l'univers pictural de Teo, la Maison poursuit son dialogue entre artisanat, création et expression artistique. Ensemble, ils donnent naissance à une série de pièces uniques où la bouteille devient toile, sculpture et terrain d'expérimentation visuelle.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_2_whlyb1.png" alt="Teo Kaykay Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Chaque création en porcelaine a été peinte à la main par l'artiste, transformant les silhouettes Dyane en œuvres singulières. Les couleurs vibrantes, les motifs spontanés et les jeux de matière viennent habiter la porcelaine avec intensité, créant un contraste entre la délicatesse de la sculpture et l'énergie brute du geste artistique.</p>
                <p>Cette collaboration illustre pleinement la vision de Dyane Paris : faire du contenant une œuvre à part entière, aussi expressive et précieuse que le cocktail qu'elle renferme. Ici, l'objet dépasse sa fonction initiale pour devenir pièce de collection, fragment d'émotion et témoignage d'une rencontre créative.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_mcxbuu.png" alt="Teo for Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <p>Pensé comme une édition limitée, ce projet s'inscrit dans la volonté de la Maison d'inviter des artistes contemporains à s'approprier l'univers Dyane à travers leur propre langage esthétique. Chaque intervention transforme ainsi l'Art Liquide en territoire d'expression libre, où le cocktail dialogue avec la peinture, la matière et le geste.</p>
                <p>Entre sculpture, artisanat et création contemporaine, Teo for Dyane célèbre une vision du luxe plus artistique, plus émotionnelle et profondément incarnée. Une rencontre où l'objet devient mémoire visuelle autant qu'expérience sensorielle.</p>
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
        extrait: "Chez Dyane Paris, la porcelaine n'est pas un simple contenant. Elle est pensée comme une œuvre habitée, façonnée pour traverser le temps bien au-delà de la dégustation.",
        contenu: (
            <>
                <p>Chez Dyane Paris, la porcelaine n'est pas un simple contenant. Elle est pensée comme une œuvre habitée, façonnée pour traverser le temps bien au-delà de la dégustation.</p>
                <p>Chaque pièce naît d'un processus exigeant mobilisant plus de soixante-dix mains artisanes et plusieurs mois de travail. La matière, élaborée à partir de feldspath, de quartz et de kaolin, est moulée, travaillée puis soumise à trois cuissons successives afin d'obtenir sa profondeur, sa résistance et son éclat final.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/PORCELAINE_2_o6ut9l.png" alt="Porcelaine Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>LA VÉNUS DE MILO COMME RÉFÉRENCE</h2>
                <p>La silhouette de la bouteille s'inspire librement de la Vénus de Milo, figure intemporelle de féminité, de beauté classique et de mystère. Chaque courbe, chaque proportion et chaque détail ont été pensés afin de donner à la pièce une présence sculpturale autonome.</p>
                <p>Une fois vide, l'objet poursuit son existence. Il devient pièce décorative, souvenir d'un instant vécu, présence silencieuse dans un intérieur. Cette seconde vie fait partie intégrante de la philosophie de la Maison : créer des objets capables de conserver une mémoire émotionnelle.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/PORCELAINE_genaol.png" alt="Porcelaine art Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>PLUS DE 70 MAINS, DEUX MOIS DE TRAVAIL</h2>
                <p>Le cycle complet de fabrication d'une création Dyane dépasse deux mois. De la préparation de la barbotine jusqu'aux finitions peintes à la main, chaque étape célèbre la précision du geste et la noblesse des savoir-faire artisanaux.</p>
                <blockquote>« UN OBJET QUI TRAVERSE LE TEMPS DOIT ÊTRE PENSÉ POUR LE TEMPS. C'EST POURQUOI CHAQUE PIÈCE DYANE EST CONÇUE AUTANT POUR ÊTRE REGARDÉE QUE POUR ÊTRE BUE. »</blockquote>
                <p>À travers cette approche, Dyane Paris affirme une vision du luxe fondée sur le temps, la matière et la transmission. Un luxe où l'objet conserve une âme longtemps après le dernier verre, et où chaque création devient le témoin durable d'un moment d'exception.</p>
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
        extrait: "Avec Dyane Paris, le cocktail quitte le verre pour entrer dans l'univers de la sculpture. La Maison française propose une approche inédite : transformer la dégustation en expérience esthétique durable.",
        contenu: (
            <>
                <p>Avec Dyane Paris, le cocktail quitte le verre pour entrer dans l'univers de la sculpture.</p>
                <p>Dans un paysage du luxe en pleine évolution, la Maison française propose une approche inédite : transformer la dégustation en expérience esthétique durable. Ce que Dyane appelle « Art Liquide » repose sur une vision précise : des cocktails signatures haut de gamme présentés dans des pièces en porcelaine conçues pour être conservées bien après l'instant de dégustation.</p>
                <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/ART_2_akhiva.png" alt="Art Liquide Dyane" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </div>
                <h2>UNE NOUVELLE MAISON FRANÇAISE</h2>
                <p>Loin des codes traditionnels du ready-to-drink, Dyane revendique un territoire plus rare : celui d'une Maison d'Art Liquide. Une expression qui emprunte à l'univers des grandes Maisons françaises leur rapport au temps, à la matière et à la création.</p>
                <h2>LA BOUTEILLE DEVIENT SCULPTURE</h2>
                <p>Inspirées librement de la Vénus de Milo, les silhouettes en porcelaine affirment une présence sculpturale forte, entre héritage classique et modernité contemporaine. Chaque courbe a été pensée pour donner à l'objet une identité visuelle singulière, capable d'exister pleinement même après avoir été dégusté.</p>
                <h2>L'OBJET APRÈS LA DÉGUSTATION</h2>
                <p>Chez Dyane, l'objet ne disparaît pas après l'usage. Il poursuit son existence comme pièce décorative, souvenir émotionnel ou objet de collection. Produites en série limitée, les créations Dyane cultivent une forme de rareté volontaire. Chaque pièce porte en elle le temps du geste artisanal, la précision des finitions et l'idée qu'un objet peut conserver une valeur émotionnelle bien après son utilisation première.</p>
                <p>Avec Dyane Paris, le cocktail ne se consomme plus uniquement : il se contemple, se collectionne et se transmet.</p>
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
    'journal-de-bord-frivole': {
    titre: 'Journal de bord — Frivole',
    date: '24 JUIN 2026',
    image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1782315804/VISUEL1_xfkylg.png',
    extrait: "Certaines rencontres semblent écrites d'avance. Notre arrivée chez Frivole marque le début d'un nouveau chapitre dans l'histoire de Dyane.",
    contenu: (
        <>
            <p>Certaines rencontres semblent écrites d'avance. Notre arrivée chez Frivole marque le début d'un nouveau chapitre dans l'histoire de Dyane. Dès les premiers instants, le lieu dévoile son caractère : une esthétique audacieuse, une élégance contemporaine et ce subtil équilibre entre raffinement et liberté qui fait naître les plus belles collaborations.</p>
            <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1782315804/VISUEL1_xfkylg.png" alt="Frivole x Dyane Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
            <p>C'est ici qu'est née notre première création commune. Aux côtés du mixologue Thibaud Sauvet, nous avons imaginé une recette exclusive, pensée pour traduire l'identité de Frivole dans un flacon de porcelaine. Un cocktail à 21 % vol., où chaque ingrédient a été choisi avec précision pour raconter une histoire.</p>
            <p>Le gin artisanal français en constitue l'ossature, apportant une fraîcheur botanique profonde. Le sirop de basilic et de yuzu dévoile une tension végétale relevée d'une vivacité délicatement citronnée. Quelques gouttes de bitters français viennent structurer l'ensemble avec élégance, tandis que la liqueur de sureau française enveloppe la dégustation d'une douceur florale, longue et aérienne.</p>
            <blockquote><p>« UNE COMPOSITION PRÉCISE, ÉQUILIBRÉE ET RÉSOLUMENT FRANÇAISE, IMAGINÉE POUR PROLONGER L'EXPÉRIENCE FRIVOLE BIEN AU-DELÀ DE LA DERNIÈRE GORGÉE. »</p></blockquote>
            <div style={{ position: 'relative', width: '100%', height: '500px', margin: '48px 0' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1782315892/c316cbca611b6edeee751d9c65b9ec46_cefx8o.jpg" alt="Frivole x Dyane Paris — Cocktail" fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
            <p>Comme toujours chez Dyane, le contenu dialogue avec le contenant. Cette recette prendra place dans une bouteille en porcelaine peinte à la main, véritable objet d'art destiné à traverser le temps autant qu'à sublimer le moment de dégustation.</p>
            <p>Cette première journée chez Frivole n'a pas seulement donné naissance à un cocktail. Elle a posé les fondations d'une vision commune : celle d'un luxe vivant, créatif et profondément artisanal, où la mixologie rencontre l'art, et où chaque bouteille devient le souvenir tangible d'une expérience unique.</p>
            <p>Une première page s'écrit aujourd'hui. Les suivantes promettent d'être tout aussi inspirantes.</p>
        </>
    ),
    related: [
        { slug: 'teo-for-dyane', titre: 'TEO FOR DYANE', image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png' },
        { slug: 'art-de-la-porcelaine', titre: "L'Art de la Porcelaine", image: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/PORCELAINE_3_khqmjh.png' },
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
        <main style={{ background: '#FAF8F5', padding: '140px 24px 80px', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
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
