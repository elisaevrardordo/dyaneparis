import type { MetadataRoute } from 'next'
import { products } from '@/components/data/products'
import { articles } from '@/components/data/articles'

const BASE = 'https://www.dyaneparis.com'
const locales = ['fr', 'en'] as const

const abs = (src: string) => (src.startsWith('http') ? src : `${BASE}${src}`)

// Curated, crawlable images per section so they can be discovered and ranked in
// Google Images. Each image must actually appear on the corresponding page.
const CLD = 'https://res.cloudinary.com/dazhkrimv/image/upload'

const productImages = products.map((p) => abs(p.image))

const routeImages: Record<string, string[]> = {
    '': [
        `${CLD}/v1779745931/Design_sans_titre_63_nbwcnv.png`,
        `${CLD}/v1781703609/Design_sans_titre_68_azlqdk.png`,
        ...productImages,
    ],
    '/la-maison': [
        `${CLD}/v1779745931/Design_sans_titre_63_nbwcnv.png`,
        `${CLD}/v1781702999/Capture_d_e%CC%81cran_2026-05-29_a%CC%80_22.30.42_td92ih.png`,
    ],
    '/oeuvres': [abs('/dyane-paris-collection-oeuvres.webp'), ...productImages],
    '/experiences': [
        `${CLD}/v1779745940/CREATION_2_bwk7r0.png`,
        `${CLD}/v1779626358/copy_of_bda00076f243f0269f3ef397c14901a1_ljqyel.jpg`,
    ],
    '/distillation': [
        `${CLD}/v1779747067/Apre%CC%80s_les_vendanges_bordelaines_2_e0i2dx.png`,
        `${CLD}/v1779626279/ChatGPT_Image_24_mai_2026_14_09_25_rfymiu.png`,
    ],
    '/le-journal': Object.values(articles).map((a) => a.image),
}

const productImageBySlug: Record<string, string> = Object.fromEntries(
    products.map((p) => [p.slug, abs(p.image)])
)

const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/la-maison', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/oeuvres', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/experiences', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/distillation', priority: 0.6, changeFrequency: 'monthly' as const },
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
            locales.map((l) => [l, localizedPath(l, path)])
        ),
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = []

    for (const route of staticRoutes) {
        const images = routeImages[route.path]
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, route.path),
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: alternatesFor(route.path),
                ...(images ? { images } : {}),
            })
        }
    }

    for (const product of products) {
        const path = `/oeuvres/${product.slug}`
        const image = productImageBySlug[product.slug]
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.85,
                alternates: alternatesFor(path),
                ...(image ? { images: [image] } : {}),
            })
        }
    }

    for (const [slug, article] of Object.entries(articles)) {
        const path = `/le-journal/${slug}`
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: alternatesFor(path),
                ...(article.image ? { images: [article.image] } : {}),
            })
        }
    }

    return entries
}
