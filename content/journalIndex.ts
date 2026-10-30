import type { JournalMedia, LocalizedText } from './journal'

export type JournalIndexVariant = 'feature' | 'images-left' | 'images-right' | 'cinematic'
export type JournalIndexCategory = 'hospitality' | 'cocktails' | 'craftsmanship' | 'art-collaborations'

export type JournalIndexLayout = Readonly<{
    columns: readonly [number, number, number]
    overlap?: Readonly<{
        image: 1 | 2 | 3
        amount: string
    }>
}>

export type JournalIndexStory = Readonly<{
    filter: JournalIndexCategory
    category: LocalizedText
    rubric: LocalizedText
    title: LocalizedText
    subtitle?: LocalizedText
    href: string
    excerpt: LocalizedText
    images: readonly JournalMedia[]
    variant: JournalIndexVariant
    indexLayout?: JournalIndexLayout
}>

type JournalIndexStoryDraft = Omit<JournalIndexStory, 'filter' | 'indexLayout'>

type JournalIndexEntryConfig = JournalIndexLayout & Readonly<{
    filter: JournalIndexCategory
    order?: readonly [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2]
    sources?: readonly [string | JournalMedia | null, string | JournalMedia | null, string | JournalMedia | null]
}>

const t = (fr: string, en: string): LocalizedText => ({ fr, en })

const image = (src: string, fr: string, en: string, objectPosition = 'center'): JournalMedia => ({
    kind: 'image',
    src,
    alt: t(fr, en),
    ratio: 'landscape',
    fit: 'cover',
    objectPosition,
})

