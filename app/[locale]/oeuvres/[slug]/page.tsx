import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProduitClient from './ProduitClient'
import { heroImages, produits } from '@/components/data/productDetails'
import {
    absoluteUrl,
    breadcrumbJsonLd,
    buildPageMetadata,
    localizedUrl,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'

const productSeoImages = {
    'dyane-paris-pornstar-martini-70-cl': seoImages.pornstarMartini,
    'dyane-no2-moscow-mule': seoImages.moscowMule,
    'bouteille-signee-teokaykay': seoImages.teo,
} as const

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { locale, slug } = await params
    const produit = produits[slug]
    if (!produit) return { robots: { index: false, follow: false } }

    const title = produit.nom
    const description = locale === 'en'
        ? `${produit.nom} — a Dyane Paris ready-to-drink cocktail presented in a hand-painted porcelain sculpture, crafted in France in a limited series.`
        : `${produit.nom} — cocktail prêt à déguster signé Dyane Paris, présenté dans un flacon sculptural en porcelaine peint à la main. Série limitée, artisanat français.`
    const baseImage = productSeoImages[slug as keyof typeof productSeoImages]
    const image = locale === 'en'
        ? {
              ...baseImage,
              alt: `${produit.nom} ready-to-drink cocktail in a hand-painted porcelain sculpture`,
              description: `${produit.nom}, a Dyane Paris cocktail presented in a porcelain sculpture.`,
          }
        : baseImage

    return buildPageMetadata({
        locale,
        path: `/oeuvres/${slug}`,
        title,
        description,
        image,
    })
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
    if (!produit) notFound()

    const image = heroImages[slug] || produit?.images?.[0]

    const allImages = produit
        ? Array.from(new Set(image ? [image, ...(produit.images || [])] : produit.images || []))
        : []
    const imageObjects = allImages.map((url, i) => ({
        '@type': 'ImageObject',
        url: absoluteUrl(url),
        contentUrl: absoluteUrl(url),
        name: `${produit.nom} — vue ${i + 1}`,
        caption: `${produit.nom} — cocktail Dyane Paris en sculpture de porcelaine peinte à la main`,
        description: `${produit.nom}, création de la Maison d'Art Liquide Dyane Paris.`,
        creditText: 'Dyane Paris',
        creator: { '@type': 'Organization', name: 'Dyane Paris' },
        copyrightNotice: 'Dyane Paris',
        ...(i === 0 ? { representativeOfPage: true } : {}),
    }))

    const productUrl = localizedUrl(locale, `/oeuvres/${slug}`)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
              '@type': 'Product',
              '@id': `${productUrl}#product`,
              name: produit.nom,
              description: produit.description,
              image: imageObjects.length ? imageObjects : undefined,
              mainEntityOfPage: productUrl,
              brand: {
                  '@type': 'Brand',
                  name: 'Dyane Paris',
              },
              url: productUrl,
              category: locale === 'en' ? 'Ready-to-drink cocktail' : 'Cocktail prêt à déguster',
              inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Collections' : 'Œuvres', path: '/oeuvres' },
                { name: produit.nom, path: `/oeuvres/${slug}` },
            ]),
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <ProduitClient params={{ slug }} />
        </>
    )
}
