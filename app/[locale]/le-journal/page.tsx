import type { Metadata } from 'next'
import JournalIndex from '@/components/journal/JournalIndex'
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
    const en = locale === 'en'

    return buildPageMetadata({
        locale,
        path: '/le-journal',
        title: en ? 'The Journal - Art, cocktails and encounters | Dyane Paris' : 'Le Journal - Art, cocktails et rencontres | Dyane Paris',
        description: en ? 'Encounters, craftsmanship and creations: the Dyane Paris Journal explores art, porcelain, signature cocktails and the art of hosting.' : 'Rencontres, savoir-faire et créations : le Journal de Dyane Paris explore l’art, la porcelaine, les cocktails d’auteur et l’art de recevoir.',
        image: seoImages.journal,
        absoluteTitle: true,
    })
}

export default async function LeJournalPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ rubrique?: string | string[]; page?: string | string[] }> }) {
    const { locale } = await params
    const query = await searchParams
    const category = typeof query.rubrique === 'string' ? query.rubrique : undefined
    const requestedPage = typeof query.page === 'string' ? query.page : undefined
    const pageUrl = localizedUrl(locale, '/le-journal')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${pageUrl}#journal`,
                name: locale === 'en' ? 'The Journal - Dyane Paris' : 'Le Journal - Dyane Paris',
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
            <JournalIndex locale={locale} category={category} page={requestedPage} />
        </>
    )
}
