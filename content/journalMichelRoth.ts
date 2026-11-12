import type { JournalArticle, JournalImage, LocalizedText } from './journal'

const t = (fr: string, en: string): LocalizedText => ({ fr, en })

const portrait: JournalImage = {
    kind: 'image',
    src: '/journal/dyane-paris-michel-roth-portrait.webp',
    alt: t('Michel Roth présente une assiette aux côtés de la sculpture Dyane Paris au drapé doré', 'Michel Roth presents a plate alongside the gold-draped Dyane Paris sculpture'),
    ratio: 'portrait',
    objectPosition: 'center 64%',
}

const sculpture: JournalImage = {
    kind: 'image',
    src: '/journal/dyane-paris-lecume-sculpture-doree.webp',
    alt: t('Sculpture en porcelaine Dyane Paris au drapé doré sur fond rouge', 'Gold-draped Dyane Paris porcelain sculpture against a red background'),
    ratio: 'portraitWide',
    objectPosition: 'center top',
}

const dressage: JournalImage = {
    kind: 'image',
    src: '/journal/dyane-paris-michel-roth-dressage.webp',
    alt: t('Michel Roth dresse une assiette près d’une sculpture Dyane Paris et de deux verres de cocktail', 'Michel Roth plates a dish beside a Dyane Paris sculpture and two cocktail glasses'),
    ratio: 'wide',
    objectPosition: '40% center',
}

export const michelRothJournalImages = [portrait, sculpture, dressage] as const

export const michelRothArticle: JournalArticle = {
    slug: 'michel-roth-dyane-paris',
    title: t('Michel Roth × Dyane Paris, L’Écume', 'Michel Roth × Dyane Paris, L’Écume'),
    excerpt: t(
        'À l’occasion des World Caviar Awards 2026, le chef Michel Roth et Dyane Paris imaginent L’Écume, un cocktail sur mesure pensé pour accompagner la dégustation du caviar.',
        'For the 2026 World Caviar Awards, chef Michel Roth and Dyane Paris created L’Écume, a bespoke cocktail designed to accompany a caviar tasting.',
    ),
    category: t('Collaboration', 'Collaboration'),
    location: t('Alcazar, Paris', 'Alcazar, Paris'),
    status: 'published',
    datePublished: '2026-11-12',
    cover: portrait,
    indexLayout: 'portrait-triptych',
    indexSecondary: sculpture,
    indexTertiary: dressage,
    heroStyle: 'landscape-portrait',
    heroSecondary: dressage,
    chapters: [],
    blocks: [
        {
            kind: 'text',
            paragraphs: [
                t(
                    'Le 12 novembre 2026, les World Caviar Awards réunissent à l’Alcazar, à Paris, des chefs et des professionnels autour du caviar. Pour cette édition, Dyane Paris s’associe à Michel Roth, Meilleur Ouvrier de France et lauréat du Bocuse d’Or. De cette rencontre naît L’Écume, un cocktail composé pour la dégustation.',
                    'On 12 November 2026, the World Caviar Awards bring chefs and professionals together around caviar at the Alcazar in Paris. For this edition, Dyane Paris joins forces with Michel Roth, a Meilleur Ouvrier de France and Bocuse d’Or winner. Their collaboration gives rise to L’Écume, a cocktail created for the tasting.',
                ),
                t(
                    'L’accord part de l’assiette. Le verre est pensé dans le rythme du service, avec un équilibre aromatique qui laisse au caviar sa place. Du dressage au premier verre, le chef et la Maison travaillent autour du même geste : composer une dégustation dans laquelle chaque élément a son rôle.',
                    'The pairing begins with the plate. The cocktail is conceived around the rhythm of service, with an aromatic balance that gives caviar room to speak. From plating to the first sip, the chef and the House share an approach: composing a tasting in which every element has a role.',
                ),
            ],
        },
        {
            kind: 'text',
            heading: t('Du verre à la porcelaine', 'From glass to porcelain'),
            paragraphs: [
                t(
                    'Sur la table, une sculpture Dyane au drapé doré accompagne les verres et l’assiette. Sa porcelaine blanche accroche la lumière, tandis que le drapé reprend les reflets chauds du lieu.',
                    'At the table, a gold-draped Dyane sculpture accompanies the glasses and the plate. Its white porcelain catches the light, while the drapery picks up the warm reflections of the room.',
                ),
                t(
                    'Avec L’Écume, Dyane Paris explore ce qu’une recette sur mesure peut apporter à une table. Le cocktail se compose pour un plat, un service et un moment précis. La sculpture en garde le souvenir.',
                    'With L’Écume, Dyane Paris explores what a bespoke recipe can bring to the table. The cocktail is composed for a dish, a service and a particular moment. The sculpture carries the memory of it.',
                ),
            ],
        },
    ],
    relatedLinks: [
        { href: '/experiences#haute-mixologie', label: t('Découvrir la haute mixologie sur mesure', 'Discover bespoke haute mixology') },
    ],
}
