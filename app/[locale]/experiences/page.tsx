import type { Metadata } from 'next'
import { experiencesHeroImage, getEditorialPage } from '@/content/editorialPages'
import ExperiencesClient from './ExperiencesClient'
import HauteMixologieSection from '../sur-mesure/HauteMixologieSection'
import BespokePiecesSection from '../sur-mesure/BespokePiecesSection'
import DiscoveryLinks from '@/components/discovery/DiscoveryLinks'
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
    const { seo } = getEditorialPage('experiences', locale)

    return buildPageMetadata({
        locale,
        path: '/experiences',
        title: seo.title,
        description: seo.description,
        image: experiencesHeroImage(locale),
        absoluteTitle: true,
    })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const pageUrl = localizedUrl(locale, '/experiences')
    const page = getEditorialPage('experiences', locale)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                name: page.title,
                description: page.seo.description,
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                primaryImageOfPage: imageObject(experiencesHeroImage(locale), true),
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
            <ExperiencesClient bespokeSections={<>
                <HauteMixologieSection locale={locale} />
                <BespokePiecesSection locale={locale} />
            </>} />
            <DiscoveryLinks locale={locale} />
        </>
    )
}
