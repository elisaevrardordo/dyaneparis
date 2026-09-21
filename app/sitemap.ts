import type { MetadataRoute } from 'next'
import { heroImages, produits } from '@/components/data/productDetails'
import { products } from '@/components/data/products'
import { journalPublishedArticles, type JournalBlock, type JournalMedia } from '@/content/journal'

const BASE = 'https://www.dyaneparis.com'
const locales = ['fr', 'en'] as const

const abs = (src: string) => new URL(src, BASE).toString()
const uniqueImages = (images: readonly string[]) => Array.from(new Set(images.map(abs)))

function imagesFromMedia(media?: JournalMedia): string[] {
    if (!media || media.kind === 'placeholder') return []
    if (media.kind === 'image') return [media.src]
    return media.poster ? [media.poster] : []
}

function imagesFromBlock(block: JournalBlock): string[] {
    if (block.kind === 'media' || block.kind === 'image-text') return imagesFromMedia(block.media)
    if (block.kind === 'diptych') return [...imagesFromMedia(block.left), ...imagesFromMedia(block.right)]
    if (block.kind === 'triptych' || block.kind === 'gallery-strip') {
        return block.media.flatMap(imagesFromMedia)
    }
    return []
}

function articleImages(article: (typeof journalPublishedArticles)[number]) {
    return uniqueImages([
        ...imagesFromMedia(article.cover),
        ...imagesFromMedia(article.indexSecondary),
        ...imagesFromMedia(article.indexTertiary),
        ...imagesFromMedia(article.heroSecondary),
        ...article.blocks.flatMap(imagesFromBlock),
    ])
}

// Curated, crawlable images per section so they can be discovered and ranked in
// Google Images. Each image must actually appear on the corresponding page.
const CLD = 'https://res.cloudinary.com/dazhkrimv/image/upload'

const productImages = products.map((p) => abs(p.image))

const routeImages: Record<string, string[]> = {
    '': [
        abs('/home/hero/hero-dyane-website-vdef-poster.jpg'),
        `${CLD}/v1788728025/Ajouter_un_titre_1_yk7tmn.png`,
        `${CLD}/v1788784346/Ajouter_un_titre_3_ebsgyz.png`,
        `${CLD}/v1788691447/COCKTAIL_5_jox1dv.png`,
        ...productImages,
    ],
    '/la-maison': [
        '/editorial/la-maison/STATUE%202.png',
        '/editorial/la-maison/ART%201.png',
        '/editorial/la-maison/STATUE%201.png',
        '/editorial/la-maison/COCKTAIL%201%20.png',
        '/editorial/la-maison/PROD%202.png',
    ],
    '/oeuvres': [
        abs(produits['dyane-paris-pornstar-martini-70-cl'].images[0]),
        abs(produits['dyane-no2-moscow-mule'].images[0]),
        abs(produits['bouteille-signee-teokaykay'].images[0]),
    ],
    '/experiences': [
        `${CLD}/v1777445316/DSC00599_copie_2_o518xt.jpg`,
        '/editorial/experiences/ART%201.png',
        '/editorial/experiences/BAR%201.png',
        '/editorial/experiences/EVENT.png',
    ],
    '/distillation': [
        `${CLD}/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg`,
        `${CLD}/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg`,
        `${CLD}/v1777444782/12_nehhxv.png`,
        `${CLD}/v1777444726/CREATION_m4wcwy.png`,
        `${CLD}/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg`,
        `${CLD}/v1777444815/Design_sans_titre_41_sens76.png`,
    ],
    '/fabrication': [
        '/editorial/fabrication/DESSIN.png',
        '/editorial/fabrication/PORCELAINE%202.png',
        '/editorial/fabrication/PEINTURE.png',
        '/editorial/fabrication/INGREDIENTS.png',
        '/editorial/fabrication/PRODUCTION%202%20.png',
    ],
    '/le-journal': journalPublishedArticles.flatMap((article) => [
        ...imagesFromMedia(article.cover),
        ...imagesFromMedia(article.indexSecondary),
        ...imagesFromMedia(article.indexTertiary),
    ]),
    '/contact': [abs('/contact/rock2-poster.jpg')],
    '/faq': [`${CLD}/v1777492634/DSC00107_copie_1_yps0ji.jpg`],
}

const productImagesBySlug: Record<string, string[]> = Object.fromEntries(
    Object.entries(produits).map(([slug, product]) => [
        slug,
        Array.from(new Set([heroImages[slug], ...product.images].filter(Boolean))).map(abs),
    ])
)

const staticRoutes = [
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
