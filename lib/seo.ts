import type { Metadata } from 'next'

export const SITE_URL = 'https://www.dyaneparis.com'

export type SeoImage = {
    url: string
    width?: number
    height?: number
    alt: string
    caption: string
    description: string
}

export const seoImages = {
    home: {
        url: '/dyane-paris-cocktails-porcelaine.webp',
        width: 1920,
        height: 1080,
        alt: 'Sculptures-bouteilles Dyane Paris contenant des cocktails prêts à déguster',
        caption: "Dyane Paris, Maison française d'Art Liquide",
        description: 'Cocktails prêts à déguster présentés dans des sculptures en porcelaine peintes à la main.',
    },
    collection: {
        url: '/dyane-paris-collection-oeuvres.webp',
        width: 1920,
        height: 1080,
        alt: 'Collection de cocktails Dyane Paris en sculptures de porcelaine peintes à la main',
        caption: 'Collection des œuvres Dyane Paris',
        description: 'Collection de cocktails signature Dyane Paris présentés dans des flacons sculpturaux en porcelaine.',
    },
    pornstarMartini: {
        url: '/dyane-no1.webp',
        width: 1080,
        height: 1350,
        alt: 'Sculpture-bouteille Dyane No.1 contenant le cocktail Pornstar Martini',
        caption: 'Dyane No.1 — Pornstar Martini',
        description: 'Cocktail Pornstar Martini Dyane Paris présenté dans un flacon sculptural en porcelaine.',
    },
    moscowMule: {
        url: '/dyane-no2.webp',
        width: 1080,
        height: 1350,
        alt: 'Sculpture-bouteille Dyane No.2 contenant le cocktail Moscow Mule',
        caption: 'Dyane No.2 — Moscow Mule',
        description: 'Cocktail Moscow Mule Dyane Paris présenté dans un flacon sculptural en porcelaine.',
    },
    teo: {
        url: '/dyane-teo.webp',
        width: 1080,
        height: 1350,
        alt: 'Bouteille-sculpture Teo for Dyane Paris peinte à la main',
        caption: 'Teo for Dyane Paris',
        description: 'Édition artistique Teo for Dyane Paris, peinte à la main en série confidentielle.',
    },
    maison: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779745931/Design_sans_titre_63_nbwcnv.png',
        alt: "Cocktail Dyane Paris présenté dans une sculpture en porcelaine peinte à la main",
        caption: "La Maison Dyane Paris et son savoir-faire d'Art Liquide",
        description: "Une création Dyane Paris réunissant sculpture en porcelaine, artisanat français et cocktail prêt à déguster.",
    },
    experiences: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg',
        alt: 'Création Dyane Paris présentée lors d’une expérience sur mesure',
        caption: 'Expériences et collaborations Dyane Paris',
        description: 'Expérience de dégustation et création sur mesure imaginée par la Maison Dyane Paris.',
    },
    distillation: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg',
        alt: 'Élaboration artisanale des cocktails Dyane Paris en France',
        caption: 'Distillation artisanale française Dyane Paris',
        description: 'Savoir-faire de la Maison Dyane Paris autour des infusions et de l’assemblage de cocktails.',
    },
    journal: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779701616/Sans_titre_1920_x_550_px_amjdym.png',
        alt: 'Le Journal de la Maison Dyane Paris',
        caption: 'Le Journal Dyane Paris',
        description: 'Actualités, collaborations et savoir-faire de la Maison Dyane Paris.',
    },
    contact: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1781513624/CONTACTER_LA_CONCIERGERIE_zwmuhm.png',
        alt: 'La Conciergerie de la Maison Dyane Paris',
        caption: 'Contacter la Conciergerie Dyane Paris',
        description: 'La Conciergerie Dyane Paris accompagne les commandes privées, collaborations et demandes presse.',
    },
    faq: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777492634/DSC00107_copie_1_yps0ji.jpg',
        alt: 'Création en porcelaine Dyane Paris accompagnant la foire aux questions',
        caption: 'Foire aux questions Dyane Paris',
        description: 'Informations sur les créations, la conservation, la livraison et la dégustation Dyane Paris.',
    },
} satisfies Record<string, SeoImage>

export function absoluteUrl(url: string) {
    return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

export function localizedUrl(locale: string, path = '') {
    const prefix = locale === 'en' ? '/en' : ''
    return `${SITE_URL}${prefix}${path}`
}

export function localizedAlternates(path = '') {
    return {
        fr: `${SITE_URL}${path}`,
        en: `${SITE_URL}/en${path}`,
        'x-default': `${SITE_URL}${path}`,
    }
}

export function buildPageMetadata({
    locale,
    path,
    title,
    description,
    image,
    absoluteTitle = false,
    type = 'website',
}: {
    locale: string
    path: string
    title: string
    description: string
    image: SeoImage
    absoluteTitle?: boolean
    type?: 'website' | 'article'
}): Metadata {
    const pageUrl = localizedUrl(locale, path)
    const imageUrl = absoluteUrl(image.url)

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: {
            canonical: pageUrl,
            languages: localizedAlternates(path),
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: 'Dyane Paris',
            locale: locale === 'en' ? 'en_US' : 'fr_FR',
            type,
            images: [
                {
                    url: imageUrl,
                    alt: image.alt,
                    ...(image.width ? { width: image.width } : {}),
                    ...(image.height ? { height: image.height } : {}),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [{ url: imageUrl, alt: image.alt }],
        },
    }
}

export function imageObject(image: SeoImage, representativeOfPage = false) {
    const contentUrl = absoluteUrl(image.url)

    return {
        '@type': 'ImageObject',
        contentUrl,
        url: contentUrl,
        name: image.caption,
        caption: image.caption,
        description: image.description,
        ...(image.width ? { width: image.width } : {}),
        ...(image.height ? { height: image.height } : {}),
        creditText: 'Dyane Paris',
        creator: { '@type': 'Organization', name: 'Dyane Paris' },
        copyrightNotice: 'Dyane Paris',
        ...(representativeOfPage ? { representativeOfPage: true } : {}),
    }
}

export function breadcrumbJsonLd(
    locale: string,
    items: Array<{ name: string; path: string }>
) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: localizedUrl(locale, item.path),
        })),
    }
}

export function serializeJsonLd(value: unknown) {
    return JSON.stringify(value).replace(/</g, '\\u003c')
}
