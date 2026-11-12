'use client'
import { formatPrice } from '@/lib/formatPrice'
import { shippingDescription } from '@/lib/shipping'
import { shopDeliveryTerms } from '@/lib/orders/fulfillment'
import { cartProducts, isTeoComposition, TEO_ARTWORK_SKU, TEO_COMPOSITIONS } from '@/components/cart/catalog'
import ProductCartActions from '@/components/commerce/ProductCartActions'
import ProductPageClosing from '@/components/product/ProductPageClosing'
import ProductShowcase from '@/components/product/ProductShowcase'
import showcase from '@/components/product/ProductShowcase.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'
import { produits, productVideos, type ProductDetails } from '@/components/data/productDetails'
import layout from './ProduitLayout.module.css'
import { availabilityLabel, type PublicOffer } from '@/lib/productStructuredData'

type GalleryMedia =
    | { type: 'video', src: string, caption: string }
    | { type: 'image', src: string }

const productMediaAlts: Record<string, Record<'fr' | 'en', string[]>> = {
    'dyane-no1-pornstar-martini': {
        fr: [
            'Portrait de Dyane No.1, sculpture en porcelaine au drapé rouge',
            'Film du service et du rituel du cocktail Dyane Paris',
            'Sculpture en porcelaine rouge Dyane No.1 accompagnée d’un cocktail',
            'Cocktail Dyane No.1 dans une coupe garnie de fleurs roses',
        ],
        en: [
            'Portrait of Dyane No.1, porcelain sculpture with red drapery',
            'Film of the Dyane Paris cocktail service and ritual',
            'Red-draped Dyane No.1 porcelain sculpture alongside a cocktail',
            'Dyane No.1 cocktail in a coupe garnished with pink flowers',
        ],
    },
    'dyane-no2-basil-smash': {
        fr: [
            'Portrait de Dyane No.2, sculpture en porcelaine au drapé vert',
            'Film de Jérémy Bacquet au bar, mixologie Dyane Paris',
            'Sculpture en porcelaine Dyane No.2 et cocktail',
            'Cocktail Basil Smash Dyane No.2 dans un verre sur fond rouge',
        ],
        en: [
            'Portrait of Dyane No.2, porcelain sculpture with green drapery',
            'Film of Jérémy Bacquet at the bar, Dyane Paris mixology',
            'Dyane No.2 porcelain sculpture and cocktail',
            'Dyane No.2 Basil Smash cocktail in a glass against a red background',
        ],
    },
}

