import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LaMaisonClient from './LaMaisonClient'
import {
    breadcrumbJsonLd,
    buildPageMetadata,
    imageObject,
    localizedUrl,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.laMaison' })

    return buildPageMetadata({
        locale,
        path: '/la-maison',
        title: t('title'),
        description: t('description'),
        image: seoImages.maison,
    })
}

export default async function LaMaisonPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/la-maison')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'AboutPage',
                '@id': `${pageUrl}#about`,
                name: locale === 'en' ? 'The Maison — Dyane Paris' : 'La Maison — Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                primaryImageOfPage: imageObject(seoImages.maison, true),
                description: locale === 'en'
                    ? 'The story of Dyane Paris, its porcelain craftsmanship and French Liquid Art savoir-faire.'
                    : "L'histoire de Dyane Paris, son artisanat de la porcelaine et son savoir-faire français d'Art Liquide.",
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'The Maison' : 'La Maison', path: '/la-maison' },
            ]),
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <LaMaisonClient />
        </>
    )
}
