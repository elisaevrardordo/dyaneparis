import { officialImageUrl } from './officialImages'

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
    src: officialImageUrl(src),
    alt: localized(fr, en),
    ...options,
})

export const oeuvreChapters: readonly OeuvreChapter[] = [
    {
        id: 'no1',
        href: '/oeuvres/dyane-no1-pornstar-martini',
        title: 'DYANE NO.1',
        descriptionKey: 'no1_sous_titre',
        eyebrow: localized('CHAPITRE I', 'CHAPTER I'),
        note: localized('PORNSTAR MARTINI', 'PORNSTAR MARTINI'),
        media: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596559/dyane-paris-sculpture-porcelaine-detail-visage.png',
                'Détail du visage de la sculpture en porcelaine Dyane No.1',
                'Face detail of the Dyane No.1 porcelain sculpture',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596557/dyane-paris-sculpture-porcelaine-voile-rouge-detail.png',
                'Détail du drapé rouge de la sculpture Dyane No.1',
                'Red drapery detail of the Dyane No.1 sculpture',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596556/dyane-paris-cocktail-signature-pornstar-martini-dyaneno1.png',
                'Cocktail Pornstar Martini, signature de Dyane No.1',
                'Pornstar Martini cocktail, Dyane No.1 signature',
            ),
        ],
    },
    {
        id: 'no2',
        href: '/oeuvres/dyane-no2-basil-smash',
        title: 'DYANE NO.2',
        descriptionKey: 'no2_sous_titre',
        eyebrow: localized('CHAPITRE II', 'CHAPTER II'),
        note: localized('BASIL SMASH', 'BASIL SMASH'),
        media: [
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596559/dyane-paris-sculpture-porcelaine-detail-visage.png',
                'Détail du visage de la sculpture en porcelaine Dyane No.2',
                'Face detail of the Dyane No.2 porcelain sculpture',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792664334/dyaneparis-details-drape-vert-dyaneno2.png',
                'Détail du drapé vert de la sculpture Dyane No.2',
                'Green drapery detail of the Dyane No.2 sculpture',
            ),
            image(
                'https://res.cloudinary.com/dazhkrimv/image/upload/v1792664326/dyane-paris-cocktail-luxe-basilsmash-dyaneno2.png',
                'Cocktail Basil Smash, signature de Dyane No.2',
                'Basil Smash cocktail, Dyane No.2 signature',
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
