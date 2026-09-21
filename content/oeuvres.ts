export type OeuvresLocale = 'fr' | 'en'

export type LocalizedText = Readonly<Record<OeuvresLocale, string>>

type OeuvreMediaBase = Readonly<{
    alt: LocalizedText
    objectFit?: 'cover' | 'contain'
    objectPositionDesktop?: string
    objectPositionTablet?: string
    objectPositionMobile?: string
}>

export type OeuvreImage = OeuvreMediaBase & Readonly<{
    type: 'image'
    src: string
}>

export type OeuvreVideo = OeuvreMediaBase & Readonly<{
    type: 'video'
    src: string
    poster: string
    mobileSrc?: string
}>

export type OeuvrePlaceholder = Readonly<{
    type: 'placeholder'
    variant: 'white' | 'yellow'
    replacementKey: string
    alt: LocalizedText
}>

export type OeuvreMedia = OeuvreImage | OeuvreVideo | OeuvrePlaceholder

export type OeuvreChapter = Readonly<{
    id: 'no1' | 'no2' | 'teo'
    href: string
    title: string
    descriptionKey: 'no1_sous_titre' | 'no2_sous_titre' | 'teo_sous_titre'
    eyebrow: LocalizedText
    note: LocalizedText
    media: readonly [OeuvreMedia, OeuvreMedia, OeuvreMedia]
}>

const localized = (fr: string, en: string): LocalizedText => ({ fr, en })

const image = (
    src: string,
    fr: string,
    en: string,
    options: Omit<OeuvreImage, 'type' | 'src' | 'alt'> = {},
): OeuvreImage => ({
    type: 'image',
    src,
    alt: localized(fr, en),
    ...options,
})

export const oeuvreChapters: readonly OeuvreChapter[] = [
    {
        id: 'no1',
        href: '/oeuvres/dyane-paris-pornstar-martini-70-cl',
        title: 'DYANE NO.1',
        descriptionKey: 'no1_sous_titre',
        eyebrow: localized('CHAPITRE I', 'CHAPTER I'),
        note: localized('PORNSTAR MARTINI', 'PORNSTAR MARTINI'),
        media: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/38_r1fuec.png',
                'Sculpture-bouteille Dyane No.1 en porcelaine',
                'Dyane No.1 porcelain bottle sculpture',
                { objectFit: 'contain' },
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/63_fimus0.png',
                'Composition éditoriale autour de Dyane No.1',
                'Editorial composition featuring Dyane No.1',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788645250/DYANE_PARIS_MAISON_D_ART_LIQUIDE_1_deqhfs.png',
                'Dyane No.1 dans l’univers de la Maison d’Art Liquide',
                'Dyane No.1 in the House of Liquid Art universe',
            ),
        ],
    },
    {
        id: 'no2',
        href: '/oeuvres/dyane-no2-moscow-mule',
        title: 'DYANE NO.2',
        descriptionKey: 'no2_sous_titre',
        eyebrow: localized('CHAPITRE II', 'CHAPTER II'),
        note: localized('MOSCOW MULE', 'MOSCOW MULE'),
        media: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365385/39_rzlpeg.png',
                'Sculpture-bouteille Dyane No.2 en porcelaine',
                'Dyane No.2 porcelain bottle sculpture',
                { objectFit: 'contain' },
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/61_xv2x3w.png',
                'Composition éditoriale autour de Dyane No.2',
                'Editorial composition featuring Dyane No.2',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1788644548/B_Fleur_de_la_Passion._Grande_fleur_solitaire_remarquable_par_sa_couronne_de_filaments_colore%CC%81s._Pe%CC%81tales_clairs_e%CC%81tamines_saillantes_et_pistil_proe%CC%81minent._Fleur_caracte%CC%81ristique_du_genre_Passiflo_15_xsolas.png',
                'Fleur de la passion, signature aromatique de la Maison Dyane Paris',
                'Passion flower, an aromatic signature of Maison Dyane Paris',
            ),
        ],
    },
    {
        id: 'teo',
        href: '/oeuvres/bouteille-signee-teokaykay',
        title: 'TEO FOR DYANE',
        descriptionKey: 'teo_sous_titre',
        eyebrow: localized('ÉDITION LIMITÉE', 'LIMITED EDITION'),
        note: localized('TEO KAYKAY', 'TEO KAYKAY'),
        media: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
                'Bouteille-sculpture Teo for Dyane peinte à la main',
                'Hand-painted Teo for Dyane bottle sculpture',
                { objectPositionDesktop: '50% 50%' },
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg',
                'Création artistique Teo for Dyane Paris',
                'Teo for Dyane Paris artist creation',
                { objectPositionDesktop: '50% 45%' },
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1783102676/img-43_fbdih2.jpg',
                'Détail peint de la collaboration Teo for Dyane',
                'Painted detail from the Teo for Dyane collaboration',
                { objectPositionDesktop: '50% 50%' },
            ),
        ],
    },
] as const

export function oeuvreText(value: LocalizedText, locale: string) {
    return value[locale === 'en' ? 'en' : 'fr']
}
