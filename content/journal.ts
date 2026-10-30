import { journalEditorialDrafts } from './journalEditorialDrafts'

export type JournalLocale = 'fr' | 'en'

export type LocalizedText = Readonly<Record<JournalLocale, string>>

export type JournalRatio = 'wide' | 'landscape' | 'portrait' | 'portraitWide' | 'square'

export type JournalImage = Readonly<{
    kind: 'image'
    src: string
    alt: LocalizedText
    caption?: LocalizedText
    ratio: JournalRatio
    position?: string
    objectPosition?: string
    positionMobile?: string
    fit?: 'cover' | 'contain'
}>

export type JournalVideo = Readonly<{
    kind: 'video'
    src: string
    mobileSrc?: string
    poster: string
    alt: LocalizedText
    ratio: Exclude<JournalRatio, 'square'>
    autoplay?: boolean
}>

export type JournalPlaceholder = Readonly<{
    kind: 'placeholder'
    variant: 'empty' | 'yellow'
    ratio: JournalRatio
    replacementKey: string
}>

export type JournalMedia = JournalImage | JournalVideo | JournalPlaceholder

export type JournalBlock =
    | Readonly<{
        kind: 'text'
        heading?: LocalizedText
        paragraphs: readonly LocalizedText[]
        width?: 'narrow' | 'medium'
      }>
    | Readonly<{
        kind: 'quote'
        text: LocalizedText
      }>
    | Readonly<{
        kind: 'media'
        media: JournalMedia
        size?: 'full' | 'large' | 'medium' | 'portrait'
        align?: 'left' | 'center' | 'right'
      }>
    | Readonly<{
        kind: 'diptych'
        left: JournalMedia
        right: JournalMedia
        balance?: 'equal' | 'left' | 'right'
      }>
    | Readonly<{
        kind: 'triptych'
        media: readonly [JournalMedia, JournalMedia, JournalMedia]
      }>
    | Readonly<{
        kind: 'image-text'
        media: JournalMedia
        heading?: LocalizedText
        paragraphs: readonly LocalizedText[]
        mediaSide?: 'left' | 'right'
      }>
    | Readonly<{
        kind: 'gallery-strip'
        media: readonly JournalMedia[]
      }>

export type JournalChapter = Readonly<{
    title: LocalizedText
    start: number
}>

export type JournalRelatedLink = Readonly<{
    href: string
    label: LocalizedText
}>

export type JournalArticle = Readonly<{
    slug: string
    title: LocalizedText
    seoTitle?: LocalizedText
    seoDescription?: LocalizedText
    excerpt: LocalizedText
    category: LocalizedText
    location?: LocalizedText
    status?: 'published' | 'draft'
    datePublished?: string
    dateModified?: string
    cover: JournalImage
    indexLayout: 'portrait-pair' | 'portrait-triptych' | 'landscape-portrait' | 'video-still'
    indexSecondary?: JournalMedia
    indexTertiary?: JournalMedia
    heroStyle: 'portrait-pair' | 'landscape-portrait'
    heroSecondary?: JournalMedia
    blocks: readonly JournalBlock[]
    chapters: readonly JournalChapter[]
    relatedLinks?: readonly JournalRelatedLink[]
    credits?: readonly Readonly<{ role: LocalizedText; name: string }>[]
}>

const t = (fr: string, en: string): LocalizedText => ({ fr, en })

const image = (
    src: string,
    fr: string,
    en: string,
    ratio: JournalImage['ratio'] = 'landscape',
    position?: string,
    caption?: LocalizedText,
): JournalImage => ({ kind: 'image', src, alt: t(fr, en), caption, ratio, position })

const CLD = 'https://res.cloudinary.com/dazhkrimv/image/upload'

