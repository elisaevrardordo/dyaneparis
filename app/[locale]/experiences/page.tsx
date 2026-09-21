import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ExperiencesClient from './ExperiencesClient'
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
    const t = await getTranslations({ locale, namespace: 'seo.experiences' })

    return buildPageMetadata({
        locale,
        path: '/experiences',
        title: t('title'),
        description: t('description'),
        image: seoImages.experiences,
    })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/experiences')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                name: locale === 'en'
                    ? 'Cocktails for luxury hotels and exceptional events'
                    : 'Cocktails pour hôtels et événements d’exception',
                description: locale === 'en'
                    ? 'Dyane Paris creates premium ready-to-serve cocktails for hotel bars, minibars, room service and events, with bespoke recipes and formats.'
                    : 'Dyane Paris conçoit des cocktails premium prêts à servir pour le bar, le minibar, le room service et les événements, avec recettes et formats sur mesure.',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                primaryImageOfPage: imageObject(seoImages.experiences, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Experiences' : 'Expériences', path: '/experiences' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <ExperiencesClient />
        </>
    )
}
