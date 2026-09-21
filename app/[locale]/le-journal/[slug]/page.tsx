import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JournalArticle from '@/components/journal/JournalArticle'
import { journalArticleBySlug, journalArticles, journalIndexArticles, journalText } from '@/content/journal'
import { journalIndexStoryByHref } from '@/content/journalIndex'
import { absoluteUrl, breadcrumbJsonLd, localizedAlternates, localizedUrl, ORGANIZATION_ID, serializeJsonLd } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params
    const article = journalArticleBySlug[slug]
    if (!article) return { robots: { index: false, follow: false } }

    const title = journalText(article.seoTitle ?? article.title, locale)
    const description = journalText(article.seoDescription ?? article.excerpt, locale)
    const path = `/le-journal/${slug}`
    const indexCover = journalIndexStoryByHref[path]?.images.find((media) => media.kind === 'image')
    const image = indexCover?.kind === 'image' ? indexCover.src : article.cover.src
    const imageAlt = indexCover?.kind === 'image' ? indexCover.alt : article.cover.alt
    const pageUrl = localizedUrl(locale, path)

    return {
        title,
        description,
        robots: article.status === 'draft'
            ? { index: false, follow: true, googleBot: { index: false, follow: true } }
            : undefined,
        alternates: { canonical: pageUrl, languages: localizedAlternates(path) },
        openGraph: {
            title,
            description,
            url: pageUrl,
            type: 'article',
            ...(article.datePublished ? { publishedTime: article.datePublished } : {}),
            ...(article.dateModified ? { modifiedTime: article.dateModified } : {}),
            authors: ['Dyane Paris'],
            images: [{ url: image, alt: journalText(imageAlt, locale) }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [{ url: image, alt: journalText(imageAlt, locale) }],
        },
    }
}

export async function generateStaticParams() {
    return ['fr', 'en'].flatMap((locale) =>
        journalArticles.map(({ slug }) => ({ locale, slug })),
    )
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const article = journalArticleBySlug[slug]
    if (!article) notFound()

    const title = journalText(article.title, locale)
    const description = journalText(article.seoDescription ?? article.excerpt, locale)
    const path = `/le-journal/${slug}`
    const pageUrl = localizedUrl(locale, path)
    const indexCover = journalIndexStoryByHref[path]?.images.find((media) => media.kind === 'image')
    const representativeImage = indexCover?.kind === 'image' ? indexCover : article.cover
    const navigationIndex = journalIndexArticles.findIndex((entry) => entry.slug === slug)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${pageUrl}#article`,
                url: pageUrl,
                headline: title,
                description,
                ...(article.datePublished ? { datePublished: article.datePublished } : {}),
                ...(article.dateModified || article.datePublished
                    ? { dateModified: article.dateModified ?? article.datePublished }
                    : {}),
                image: [{
                    '@type': 'ImageObject',
                    url: absoluteUrl(representativeImage.src),
                    contentUrl: absoluteUrl(representativeImage.src),
                    name: title,
                    caption: journalText(representativeImage.alt, locale),
                    description,
                    creditText: 'Dyane Paris',
                    creator: { '@id': ORGANIZATION_ID },
                    copyrightNotice: 'Dyane Paris',
                    representativeOfPage: true,
                }],
                author: { '@id': ORGANIZATION_ID },
                publisher: { '@id': ORGANIZATION_ID },
                mainEntityOfPage: pageUrl,
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'The Journal' : 'Le Journal', path: '/le-journal' },
                { name: title, path: `/le-journal/${slug}` },
            ]),
        ],
    }

    return (
        <>
            {article.status !== 'draft' ? (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            ) : null}
            <JournalArticle
                article={article}
                previous={navigationIndex >= 0 ? journalIndexArticles[navigationIndex - 1] : undefined}
                next={navigationIndex >= 0 ? journalIndexArticles[navigationIndex + 1] : undefined}
                locale={locale}
            />
        </>
    )
}
