export type PublicOffer = {
    price: string
    priceCurrency: 'EUR'
    availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder'
    url: string
}

type ShopPublication = {
    open: boolean
    offers: Record<string, Partial<Record<'fr' | 'en', PublicOffer>>>
}

// Populate only when checkout and these same details are public on the page.
// Opening the shop alone cannot produce an Offer without a verified entry.
const publicShop: ShopPublication = { open: false, offers: {} }

export function getPublicOffer(slug: string, locale: string, shop: ShopPublication = publicShop): PublicOffer | null {
    if (!shop.open) return null
    const offer = shop.offers[slug]?.[locale === 'en' ? 'en' : 'fr']
    if (offer?.priceCurrency !== 'EUR' || !/^\d+(?:\.\d{1,2})?$/.test(offer.price) || !Number.isFinite(Number(offer.price)) || Number(offer.price) <= 0) return null
    if (!['InStock', 'OutOfStock', 'PreOrder', 'BackOrder'].includes(offer.availability)) return null
    try {
        const url = new URL(offer.url)
        if (url.origin !== 'https://www.dyaneparis.com' || url.username || url.password || url.href.includes('70-cl')) return null
    } catch {
        return null
    }
    return offer
}

export function workIdentity(url: string, offer: PublicOffer | null) {
    return { '@type': offer ? 'Product' : 'VisualArtwork', '@id': `${url}#${offer ? 'product' : 'artwork'}` }
}

export function workDetails(offer: PublicOffer | null, locale: string, organizationId: string) {
    return offer
        ? {
            brand: { '@id': organizationId },
            category: locale === 'en' ? 'Ready-to-drink cocktail' : 'Cocktail prêt à déguster',
            offers: {
                '@type': 'Offer',
                price: offer.price,
                priceCurrency: offer.priceCurrency,
                availability: `https://schema.org/${offer.availability}`,
                url: offer.url,
            },
        }
        : {
            artform: 'Sculpture',
            artMedium: locale === 'en' ? 'Hand-painted porcelain' : 'Porcelaine peinte à la main',
        }
}

export function availabilityLabel(offer: PublicOffer, locale: string) {
    const labels = {
        InStock: ['Disponible', 'In stock'],
        OutOfStock: ['Indisponible', 'Out of stock'],
        PreOrder: ['Précommande', 'Pre-order'],
        BackOrder: ['Sur commande', 'Back order'],
    }
    return labels[offer.availability][locale === 'en' ? 1 : 0]
}