const journalIndexStoryDrafts: readonly JournalIndexStoryDraft[] = [
    {
        category: t('HOSPITALITÉ', 'HOSPITALITY'),
        rubric: t('APERÇU ÉDITORIAL', 'EDITORIAL PREVIEW'),
        title: t("L’Art de Recevoir, Autrement", 'The Art of Hosting, Reimagined'),
        href: '/le-journal/art-de-recevoir-cocktail-hotel',
        excerpt: t(
            "Recevoir ne consiste pas seulement à ouvrir une porte. C’est composer une attention, donner un rythme à l’arrivée et laisser au lieu le temps de se révéler.",
            'Hosting is more than opening a door. It is composing an attention, setting the rhythm of an arrival and allowing a place to reveal itself.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788643773/dyane-paris-sculpture-rouge-art-floral.png',
                'L’art de recevoir selon Dyane Paris',
                'The art of hosting according to Dyane Paris',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788705330/B_Fleur_de_la_Passion._Grande_fleur_solitaire_remarquable_par_sa_couronne_de_filaments_colore%CC%81s._Pe%CC%81tales_clairs_e%CC%81tamines_saillantes_et_pistil_proe%CC%81minent._Fleur_caracte%CC%81ristique_du_genre_Passiflo_31_flyp3u.png',
                'Détail d’une réception Dyane Paris',
                'Detail of a Dyane Paris reception',
            ),
        ],
        variant: 'feature',
    },
    {
        category: t('HOSPITALITÉ', 'HOSPITALITY'),
        rubric: t('LE BAR', 'THE BAR'),
        title: t('L’Heure du Bar', 'The Bar Hour'),
        href: '/le-journal/heure-du-bar-cocktail-hotel',
        excerpt: t(
            "À la fin du jour, l’hôtel change de rythme. Le bar devient un point de rencontre, une lumière dans le mouvement du lieu.",
            'At the end of the day, the hotel changes pace. The bar becomes a meeting point, a light within the movement of the place.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788704866/dyane-paris-cocktail-service-detail.png',
                'L’heure du bar avec Dyane Paris',
                'The bar hour with Dyane Paris',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788705296/dyane-paris-cocktail-pret-a-servir-shaker.png',
                'Atmosphère d’un bar Dyane Paris',
                'A Dyane Paris bar atmosphere',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('HOSPITALITÉ', 'HOSPITALITY'),
        rubric: t('CHAMBRES & MINIBAR', 'ROOMS & MINIBAR'),
        title: t('Dans l’Intimité des Chambres', 'In the Privacy of the Room'),
        href: '/le-journal/cocktail-minibar-hotel',
        excerpt: t(
            "Une chambre d’hôtel est un intérieur temporaire. Pendant quelques heures ou quelques jours, elle devient un espace à soi.",
            'A hotel room is a temporary interior. For a few hours or a few days, it becomes a space of one’s own.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788704863/dyane-paris-sculpture-porcelaine-rouge-exposition.png',
                'Dyane Paris dans l’intimité d’une chambre',
                'Dyane Paris in the privacy of a room',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788704992/dyane-paris-sculpture-silhouette-lumiere-doree.png',
                'Le minibar selon Dyane Paris',
                'The minibar according to Dyane Paris',
            ),
        ],
        variant: 'images-right',
    },
    {
        category: t('COCKTAILS', 'COCKTAILS'),
        rubric: t('LES SIGNATURES', 'SIGNATURES'),
        title: t('Pornstar Martini, Anatomie d’une Icône', 'Pornstar Martini, Anatomy of an Icon'),
        href: '/le-journal/pornstar-martini',
        excerpt: t(
            'Certaines créations deviennent des icônes parce qu’elles réunissent en un seul geste une couleur, un parfum et une époque.',
            'Some creations become icons because they bring together a colour, a scent and an era in a single gesture.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788646118/dyane-paris-cocktail-jaune-ingredients-detail.png',
                'Pornstar Martini, une icône Dyane Paris',
                'Pornstar Martini, a Dyane Paris icon',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788645247/dyane-paris-ingredient-cocktail-vanille.png',
                'Dyane No.1 et le Pornstar Martini',
                'Dyane No.1 and the Pornstar Martini',
            ),
        ],
        variant: 'cinematic',
    },
    {
        category: t('COCKTAILS', 'COCKTAILS'),
        rubric: t('LES SIGNATURES', 'SIGNATURES'),
        title: t('Moscow Mule, L’Éclat du Gingembre', 'Moscow Mule, The Brightness of Ginger'),
        href: '/le-journal/moscow-mule',
        excerpt: t(
            'Le Moscow Mule semble tenir en quelques lignes : la vodka, le gingembre, le citron vert et le froid. Sa simplicité est pourtant une discipline.',
            'The Moscow Mule seems to fit into a few lines: vodka, ginger, lime and cold. Yet its simplicity is a discipline.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788340449/dyane-paris-cocktail-dyaneno2-verre.png',
                'Histoire du Moscow Mule',
                'History of the Moscow Mule',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788704671/32507171a9d356f9bebf96606989d6c3_r0n5zd.jpg',
                'L’éclat du gingembre',
                'The brightness of ginger',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('COCKTAILS', 'COCKTAILS'),
        rubric: t('LES SIGNATURES', 'SIGNATURES'),
        title: t('Basil Smash, Le Vert comme Signature', 'Basil Smash, Green as a Signature'),
        href: '/le-journal/basil-smash',
        excerpt: t(
            'Avant même d’être une saveur, le Basil Smash est une couleur. Un vert franc qui annonce la fraîcheur avant le premier parfum.',
            'Before it is a flavour, the Basil Smash is a colour. A vivid green that announces freshness before the first aroma.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788442840/dyane-paris-cocktail-vert-art-de-recevoir.jpg',
                'Basil Smash, le vert comme signature',
                'Basil Smash, green as a signature',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788704638/308553d6f315e3c0a8ce9be7392bb373_htukmn.jpg',
                'Composition végétale du Basil Smash',
                'Botanical Basil Smash composition',
            ),
        ],
        variant: 'images-right',
    },
    {
        category: t('SAVOIR-FAIRE', 'SAVOIR-FAIRE'),
        rubric: t('MIXOLOGIE', 'MIXOLOGY'),
        title: t('Du Bar au Flacon', 'From Bar to Bottle'),
        href: '/le-journal/cocktail-pret-a-deguster',
        excerpt: t(
            'Le cocktail traditionnel se compose devant celui qui le boit. Le verre attend, la glace résonne et le geste donne une durée à l’instant.',
            'The traditional cocktail is composed before the person who will drink it. The glass waits, ice resonates and gesture gives the moment its duration.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788680934/ChatGPT_Image_6_sept._2026_09_48_41_rddc7x.png',
                'Du bar au flacon Dyane Paris',
                'From bar to bottle at Dyane Paris',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788679012/c637aa22788ba7c3cff44ecbe31f8135_aoad1p.jpg',
                'Le geste de mixologie Dyane Paris',
                'The Dyane Paris mixology gesture',
            ),
        ],
        variant: 'cinematic',
    },
    {
        category: t('SAVOIR-FAIRE', 'SAVOIR-FAIRE'),
        rubric: t('PORCELAINE', 'PORCELAIN'),
        title: t('La Porcelaine, Matière d’Éternité', 'Porcelain, a Material of Eternity'),
        href: '/le-journal/porcelaine-spiritueux',
        excerpt: t(
            'La porcelaine appartient depuis des siècles aux arts de la table. Dyane Paris la déplace vers le cocktail contemporain et en fait le flacon lui-même.',
            'Porcelain has belonged to the table arts for centuries. Dyane Paris moves it into the contemporary cocktail and makes it the vessel itself.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788646553/dyane-paris-fabrication-moule-porcelaine-atelier.png',
                'La porcelaine, matière d’éternité',
                'Porcelain, a material of eternity',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788644554/dyane-paris-fabrication-sculpture-brute-atelier-face.png',
                'Le façonnage de la porcelaine Dyane Paris',
                'The shaping of Dyane Paris porcelain',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('HOSPITALITÉ', 'HOSPITALITY'),
        rubric: t('ÉVÉNEMENTIEL', 'EVENTS'),
        title: t('L’Art de Servir Cent Convives', 'The Art of Serving One Hundred Guests'),
        href: '/le-journal/cocktail-evenementiel-grands-volumes',
        excerpt: t(
            'Servir un cocktail à une personne relève du geste. En servir cent relève de la chorégraphie.',
            'Serving a cocktail to one person is a gesture. Serving one hundred is choreography.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706612/dyane-paris-cocktail-signature-dyaneno1.png',
                'Service Dyane Paris pour cent convives',
                'Dyane Paris service for one hundred guests',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706723/dyane-paris-cocktail-pret-a-servir-service-shaker.png',
                'Geste de service lors d’une réception',
                'Service gesture during a reception',
                '50% 45%',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706614/dyane-paris-cocktail-dyaneno1-detail.png',
                'Composition événementielle Dyane Paris',
                'Dyane Paris event composition',
            ),
        ],
        variant: 'feature',
    },
    {
        category: t('COLLABORATIONS', 'COLLABORATIONS'),
        rubric: t('JOURNAL DE BORD', 'FIELD NOTES'),
        title: t('Journal de bord, Frivole', 'Field notes — Frivole'),
        href: '/le-journal/journal-de-bord-frivole',
        excerpt: t(
            'Certaines rencontres semblent écrites d’avance. Notre arrivée chez Frivole marque le début d’un nouveau chapitre dans l’histoire de Dyane.',
            'Some encounters feel written in advance. Our arrival at Frivole marks the beginning of a new chapter in the story of Dyane.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1782315804/VISUEL1_xfkylg.png',
                'Création sur mesure Frivole × Dyane Paris',
                'Bespoke Frivole × Dyane Paris creation',
                '50% 42%',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788705456/Capture_d_e%CC%81cran_2026-09-06_a%CC%80_16.37.30_qzrdnl.png',
                'Journal de bord chez Frivole',
                'Field notes at Frivole',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('APPARITIONS', 'APPEARANCES'),
        rubric: t('FASHION WEEK', 'FASHION WEEK'),
        title: t('Dyane Paris au Ritz Paris, Fashion Week', 'Dyane Paris at the Ritz Paris, Fashion Week'),
        href: '/le-journal/ritz-paris-fashion-week',
        excerpt: t(
            'Le 8 mars, à l’occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris comme une véritable exposition d’Art Liquide.',
            'On 8 March, for Paris Fashion Week, Dyane Paris took over the salons of the Ritz Paris as a true exhibition of Liquid Art.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_2_dlipkw.png',
                'Dyane Paris au Ritz Paris pendant la Fashion Week',
                'Dyane Paris at the Ritz Paris during Fashion Week',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/RITZ_ukrb4s.png',
                'Sculpture Dyane dans les salons du Ritz',
                'Dyane sculpture in the salons of the Ritz',
                '50% 38%',
            ),
        ],
        variant: 'images-right',
    },
    {
        category: t('SAVOIR-FAIRE', 'SAVOIR-FAIRE'),
        rubric: t('DISTILLATION', 'DISTILLATION'),
        title: t('Dyane, du point de vue d’un distillateur.', 'Dyane, from a distiller’s point of view.'),
        href: '/le-journal/point-de-vue-distillateur',
        excerpt: t(
            'Chez Dyane Paris, un cocktail ne naît jamais d’un simple assemblage. Il prend forme à travers une recherche exigeante autour des arômes et de la distillation.',
            'At Dyane Paris, a cocktail is never born from a simple blend. It takes shape through demanding research into aromas and distillation.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788705759/dyane-paris-sculpture-cocktail-reflets.png',
                'Le point de vue du distillateur',
                'The distiller’s point of view',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713794/DISTILLATION_yjwtvq.png',
                'Alambics de la distillerie',
                'Stills at the distillery',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('MATIÈRES', 'INGREDIENTS'),
        rubric: t('FILIÈRES FRANÇAISES', 'FRENCH SUPPLY CHAINS'),
        title: t('L’Exigence des Ingrédients', 'The Pursuit of Ingredients'),
        subtitle: t('Alcool Vinique et Filières Françaises', 'Wine Spirit and French Supply Chains'),
        href: '/le-journal/ingredients-locaux-francais',
        excerpt: t(
            'Chez Dyane Paris, chaque ingrédient est un choix délibéré. Des matières premières sélectionnées avec précision pour préserver chaque signature aromatique.',
            'At Dyane Paris, every ingredient is a deliberate choice. Raw materials selected with precision to preserve each aromatic signature.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDIENTS_jnqiij.png',
                'Ingrédients des cocktails Dyane Paris',
                'Ingredients used in Dyane Paris cocktails',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/INGREDINETS_b7p9za.png',
                'Sélection de matières premières',
                'Selection of raw ingredients',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706467/2468b0738773e63e420dd5316c0ee647_qr7jqs.jpg',
                'Filières françaises sélectionnées par Dyane Paris',
                'French supply chains selected by Dyane Paris',
            ),
        ],
        variant: 'cinematic',
    },
    {
        category: t('MANIFESTE', 'MANIFESTO'),
        rubric: t('ART LIQUIDE', 'LIQUID ART'),
        title: t('Quand le Cocktail devient Œuvre à Collectionner', 'When the Cocktail Becomes a Work to Collect'),
        href: '/le-journal/cocktail-oeuvre-collectionner',
        excerpt: t(
            'Avec Dyane Paris, le cocktail quitte le verre pour entrer dans l’univers de la sculpture.',
            'With Dyane Paris, the cocktail leaves the glass and enters the world of sculpture.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788644549/dyane-paris-sculpture-porcelaine-visage-detail.png',
                'Le cocktail comme œuvre à collectionner',
                'The cocktail as a work to collect',
                '50% 42%',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788645239/dyane-paris-porcelaine-sculpture-matiere-detail.png',
                'Sculpture Dyane Paris à collectionner',
                'Collectible Dyane Paris sculpture',
                '50% 42%',
            ),
        ],
        variant: 'images-right',
    },
    {
        category: t('COLLABORATIONS', 'COLLABORATIONS'),
        rubric: t('ÉDITION LIMITÉE', 'LIMITED EDITION'),
        title: t('TEO FOR DYANE', 'TEO FOR DYANE'),
        href: '/le-journal/teo-for-dyane',
        excerpt: t(
            'Dyane Paris dévoile une collaboration artistique avec Matteo Mengacci, plus connu sous le nom de Teo Kaykay.',
            'Dyane Paris unveils an artistic collaboration with Matteo Mengacci, better known as Teo Kaykay.',
        ),
        images: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_3_t40oxp.png', 'Teo for Dyane Paris', 'Teo for Dyane Paris'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_2_whlyb1.png', 'Teo Kaykay peignant une création Dyane', 'Teo Kaykay painting a Dyane creation'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_mcxbuu.png', 'Bouteille-sculpture Teo for Dyane Paris peinte à la main', 'Hand-painted Teo for Dyane Paris bottle sculpture'),
        ],
        variant: 'feature',
    },
    {
        category: t('SAVOIR-FAIRE', 'SAVOIR-FAIRE'),
        rubric: t('PORCELAINE', 'PORCELAIN'),
        title: t('L’Art de la Porcelaine : Quand le Contenant devient Œuvre', 'The Art of Porcelain: When the Vessel Becomes a Work'),
        href: '/le-journal/art-de-la-porcelaine',
        excerpt: t(
            'Chez Dyane Paris, la porcelaine n’est pas un simple contenant. Elle est pensée comme une œuvre façonnée pour traverser le temps.',
            'At Dyane Paris, porcelain is not a simple container. It is conceived as a work shaped to endure through time.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png',
                'L’art de la porcelaine Dyane Paris',
                'The art of Dyane Paris porcelain',
                '50% 44%',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png',
                'Le contenant devient œuvre',
                'The vessel becomes a work',
                '50% 44%',
            ),
        ],
        variant: 'images-left',
    },
    {
        category: t('COLLABORATIONS', 'COLLABORATIONS'),
        rubric: t('FASHION WEEK', 'FASHION WEEK'),
        title: t('PRESSIAT × DYANE PARIS', 'PRESSIAT × DYANE PARIS'),
        subtitle: t('Fashion Week Around Art', 'Fashion Week Around Art'),
        href: '/le-journal/pressiat-dyane-fashion-week',
        excerpt: t(
            'À l’occasion de la Fashion Week, PRESSIAT et DYANE PARIS réunissent mode, art et mixologie autour d’un dîner imaginé par Vincent Pressiat. Une rencontre où le cocktail devient, lui aussi, matière de création.',
            'For Fashion Week, PRESSIAT and DYANE PARIS bring fashion, art and mixology together around a dinner imagined by Vincent Pressiat. An encounter in which the cocktail itself becomes a creative material.',
        ),
        images: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706395/dyane-paris-hospitality-cocktail-bar-luxe.png',
                'PRESSIAT × Dyane Paris pendant la Fashion Week',
                'PRESSIAT × Dyane Paris during Fashion Week',
                '50% 40%',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706396/dyane-paris-art-de-recevoir-cocktail-cameliajordana.png',
                'Dîner PRESSIAT × Dyane Paris',
                'PRESSIAT × Dyane Paris dinner',
                '50% 42%',
            ),
        ],
        variant: 'images-right',
    },
] as const satisfies readonly JournalIndexStoryDraft[]

