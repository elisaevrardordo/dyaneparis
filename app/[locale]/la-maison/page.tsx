import type { Metadata } from 'next'
import { getEditorialPage } from '@/content/editorialPages'
import LaMaisonClient from './LaMaisonClient'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'
import { officialSeoImage } from '@/content/officialImages'
import {
    breadcrumbJsonLd,
    buildPageMetadata,
    imageObject,
    localizedUrl,
    serializeJsonLd,
} from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const { seo } = getEditorialPage('la-maison', locale)

    return buildPageMetadata({
        locale,
        path: '/la-maison',
        title: seo.title,
        description: seo.description,
        image: officialSeoImage('maison', locale),
        absoluteTitle: true,
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
                name: locale === 'en' ? 'The Maison - Dyane Paris' : 'La Maison - Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                primaryImageOfPage: imageObject(officialSeoImage('maison', locale), true),
                description: getEditorialPage('la-maison', locale).seo.description,
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
            <DiscoveryLinks locale={locale} />
        </>
    )
}
