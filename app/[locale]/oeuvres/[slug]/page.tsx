import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProduitClient from './ProduitClient'
import { heroImages, produits } from '@/components/data/productDetails'
import {
    absoluteUrl,
    breadcrumbJsonLd,
    buildPageMetadata,
    localizedUrl,
    ORGANIZATION_ID,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'

const productSeoImages = {
    'dyane-paris-pornstar-martini-70-cl': seoImages.pornstarMartini,
    'dyane-no2-moscow-mule': seoImages.moscowMule,
    'bouteille-signee-teokaykay': seoImages.teo,
} as const

const productDescriptions = {
    'dyane-paris-pornstar-martini-70-cl': {
        fr: 'Dyane No.1 réinterprète le Pornstar Martini autour du fruit de la passion, de la vanille et de la framboise sauvage. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main.',
        en: 'Dyane No.1 reinterprets the Pornstar Martini through passion fruit, vanilla and wild raspberry. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture.',
    },
    'dyane-no2-moscow-mule': {
        fr: 'Dyane No.2 interprète le Moscow Mule autour du gingembre et du citron. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main.',
        en: 'Dyane No.2 interprets the Moscow Mule through ginger and lemon. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture.',
    },
} as const

const productImageNames = {
    'dyane-paris-pornstar-martini-70-cl': {
        fr: [
            'Dyane No.1 — cocktail Pornstar Martini dans sa sculpture en porcelaine',
            'Composition éditoriale autour de la sculpture Dyane No.1',
            'Détail de la porcelaine peinte à la main de Dyane No.1',
            'Flacon sculptural Dyane No.1 et cocktail prêt à servir',
            'Fleur de la passion, inspiration aromatique de Dyane No.1',
        ],
        en: [
            'Dyane No.1 — Pornstar Martini cocktail in its porcelain sculpture',
            'Editorial composition featuring the Dyane No.1 sculpture',
            'Detail of the hand-painted porcelain on Dyane No.1',
            'Dyane No.1 sculptural vessel and ready-to-serve cocktail',
            'Passion flower, an aromatic inspiration for Dyane No.1',
        ],
    },
    'dyane-no2-moscow-mule': {
        fr: [
            'Dyane No.2 — cocktail Moscow Mule dans sa sculpture en porcelaine',
            'Composition éditoriale autour de la sculpture Dyane No.2',
            'Détail artistique de la création en porcelaine Dyane No.2',
            'Dyane No.2 dans l’univers de la Maison d’Art Liquide',
        ],
        en: [
            'Dyane No.2 — Moscow Mule cocktail in its porcelain sculpture',
            'Editorial composition featuring the Dyane No.2 sculpture',
            'Artistic detail of the Dyane No.2 porcelain creation',
            'Dyane No.2 in the House of Liquid Art universe',
        ],
    },
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
    return ['fr', 'en'].flatMap((locale) =>
        Object.keys(produits).map((slug) => ({ locale, slug })),
    )
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
    const language = locale === 'en' ? 'en' : 'fr'
    const semanticDescription = productDescriptions[slug as keyof typeof productDescriptions]?.[language]
        ?? produit.description
    const semanticImageNames = productImageNames[slug as keyof typeof productImageNames]?.[language]

    const allImages = produit
        ? Array.from(new Set(image ? [image, ...(produit.images || [])] : produit.images || []))
        : []
    const imageObjects = allImages.map((url, i) => ({
        '@type': 'ImageObject',
        url: absoluteUrl(url),
        contentUrl: absoluteUrl(url),
        name: semanticImageNames?.[i] ?? `${produit.nom} — ${language === 'en' ? 'view' : 'vue'} ${i + 1}`,
        caption: semanticImageNames?.[i] ?? `${produit.nom} — cocktail Dyane Paris en sculpture de porcelaine peinte à la main`,
        description: semanticImageNames?.[i] ?? `${produit.nom}, création de la Maison d'Art Liquide Dyane Paris.`,
        creditText: 'Dyane Paris',
        creator: { '@id': ORGANIZATION_ID },
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
              description: semanticDescription,
              image: imageObjects.length ? imageObjects : undefined,
              mainEntityOfPage: productUrl,
              brand: { '@id': ORGANIZATION_ID },
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