const additionalIndexImages = [
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788785842/dyane-paris-collection-sculptures-cocktails-luxe.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788785825/dyane-paris-sculpture-porcelaine-rouge-fond-noir.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788785764/dyane-paris-cocktail-luxe-service-hospitality.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788785763/dyane-paris-cocktail-signature-service-restaurant.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788644544/dyane-paris-sculpture-drape-porcelaine-detail.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788644545/dyane-paris-collection-sculptures-rouge-verte.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1785936020/dyane-paris-cocktail-luxe-coupe-sombre.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1783102782/dyane-paris-sculpture-porcelaine-peinte-main.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787477/dyane-paris-sculpture-porcelaine-design-art.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787454/dyane-paris-cocktail-luxe-art-de-recevoir.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787431/dyane-paris-art-de-recevoir-luxe-cocktail.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788646096/dyane-paris-cocktail-liquide-goutte-art.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787619/dyane-paris-sculpture-porcelaine-rouge-detail-noir.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787591/dyane-paris-maison-art-liquide-cocktail-editorial.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787561/dyane-paris-croquis-sculpture-porcelaine-creation.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788787528/dyane-paris-cocktail-pret-a-servir-service-coupe.png',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788789774/dyane-paris-pressiat-collaboration-cocktail.png',
] as const

