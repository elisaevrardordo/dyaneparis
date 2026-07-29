import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactClient from './ContactClient'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.contact' })

    return buildPageMetadata({
        locale,
        path: '/contact',
        title: t('title'),
        description: t('description'),
        image: seoImages.contact,
        absoluteTitle: true,
    })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/contact')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ContactPage',
                '@id': `${pageUrl}#contact`,
                name: locale === 'en' ? 'Contact Dyane Paris' : 'Contacter Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                primaryImageOfPage: imageObject(seoImages.contact, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Contact' : 'Contact', path: '/contact' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <ContactClient />
        </>
    )
}
