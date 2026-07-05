import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OeuvresClient from './OeuvresClient'
import { products } from '@/components/data/products'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.oeuvres' })
    const path = locale === 'fr' ? '/oeuvres' : `/${locale}/oeuvres`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/oeuvres',
                en: 'https://www.dyaneparis.com/en/oeuvres',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `https://www.dyaneparis.com${path}`,
        },
    }
}

export default async function OeuvresPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const base = locale === 'fr' ? '' : `/${locale}`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Les Œuvres — Dyane Paris',
        url: `https://www.dyaneparis.com${base}/oeuvres`,
        isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://www.dyaneparis.com${base}/oeuvres/${p.slug}`,
                name: p.name,
            })),
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <OeuvresClient />
        </>
    )
}