const englishProductDetails: Record<string, Partial<ProductDetails>> = {
    'dyane-no1-pornstar-martini': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'ARTISANAL FRENCH VODKA INFUSED WITH MADAGASCAR BOURBON GOLD VANILLA PODS. PASSION FRUIT PURÉE LIFTED BY WILD RASPBERRY AND ORGANIC LEMON JUICE. BOTTLED IN FRANCE, IN THE AVIGNON REGION. MAIN WORK: 1.5 L.',
        plusInfos: 'VANILLA & PASSION FRUIT\nSUNLIT. SENSUAL. AN INTENSE INTERPRETATION OF PASSION FRUIT, INFUSED IN AN ARTISANAL FRENCH VODKA. BRIGHT ACIDITY MEETS MEASURED SWEETNESS, WHILE MADAGASCAR BOURBON GOLD VANILLA BRINGS A SILKEN ROUNDNESS.\nDENSE. LUMINOUS. A LIQUID WORK OF ART.\n-\nSENSORY PROFILE\nCOLOUR - AMBER GOLD\nNOSE - FRESH PASSION FRUIT, WARM VANILLA\nPALATE - PULPY, BALANCED\nFINISH - LONG, SUNLIT.',
        livraison: `ESTIMATED DELIVERY WITHIN TWO WEEKS.\n${shippingDescription('en').toUpperCase()}`,
        disponibilite: 'SIZE ON THIS PAGE: 1.5 L.\nTHE 25 CL SIZE HAS ITS OWN PRODUCT PAGE.\nCONTACT THE CONCIERGE FOR ENQUIRIES ABOUT THE WORK.',
    },
    'dyane-no2-basil-smash': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'Gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour',
        plusInfos: 'BASIL SMASH\nGin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour',
        livraison: `ESTIMATED DELIVERY WITHIN TWO WEEKS.\n${shippingDescription('en').toUpperCase()}`,
        disponibilite: 'BATCH 1.\n25 PIECES PER BATCH.\nJOIN OUR NEWSLETTER TO HEAR ABOUT FUTURE BATCHES.',
    },
    'bouteille-signee-teokaykay': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'A limited edition of 25 hand-painted porcelain sculptures, each holding a choice of signature cocktail inspired by the Pornstar Martini or Basil Smash.',
        plusInfos: 'A CONFIDENTIAL SERIES OF 25 WORKS BY DYANE PARIS AND TEO KAYKAY. EACH PORCELAIN SCULPTURE IS HAND-PAINTED BY THE ARTIST, MAKING EVERY PIECE UNIQUE. INSIDE, A DYANE SIGNATURE COCKTAIL EXTENDS THE WORK THROUGH A PRECISE TASTING EXPERIENCE. ART IS DRUNK, THEN KEPT. CHOOSE BETWEEN PORNSTAR MARTINI AND BASIL SMASH.',
        livraison: `MADE TO ORDER. ESTIMATED DELIVERY WITHIN THREE WEEKS.\n${shippingDescription('en').toUpperCase()}`,
        disponibilite: 'BATCH 1.\n25 PIECES PER BATCH.\nJOIN OUR NEWSLETTER TO HEAR ABOUT FUTURE BATCHES.',
    },
}

function mediaAlt(slug: string, index: number, locale: 'fr' | 'en', fallback: string) {
    return productMediaAlts[slug]?.[locale]?.[index] ?? `${fallback} - ${locale === 'en' ? 'Dyane Paris artwork' : 'œuvre Dyane Paris'}`
}

const showcaseTitles: Record<string, { title: string; fr: string; en: string; enquirySku?: string }> = {
    'dyane-no1-pornstar-martini': {
        title: 'Dyane No.1',
        fr: 'Inspiré du Pornstar Martini, 24 % vol. · 1,5 L',
        en: 'Inspired by the Pornstar Martini, 24% vol. · 1.5 L',
    },
    'dyane-no2-basil-smash': {
        title: 'Dyane No.2',
        fr: 'Basil Smash · 1,5 L',
        en: 'Basil Smash · 1.5 L',
    },
    'bouteille-signee-teokaykay': {
        title: 'Teo for Dyane',
        fr: 'Édition artistique · Porcelaine peinte à la main',
        en: 'Artist edition · Hand-painted porcelain',
        enquirySku: TEO_ARTWORK_SKU,
    },
}