/*
 * Centralised art direction for the Journal index. The three values are the
 * relative desktop widths of each image. Source/order overrides stay here so
 * the composition can be tuned without scattering one-off CSS rules.
 */
const journalIndexEntryConfigs: readonly JournalIndexEntryConfig[] = [
    {
        filter: 'hospitality',
        columns: [1.28, 0.66, 1.06],
        sources: [
            null,
            null,
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443739/DSC00193_copie_1_ulvcvq.jpg',
        ],
    },
    {
        filter: 'hospitality',
        columns: [0.91, 1.31, 0.78],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792665186/dyane-paris-cocktail-bar-luxe.png', 'Cocktail Dyane Paris dans un bar', 'Dyane Paris cocktail in a bar'),
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792596483/dyane-paris-cocktail-signature-rouge.png', 'Cocktail signature rouge Dyane Paris', 'Dyane Paris red signature cocktail'),
        ],
    },
    {
        filter: 'hospitality',
        columns: [1.32, 0.83, 0.85],
        sources: [
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1791499959/dyane-paris-sculpture-porcelaine-objet-decoration.png', 'Sculpture en porcelaine Dyane Paris dans un intérieur', 'Dyane Paris porcelain sculpture in an interior'),
            null,
        ],
    },
    {
        filter: 'cocktails',
        columns: [1.58, 0.67, 0.75],
        sources: [
            null,
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1791499960/dyane-paris-sculpture-porcelaine-argent-voile-rouge.png', 'Sculpture Dyane Paris argentée au voile rouge', 'Silver Dyane Paris sculpture with a red drape'),
        ],
    },
    {
        filter: 'cocktails',
        columns: [1.05, 0.9, 1.05],
        sources: [
            null,
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788793588/dyane-paris-ingredients-cocktail-gingembre.jpg',
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-argent-voile-vert-detail.png', 'Détail de la sculpture Dyane Paris argentée au voile vert', 'Detail of the silver Dyane Paris sculpture with a green drape'),
        ],
    },
    {
        filter: 'cocktails',
        columns: [1.32, 0.72, 0.92],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788679607/dyane-paris-cocktail-vert-citron-vue-dessus.jpg', 'Cocktail vert et citron vus de dessus', 'Green cocktail and citrus seen from above'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788644545/dyane-paris-collection-sculptures-rouge-verte.png', 'Duo de sculptures Dyane Paris rouge et verte', 'Red and green Dyane Paris sculpture duo'),
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788789744/dyane-paris-sculpture-porcelaine-voile-orange-dos.png',
        ],
    },
    {
        filter: 'craftsmanship',
        columns: [1.15, 0.92, 0.92],
        sources: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777455978/DSC00429_lpmymt.jpg',
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788644545/dyane-paris-art-de-recevoir-cocktails-vue-dessus.png', 'Cocktails Dyane Paris et art de recevoir vus de dessus', 'Dyane Paris cocktails and hosting seen from above'),
            null,
        ],
    },
    {
        filter: 'craftsmanship',
        columns: [0.72, 1.4, 0.82],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788644549/dyane-paris-atelier-sculpture-outils-artisan.png', 'Outils de sculpture dans l’atelier Dyane Paris', 'Sculpting tools in the Dyane Paris workshop'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788646558/dyane-paris-fabrication-porcelaine-matiere.png', 'Matière et fabrication de la porcelaine Dyane Paris', 'Porcelain material and making at Dyane Paris'),
            null,
        ],
    },
    {
        filter: 'hospitality',
        columns: [1.16, 0.96, 0.88],
        sources: [
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png', 'Sculpture verte Dyane Paris dans une lumière ambrée', 'Green Dyane Paris sculpture in amber light'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1788508320/dyane-paris-cocktail-pret-a-servir-petit-verre.png', 'Cocktail Dyane Paris prêt à servir dans un petit verre', 'Ready-to-serve Dyane Paris cocktail in a small glass'),
        ],
    },
    {
        filter: 'art-collaborations',
        columns: [1.02, 1.02, 0.96],
        sources: [
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1785915125/dyane-paris-sculpture-porcelaine-rouge-studio.png', 'Sculpture rouge Dyane Paris photographiée en studio', 'Red Dyane Paris sculpture photographed in a studio'),
            null,
        ],
    },
    { filter: 'art-collaborations', columns: [1.32, 0.72, 0.92] },
    { filter: 'craftsmanship', columns: [0.72, 1.4, 0.82] },
    {
        filter: 'craftsmanship',
        columns: [1.65, 0.68, 0.68],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1783102818/dyaneparis-fleurs-d%C3%A9coration-cocktail-luxe.png', 'Fleurs et décoration d’un cocktail Dyane Paris', 'Flowers and decoration of a Dyane Paris cocktail'),
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788789893/dyane-paris-ingredients-cocktail-vanille.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788789847/dyane-paris-ingredients-gingembre-artisanal.jpg',
        ],
    },
    {
        filter: 'art-collaborations',
        columns: [1.32, 0.72, 0.92],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792596559/dyane-paris-sculpture-porcelaine-detail-visage.png', 'Détail du visage de la sculpture en porcelaine Dyane Paris', 'Face detail of the Dyane Paris porcelain sculpture'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792664334/dyaneparis-details-drape-vert-dyaneno2.png', 'Détail du drapé vert de Dyane No.2', 'Detail of the green drape of Dyane No.2'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792664326/dyane-paris-cocktail-luxe-basilsmash-dyaneno2.png', 'Cocktail Basil Smash et Dyane No.2', 'Basil Smash cocktail and Dyane No.2'),
        ],
    },
    {
        filter: 'art-collaborations',
        columns: [1.65, 0.68, 0.68],
        order: [0, 2, 1],
        sources: [
            null,
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792705861/dyaneparis-design-teokaykay.png', 'Création et dessin de Teo Kaykay pour Dyane Paris', 'Creation and design by Teo Kaykay for Dyane Paris'),
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779713795/TEO_mcxbuu.png',
        ],
    },
    {
        filter: 'craftsmanship',
        columns: [0.72, 1.4, 0.82],
        sources: [
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1792664670/dyane-paris-fabrication-ustensiles-porcelaine.png', 'Ustensiles de fabrication de la porcelaine Dyane Paris', 'Tools for making Dyane Paris porcelain'),
            image('https://res.cloudinary.com/dazhkrimv/image/upload/v1791499959/dyane-paris-fabrication-porcelaine-savoir-faire.png', 'Savoir-faire de fabrication de la porcelaine Dyane Paris', 'Dyane Paris porcelain-making craftsmanship'),
            {
                kind: 'video',
                src: 'https://res.cloudinary.com/dazhkrimv/video/upload/eo_3.9/v1792664691/dyane-paris-fabrication-artisanale.mp4',
                poster: 'https://res.cloudinary.com/dazhkrimv/video/upload/so_0/v1792664691/dyane-paris-fabrication-artisanale.jpg',
                alt: t('Peinture artisanale de la sculpture en porcelaine Dyane Paris', 'Hand-painting the Dyane Paris porcelain sculpture'),
                ratio: 'landscape',
                autoplay: true,
            },
        ],
    },
    { filter: 'art-collaborations', columns: [1.32, 0.72, 0.92], order: [0, 2, 1] },
]

