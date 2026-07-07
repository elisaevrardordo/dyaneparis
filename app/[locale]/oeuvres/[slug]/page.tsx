import type { Metadata } from 'next'
import ProduitClient, { produits, heroImages } from './ProduitClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { locale, slug } = await params
    const produit = produits[slug]
    if (!produit) return {}

    const title = `${produit.nom} | Dyane Paris`
    const description = `${produit.nom} — cocktail de luxe signé Dyane Paris, présenté dans un flacon sculptural en porcelaine peint à la main. Édition limitée, artisanat français.`
    const path = locale === 'fr' ? `/oeuvres/${slug}` : `/${locale}/oeuvres/${slug}`
    const image = heroImages[slug] || produit.images?.[0]

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: `https://www.dyaneparis.com/oeuvres/${slug}`,
                en: `https://www.dyaneparis.com/en/oeuvres/${slug}`,
                'x-default': `https://www.dyaneparis.com/oeuvres/${slug}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.dyaneparis.com${path}`,
            type: 'website',
            images: image
                ? [{ url: image, width: 1200, height: 1500, alt: `${produit.nom} — flacon Dyane Paris en porcelaine peinte à la main` }]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : undefined,
        },
    }
}

export async function generateStaticParams() {
    return Object.keys(produits).map((slug) => ({ slug }))
}

export default async function ProduitPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params
    const produit = produits[slug]
    const image = heroImages[slug] || produit?.images?.[0]

    const allImages = produit
        ? Array.from(new Set(image ? [image, ...(produit.images || [])] : produit.images || []))
        : []
    const imageObjects = allImages.map((url, i) => ({
        '@type': 'ImageObject',
        url,
        contentUrl: url,
        caption: `${produit!.nom} — cocktail de luxe Dyane Paris en flacon de porcelaine peint à la main`,
        creditText: 'Dyane Paris',
        creator: { '@type': 'Organization', name: 'Dyane Paris' },
        ...(i === 0 ? { representativeOfPage: true } : {}),
    }))

    const jsonLd = produit
        ? {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: produit.nom,
              description: produit.description,
              image: imageObjects.length ? imageObjects : undefined,
              brand: {
                  '@type': 'Brand',
                  name: 'Dyane Paris',
              },
              url: `https://www.dyaneparis.com${locale === 'fr' ? '' : `/${locale}`}/oeuvres/${slug}`,
              category: 'Luxury Bottled Cocktail',
              offers: {
                  '@type': 'Offer',
                  availability: 'https://schema.org/InStock',
                  priceCurrency: 'EUR',
                  url: `https://www.dyaneparis.com${locale === 'fr' ? '' : `/${locale}`}/oeuvres/${slug}`,
              },
          }
        : null

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProduitClient params={{ slug }} />
        </>
    )
}