export default function ProduitClient({ params, publicOffer = null, sandboxCartEnabled = false, liveCartEnabled = false }: {
    params: { slug: string }; publicOffer?: PublicOffer | null; sandboxCartEnabled?: boolean; liveCartEnabled?: boolean
}) {
    const { slug } = params
    const pathname = usePathname()
    const [composition, setComposition] = useState('')
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const en = locale === 'en'
    const baseProduit = produits[slug]
    const produit = en ? { ...baseProduit, ...englishProductDetails[slug] } : baseProduit
    const productVideo = productVideos[slug]
    const galleryMedia: GalleryMedia[] = [
        ...produit.images.slice(0, 1).map(src => ({ type: 'image' as const, src })),
        ...(productVideo ? [{ type: 'video' as const, src: productVideo.src, caption: productVideo.caption[locale] }] : []),
        ...produit.images.slice(1).map(src => ({ type: 'image' as const, src })),
    ]
    const fullscreenMedia = galleryMedia.map((item, index) => ({ ...item, alt: mediaAlt(slug, index, locale, produit.nom) }))
    const { title, enquirySku, [locale]: subtitle } = showcaseTitles[slug]
    const sku = enquirySku ?? (slug === 'dyane-no2-basil-smash' ? 'dyane-no2-150cl' : 'dyane-sculpture-150cl')
    const t = (fr: string, english: string) => en ? english : fr
    const canPurchase = sandboxCartEnabled || liveCartEnabled
    const teoCheckout = canPurchase && sku === TEO_ARTWORK_SKU
    const delivery = shopDeliveryTerms(locale, 'stock')
    const cataloguePrice = cartProducts.find(product => product.sku === sku)?.amount
    const compositionOptions = sku === TEO_ARTWORK_SKU
        ? [{ value: 'no1', label: t('Inspiré du Pornstar Martini, 24 % vol.', 'Inspired by the Pornstar Martini, 24% vol.') }, { value: 'no2', label: TEO_COMPOSITIONS.no2 }]
        : produit.formats?.map(label => ({ value: label, label }))
    const chosenOption = compositionOptions?.find(option => option.value === composition) ?? compositionOptions?.[0]
    const chosenComposition = chosenOption?.value
    const privateOrderHref = chosenOption
        ? `mailto:conciergerie@dyaneparis.com?subject=${encodeURIComponent(`${title} · ${chosenOption.label}`)}`
        : localizedPath(locale, '/contact')

    return <main className={`theme-page ${layout.page}`}>
        <ProductShowcase items={fullscreenMedia} locale={locale} title={title}>
            <h1>{title}</h1>
            <p className={showcase.subtitle}>{subtitle}</p>
            {canPurchase && !enquirySku && <ProductCartActions sku={sku} locale={locale} className={showcase.actions} showPrice sandbox={sandboxCartEnabled} />}
            {canPurchase && publicOffer && <p>{formatPrice(Number(publicOffer.price) * 100, locale)} · {availabilityLabel(publicOffer, locale)} <a href={publicOffer.url}>{t('Voir la boutique en ligne', 'View online shop')}</a></p>}
            {compositionOptions && <label className={showcase.composition}>
                {t('Choisir votre composition', 'Choose your composition')}
                <select value={chosenComposition} onChange={event => setComposition(event.target.value)}>
                    {compositionOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
            </label>}
            {teoCheckout && <ProductCartActions sku={sku} locale={locale} className={showcase.actions} showPrice sandbox={sandboxCartEnabled} composition={isTeoComposition(chosenComposition) ? chosenComposition : undefined} />}
            {!canPurchase ? <div className={showcase.enquiry}>
                <p>{cataloguePrice === undefined ? t('Sur demande', 'On request') : formatPrice(cataloguePrice, locale)}</p>
                <Link className={showcase.orderButton} href={localizedPath(locale, '/contact')}>{t('Contacter la Conciergerie', 'Contact the Concierge')}</Link>
                <p>{t('Disponible auprès de la Conciergerie. Livraison sous 5 jours ouvrés en France métropolitaine et à Monaco.', 'Available through the Concierge. Delivery within 5 business days in metropolitan France and Monaco.')}</p>
            </div> : <Link className={showcase.privateOrder} href={teoCheckout ? privateOrderHref : localizedPath(locale, '/contact')}>{t('Passer une commande privée', 'Place a private order')}</Link>}
            <p className={showcase.description}>{produit.description}</p>
            {[
                [t('Notes de dégustation', 'Tasting notes'), produit.plusInfos],
                [t('Livraison', 'Delivery'), delivery],
                [t('Disponibilité', 'Availability'), produit.disponibilite],
            ].map(([label, description]) => <details className={showcase.details} key={label}><summary>{label}</summary><p>{description}</p></details>)}
        </ProductShowcase>
        <ProductPageClosing locale={locale} currentSku={sku} />
    </main>
}
