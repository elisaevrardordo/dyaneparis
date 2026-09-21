import type { Metadata } from 'next'
import {
    breadcrumbJsonLd,
    buildPageMetadata,
    localizedUrl,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'
import CommissionEditorial from './CommissionEditorial'

const copy = {
    fr: {
        title: 'Commander une sculpture en porcelaine | Dyane Paris',
        description: 'Commandez une sculpture en porcelaine Dyane Paris auprès de notre Conciergerie et découvrez les possibilités de personnalisation artistique.',
        name: 'Commander une sculpture — Dyane Paris',
        home: 'Accueil',
        breadcrumb: 'Commander une sculpture',
    },
    en: {
        title: 'Commission a Sculpture | Dyane Paris',
        description: 'Commission a Dyane Paris porcelain sculpture through our Concierge, discover artistic personalization and arrange delivery in France or internationally.',
        name: 'Commission a Sculpture — Dyane Paris',
        home: 'Home',
        breadcrumb: 'Commission a Sculpture',
    },
} as const

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const content = copy[locale === 'en' ? 'en' : 'fr']

    return buildPageMetadata({
        locale,
        path: '/commission-a-sculpture',
        title: content.title,
        description: content.description,
        image: seoImages.maison,
        absoluteTitle: true,
    })
}

export default async function CommissionPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const content = copy[locale === 'en' ? 'en' : 'fr']
    const pageUrl = localizedUrl(locale, '/commission-a-sculpture')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                name: content.name,
                description: content.description,
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: content.home, path: '' },
                { name: content.breadcrumb, path: '/commission-a-sculpture' },
            ]),
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <CommissionEditorial locale={locale} />
        </>
    )
}
