import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LeJournalClient from './LeJournalClient'
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
    const t = await getTranslations({ locale, namespace: 'seo.journal' })

    return buildPageMetadata({
        locale,
        path: '/le-journal',
        title: t('title'),
        description: t('description'),
        image: seoImages.journal,
        absoluteTitle: true,
    })
}

export default async function LeJournalPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/le-journal')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${pageUrl}#journal`,
                name: locale === 'en' ? 'The Journal — Dyane Paris' : 'Le Journal — Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                primaryImageOfPage: imageObject(seoImages.journal, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Journal' : 'Le Journal', path: '/le-journal' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <LeJournalClient />
        </>
    )
}
