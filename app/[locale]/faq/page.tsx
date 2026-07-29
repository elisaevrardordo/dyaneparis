import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import FaqClient from './FaqClient'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.faq' })

    return buildPageMetadata({
        locale,
        path: '/faq',
        title: t('title'),
        description: t('description'),
        image: seoImages.faq,
        absoluteTitle: true,
    })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/faq')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#faq`,
                name: locale === 'en' ? 'Dyane Paris FAQ' : 'Foire aux questions Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                primaryImageOfPage: imageObject(seoImages.faq, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: 'FAQ', path: '/faq' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <FaqClient />
        </>
    )
}