const preserveImageTop = (media: JournalMedia): JournalMedia => media.kind === 'image'
    ? { ...media, objectPosition: 'center top', positionMobile: 'center top' }
    : media

const configuredJournalIndexStories: readonly JournalIndexStory[] = journalIndexStoryDrafts.map((story, index) => {
    const config = journalIndexEntryConfigs[index]
    const baseImages: readonly JournalMedia[] = [
        ...story.images.slice(0, 2),
        image(
            additionalIndexImages[index],
            `Vue éditoriale — ${story.title.fr}`,
            `Editorial view — ${story.title.en}`,
            'center top',
        ),
    ]
    const order = config.order ?? [0, 1, 2]
    const orderedImages = order.map((mediaIndex) => baseImages[mediaIndex])
    const configuredImages = orderedImages.map((media, mediaIndex) => {
        const replacement = config.sources?.[mediaIndex]

        if (replacement) {
            if (typeof replacement !== 'string') return preserveImageTop(replacement)

            return image(
                replacement,
                `Vue éditoriale ${mediaIndex + 1} — ${story.title.fr}`,
                `Editorial view ${mediaIndex + 1} — ${story.title.en}`,
                'center top',
            )
        }

        return preserveImageTop(media)
    })

    return {
        ...story,
        filter: config.filter,
        images: configuredImages,
        indexLayout: config.overlap
            ? { columns: config.columns, overlap: config.overlap }
            : { columns: config.columns },
    }
})

const PRESSIAT_ARTICLE_HREF = '/le-journal/pressiat-dyane-fashion-week'
const pressiatStory = configuredJournalIndexStories.find((story) => story.href === PRESSIAT_ARTICLE_HREF)

export const journalIndexStories: readonly JournalIndexStory[] = pressiatStory
    ? [
        configuredJournalIndexStories[0],
        pressiatStory,
        ...configuredJournalIndexStories.slice(1).filter((story) => story.href !== PRESSIAT_ARTICLE_HREF),
    ]
    : configuredJournalIndexStories

export const journalIndexStoryByHref = Object.fromEntries(
    journalIndexStories.map((story) => [story.href, story]),
) as Record<string, JournalIndexStory>
