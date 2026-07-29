import type { MetadataRoute } from 'next'
import { products } from '@/components/data/products'
import { articles } from '@/components/data/articles'
import { heroImages, produits } from '@/components/data/productDetails'

const BASE = 'https://www.dyaneparis.com'
const locales = ['fr', 'en'] as const

const abs = (src: string) => (src.startsWith('http') ? src : `${BASE}${src}`)

// Curated, crawlable images per section so they can be discovered and ranked in
// Google Images. Each image must actually appear on the corresponding page.
const CLD = 'https://res.cloudinary.com/dazhkrimv/image/upload'

const productImages = products.map((p) => abs(p.image))

const routeImages: Record<string, string[]> = {
    '': [
        abs('/dyane-paris-cocktails-porcelaine.webp'),
        `${CLD}/v1779745931/Design_sans_titre_63_nbwcnv.png`,
        `${CLD}/v1781703609/Design_sans_titre_68_azlqdk.png`,
        ...productImages,
    ],
    '/la-maison': [
        `${CLD}/v1779745931/Design_sans_titre_63_nbwcnv.png`,
        `${CLD}/v1781702999/Capture_d_e%CC%81cran_2026-05-29_a%CC%80_22.30.42_td92ih.png`,
    ],
    '/oeuvres': [
        abs('/dyane-paris-collection-oeuvres.webp'),
        produits['dyane-paris-pornstar-martini-70-cl'].images[0],
        produits['dyane-no2-moscow-mule'].images[0],
        produits['bouteille-signee-teokaykay'].images[0],
    ],
    '/experiences': [
        `${CLD}/v1777445316/DSC00599_copie_2_o518xt.jpg`,
        `${CLD}/v1777413089/DSC00084_1_mjztqk.jpg`,
        abs('/dyane-paris-cocktails-porcelaine.webp'),
    ],
    '/distillation': [
        `${CLD}/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg`,
        `${CLD}/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg`,
        `${CLD}/v1777444782/12_nehhxv.png`,
    ],
    '/le-journal': Object.values(articles).map((a) => a.image),
    '/contact': [`${CLD}/v1781513624/CONTACTER_LA_CONCIERGERIE_zwmuhm.png`],
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

    for (const [slug, article] of Object.entries(articles)) {
        const path = `/le-journal/${slug}`
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: alternatesFor(path),
                ...(article.image ? { images: [article.image] } : {}),
            })
        }
    }

    return entries
}
