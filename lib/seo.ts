import type { Metadata } from 'next'
import { officialSeoImage } from '@/content/officialImages'
import { imageRightsMetadata } from '@/lib/imageRights'

export const SITE_URL = 'https://www.dyaneparis.com'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export type SeoImage = {
    url: string
    width?: number
    height?: number
    alt: string
    caption: string
    description: string
}

export const seoImages = {
    // Metadata only: the opening film and its poster are intentionally untouched.
    home: officialSeoImage('maison-campagne'),
    collection: officialSeoImage('no1-catalogue'),
    pornstarMartini: officialSeoImage('no1-portrait'),
    basilSmash: officialSeoImage('no2-portrait'),
    teo: officialSeoImage('teo'),
    maison: officialSeoImage('maison'),
    experiences: officialSeoImage('experiences'),
    distillation: {
        url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg',
        width: 1200,
        height: 800,
        alt: 'Élaboration artisanale des cocktails Dyane Paris en France',
        caption: 'Distillation artisanale française Dyane Paris',
        description: 'Savoir-faire de la Maison Dyane Paris autour des infusions et de l’assemblage de cocktails.',
    },
    journal: {
        url: '/journal/dyane-paris-cocktail-hotel.webp',
        width: 1920,
        height: 1080,
        alt: 'Le Journal de la Maison Dyane Paris',
        caption: 'Le Journal Dyane Paris',
        description: 'Actualités, collaborations et savoir-faire de la Maison Dyane Paris.',
    },
    contact: {
        url: '/contact/rock2-poster.jpg',
        width: 1200,
        height: 675,
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

// The locale layout appends the brand once. Source titles may already include it.
export function titleWithoutBrand(title: string) {
    return title.replace(/(?:\s*\|\s*Dyane Paris)+\s*$/i, '').trim()
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
        title: absoluteTitle ? { absolute: title } : titleWithoutBrand(title),
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
        '@id': `${contentUrl}#image`,
        contentUrl,
        url: contentUrl,
        name: image.caption,
        caption: image.caption,
        description: image.description,
        ...(image.width ? { width: image.width } : {}),
        ...(image.height ? { height: image.height } : {}),
        ...imageRightsMetadata(contentUrl),
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
