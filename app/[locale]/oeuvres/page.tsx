import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { products } from '@/components/data/products'
import {
    absoluteUrl,
    breadcrumbJsonLd,
    buildPageMetadata,
    imageObject,
    localizedUrl,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'
import OeuvresEditorial from './OeuvresEditorial'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.oeuvres' })

    return buildPageMetadata({
        locale,
        path: '/oeuvres',
        title: t('title'),
        description: t('description'),
        image: seoImages.collection,
    })
}

export default async function OeuvresPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/oeuvres')

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${pageUrl}#collection`,
                name: locale === 'en' ? 'The Collections — Dyane Paris' : 'Les Œuvres — Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                primaryImageOfPage: imageObject(seoImages.collection, true),
                inLanguage: locale,
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: products.map((p, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        item: {
                            '@type': 'WebPage',
                            '@id': `${localizedUrl(locale, `/oeuvres/${p.slug}`)}#webpage`,
                            name: p.name,
                            url: localizedUrl(locale, `/oeuvres/${p.slug}`),
                            image: absoluteUrl(p.image),
                        },
                    })),
                },
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Collections' : 'Œuvres', path: '/oeuvres' },
            ]),
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <OeuvresEditorial locale={locale} />
            <DiscoveryLinks locale={locale} />
        </>
    )
}
