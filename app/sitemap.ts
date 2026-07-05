import type { MetadataRoute } from 'next'
import { products } from '@/components/data/products'
import { articles } from '@/components/data/articles'

const BASE = 'https://www.dyaneparis.com'
const locales = ['fr', 'en'] as const

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
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, route.path),
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: alternatesFor(route.path),
            })
        }
    }

    for (const product of products) {
        const path = `/oeuvres/${product.slug}`
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.85,
                alternates: alternatesFor(path),
            })
        }
    }

    for (const slug of Object.keys(articles)) {
        const path = `/le-journal/${slug}`
        for (const locale of locales) {
            entries.push({
                url: localizedPath(locale, path),
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: alternatesFor(path),
            })
        }
    }

    return entries
}