const journalEstablishedArticles: readonly JournalArticle[] = [
    {
        slug: 'journal-de-bord-frivole',
        title: t('Journal de bord, Frivole', 'Field notes — Frivole'),
        excerpt: t(
            "Certaines rencontres semblent écrites d'avance. Notre arrivée chez Frivole marque le début d'un nouveau chapitre dans l'histoire de Dyane.",
            'Some encounters feel written in advance. Our arrival at Frivole marks the beginning of a new chapter in the story of Dyane.',
        ),
        category: t('Collaboration', 'Collaboration'),
        location: t('Paris', 'Paris'),
        datePublished: '2026-06-24',
        cover: image(
            `${CLD}/v1782315804/VISUEL1_xfkylg.png`,
            'Création sur mesure Frivole x Dyane Paris dans son flacon de porcelaine',
            'Bespoke Frivole x Dyane Paris creation in its porcelain vessel',
            'portrait',
        ),
        indexLayout: 'portrait-pair',
        indexSecondary: image(
            `${CLD}/v1788705456/Capture_d_e%CC%81cran_2026-09-06_a%CC%80_16.37.30_qzrdnl.png`,
            'Cocktail Frivole x Dyane Paris au gin français, basilic, yuzu et sureau',
            'Frivole x Dyane Paris cocktail with French gin, basil, yuzu and elderflower',
            'landscape',
        ),
        heroStyle: 'portrait-pair',
        heroSecondary: image(
            `${CLD}/v1788705456/Capture_d_e%CC%81cran_2026-09-06_a%CC%80_16.37.30_qzrdnl.png`,
            'Cocktail Frivole x Dyane Paris au gin français, basilic, yuzu et sureau',
            'Frivole x Dyane Paris cocktail with French gin, basil, yuzu and elderflower',
            'landscape',
        ),
        chapters: [
            { title: t('La rencontre', 'The encounter'), start: 1 },
            { title: t('La composition', 'The composition'), start: 3 },
            { title: t("L'objet-souvenir", 'The keepsake'), start: 5 },
        ],
        blocks: [
            {
                kind: 'text',
                paragraphs: [t(
                    "Certaines rencontres semblent écrites d'avance. Notre arrivée chez Frivole marque le début d'un nouveau chapitre dans l'histoire de Dyane. Dès les premiers instants, le lieu dévoile son caractère : une esthétique audacieuse, une élégance contemporaine et ce subtil équilibre entre raffinement et liberté qui fait naître les plus belles collaborations.",
                    'Some encounters feel written in advance. Our arrival at Frivole marks the beginning of a new chapter in the story of Dyane. From the first moments, the place reveals its character: a bold aesthetic, contemporary elegance and that subtle balance between refinement and freedom from which the most beautiful collaborations emerge.',
                )],
            },
            {
                kind: 'media',
                media: image(
                    `${CLD}/v1782315804/VISUEL1_xfkylg.png`,
                    'Création sur mesure Frivole x Dyane Paris dans son flacon de porcelaine',
                    'Bespoke Frivole x Dyane Paris creation in its porcelain vessel',
                    'portrait',
                ),
                size: 'portrait',
                align: 'right',
            },
            {
                kind: 'text',
                paragraphs: [
                    t(
                        "C'est ici qu'est née notre première création commune. Aux côtés du mixologue Thibaud Sauvet, nous avons imaginé une recette exclusive, pensée pour traduire l'identité de Frivole dans un flacon de porcelaine. Un cocktail à 21 % vol., où chaque ingrédient a été choisi avec précision pour raconter une histoire.",
                        'This is where our first shared creation was born. Alongside mixologist Thibaud Sauvet, we imagined an exclusive recipe designed to translate the identity of Frivole into a porcelain vessel. A cocktail at 21% ABV, in which every ingredient was chosen with precision to tell a story.',
                    ),
                    t(
                        "Le gin artisanal français en constitue l'ossature, apportant une fraîcheur botanique profonde. Le sirop de basilic et de yuzu dévoile une tension végétale relevée d'une vivacité délicatement citronnée. Quelques gouttes de bitters français viennent structurer l'ensemble avec élégance, tandis que la liqueur de sureau française enveloppe la dégustation d'une douceur florale, longue et aérienne.",
                        'French craft gin forms its backbone, bringing deep botanical freshness. Basil and yuzu syrup reveals a green tension lifted by delicate citrus brightness. A few drops of French bitters structure the whole with elegance, while French elderflower liqueur wraps the tasting in a long, airy floral softness.',
                    ),
                ],
                width: 'medium',
            },
            {
                kind: 'quote',
                text: t(
                    '« UNE COMPOSITION PRÉCISE, ÉQUILIBRÉE ET RÉSOLUMENT FRANÇAISE, IMAGINÉE POUR PROLONGER L’EXPÉRIENCE FRIVOLE BIEN AU-DELÀ DE LA DERNIÈRE GORGÉE. »',
                    '“A PRECISE, BALANCED AND RESOLUTELY FRENCH COMPOSITION, CREATED TO EXTEND THE FRIVOLE EXPERIENCE FAR BEYOND THE FINAL SIP.”',
                ),
            },
            {
                kind: 'media',
                media: image(
                    `${CLD}/v1788705456/Capture_d_e%CC%81cran_2026-09-06_a%CC%80_16.37.30_qzrdnl.png`,
                    'Cocktail Frivole x Dyane Paris au gin français, basilic, yuzu et sureau',
                    'Frivole x Dyane Paris cocktail with French gin, basil, yuzu and elderflower',
                    'landscape',
                ),
                size: 'large',
                align: 'left',
            },
            {
                kind: 'text',
                paragraphs: [
                    t(
                        "Comme toujours chez Dyane, le contenu dialogue avec le contenant. Cette recette prendra place dans une bouteille en porcelaine peinte à la main, véritable objet d'art destiné à traverser le temps autant qu'à sublimer le moment de dégustation.",
                        'As always at Dyane, content and container speak to one another. This recipe will live in a hand-painted porcelain bottle, a true art object designed to endure through time while elevating the moment of tasting.',
                    ),
                    t(
                        "Cette première journée chez Frivole n'a pas seulement donné naissance à un cocktail. Elle a posé les fondations d'une vision commune : celle d'un luxe vivant, créatif et profondément artisanal, où la mixologie rencontre l'art, et où chaque bouteille devient le souvenir tangible d'une expérience unique.",
                        'This first day at Frivole did more than give birth to a cocktail. It laid the foundations of a shared vision: a living, creative and profoundly artisanal luxury, where mixology meets art and every bottle becomes the tangible memory of a unique experience.',
                    ),
                    t(
                        "Une première page s'écrit aujourd'hui. Les suivantes promettent d'être tout aussi inspirantes.",
                        'A first page is being written today. Those that follow promise to be just as inspiring.',
                    ),
                ],
            },
        ],
        credits: [{ role: t('Mixologie', 'Mixology'), name: 'Thibaud Sauvet' }],
        relatedLinks: [
            { href: '/experiences', label: t('Découvrir les expériences Dyane', 'Discover Dyane experiences') },
            { href: '/oeuvres', label: t('Explorer les œuvres', 'Explore the works') },
        ],
    },
    {
        slug: 'commanderie-ambassadeurs-rungis',
        title: t('Dyane Paris pour la Commanderie des Ambassadeurs de Rungis', 'Dyane Paris for the Commanderie des Ambassadeurs de Rungis'),
        excerpt: t(
            "Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à une soirée d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.",
            "In the majestic setting of the Café de l'Homme, facing the Eiffel Tower, Dyane Paris was honoured to take part in an exceptional evening with the Commanderie des Ambassadeurs de Rungis.",
        ),
        category: t('Expérience privée', 'Private experience'),
        location: t("Café de l'Homme, Paris", "Café de l'Homme, Paris"),
        datePublished: '2026-03-24',
        cover: image(`${CLD}/v1779713795/CAFE_rzj5qf.png`, "Soirée Dyane Paris au Café de l'Homme", "Dyane Paris evening at the Café de l'Homme", 'wide'),
        indexLayout: 'landscape-portrait',
        indexSecondary: image(`${CLD}/v1779713795/CAFE_3_vzlzva.png`, "Sculpture-bouteille Dyane Paris présentée au Café de l'Homme", "Dyane Paris bottle sculpture presented at the Café de l'Homme", 'portrait'),
        heroStyle: 'landscape-portrait',
        heroSecondary: image(`${CLD}/v1779713795/CAFE_3_vzlzva.png`, "Sculpture-bouteille Dyane Paris présentée au Café de l'Homme", "Dyane Paris bottle sculpture presented at the Café de l'Homme", 'portrait'),
        chapters: [
            { title: t("L'écrin parisien", 'A Parisian setting'), start: 1 },
            { title: t('Le rituel contemporain', 'A contemporary ritual'), start: 3 },
        ],
        blocks: [
            {
                kind: 'text',
                paragraphs: [
                    t("Dans l'écrin majestueux du Café de l'Homme, face à la Tour Eiffel, Dyane Paris a eu l'honneur de participer à une soirée d'exception aux côtés de la Commanderie des Ambassadeurs de Rungis.", "In the majestic setting of the Café de l'Homme, facing the Eiffel Tower, Dyane Paris was honoured to take part in an exceptional evening with the Commanderie des Ambassadeurs de Rungis."),
                    t("Réunissant des figures emblématiques de la gastronomie française, des artisans du goût et des acteurs majeurs de l'excellence française, cet événement célébrait la transmission, le savoir-faire et la passion avec une élégance rare.", 'Bringing together emblematic figures of French gastronomy, artisans of taste and major champions of French excellence, the event celebrated transmission, savoir-faire and passion with rare elegance.'),
                ],
            },
            { kind: 'media', media: image(`${CLD}/v1779713796/CAFE_2_wozute.png`, "Création Dyane Paris exposée au Café de l'Homme à Paris", "Dyane Paris creation displayed at the Café de l'Homme in Paris", 'landscape'), size: 'large', align: 'right' },
            {
                kind: 'text',
                paragraphs: [
                    t("Dans ce décor suspendu au-dessus de Paris, Dyane a présenté ses créations comme des objets à part entière, à la frontière du cocktail, de l'art et de l'expérience sensorielle. Les pièces en porcelaine, façonnées avec précision, trouvaient naturellement leur place dans cet univers où chaque détail porte une intention et où l'exigence devient une signature.", 'In this setting suspended above Paris, Dyane presented its creations as objects in their own right, at the meeting point of cocktail, art and sensory experience. Precisely crafted porcelain pieces naturally belonged to a world where every detail carries intention and exacting standards become a signature.'),
                    t("Cette collaboration fut l'occasion pour la Maison de proposer une lecture contemporaine du rituel de dégustation. Chez Dyane, le cocktail ne se limite pas à un instant de consommation : il devient un geste esthétique, une émotion visuelle, une œuvre pensée pour prolonger l'expérience bien au-delà du verre.", 'This collaboration allowed the Maison to offer a contemporary reading of the tasting ritual. At Dyane, a cocktail is not confined to a moment of consumption: it becomes an aesthetic gesture, a visual emotion, a work conceived to extend the experience far beyond the glass.'),
                ],
                width: 'medium',
            },
            { kind: 'media', media: image(`${CLD}/v1779713795/CAFE_3_vzlzva.png`, "Sculpture-bouteille Dyane Paris présentée au Café de l'Homme", "Dyane Paris bottle sculpture presented at the Café de l'Homme", 'portrait'), size: 'portrait', align: 'left' },
            {
                kind: 'text',
                paragraphs: [t("Présentées dans un cadre chargé d'histoire et de symboles, les créations Dyane ont dialogué avec l'esprit du lieu, mêlant héritage gastronomique français et vision contemporaine du luxe. À travers cette présence au Café de l'Homme, Dyane Paris poursuit son inscription dans les cercles de l'excellence française tout en affirmant une vision singulière : celle d'une Maison d'Art Liquide où la création, l'émotion et le savoir-faire se rencontrent.", "Presented in a setting rich in history and symbols, Dyane's creations entered into dialogue with the spirit of the place, bringing together French gastronomic heritage and a contemporary vision of luxury. Through this presence at the Café de l'Homme, Dyane Paris continues its journey within the circles of French excellence while asserting a singular vision: a Maison of Liquid Art where creation, emotion and savoir-faire meet.")],
            },
        ],
        relatedLinks: [
            { href: '/experiences', label: t('Cocktails pour événements privés', 'Cocktails for private events') },
            { href: '/oeuvres', label: t('Découvrir les œuvres', 'Discover the works') },
        ],
    },
    {
        slug: 'ritz-paris-fashion-week',
        title: t('Dyane Paris au Ritz Paris, Fashion Week', 'Dyane Paris at the Ritz Paris, Fashion Week'),
        excerpt: t("À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence imaginée comme une véritable exposition d'Art Liquide.", 'For Paris Fashion Week, Dyane Paris took over the salons of the Ritz Paris with a presentation imagined as a true exhibition of Liquid Art.'),
        category: t('Apparition', 'Appearance'),
        location: t('Ritz Paris, place Vendôme', 'Ritz Paris, Place Vendôme'),
        datePublished: '2026-03-08',
        cover: image(`${CLD}/v1779713795/RITZ_2_dlipkw.png`, 'Dyane Paris au Ritz Paris pendant la Fashion Week', 'Dyane Paris at the Ritz Paris during Fashion Week', 'landscape'),
        indexLayout: 'portrait-triptych',
        indexSecondary: image(`${CLD}/v1779713795/RITZ_ukrb4s.png`, 'Sculpture Dyane dans les salons du Ritz', 'Dyane sculpture in the salons of the Ritz', 'portrait'),
        indexTertiary: image(`${CLD}/v1779713795/RITZ_3_eow2t2.png`, 'Création en porcelaine Dyane Paris au Ritz Paris', 'Dyane Paris porcelain creation at the Ritz Paris', 'landscape'),
        heroStyle: 'portrait-pair',
        heroSecondary: image(`${CLD}/v1779713795/RITZ_ukrb4s.png`, 'Sculpture Dyane dans les salons du Ritz', 'Dyane sculpture in the salons of the Ritz', 'portrait'),
        chapters: [
            { title: t("L'installation", 'The installation'), start: 1 },
            { title: t("L'Art Liquide", 'Liquid Art'), start: 3 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [
                t("À l'occasion de la Paris Fashion Week, Dyane Paris a investi les salons du Ritz Paris à travers une présence imaginée comme une véritable exposition d'Art Liquide.", 'For Paris Fashion Week, Dyane Paris took over the salons of the Ritz Paris with a presentation imagined as a true exhibition of Liquid Art.'),
                t("Dans ce lieu emblématique de la place Vendôme, où se croisent héritage, création et art de vivre à la française, la Maison a dévoilé ses créations en porcelaine comme des œuvres sculpturales à part entière.", 'In this emblematic place on Place Vendôme, where heritage, creation and the French art of living meet, the Maison unveiled its porcelain creations as sculptural works in their own right.'),
            ] },
            { kind: 'diptych', left: image(`${CLD}/v1779713795/RITZ_ukrb4s.png`, 'Sculpture de cocktail Dyane Paris au Ritz Paris', 'Dyane Paris cocktail sculpture at the Ritz Paris', 'portrait'), right: image(`${CLD}/v1779713795/RITZ_3_eow2t2.png`, 'Création en porcelaine Dyane Paris au Ritz Paris', 'Dyane Paris porcelain creation at the Ritz Paris', 'landscape'), balance: 'right' },
            { kind: 'text', paragraphs: [
                t("Loin d'une approche traditionnelle de la dégustation, cette présence s'apparentait davantage à une installation curatoriale qu'à une simple activation événementielle. Les cocktails devenaient objets d'expression, silhouettes à contempler, signatures visuelles incarnant une vision nouvelle du luxe contemporain.", 'Far from a traditional approach to tasting, this presence felt more like a curated installation than a simple event activation. Cocktails became objects of expression, silhouettes to contemplate and visual signatures embodying a new vision of contemporary luxury.'),
                t("Présentées dans les salons du Ritz Paris, les créations Dyane ont trouvé naturellement leur place dans cet univers où chaque détail raconte une histoire. La porcelaine, travaillée comme une matière d'art, faisait écho à l'atmosphère intemporelle du lieu, entre raffinement classique et modernité discrète.", "Presented in the salons of the Ritz Paris, Dyane's creations naturally found their place in a world where every detail tells a story. Porcelain, treated as an artistic material, echoed the timeless atmosphere of the place, between classical refinement and understated modernity."),
            ], width: 'medium' },
            { kind: 'media', media: image(`${CLD}/v1779713796/RITZ_4_c0iyhi.png`, "Installation d'Art Liquide Dyane Paris au Ritz Paris", 'Dyane Paris Liquid Art installation at the Ritz Paris', 'wide'), size: 'full' },
            { kind: 'text', paragraphs: [t("À travers cette apparition durant la Fashion Week, Dyane Paris affirme sa volonté d'inscrire l'Art Liquide dans les lieux où la mode, la culture et l'excellence française se rencontrent avec évidence. Une présence qui traduit l'ambition de la Maison : faire du cocktail un objet de collection, de contemplation et d'émotion.", 'Through this appearance during Fashion Week, Dyane Paris affirms its desire to place Liquid Art in the settings where fashion, culture and French excellence naturally meet. A presence that expresses the ambition of the Maison: to make the cocktail an object of collection, contemplation and emotion.')] },
        ],
        relatedLinks: [
            { href: '/experiences', label: t('Expériences pour hôtels et partenaires', 'Experiences for hotels and partners') },
            { href: '/la-maison', label: t('Découvrir la Maison d’Art Liquide', 'Discover the House of Liquid Art') },
        ],
    },
    {
        slug: 'point-de-vue-distillateur',
        title: t("Dyane, du point de vue d'un distillateur.", "Dyane, from a distiller's point of view."),
        excerpt: t("Chez Dyane Paris, un cocktail ne naît jamais d'un simple assemblage. Il prend forme à travers une recherche exigeante autour des arômes, des matières premières et du geste précis de la distillation.", 'At Dyane Paris, a cocktail is never born from a simple blend. It takes shape through demanding research into aromas, raw materials and the precise gesture of distillation.'),
        category: t('Savoir-faire', 'Savoir-faire'),
        location: t('Vaucluse, France', 'Vaucluse, France'),
        datePublished: '2026-02-22',
        cover: image(`${CLD}/v1788705759/dyane-paris-sculpture-cocktail-reflets.png`, 'Distillation artisanale Dyane Paris dans le Vaucluse', 'Dyane Paris craft distillation in the Vaucluse', 'wide'),
        indexLayout: 'portrait-pair',
        indexSecondary: image(`${CLD}/v1779713794/DISTILLATION_yjwtvq.png`, 'Alambics de la distillerie', 'Stills at the distillery', 'portrait'),
        heroStyle: 'portrait-pair',
        heroSecondary: image(`${CLD}/v1779713794/DISTILLATION_yjwtvq.png`, 'Alambics de la distillerie', 'Stills at the distillery', 'portrait'),
        chapters: [
            { title: t('La distillation', 'Distillation'), start: 1 },
            { title: t('La rencontre', 'The encounter'), start: 3 },
            { title: t('La signature', 'The signature'), start: 5 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [
                t("Chez Dyane Paris, un cocktail ne naît jamais d'un simple assemblage. Il prend forme à travers une recherche exigeante autour des arômes, des matières premières et du geste précis de la distillation.", 'At Dyane Paris, a cocktail is never born from a simple blend. It takes shape through demanding research into aromas, raw materials and the precise gesture of distillation.'),
                t("C'est au cœur du Vaucluse, entre lumière provençale et savoir-faire artisanal, que cette exploration se construit aux côtés de Julien Ducruet, président d'Esprit Distillation.", 'At the heart of the Vaucluse, between Provençal light and artisanal savoir-faire, this exploration takes shape alongside Julien Ducruet, president of Esprit Distillation.'),
            ] },
            { kind: 'media', media: image(`${CLD}/v1779713794/DISTILLATION_yjwtvq.png`, "Distillation artisanale d'un cocktail Dyane Paris en France", 'Craft distillation of a Dyane Paris cocktail in France', 'landscape'), size: 'large', align: 'right' },
            { kind: 'quote', text: t("« CHAQUE SPIRITUEUX EST IMAGINÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE RÉVÉLER LA PURETÉ DES ARÔMES ET LA COMPLEXITÉ DES MATIÈRES PREMIÈRES. »", '“EVERY SPIRIT IS CONCEIVED WITH GOLDSMITH-LIKE PRECISION TO REVEAL THE PURITY OF THE AROMAS AND THE COMPLEXITY OF THE RAW MATERIALS.”') },
            { kind: 'text', paragraphs: [t("Certaines collaborations naissent d'une évidence. Celle entre Elisa Evrard Ordonez, fondatrice de Dyane Paris, et Julien Ducruet s'est imposée autour d'une ambition commune : créer des cocktails capables de conjuguer exigence technique, émotion et sophistication contemporaine.", 'Some collaborations feel inevitable. The one between Elisa Evrard Ordonez, founder of Dyane Paris, and Julien Ducruet grew from a shared ambition: to create cocktails able to unite technical rigour, emotion and contemporary sophistication.')] },
            { kind: 'quote', text: t("« DERRIÈRE LA JEUNESSE D'ELISA, J'AI IMMÉDIATEMENT PERÇU UNE MATURITÉ RARE, UNE ÉNERGIE POSITIVE FOLLE ET CETTE INTUITION JUSTE QUI CARACTÉRISE LES GRANDS CRÉATEURS. »", '“BEYOND ELISA’S YOUTH, I IMMEDIATELY SAW A RARE MATURITY, AN EXTRAORDINARY POSITIVE ENERGY AND THE SURE INTUITION THAT DEFINES GREAT CREATORS.”') },
            { kind: 'text', paragraphs: [t("Au-delà de la maîtrise des procédés, cette rencontre traduit une vision commune du luxe français : un luxe fondé sur le temps, le détail et l'authenticité du geste. Chez Dyane, la création d'un cocktail s'apparente davantage au travail d'un parfumeur ou d'un artisan d'art qu'à une simple production de boissons.", 'Beyond mastery of the process, this encounter expresses a shared vision of French luxury: a luxury founded on time, detail and authenticity of gesture. At Dyane, creating a cocktail is closer to the work of a perfumer or art artisan than to simple beverage production.')] },
            { kind: 'quote', text: t("« ENSEMBLE, NOUS CRÉONS DES COCKTAILS QUI RACONTENT UNE HISTOIRE : CELLE D'UNE RENCONTRE, D'UNE PASSION COMMUNE ET D'UN ENGAGEMENT TOTAL POUR LA QUALITÉ. »", '“TOGETHER, WE CREATE COCKTAILS THAT TELL A STORY: OF AN ENCOUNTER, A SHARED PASSION AND A TOTAL COMMITMENT TO QUALITY.”') },
            { kind: 'text', paragraphs: [t("Chaque création raconte ainsi une histoire singulière — celle d'une rencontre entre artisanat, création et passion — portée par une volonté absolue de qualité. Une approche où la distillation devient un langage, et où chaque note aromatique participe à la signature émotionnelle de la Maison.", 'Each creation thus tells a singular story—an encounter between craft, creation and passion—carried by an absolute dedication to quality. An approach in which distillation becomes a language and every aromatic note contributes to the emotional signature of the Maison.')] },
        ],
        credits: [{ role: t('Distillation', 'Distillation'), name: 'Julien Ducruet — Esprit Distillation' }],
        relatedLinks: [
            { href: '/distillation', label: t('La mixologie selon Dyane Paris', 'Mixology according to Dyane Paris') },
            { href: '/oeuvres', label: t('Découvrir les œuvres', 'Discover the works') },
        ],
    },
    {
        slug: 'ingredients-locaux-francais',
        title: t("L'Exigence des Ingrédients : Alcool Vinique et Filières Françaises", 'The Pursuit of Ingredients: Wine Spirit and French Supply Chains'),
        excerpt: t("Chez Dyane Paris, chaque ingrédient est un choix délibéré. De l'alcool vinique élaboré en France aux fruits, plantes et épices sélectionnés avec précision, rien n'est laissé au hasard.", 'At Dyane Paris, every ingredient is a deliberate choice. From wine spirit made in France to precisely selected fruit, plants and spices, nothing is left to chance.'),
        category: t('Matières', 'Ingredients'),
        location: t('France', 'France'),
        datePublished: '2026-02-10',
        cover: image(`${CLD}/v1779713795/INGREDIENTS_jnqiij.png`, 'Ingrédients des cocktails Dyane Paris', 'Ingredients used in Dyane Paris cocktails', 'wide'),
        indexLayout: 'portrait-triptych',
        indexSecondary: image(`${CLD}/v1779713795/INGREDINETS_b7p9za.png`, 'Sélection de matières premières', 'Selection of raw ingredients', 'portrait'),
        indexTertiary: image(`${CLD}/v1788706467/2468b0738773e63e420dd5316c0ee647_qr7jqs.jpg`, 'Matières premières françaises utilisées par Dyane Paris', 'French raw ingredients used by Dyane Paris', 'wide'),
        heroStyle: 'portrait-pair',
        heroSecondary: image(`${CLD}/v1779713795/INGREDINETS_b7p9za.png`, 'Sélection de matières premières', 'Selection of raw ingredients', 'portrait'),
        chapters: [
            { title: t("L'alcool vinique", 'Wine spirit'), start: 1 },
            { title: t("Fruits et plantes d'exception", 'Exceptional fruits and plants'), start: 3 },
            { title: t('Le terroir français', 'French terroir'), start: 5 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [t("Chez Dyane Paris, chaque ingrédient est un choix délibéré. De l'alcool vinique élaboré en France aux fruits, plantes et épices sélectionnés avec précision, rien n'est laissé au hasard. Chaque composant est pensé pour apporter équilibre, profondeur et signature aromatique à nos créations.", 'At Dyane Paris, every ingredient is a deliberate choice. From wine spirit made in France to precisely selected fruit, plants and spices, nothing is left to chance. Every component is chosen to bring balance, depth and an aromatic signature to our creations.')] },
            { kind: 'text', heading: t("Le choix de l'alcool vinique", 'The choice of wine spirit'), paragraphs: [
                t("Nous avons choisi un alcool vinique issu de la fermentation puis de la distillation du vin, élaboré exclusivement en France, dans la région d'Avignon, après les vendanges bordelaises. Plus noble et plus complexe qu'un alcool neutre de grain, il apporte une texture plus ronde, une longueur plus élégante et une profondeur naturelle qui sublime les ingrédients sans jamais les dominer.", 'We chose a wine spirit obtained from the fermentation and distillation of wine, made exclusively in France in the Avignon region after the Bordeaux harvest. Nobler and more complex than a neutral grain alcohol, it brings a rounder texture, a more elegant finish and a natural depth that elevates the ingredients without ever overwhelming them.'),
                t("Sélectionné pour sa pureté à 96%, cet alcool se distingue par sa neutralité aromatique maîtrisée : suffisamment discrète pour laisser s'exprimer chaque note, suffisamment structurée pour donner de la tenue et du relief à l'ensemble.", 'Selected at 96% purity, this spirit stands apart through its controlled aromatic neutrality: discreet enough to let every note express itself, yet structured enough to give the whole composition poise and relief.'),
            ], width: 'medium' },
            { kind: 'media', media: image(`${CLD}/v1779713795/INGREDINETS_b7p9za.png`, 'Ingrédients sélectionnés pour les cocktails Dyane Paris', 'Ingredients selected for Dyane Paris cocktails', 'portrait'), size: 'portrait', align: 'right' },
            { kind: 'text', heading: t("Des fruits et plantes d'exception", 'Exceptional fruits and plants'), paragraphs: [
                t("Le fruit de la passion provient de filières sélectionnées pour la richesse de leur maturité et l'intensité naturelle de leurs arômes. La vanille utilisée dans nos créations est une Bourbon Gold de La Réunion, reconnue pour sa rondeur profonde et ses notes chaudes et enveloppantes. Le gingembre, issu de producteurs français, révèle une chaleur vive, nette et parfaitement équilibrée.", 'Passion fruit comes from selected supply chains chosen for the richness of its ripeness and the natural intensity of its aromas. Our vanilla is a Bourbon Gold from Réunion, renowned for its deep roundness and warm, enveloping notes. Ginger from French growers reveals a vivid, clean and perfectly balanced heat.'),
                t("Chaque ingrédient fait l'objet d'une sélection rigoureuse. Nous travaillons exclusivement avec des partenaires capables de garantir une qualité irréprochable d'un batch à l'autre, afin de préserver l'identité sensorielle de chaque création Dyane Paris.", 'Every ingredient undergoes rigorous selection. We work exclusively with partners able to guarantee impeccable quality from one batch to the next, preserving the sensory identity of each Dyane Paris creation.'),
            ] },
            { kind: 'media', media: image(`${CLD}/v1788706467/2468b0738773e63e420dd5316c0ee647_qr7jqs.jpg`, 'Matières premières françaises utilisées par Dyane Paris', 'French raw ingredients used by Dyane Paris', 'wide'), size: 'full' },
            { kind: 'text', heading: t('Un engagement pour le terroir français', 'A commitment to French terroir'), paragraphs: [t("Dyane Paris est une Maison profondément ancrée dans le terroir français. Nos cocktails ne sont pas seulement fabriqués en France : ils sont pensés, élaborés et assemblés avec des ingrédients qui racontent une géographie, une saison, un geste artisanal.", 'Dyane Paris is a Maison deeply rooted in French terroir. Our cocktails are not merely made in France: they are conceived, developed and assembled with ingredients that tell of a geography, a season and an artisanal gesture.')] },
            { kind: 'quote', text: t("« NOUS NE FAISONS PAS DES COCKTAILS. NOUS FAISONS DES INTERPRÉTATIONS D'UN TERRITOIRE ET D'UNE SAISON, CAPTURÉES DANS UN FLACON. »", '“WE DO NOT MAKE COCKTAILS. WE MAKE INTERPRETATIONS OF A PLACE AND A SEASON, CAPTURED IN A BOTTLE.”') },
        ],
        relatedLinks: [
            { href: '/distillation', label: t('Découvrir la distillation Dyane', 'Discover Dyane distillation') },
            { href: '/oeuvres', label: t('Explorer les cocktails Dyane', 'Explore Dyane cocktails') },
        ],
    },
    {
        slug: 'cocktail-oeuvre-collectionner',
        title: t('Quand le Cocktail devient œuvre à Collectionner', 'When the Cocktail Becomes a Work to Collect'),
        excerpt: t('Avec Dyane Paris, le cocktail quitte le verre pour entrer dans l’univers de la sculpture.', 'With Dyane Paris, the cocktail leaves the glass and enters the world of sculpture.'),
        category: t('Manifeste', 'Manifesto'),
        datePublished: '2026-01-31',
        cover: image(`${CLD}/v1788644549/dyane-paris-sculpture-porcelaine-visage-detail.png`, 'Cocktail Dyane Paris comme œuvre à collectionner', 'Dyane Paris cocktail as a collectible work', 'wide'),
        indexLayout: 'video-still',
        indexSecondary: image(`${CLD}/v1788645239/dyane-paris-porcelaine-sculpture-matiere-detail.png`, 'Cocktail Dyane Paris dans une sculpture de porcelaine à collectionner', 'Dyane Paris cocktail in a collectible porcelain sculpture', 'portrait'),
        heroStyle: 'landscape-portrait',
        heroSecondary: image(`${CLD}/v1788645239/dyane-paris-porcelaine-sculpture-matiere-detail.png`, 'Cocktail Dyane Paris dans une sculpture de porcelaine à collectionner', 'Dyane Paris cocktail in a collectible work', 'portrait'),
        chapters: [
            { title: t("De la boisson à l'objet", 'From drink to object'), start: 1 },
            { title: t('Une nouvelle Maison française', 'A new French Maison'), start: 2 },
            { title: t('La bouteille devient sculpture', 'The bottle becomes sculpture'), start: 3 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [
                t('Un cocktail à collectionner Dyane Paris associe une recette haut de gamme à une sculpture-flacon en porcelaine conçue pour demeurer après la dégustation. Le cocktail devient ainsi un objet d’art liquide : il se sert et se déguste, tandis que son contenant peint à la main peut être contemplé, conservé ou transmis.', 'A collectible Dyane Paris cocktail combines a high-end recipe with a porcelain bottle sculpture designed to remain after tasting. The cocktail becomes an object of liquid art: it is served and savoured, while its hand-painted vessel can be contemplated, kept or passed on.'),
                t('Dans un paysage du luxe en pleine évolution, la Maison française propose une approche inédite : transformer la dégustation en expérience esthétique durable. Ce que Dyane appelle « Art Liquide » repose sur une vision précise : des cocktails signatures haut de gamme présentés dans des pièces en porcelaine conçues pour être conservées bien après l’instant de dégustation.', 'In an evolving luxury landscape, the French Maison proposes a new approach: transforming tasting into a lasting aesthetic experience. What Dyane calls “Liquid Art” rests on a precise vision: high-end signature cocktails presented in porcelain pieces designed to be kept long after the moment of tasting.'),
            ] },
            { kind: 'media', media: image(`${CLD}/v1788645239/dyane-paris-porcelaine-sculpture-matiere-detail.png`, 'Cocktail Dyane Paris dans une sculpture de porcelaine à collectionner', 'Dyane Paris cocktail in a collectible porcelain sculpture', 'portrait'), size: 'portrait', align: 'right' },
            { kind: 'text', heading: t('Une nouvelle Maison française', 'A new French Maison'), paragraphs: [t("Loin des codes traditionnels du ready-to-drink, Dyane revendique un territoire plus rare : celui d'une Maison d'Art Liquide. Une expression qui emprunte à l'univers des grandes Maisons françaises leur rapport au temps, à la matière et à la création.", 'Far from the traditional codes of ready-to-drink, Dyane claims a rarer territory: that of a Maison of Liquid Art. An expression that borrows from the great French Maisons their relationship to time, material and creation.')] },
            { kind: 'text', heading: t('La bouteille devient sculpture', 'The bottle becomes sculpture'), paragraphs: [t("Inspirées librement de la Vénus de Milo, les silhouettes en porcelaine affirment une présence sculpturale forte, entre héritage classique et modernité contemporaine. Chaque courbe a été pensée pour donner à l'objet une identité visuelle singulière, capable d'exister pleinement même après avoir été dégusté.", 'Freely inspired by the Venus de Milo, the porcelain silhouettes assert a powerful sculptural presence between classical heritage and contemporary modernity. Every curve was conceived to give the object a singular visual identity, able to exist fully even after its contents have been tasted.')] },
            { kind: 'text', heading: t("L'objet après la dégustation", 'The object after tasting'), paragraphs: [
                t("Chez Dyane, l'objet ne disparaît pas après l'usage. Il poursuit son existence comme pièce décorative, souvenir émotionnel ou objet de collection. Produites en série limitée, les créations Dyane cultivent une forme de rareté volontaire. Chaque pièce porte en elle le temps du geste artisanal, la précision des finitions et l'idée qu'un objet peut conserver une valeur émotionnelle bien après son utilisation première.", 'At Dyane, the object does not disappear after use. It continues its existence as a decorative piece, an emotional souvenir or a collector’s object. Produced in limited series, Dyane creations cultivate a deliberate form of rarity. Every piece carries the time of the artisan’s gesture, the precision of its finishes and the idea that an object can retain emotional value long after its first use.'),
                t('Avec Dyane Paris, le cocktail ne se consomme plus uniquement : il se contemple, se collectionne et se transmet.', 'With Dyane Paris, the cocktail is no longer merely consumed: it is contemplated, collected and passed on.'),
            ] },
        ],
        credits: [{ role: t('Texte', 'Text'), name: 'Bethszabée Garner — Oniriq' }],
        relatedLinks: [
            { href: '/la-maison', label: t('Comprendre la Maison d’Art Liquide', 'Understand the House of Liquid Art') },
            { href: '/oeuvres', label: t('Découvrir les cocktails à collectionner', 'Discover collectible cocktails') },
            { href: '/oeuvres/dyane-no1-pornstar-martini', label: t('Découvrir Dyane No.1', 'Discover Dyane No.1') },
            { href: '/fabrication', label: t('Voir la fabrication de la sculpture', 'See how the sculpture is made') },
        ],
    },
    {
        slug: 'teo-for-dyane',
        title: t('TEO FOR DYANE', 'TEO FOR DYANE'),
        excerpt: t("Dyane Paris dévoile une collaboration artistique avec Matteo Mengacci, plus connu sous le nom de Teo Kaykay, peintre dont l'univers visuel se distingue par une énergie instinctive et une écriture contemporaine immédiatement reconnaissable.", 'Dyane Paris unveils an artistic collaboration with Matteo Mengacci, better known as Teo Kaykay, a painter whose visual world is defined by instinctive energy and an immediately recognisable contemporary language.'),
        category: t('Collaboration artistique', 'Artist collaboration'),
        location: t('Paris', 'Paris'),
        datePublished: '2026-01-18',
        cover: image(`${CLD}/v1779713795/TEO_3_t40oxp.png`, 'Teo for Dyane Paris', 'Teo for Dyane Paris', 'portrait'),
        indexLayout: 'portrait-triptych',
        indexSecondary: image(`${CLD}/v1779713795/TEO_2_whlyb1.png`, 'Teo Kaykay peignant une création Dyane', 'Teo Kaykay painting a Dyane creation', 'landscape'),
        indexTertiary: image(`${CLD}/v1779713795/TEO_mcxbuu.png`, 'Bouteille-sculpture Teo for Dyane Paris peinte à la main', 'Hand-painted Teo for Dyane Paris bottle sculpture', 'portrait'),
        heroStyle: 'portrait-pair',
        heroSecondary: image(`${CLD}/v1779713795/TEO_2_whlyb1.png`, 'Teo Kaykay peignant une création Dyane', 'Teo Kaykay painting a Dyane creation', 'landscape'),
        chapters: [
            { title: t('La rencontre', 'The encounter'), start: 1 },
            { title: t('Le geste', 'The gesture'), start: 2 },
            { title: t("L'édition limitée", 'The limited edition'), start: 4 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [
                t("Dyane Paris dévoile une collaboration artistique avec Matteo Mengacci, plus connu sous le nom de Teo Kaykay, peintre italien dont l'univers visuel se distingue par une énergie instinctive, des contrastes affirmés et une écriture contemporaine immédiatement reconnaissable.", 'Dyane Paris unveils an artistic collaboration with Matteo Mengacci, better known as Teo Kaykay, an Italian painter whose visual world is defined by instinctive energy, bold contrasts and an immediately recognisable contemporary language.'),
                t("À travers cette rencontre entre l'Art Liquide de Dyane et l'univers pictural de Teo, la Maison poursuit son dialogue entre artisanat, création et expression artistique. Ensemble, ils donnent naissance à une série de pièces uniques où la bouteille devient toile, sculpture et terrain d'expérimentation visuelle.", "Through this encounter between Dyane's Liquid Art and Teo's pictorial world, the Maison continues its dialogue between craft, creation and artistic expression. Together they give life to a series of unique pieces in which the bottle becomes canvas, sculpture and field of visual experimentation."),
            ] },
            { kind: 'media', media: image(`${CLD}/v1779713795/TEO_2_whlyb1.png`, 'Teo Kaykay peignant une bouteille-sculpture pour Dyane Paris', 'Teo Kaykay painting a bottle sculpture for Dyane Paris', 'wide'), size: 'large', align: 'left' },
            { kind: 'text', paragraphs: [
                t("Chaque création en porcelaine a été peinte à la main par l'artiste, transformant les silhouettes Dyane en œuvres singulières. Les couleurs vibrantes, les motifs spontanés et les jeux de matière viennent habiter la porcelaine avec intensité, créant un contraste entre la délicatesse de la sculpture et l'énergie brute du geste artistique.", 'Each porcelain creation was hand-painted by the artist, transforming Dyane silhouettes into singular works. Vibrant colours, spontaneous motifs and plays of texture inhabit the porcelain with intensity, creating a contrast between the delicacy of the sculpture and the raw energy of the artistic gesture.'),
                t("Cette collaboration illustre pleinement la vision de Dyane Paris : faire du contenant une œuvre à part entière, aussi expressive et précieuse que le cocktail qu'elle renferme. Ici, l'objet dépasse sa fonction initiale pour devenir pièce de collection, fragment d'émotion et témoignage d'une rencontre créative.", 'This collaboration fully embodies the vision of Dyane Paris: to make the container a work in its own right, as expressive and precious as the cocktail it holds. Here the object transcends its first function to become a collector’s piece, a fragment of emotion and testimony to a creative encounter.'),
            ], width: 'medium' },
            { kind: 'media', media: image(`${CLD}/v1779713795/TEO_mcxbuu.png`, 'Bouteille-sculpture Teo for Dyane Paris peinte à la main', 'Hand-painted Teo for Dyane Paris bottle sculpture', 'portrait'), size: 'portrait', align: 'right' },
            { kind: 'text', paragraphs: [
                t("Pensé comme une édition limitée, ce projet s'inscrit dans la volonté de la Maison d'inviter des artistes contemporains à s'approprier l'univers Dyane à travers leur propre langage esthétique. Chaque intervention transforme ainsi l'Art Liquide en territoire d'expression libre, où le cocktail dialogue avec la peinture, la matière et le geste.", 'Conceived as a limited edition, this project reflects the desire of the Maison to invite contemporary artists to make the Dyane world their own through their personal aesthetic language. Each intervention transforms Liquid Art into a territory of free expression where cocktail enters into dialogue with painting, material and gesture.'),
                t("Entre sculpture, artisanat et création contemporaine, Teo for Dyane célèbre une vision du luxe plus artistique, plus émotionnelle et profondément incarnée. Une rencontre où l'objet devient mémoire visuelle autant qu'expérience sensorielle.", 'Between sculpture, craft and contemporary creation, Teo for Dyane celebrates a more artistic, more emotional and deeply embodied vision of luxury. An encounter in which the object becomes visual memory as much as sensory experience.'),
            ] },
        ],
        credits: [{ role: t('Artiste', 'Artist'), name: 'Matteo Mengacci — Teo Kaykay' }],
        relatedLinks: [
            { href: '/oeuvres/bouteille-signee-teokaykay', label: t('Découvrir TEO FOR DYANE', 'Discover TEO FOR DYANE') },
            { href: '/oeuvres', label: t('Explorer les œuvres', 'Explore the works') },
        ],
    },
    {
        slug: 'art-de-la-porcelaine',
        title: t("L'Art de la Porcelaine : Quand le Contenant devient Œuvre", 'The Art of Porcelain: When the Vessel Becomes a Work'),
        excerpt: t("Chez Dyane Paris, la porcelaine n'est pas un simple contenant. Elle est pensée comme une œuvre habitée, façonnée pour traverser le temps bien au-delà de la dégustation.", 'At Dyane Paris, porcelain is not a simple container. It is conceived as an inhabited work, shaped to endure far beyond the tasting.'),
        category: t('Savoir-faire', 'Savoir-faire'),
        datePublished: '2026-01-05',
        cover: image(`${CLD}/v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png`, 'Sculpture-bouteille Dyane Paris en porcelaine', 'Dyane Paris porcelain bottle sculpture', 'portrait'),
        indexLayout: 'portrait-triptych',
        indexSecondary: image(`${CLD}/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png`, 'Façonnage artisanal de la porcelaine', 'Artisanal shaping of porcelain', 'landscape'),
        heroStyle: 'portrait-pair',
        heroSecondary: image(`${CLD}/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png`, 'Façonnage artisanal de la porcelaine', 'Artisanal shaping of porcelain', 'landscape'),
        chapters: [
            { title: t('La matière', 'The material'), start: 1 },
            { title: t('La Vénus de Milo', 'The Venus de Milo'), start: 3 },
            { title: t('Le temps du geste', 'The time of the gesture'), start: 5 },
        ],
        blocks: [
            { kind: 'text', paragraphs: [
                t("Chez Dyane Paris, la porcelaine n'est pas un simple contenant. Elle est pensée comme une œuvre habitée, façonnée pour traverser le temps bien au-delà de la dégustation.", 'At Dyane Paris, porcelain is not a simple container. It is conceived as an inhabited work, shaped to endure far beyond the tasting.'),
                t("Chaque pièce naît d'un processus exigeant mobilisant plus de soixante-dix mains artisanes et plusieurs mois de travail. La matière, élaborée à partir de feldspath, de quartz et de kaolin, est moulée, travaillée puis soumise à trois cuissons successives afin d'obtenir sa profondeur, sa résistance et son éclat final.", 'Each piece is born from a demanding process involving more than seventy artisan hands and several months of work. The material, made from feldspar, quartz and kaolin, is moulded, worked and then fired three successive times to achieve its depth, strength and final brilliance.'),
            ] },
            { kind: 'media', media: image(`${CLD}/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png`, "Façonnage artisanal d'une sculpture-bouteille Dyane Paris en porcelaine", 'Artisanal shaping of a Dyane Paris porcelain bottle sculpture', 'wide'), size: 'large', align: 'left' },
            { kind: 'text', heading: t('La Vénus de Milo comme référence', 'The Venus de Milo as reference'), paragraphs: [
                t("La silhouette de la bouteille s'inspire librement de la Vénus de Milo, figure intemporelle de féminité, de beauté classique et de mystère. Chaque courbe, chaque proportion et chaque détail ont été pensés afin de donner à la pièce une présence sculpturale autonome.", 'The silhouette of the bottle is freely inspired by the Venus de Milo, a timeless figure of femininity, classical beauty and mystery. Every curve, proportion and detail was conceived to give the piece an autonomous sculptural presence.'),
                t("Une fois vide, l'objet poursuit son existence. Il devient pièce décorative, souvenir d'un instant vécu, présence silencieuse dans un intérieur. Cette seconde vie fait partie intégrante de la philosophie de la Maison : créer des objets capables de conserver une mémoire émotionnelle.", 'Once empty, the object continues its existence. It becomes a decorative piece, the memory of a lived moment, a quiet presence in an interior. This second life is integral to the philosophy of the Maison: creating objects able to preserve an emotional memory.'),
            ], width: 'medium' },
            { kind: 'media', media: image(`${CLD}/v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png`, "Détail d'une sculpture en porcelaine peinte à la main pour Dyane Paris", 'Detail of a hand-painted porcelain sculpture for Dyane Paris', 'portrait'), size: 'portrait', align: 'right' },
            { kind: 'text', heading: t('Plus de 70 mains, deux mois de travail', 'More than 70 hands, two months of work'), paragraphs: [t("Le cycle complet de fabrication d'une création Dyane dépasse deux mois. De la préparation de la barbotine jusqu'aux finitions peintes à la main, chaque étape célèbre la précision du geste et la noblesse des savoir-faire artisanaux.", 'The complete production cycle of a Dyane creation exceeds two months. From preparing the slip to the hand-painted finishes, every stage celebrates precision of gesture and the nobility of artisanal savoir-faire.')] },
            { kind: 'quote', text: t("« UN OBJET QUI TRAVERSE LE TEMPS DOIT ÊTRE PENSÉ POUR LE TEMPS. C'EST POURQUOI CHAQUE PIÈCE DYANE EST CONÇUE AUTANT POUR ÊTRE REGARDÉE QUE POUR ÊTRE BUE. »", '“AN OBJECT THAT ENDURES THROUGH TIME MUST BE CONCEIVED FOR TIME. THIS IS WHY EVERY DYANE PIECE IS DESIGNED AS MUCH TO BE SEEN AS TO BE DRUNK.”') },
            { kind: 'text', paragraphs: [t("À travers cette approche, Dyane Paris affirme une vision du luxe fondée sur le temps, la matière et la transmission. Un luxe où l'objet conserve une âme longtemps après le dernier verre, et où chaque création devient le témoin durable d'un moment d'exception.", 'Through this approach, Dyane Paris asserts a vision of luxury founded on time, material and transmission. A luxury in which the object retains a soul long after the final glass, and every creation becomes the enduring witness to an exceptional moment.')] },
        ],
        relatedLinks: [
            { href: '/fabrication', label: t('Découvrir la fabrication', 'Discover the making') },
            { href: '/oeuvres', label: t('Explorer les sculptures en porcelaine', 'Explore the porcelain sculptures') },
        ],
    },
] as const

export const journalArticles: readonly JournalArticle[] = [
    ...journalEditorialDrafts,
    ...journalEstablishedArticles,
]

export const journalPublishedArticles: readonly JournalArticle[] = journalArticles.filter(
    (article) => article.status !== 'draft',
)

/**
 * Drafts remain visible in local development for editorial review, but are not
 * surfaced by the public archive or its production navigation. A publication
 * date is optional and must only be added when it has been editorially approved.
 */
export const journalIndexArticles: readonly JournalArticle[] =
    process.env.NODE_ENV === 'production' ? journalPublishedArticles : journalArticles

export const journalArticleBySlug = Object.fromEntries(
    journalArticles.map((article) => [article.slug, article]),
) as Record<string, JournalArticle>

export function journalText(value: LocalizedText, locale: string): string {
    return value[locale === 'en' ? 'en' : 'fr']
}

export function formatJournalDate(date: string | undefined, locale: string): string {
    if (!date) return locale === 'en' ? 'Editorial preview' : 'Aperçu éditorial'
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`))
}
