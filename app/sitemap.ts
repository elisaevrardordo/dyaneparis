import type { MetadataRoute } from 'next'
import { produits } from '@/components/data/productDetails'
import { products } from '@/components/data/products'
import { journalPublishedArticles, type JournalMedia } from '@/content/journal'
import { journalIndexStories } from '@/content/journalIndex'
import { articleImages as renderedArticleImages } from '@/content/journalImages'
import { oeuvreChapters } from '@/content/oeuvres'
import { maisonMedia, maisonGalleries, experiencesMedia, experiencesGalleries, fabricationGalleries, FABRICATION_VIDEO_URL } from '@/content/editorialMedia'
import type { DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { officialEditorialMedia } from '@/content/officialImages'
import { cloudinaryVideoPoster } from '@/lib/cloudinary'
import { getHomeContent } from '@/content/home'
import { officialImage, officialImagePath, officialImageUrl } from '@/content/officialImages'
import { galleryImages } from '@/content/galleryImages'
import { giftingPages, giftingSlugs } from '@/content/gifting'

const BASE = 'https://www.dyaneparis.com'
const locales = ['fr', 'en'] as const

const abs = (src: string) => new URL(officialImageUrl(src), BASE).toString()
const uniqueImages = (images: readonly string[]) => Array.from(new Set(images.map(abs)))

function imagesFromMedia(media?: JournalMedia): string[] {
    if (!media || media.kind === 'placeholder') return []
    if (media.kind === 'image') return [media.src]
    return media.poster ? [media.poster] : []
}

function articleImages(article: (typeof journalPublishedArticles)[number]) {
    return uniqueImages(renderedArticleImages(article).map((image) => image.src))
}

function editorialImages(galleries: Record<string, DyaneEditorialMedia[]>) {
    return Object.values(galleries).flat().flatMap((item) => {
        const media = officialEditorialMedia(item, 'fr')
        const image = media.type === 'video' ? media.poster : media.src
        return image ? [image] : []
    })
}

// Curated, crawlable images per section so they can be discovered and ranked in
// Google Images. Each image must actually appear on the corresponding page.
const CLD = 'https://res.cloudinary.com/dazhkrimv/image/upload'

const home = getHomeContent('fr')

const routeImages: Record<string, string[]> = {
    '/galerie': galleryImages.map((image) => image.url),
    ...Object.fromEntries(giftingSlugs.map((slug) => [
        `/${slug}`, [officialImagePath(officialImage(giftingPages[slug].image))],
    ])),
    '': [
        `${CLD}/v1788728025/dyane-paris-maison-art-liquide-campagne-noir-blanc.png`,
        abs('/home/hero/hero-dyane-website-vdef-poster.jpg'),
        `${CLD}/v1788784346/dyane-paris-sculpture-rouge-cocktail-signature-bar.png`,
        `${CLD}/v1788691447/dyane-paris-fabrication-sculpture-modelage-main2.png`,
        ...oeuvreChapters.filter((chapter) => chapter.id === 'no1' || chapter.id === 'no2')
            .flatMap((chapter) => chapter.media.flatMap((media) =>
                media.type === 'image' ? [media.src] : media.type === 'video' ? [media.poster] : [])),
    ],
    '/la-maison': [maisonMedia.filmPoster, ...editorialImages(maisonGalleries)],
    '/oeuvres': [
        ...home.products.map((product) => product.src),
        ...oeuvreChapters.filter((chapter) => chapter.id === 'teo')
            .flatMap((chapter) => chapter.media.flatMap((media) =>
                media.type === 'image' ? [media.src] : media.type === 'video' ? [media.poster] : [])),
    ],
    '/commission-a-sculpture': [
        `${CLD}/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png`,
        `${CLD}/v1788365386/dyane-paris-sculpture-argent-voile-rouge-portrait.png`,
    ],
    '/experiences': [experiencesMedia.heroPoster, ...editorialImages(experiencesGalleries)],
    '/distillation': [
        `${CLD}/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg`,
        `${CLD}/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg`,
        `${CLD}/v1777444782/12_nehhxv.png`,
        `${CLD}/v1777444726/CREATION_m4wcwy.png`,
        `${CLD}/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg`,
        `${CLD}/v1777444815/Design_sans_titre_41_sens76.png`,
    ],
    '/fabrication': [cloudinaryVideoPoster(FABRICATION_VIDEO_URL), ...editorialImages(fabricationGalleries)],
    '/le-journal': journalIndexStories.flatMap((story) => story.images.flatMap(imagesFromMedia)),
    '/contact': [abs('/contact/rock2-poster.jpg')],
    '/faq': [`${CLD}/v1777492634/DSC00107_copie_1_yps0ji.jpg`],
}

const productImagesBySlug: Record<string, string[]> = Object.fromEntries(
    Object.entries(produits).map(([slug, product]) => [
        slug,
        uniqueImages(product.images),
    ])
)

const staticRoutes = [
    { path: '/galerie', priority: 0.7, changeFrequency: 'monthly' as const },
    ...giftingSlugs.map((slug) => ({ path: `/${slug}`, priority: 0.7, changeFrequency: 'monthly' as const })),
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/la-maison', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/oeuvres', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/commission-a-sculpture', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/experiences', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/distillation', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/fabrication', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/le-journal', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/faq', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/mentions-legales', priority: 0.1, changeFrequency: 'yearly' as const },
    { path: '/confidentialite', priority: 0.1, changeFrequency: 'yearly' as const },
    { path: '/cgv', priority: 0.1, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.1, changeFrequency: 'yearly' as const },
]

function localizedPath(locale: string, path: string) {
    return locale === 'fr' ? `${BASE}${path}` : `${BASE}/${locale}${path}`
}

function alternatesFor(path: string) {
    return {
        languages: Object.fromEntries(
            [
                ...locales.map((l) => [l, localizedPath(l, path)] as const),
                ['x-default', localizedPath('fr', path)] as const,
            ]
        ),
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = []

    for (const route of staticRoutes) {
        const images = routeImages[route.path]
            ? uniqueImages(routeImages[route.path])
            : undefined
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, route.path),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: alternatesFor(route.path),
                ...(images ? { images } : {}),
            })
        }
    }

    for (const product of products) {
        const path = `/oeuvres/${product.slug}`
        const images = productImagesBySlug[product.slug]
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                changeFrequency: 'monthly',
                priority: 0.85,
                alternates: alternatesFor(path),
                ...(images?.length ? { images } : {}),
            })
        }
    }

    for (const article of journalPublishedArticles) {
        const { slug } = article
        const path = `/le-journal/${slug}`
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: alternatesFor(path),
                ...(article.dateModified || article.datePublished
                    ? { lastModified: article.dateModified ?? article.datePublished }
                    : {}),
                images: articleImages(article),
            })
        }
    }

    return entries
}
