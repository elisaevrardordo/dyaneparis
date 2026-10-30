import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProduitClient from './ProduitClient'
import { heroImages, produits } from '@/components/data/productDetails'
import { officialImages, officialImagePath, officialSeoImage } from '@/content/officialImages'
import { getPublicOffer, workDetails, workIdentity } from '@/lib/productStructuredData'
import { imageRightsMetadata } from '@/lib/imageRights'
import {
    absoluteUrl,
    breadcrumbJsonLd,
    buildPageMetadata,
    imageObject,
    localizedUrl,
    ORGANIZATION_ID,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'

const productSeoImages = {
    'dyane-no1-pornstar-martini': seoImages.pornstarMartini,
    'dyane-no2-basil-smash': seoImages.basilSmash,
    'bouteille-signee-teokaykay': seoImages.teo,
} as const

const productDescriptions = {
    'dyane-no1-pornstar-martini': {
        fr: 'Dyane No.1 réinterprète le Pornstar Martini à partir d’une vodka artisanale française infusée à la vanille, avec du fruit de la passion et une touche de framboise sauvage. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main. L’œuvre principale est présentée en 1,5 L ; un format 25 cl est prévu pour la future boutique, sans achat en ligne ouvert à ce jour.',
        en: 'Dyane No.1 reinterprets the Pornstar Martini with artisanal French vodka infused with vanilla, passion fruit and a touch of wild raspberry. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture. The main work is presented in 1.5 L; a 25 cl format is planned for the future online shop, with no online purchase available yet.',
    },
    'dyane-no2-basil-smash': {
        fr: 'Dyane No.2 — Basil Smash : gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main.',
        en: 'Dyane No.2 — Basil Smash: gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture.',
    },
} as const

const productImageNames = {
    'dyane-no1-pornstar-martini': {
        fr: [
            'Composition éditoriale autour de la sculpture Dyane No.1',
            'Dyane No.1 — cocktail Pornstar Martini dans sa sculpture en porcelaine',
            'Sculpture en porcelaine rouge Dyane No.1 accompagnée d’un cocktail',
            'Détail artistique de la création en porcelaine Dyane No.1',
            'Dyane No.1 dans l’univers de la Maison d’Art Liquide',
        ],
        en: [
            'Editorial composition featuring the Dyane No.1 sculpture',
            'Dyane No.1 — Pornstar Martini cocktail in its porcelain sculpture',
            'Red-draped Dyane No.1 porcelain sculpture alongside a cocktail',
            'Artistic detail of the Dyane No.1 porcelain creation',
            'Dyane No.1 in the House of Liquid Art universe',
        ],
    },
    'dyane-no2-basil-smash': {
        fr: [
            'Composition éditoriale autour de la sculpture Dyane No.2',
            'Dyane No.2 — cocktail Basil Smash dans sa sculpture en porcelaine',
            'Sculpture en porcelaine Dyane No.2 et cocktail',
            'Étude botanique dans l’univers visuel de Dyane No.2',
        ],
        en: [
            'Editorial composition featuring the Dyane No.2 sculpture',
            'Dyane No.2 — Basil Smash cocktail in its porcelain sculpture',
            'Dyane No.2 porcelain sculpture and cocktail',
            'Botanical study in the visual world of Dyane No.2',
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
    const description = slug === 'dyane-no1-pornstar-martini'
        ? locale === 'en'
            ? 'Dyane No.1 Pornstar Martini, a French cocktail in a hand-painted porcelain sculpture. Main work: 1.5 L. A 25 cl format is planned for the future online shop.'
            : 'Dyane No.1 Pornstar Martini, cocktail français en sculpture de porcelaine peinte à la main. Œuvre principale : 1,5 L. Format 25 cl prévu pour la future boutique.'
        : slug === 'dyane-no2-basil-smash'
        ? locale === 'en'
            ? 'Dyane No.2 Basil Smash: gin, basil, yuzu and wild elderflower in a hand-painted porcelain sculpture. Discover the work and its tasting notes.'
            : 'Dyane No.2 Basil Smash : gin, basilic, yuzu et sureau sauvage dans une sculpture en porcelaine peinte à la main. Découvrez l’œuvre et sa dégustation.'
        : slug === 'bouteille-signee-teokaykay'
        ? locale === 'en'
            ? 'Teo for Dyane Paris: hand-painted porcelain sculptures created with artist Teo Kaykay. Enquire about the work through the Concierge.'
            : 'Teo for Dyane Paris : sculptures en porcelaine peintes à la main avec l’artiste Teo Kaykay. Demandez une commande privée auprès de la Conciergerie.'
        : locale === 'en'
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

    // The first visible gallery image is also the representative work image.
    const image = produit.images[0] || heroImages[slug]
    const language = locale === 'en' ? 'en' : 'fr'
    const semanticDescription = productDescriptions[slug as keyof typeof productDescriptions]?.[language]
        ?? produit.description
    const semanticImageNames = productImageNames[slug as keyof typeof productImageNames]?.[language]

    const allImages = produit
        ? Array.from(new Set(image ? [image, ...(produit.images || [])] : produit.images || []))
        : []
    const imageObjects = allImages.map((url, i) => {
        const credits = imageRightsMetadata(url)
        const official = officialImages.find((item) => officialImagePath(item) === url)
        if (official) return { ...imageObject(officialSeoImage(official.id, language), i === 0), ...credits }
        return {
        '@type': 'ImageObject',
        '@id': `${absoluteUrl(url)}#image`,
        url: absoluteUrl(url),
        contentUrl: absoluteUrl(url),
        name: semanticImageNames?.[i] ?? `${produit.nom} — ${language === 'en' ? 'view' : 'vue'} ${i + 1}`,
        caption: semanticImageNames?.[i] ?? `${produit.nom} — cocktail Dyane Paris en sculpture de porcelaine peinte à la main`,
        description: semanticImageNames?.[i] ?? `${produit.nom}, création de la Maison d'Art Liquide Dyane Paris.`,
        ...credits,
        ...(i === 0 ? { representativeOfPage: true } : {}),
        }
    })

    const productUrl = localizedUrl(locale, `/oeuvres/${slug}`)
    // This exact offer is also rendered by ProduitClient; closed shop emits none.
    const publicOffer = getPublicOffer(slug, locale)
    const identity = workIdentity(productUrl, publicOffer)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
              ...identity,
              name: produit.nom,
              description: semanticDescription,
              image: imageObjects.length ? imageObjects : undefined,
              mainEntityOfPage: productUrl,
              url: productUrl,
              inLanguage: locale,
              ...workDetails(publicOffer, locale, ORGANIZATION_ID),
              // Describe the current work without publishing an unlaunched variant.
              ...(publicOffer && slug === 'dyane-no1-pornstar-martini' ? { size: '1.5 L' } : {}),
              // No unpublished variants, reviews or aggregate ratings.
            },
            {
              '@type': 'WebPage',
              '@id': `${productUrl}#webpage`,
              url: productUrl,
              name: produit.nom,
              inLanguage: locale,
              mainEntity: { '@id': identity['@id'] },
              primaryImageOfPage: imageObjects[0],
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
            <ProduitClient params={{ slug }} publicOffer={publicOffer} />
        </>
    )
}
