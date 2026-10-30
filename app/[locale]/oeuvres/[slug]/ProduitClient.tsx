'use client'
import Image from 'next/image'
import EditorialImage from '@/components/editorial/EditorialImage'
import ProductLightbox from '@/components/product/ProductLightbox'
import ProductGallery from '@/components/product/ProductGallery'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'
import { heroImages, produits, productVideos, productMediaDimensions, type ProductDetails } from '@/components/data/productDetails'
import layout from './ProduitLayout.module.css'
import { ChevronIcon, ArrowLeftIcon } from '@/components/icons/EditorialIcons'
import { cloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import { availabilityLabel, type PublicOffer } from '@/lib/productStructuredData'

const font = { fontFamily: 'var(--font-editorial), serif' }
const lora = { fontFamily: 'var(--font-editorial), serif' }
const quotePhrasePattern = /(D[ÉE]SORMAIS,?\s+L[’']ART SE BOIT\.?|L[’']ART SE BOIT\.?)/gi
const exactQuotePhrasePattern = /^(D[ÉE]SORMAIS,?\s+L[’']ART SE BOIT\.?|L[’']ART SE BOIT\.?)$/i

function EditorialLine({ text }: { text: string }) {
    return text.split(quotePhrasePattern).map((part, index) => (
        exactQuotePhrasePattern.test(part)
            ? <span key={`${part}-${index}`} className="font-quote" data-font="quote">{part}</span>
            : part
    ))
}

function Accordion({ titre, contenu, semanticHeading = false }: { titre: string, contenu: string, semanticHeading?: boolean }) {
    const [open, setOpen] = useState(false)
    const panelId = `product-accordion-${titre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    return (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={panelId}
                style={{ ...font, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
                {semanticHeading
                    ? <h2 style={{ margin: 0, font: 'inherit', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{titre}</h2>
                    : <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{titre}</span>}
                <ChevronIcon direction="right" className={open ? layout.accordionChevronOpen : layout.accordionChevron} />
            </button>
            {open && (
                <div id={panelId} style={{ paddingBottom: '16px' }}>
                    {contenu.split('\n').map((ligne, i) => (
                        <p key={i} style={{ ...lora, fontSize: '12px', letterSpacing: '0.08em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase' }}>
                            <EditorialLine text={ligne} />
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

type GalleryMedia =
    | { type: 'video', src: string }
    | { type: 'image', src: string }

const videoCaption = "DYANE X JEREMY BACQUET, L'ART DE LA MIXOLOGIE"

type ProductEditorialCopy = {
    definitionTitle: string
    definition: string
    porcelainTitle: string
    porcelain: string
    franceTitle: string
    france: string
    serviceTitle: string
    service: string
    articleHref: string
    articleLabel: string
    fabricationLabel: string
    distillationLabel: string
    commissionLabel: string
}

const productEditorial: Record<string, Record<'fr' | 'en', ProductEditorialCopy>> = {
    'dyane-no1-pornstar-martini': {
        fr: {
            definitionTitle: 'QU’EST-CE QUE DYANE NO.1 ?',
            definition: 'Dyane No.1 est la première création de la Maison d’Art Liquide Dyane Paris. Elle réinterprète le Pornstar Martini autour du fruit de la passion, de la vanille et de la framboise sauvage, dans un cocktail prêt à servir présenté au sein d’une sculpture en porcelaine peinte à la main. L’œuvre principale est présentée en 1,5 L. Un format 25 cl est prévu pour la future boutique ; il n’est pas encore proposé à l’achat en ligne.',
            porcelainTitle: 'UNE SCULPTURE EN PORCELAINE',
            porcelain: 'Le contenant abandonne les codes de la bouteille traditionnelle pour adopter la silhouette sculpturale de Dyane. Sa porcelaine et ses finitions peintes à la main donnent à chaque création une présence conçue pour demeurer après la dégustation.',
            franceTitle: 'UNE ÉLABORATION FRANÇAISE',
            france: 'Le cocktail est élaboré et embouteillé en France, dans la région d’Avignon, à partir d’une vodka artisanale française travaillée par infusion. La recette recherche un équilibre entre l’intensité du fruit de la passion, l’acidité et la rondeur de la vanille.',
            serviceTitle: 'À SERVIR, PUIS À COLLECTIONNER',
            service: 'Prête à déguster, la composition est pensée pour préserver la constance du service. Une fois le cocktail savouré, la sculpture conserve sa fonction d’objet d’art et peut rejoindre une collection ou un intérieur.',
            articleHref: '/le-journal/pornstar-martini',
            articleLabel: 'LIRE L’HISTOIRE DU PORNSTAR MARTINI',
            fabricationLabel: 'DÉCOUVRIR LA FABRICATION',
            distillationLabel: 'EXPLORER LA MIXOLOGIE DYANE',
            commissionLabel: 'COMMANDER UNE SCULPTURE',
        },
        en: {
            definitionTitle: 'WHAT IS DYANE NO.1?',
            definition: 'Dyane No.1 is the first creation by the Dyane Paris House of Liquid Art. It reinterprets the Pornstar Martini through passion fruit, vanilla and wild raspberry, in a ready-to-serve cocktail presented within a hand-painted porcelain sculpture. The main work is presented in 1.5 L. A 25 cl format is planned for the future online shop and is not yet available to buy online.',
            porcelainTitle: 'A PORCELAIN SCULPTURE',
            porcelain: 'The vessel leaves behind the codes of the traditional bottle for Dyane’s sculptural silhouette. Its porcelain body and hand-painted finishes give every creation a presence designed to remain after the tasting experience.',
            franceTitle: 'CRAFTED IN FRANCE',
            france: 'The cocktail is crafted and bottled in France, near Avignon, using an infused artisanal French vodka. Its recipe seeks balance between the intensity of passion fruit, bright acidity and the rounded character of vanilla.',
            serviceTitle: 'TO SERVE, THEN COLLECT',
            service: 'Ready to taste, the composition is designed to preserve consistency of service. Once the cocktail has been enjoyed, the sculpture remains as an art object for a collection or interior.',
            articleHref: '/le-journal/pornstar-martini',
            articleLabel: 'READ THE STORY OF THE PORNSTAR MARTINI',
            fabricationLabel: 'DISCOVER THE MAKING',
            distillationLabel: 'EXPLORE DYANE MIXOLOGY',
            commissionLabel: 'COMMISSION A SCULPTURE',
        },
    },
    'dyane-no2-basil-smash': {
        fr: {
            definitionTitle: 'QU’EST-CE QUE DYANE NO.2 ?',
            definition: 'Dyane No.2 Basil Smash est une création de la Maison d’Art Liquide Dyane Paris. Gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main destinée à être conservée.',
            porcelainTitle: 'UNE SCULPTURE EN PORCELAINE',
            porcelain: 'La forme signature de Dyane transforme le flacon en présence sculpturale. La porcelaine met en valeur les volumes et les finitions peintes à la main, pour un objet qui prolonge l’expérience au-delà du cocktail.',
            franceTitle: 'UNE ÉLABORATION FRANÇAISE',
            france: 'La recette est élaborée et embouteillée en France. Sa composition : gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. La sculpture en porcelaine prolonge cette création de la Maison.',
            serviceTitle: 'À SERVIR, PUIS À COLLECTIONNER',
            service: 'La composition prête à déguster facilite un service régulier, sans dissocier le liquide de sa mise en scène. Après dégustation, la sculpture demeure et devient un objet à collectionner.',
            articleHref: '/le-journal/basil-smash',
            articleLabel: 'DÉCOUVRIR LE BASIL SMASH',
            fabricationLabel: 'DÉCOUVRIR LA FABRICATION',
            distillationLabel: 'EXPLORER LA MIXOLOGIE DYANE',
            commissionLabel: 'COMMANDER UNE SCULPTURE',
        },
        en: {
            definitionTitle: 'WHAT IS DYANE NO.2?',
            definition: 'Dyane No.2 Basil Smash is a creation by the Dyane Paris House of Liquid Art. Gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture designed to be kept.',
            porcelainTitle: 'A PORCELAIN SCULPTURE',
            porcelain: 'Dyane’s signature form turns the vessel into a sculptural presence. Porcelain reveals its volumes and hand-painted finishes, creating an object that extends the experience beyond the cocktail.',
            franceTitle: 'CRAFTED IN FRANCE',
            france: 'The recipe is crafted and bottled in France. Its composition: gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. The porcelain sculpture extends this creation by the House.',
            serviceTitle: 'TO SERVE, THEN COLLECT',
            service: 'The ready-to-taste composition supports a consistent service without separating the liquid from its presentation. After tasting, the sculpture remains as a collectible object.',
            articleHref: '/le-journal/basil-smash',
            articleLabel: 'DISCOVER THE BASIL SMASH',
            fabricationLabel: 'DISCOVER THE MAKING',
            distillationLabel: 'EXPLORE DYANE MIXOLOGY',
            commissionLabel: 'COMMISSION A SCULPTURE',
        },
    },
}

const productMediaAlts: Record<string, Record<'fr' | 'en', string[]>> = {
    'dyane-no1-pornstar-martini': {
        fr: [
            'Portrait de Dyane No.1, sculpture en porcelaine au drapé rouge',
            'Film du service et du rituel du cocktail Dyane Paris',
            'Sculpture en porcelaine rouge Dyane No.1 accompagnée d’un cocktail',
            'Dyane No.1 au drapé rouge dans un intérieur',
        ],
        en: [
            'Portrait of Dyane No.1, porcelain sculpture with red drapery',
            'Film of the Dyane Paris cocktail service and ritual',
            'Red-draped Dyane No.1 porcelain sculpture alongside a cocktail',
            'Dyane No.1 with red drapery in an interior',
        ],
    },
    'dyane-no2-basil-smash': {
        fr: [
            'Portrait de Dyane No.2, sculpture en porcelaine au drapé vert',
            'Film de Jérémy Bacquet au bar, mixologie Dyane Paris',
            'Sculpture en porcelaine Dyane No.2 et cocktail',
            'Dyane No.2 au drapé vert dans un intérieur',
        ],
        en: [
            'Portrait of Dyane No.2, porcelain sculpture with green drapery',
            'Film of Jérémy Bacquet at the bar, Dyane Paris mixology',
            'Dyane No.2 porcelain sculpture and cocktail',
            'Dyane No.2 with green drapery in an interior',
        ],
    },
}

const englishProductDetails: Record<string, Partial<ProductDetails>> = {
    'dyane-no1-pornstar-martini': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'ARTISANAL FRENCH VODKA INFUSED WITH MADAGASCAR BOURBON GOLD VANILLA PODS. PASSION FRUIT PURÉE LIFTED BY WILD RASPBERRY AND ORGANIC LEMON JUICE. BOTTLED IN FRANCE, IN THE AVIGNON REGION. MAIN WORK: 1.5 L.',
        plusInfos: 'VANILLA & PASSION FRUIT\nSUNLIT. SENSUAL. AN INTENSE INTERPRETATION OF PASSION FRUIT, INFUSED IN AN ARTISANAL FRENCH VODKA. BRIGHT ACIDITY MEETS MEASURED SWEETNESS, WHILE MADAGASCAR BOURBON GOLD VANILLA BRINGS A SILKEN ROUNDNESS.\nDENSE. LUMINOUS. A LIQUID WORK OF ART.\n—\nSENSORY PROFILE\nCOLOUR — AMBER GOLD\nNOSE — FRESH PASSION FRUIT, WARM VANILLA\nPALATE — PULPY, BALANCED\nFINISH — LONG, SUNLIT.',
        livraison: 'ESTIMATED DELIVERY WITHIN TWO WEEKS.\nCOMPLIMENTARY DELIVERY FROM €300.',
        disponibilite: 'MAIN WORK: 1.5 L.\nA 25 CL FORMAT IS PLANNED FOR THE FUTURE ONLINE SHOP. IT IS NOT YET AVAILABLE TO BUY ONLINE.\nCONTACT THE CONCIERGE FOR ENQUIRIES ABOUT THE WORK.',
    },
    'dyane-no2-basil-smash': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'Gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour',
        plusInfos: 'BASIL SMASH\nGin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour',
        livraison: 'ESTIMATED DELIVERY WITHIN TWO WEEKS.\nCOMPLIMENTARY DELIVERY FROM €300.',
        disponibilite: 'BATCH 1.\n25 PIECES PER BATCH.\nJOIN OUR NEWSLETTER TO HEAR ABOUT FUTURE BATCHES.',
    },
    'bouteille-signee-teokaykay': {
        sousTitre: 'PLACE A PRIVATE ORDER',
        description: 'DYANE PARIS AND TEO KAYKAY PRESENT A CONFIDENTIAL SERIES OF 25 WORKS. EACH PORCELAIN SCULPTURE IS HAND-PAINTED BY THE ARTIST AND HOLDS A DYANE SIGNATURE COCKTAIL, UNITING CONTEMPORARY ART WITH HIGH MIXOLOGY.',
        plusInfos: 'A CONFIDENTIAL SERIES OF 25 WORKS BY DYANE PARIS AND TEO KAYKAY. EACH PORCELAIN SCULPTURE IS HAND-PAINTED BY THE ARTIST, MAKING EVERY PIECE UNIQUE. INSIDE, A DYANE SIGNATURE COCKTAIL EXTENDS THE WORK THROUGH A PRECISE TASTING EXPERIENCE. ART IS DRUNK, THEN KEPT. CHOOSE BETWEEN PORNSTAR MARTINI AND BASIL SMASH.',
        livraison: 'MADE TO ORDER. ESTIMATED DELIVERY WITHIN THREE WEEKS.\nCOMPLIMENTARY DELIVERY FROM €300.',
        disponibilite: 'BATCH 1.\n25 PIECES PER BATCH.\nJOIN OUR NEWSLETTER TO HEAR ABOUT FUTURE BATCHES.',
    },
}

function mediaAlt(slug: string, index: number, locale: 'fr' | 'en', fallback: string) {
    return productMediaAlts[slug]?.[locale]?.[index] ?? `${fallback} — ${locale === 'en' ? 'Dyane Paris artwork' : 'œuvre Dyane Paris'}`
}

function ProductEditorial({ copy, locale, title }: { copy: ProductEditorialCopy; locale: string; title: string }) {
    return (
        <section className={layout.seoEditorial} aria-labelledby="product-definition-title">
            <h1 className={layout.editorialTitle}>{title}</h1>
            <div className={layout.seoGrid}>
                <article className={layout.editorialCard}>
                    <EditorialEmblem />
                    <h2 id="product-definition-title">{copy.definitionTitle}</h2>
                    <p>{copy.definition}</p>
                </article>
                <article className={layout.editorialCard}>
                    <EditorialEmblem />
                    <h2>{copy.porcelainTitle}</h2>
                    <p>{copy.porcelain}</p>
                </article>
                <article className={layout.editorialCard}>
                    <EditorialEmblem />
                    <h2>{copy.franceTitle}</h2>
                    <p>{copy.france}</p>
                </article>
                <article className={layout.editorialCard}>
                    <EditorialEmblem />
                    <h2>{copy.serviceTitle}</h2>
                    <p>{copy.service}</p>
                </article>
            </div>
            <nav className={layout.seoLinks} aria-label={locale === 'en' ? 'Learn more about this work' : 'En savoir plus sur cette œuvre'}>
                <Link href={localizedPath(locale, copy.articleHref)}>{copy.articleLabel}</Link>
                <Link href={localizedPath(locale, '/fabrication')}>{copy.fabricationLabel}</Link>
                <Link href={localizedPath(locale, '/distillation')}>{copy.distillationLabel}</Link>
                <Link href={localizedPath(locale, '/commission-a-sculpture')}>{copy.commissionLabel}</Link>
            </nav>
        </section>
    )
}

function ProductMedia({ media, alt, caption = videoCaption, priority = false, sizes, sourceMedia, onOpen, locale, natural = false }: {
    media: GalleryMedia
    alt: string
    caption?: string
    priority?: boolean
    sizes: string
    sourceMedia?: string
    onOpen?: () => void
    locale: 'fr' | 'en'
    natural?: boolean
}) {
    const dimensions = productMediaDimensions[media.src]
    const openLabel = `${locale === 'en' ? 'Open gallery' : 'Ouvrir la galerie'} — ${alt}`
    if (media.type === 'video') {
        return (
            <div className={`${layout.mediaSurface}${natural ? ` ${layout.naturalMedia}` : ''}`}>
                <video
                    className={layout.galleryVideo}
                    width={natural ? dimensions?.width : undefined}
                    height={natural ? dimensions?.height : undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={cloudinaryVideoPoster(media.src, 900)}
                    aria-label={alt}
                >
                    <source src={cloudinaryVideo(media.src, 900)} type="video/mp4" media={sourceMedia} />
                </video>
                {natural && <button type="button" className={layout.videoOpen} onClick={onOpen} aria-label={openLabel} aria-haspopup="dialog" />}
                <p className={layout.videoCaption}>{caption}</p>
            </div>
        )
    }

    return (
        <button type="button" className={`${layout.photoButton}${natural ? ` ${layout.naturalMedia}` : ''}`} onClick={onOpen} aria-label={openLabel} aria-haspopup="dialog">
            {natural && dimensions ? <EditorialImage
                className={layout.galleryImage}
                src={media.src}
                alt={alt}
                width={dimensions.width}
                height={dimensions.height}
                quality={85}
                priority={priority}
                sizes={sizes}
            /> : <Image
                className={layout.galleryImage}
                src={media.src}
                alt={alt}
                fill
                quality={85}
                priority={priority}
                sizes={sizes}
            />}
        </button>
    )
}

function MobileMediaCarousel({ media, nom, slug, locale, onOpen, natural = false }: { media: GalleryMedia[], nom: string, slug: string, locale: 'fr' | 'en', onOpen: (src: string) => void, natural?: boolean }) {
    const [current, setCurrent] = useState(media[0]?.type === 'video' ? 1 : 0)
    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
            <div className={`${layout.mobileFrame}${natural ? ` ${layout.naturalFrame}` : ''}`}>
                <ProductMedia
                    key={`${current}-${media[current].src}`}
                    media={media[current]}
                    natural={natural}
                    locale={locale}
                    alt={mediaAlt(slug, current, locale, nom)}
                    caption={locale === 'en' ? 'DYANE X JEREMY BACQUET, MIXOLOGY AS ART' : videoCaption}
                    priority={current === (media[0]?.type === 'video' ? 1 : 0)}
                    onOpen={() => onOpen(media[current].src)}
                    sizes="100vw"
                    sourceMedia="(max-width: 768px)"
                />
            </div>
            <button type="button" aria-label={locale === 'en' ? 'Previous media' : 'Média précédent'} onClick={() => setCurrent((current - 1 + media.length) % media.length)} style={{ position: 'absolute', top: '50%', left: '4px', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: '44px', height: '44px', color: '#111', background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer', padding: 0, fontSize: '22px' }}><ChevronIcon direction="left" /></button>
            <button type="button" aria-label={locale === 'en' ? 'Next media' : 'Média suivant'} onClick={() => setCurrent((current + 1) % media.length)} style={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: '44px', height: '44px', color: '#111', background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer', padding: 0, fontSize: '22px' }}><ChevronIcon direction="right" /></button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                {media.map((item, i) => (
                    <button type="button" key={`${item.type}-${item.src}`} aria-label={`${locale === 'en' ? 'Show media' : 'Afficher le média'} ${i + 1}`} onClick={() => setCurrent(i)} style={{ width: i === current ? '20px' : '6px', height: '2px', background: i === current ? '#111' : 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                ))}
            </div>
        </div>
    )
}

export default function ProduitClient({ params, publicOffer = null }: { params: { slug: string }; publicOffer?: PublicOffer | null }) {
    const { slug } = params
    const baseProduit = produits[slug]
    const directLayout = slug === 'dyane-no1-pornstar-martini' || slug === 'dyane-no2-basil-smash'
    const pathname = usePathname()
    const locale: 'fr' | 'en' = pathname.startsWith('/en') ? 'en' : 'fr'
    const produit = baseProduit && locale === 'en'
        ? { ...baseProduit, ...englishProductDetails[slug] }
        : baseProduit
    const heroRef = useRef<HTMLElement>(null)
    const productRef = useRef<HTMLDivElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)
    const [infoFitsViewport, setInfoFitsViewport] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    useEffect(() => {
        const info = infoRef.current
        if (!directLayout || !info) return

        // Keep the information in view while browsing the gallery, but let a
        // long, expanded accordion scroll normally instead of trapping content.
        const updateInfoLayout = () => {
            const headerHeight = Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
            ) || 112
            setInfoFitsViewport(info.getBoundingClientRect().height <= window.innerHeight - headerHeight + 1)
        }
        const observer = new ResizeObserver(updateInfoLayout)
        observer.observe(info)
        updateInfoLayout()
        window.addEventListener('resize', updateInfoLayout)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', updateInfoLayout)
        }
    }, [directLayout])

    const revealProduct = useCallback(() => {
        const product = productRef.current
        if (!product) return

        const headerHeight = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        ) || 112

        window.scrollTo({
            top: Math.max(0, product.offsetTop - headerHeight),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
    }, [])

    useEffect(() => {
        if (directLayout) return
        const hero = heroRef.current
        if (!hero) return

        let touchStartY = 0
        let transitionLocked = false
        let unlockTimer = 0

        const beginReveal = () => {
            if (transitionLocked) return
            transitionLocked = true
            revealProduct()
            unlockTimer = window.setTimeout(() => {
                transitionLocked = false
            }, 850)
        }

        const heroIsActive = () => {
            const bounds = hero.getBoundingClientRect()
            return bounds.top > -8 && bounds.bottom > window.innerHeight * 0.35
        }

        const onWheel = (event: WheelEvent) => {
            if (event.deltaY <= 0 || !heroIsActive()) return
            event.preventDefault()
            beginReveal()
        }

        const onTouchStart = (event: TouchEvent) => {
            touchStartY = event.touches[0]?.clientY ?? 0
        }

        const onTouchMove = (event: TouchEvent) => {
            const currentY = event.touches[0]?.clientY ?? touchStartY
            if (touchStartY - currentY < 34 || !heroIsActive()) return
            event.preventDefault()
            touchStartY = currentY
            beginReveal()
        }

        hero.addEventListener('wheel', onWheel, { passive: false })
        hero.addEventListener('touchstart', onTouchStart, { passive: true })
        hero.addEventListener('touchmove', onTouchMove, { passive: false })

        return () => {
            window.clearTimeout(unlockTimer)
            hero.removeEventListener('wheel', onWheel)
            hero.removeEventListener('touchstart', onTouchStart)
            hero.removeEventListener('touchmove', onTouchMove)
        }
    }, [directLayout, revealProduct])

    if (!produit) return (
        <main style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'var(--font-editorial), serif' }}>
            <p>{locale === 'en' ? 'Product not found' : 'Produit non trouvé'}</p>
            <Link href={localizedPath(locale, '/oeuvres')}><ArrowLeftIcon /> {locale === 'en' ? 'Back to the works' : 'Retour aux œuvres'}</Link>
        </main>
    )

    const heroImg = heroImages[slug]
    const productVideo = productVideos[slug]
    const galleryMedia: GalleryMedia[] = [
        ...produit.images.slice(0, 1).map((src) => ({ type: 'image' as const, src })),
        ...(productVideo ? [{ type: 'video' as const, src: productVideo }] : []),
        ...produit.images.slice(1).map((src) => ({ type: 'image' as const, src })),
    ]
    const openMedia = (src: string) => setLightboxIndex(directLayout ? galleryMedia.findIndex(item => item.src === src) : produit.images.indexOf(src))
    const fullscreenMedia = galleryMedia.map((item, index) => ({ ...item, alt: mediaAlt(slug, index, locale, produit.nom) }))
    const photos = produit.images.map(src => ({ src, alt: mediaAlt(slug, galleryMedia.findIndex(media => media.src === src), locale, produit.nom) }))
    const editorialCopy = productEditorial[slug]?.[locale]

    return (
        <>
            {!directLayout && <style>{`
                @media (max-width: 768px) {
                    .produit-hero { height: 40vh !important; }
                    .produit-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 24px 20px !important; }
                    .produit-galerie-desktop { display: none !important; }
                    .produit-galerie-mobile { display: block !important; }
                    .produit-sticky { position: static !important; }
                }
                @media (min-width: 769px) {
                    .produit-galerie-desktop { display: block !important; }
                    .produit-galerie-mobile { display: none !important; }
                }
                .produit-scroll-prompt {
                    position: absolute;
                    right: 50%;
                    bottom: 22px;
                    z-index: 2;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                    color: inherit;
                    font: inherit;
                    font-size: 18px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    background: transparent;
                    border: 0;
                    cursor: pointer;
                    transform: translateX(50%);
                }
                .produit-scroll-prompt::after {
                    width: 1px;
                    height: 30px;
                    content: '';
                    background: currentColor;
                    transform-origin: top;
                    animation: produit-scroll-line 1.8s ease-in-out infinite;
                }
                @keyframes produit-scroll-line {
                    0%, 100% { transform: scaleY(0.35); opacity: 0.45; }
                    50% { transform: scaleY(1); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .produit-scroll-prompt::after { animation: none; }
                }
            `}</style>}
            <div className={`theme-page${directLayout ? ` ${layout.page}` : ''}`} style={{ background: 'transparent' }}>

                {/* Hero */}
                {heroImg && !directLayout && (
                    <section ref={heroRef} data-page-hero data-header-foreground="white" className="produit-hero" style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden', color: '#fff' }}>
                        <Image src={heroImg} alt={`${produit.nom} — cocktail Dyane Paris en sculpture de porcelaine`} fill priority quality={85} sizes="100vw" style={{ objectFit: 'cover' }} />
                        <button className="produit-scroll-prompt" type="button" onClick={revealProduct}>
                            {locale === 'en' ? 'View the piece' : 'Voir l’œuvre'}
                        </button>
                    </section>
                )}

                <div ref={productRef} className={`produit-grid${directLayout ? ` ${layout.grid}` : ''}`} style={directLayout ? undefined : { maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                    {directLayout ? (
                        <ProductGallery items={fullscreenMedia} name={produit.nom} locale={locale}
                            videoCaption={locale === 'en' ? 'DYANE X JEREMY BACQUET, MIXOLOGY AS ART' : videoCaption} />
                    ) : <>
                    {/* Galerie desktop */}
                    <div className={`produit-galerie-desktop${directLayout ? ` ${layout.gallery}` : ''}`}>
                        {galleryMedia.map((media, i) => (
                            <div key={`${media.type}-${media.src}`} className={directLayout ? `${layout.imageFrame} ${layout.naturalFrame}` : undefined} style={directLayout ? undefined : { position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '8px', overflow: 'hidden' }}>
                                <ProductMedia
                                    media={media}
                                    natural={directLayout}
                                    locale={locale}
                                    alt={mediaAlt(slug, i, locale, produit.nom)}
                                    caption={locale === 'en' ? 'DYANE X JEREMY BACQUET, MIXOLOGY AS ART' : videoCaption}
                                    priority={directLayout && i === 0}
                                    onOpen={() => openMedia(media.src)}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    sourceMedia="(min-width: 769px)"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Carousel mobile */}
                    <div className={`produit-galerie-mobile${directLayout ? ` ${layout.mobileGallery}` : ''}`} style={directLayout ? undefined : { display: 'none' }}>
                        <MobileMediaCarousel media={galleryMedia} nom={produit.nom} slug={slug} locale={locale} onOpen={openMedia} natural={directLayout} />
                    </div>

                    </>}

                    {/* Infos droite */}
                    <div ref={infoRef} className={`produit-sticky${directLayout ? ` ${layout.information}` : ''}`} data-sticky={directLayout ? infoFitsViewport : undefined} style={directLayout ? undefined : { position: 'sticky', top: '120px' }}>
                        <div>
                        <div className={directLayout ? layout.productSummary : layout.productIntroduction}>
                        {!directLayout && <EditorialEmblem />}
                        {!directLayout && <h1 style={{ ...font, fontSize: '14px', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>{produit.nom}</h1>}
                        {!directLayout && <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>{produit.sousTitre}</p>}
                        <p className={directLayout ? layout.productDescription : undefined} style={directLayout ? undefined : { ...lora, fontSize: '11px', letterSpacing: '0.12em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase', marginBottom: '24px' }}>{produit.description}</p>
                        </div>
                        {directLayout && <Link className={layout.secondaryOrder} href={localizedPath(locale, '/commission-a-sculpture')}>{locale === 'en' ? 'COMMISSION A SCULPTURE' : 'COMMANDER UNE SCULPTURE'}</Link>}

                        {publicOffer && (
                            <div style={{ ...font, fontSize: '12px', marginBottom: '20px' }}>
                                <p>{new Intl.NumberFormat(locale, { style: 'currency', currency: publicOffer.priceCurrency }).format(Number(publicOffer.price))}</p>
                                <p>{availabilityLabel(publicOffer, locale)}</p>
                                <a href={publicOffer.url}>{locale === 'en' ? 'VIEW ONLINE SHOP' : 'VOIR LA BOUTIQUE EN LIGNE'}</a>
                            </div>
                        )}

                        {produit.formats && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ ...font, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>FORMAT</p>
                                <select style={{ ...lora, width: '100%', padding: '12px 16px', border: '1px solid var(--page-border)', background: 'var(--background-house)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none' }}>
                                    {produit.formats.map(f => <option key={f}>{f}</option>)}
                                </select>
                            </div>
                        )}

                        <Link href={localizedPath(locale, '/contact')} style={{ display: 'block', background: '#000', color: '#fff', textAlign: 'center', padding: '18px 24px', ...font, fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '40px' }}>
                            {locale === 'en' ? 'PLACE A PRIVATE ORDER' : 'PASSER UNE COMMANDE PRIVÉE'}
                        </Link>

                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>{locale === 'en' ? 'ESTIMATED DELIVERY:' : 'DATE ESTIMÉE DE LIVRAISON :'}</p>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px' }}>{locale === 'en' ? 'WITHIN TWO WEEKS' : 'SOUS DEUX SEMAINES'}</p>

                        <Accordion
                            titre={locale === 'en' ? 'TASTING NOTES' : 'NOTES DE DÉGUSTATION'}
                            contenu={produit.plusInfos}
                            semanticHeading
                        />
                        <Accordion titre={locale === 'en' ? 'DELIVERY' : 'LIVRAISON'} contenu={produit.livraison} />
                        <Accordion titre={locale === 'en' ? 'AVAILABILITY' : 'DISPONIBILITÉ EN BOUTIQUE'} contenu={produit.disponibilite} />
                        <Accordion titre={locale === 'en' ? 'CONTACT US' : 'NOUS CONTACTER'} contenu={locale === 'en' ? 'JOIN THE WAITING LIST\n\nE-MAIL: CONTACT@DYANEPARIS.COM\nINSTAGRAM: @DYANEPARIS_' : 'REJOIGNEZ LA LISTE D\'ATTENTE\n\nE-MAIL : CONTACT@DYANEPARIS.COM\nINSTAGRAM : @DYANEPARIS_'} />
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }} />
                        </div>
                    </div>
                </div>
                {lightboxIndex !== null && lightboxIndex >= 0 ? <ProductLightbox media={directLayout ? fullscreenMedia : undefined} photos={directLayout ? undefined : photos} initialIndex={lightboxIndex} locale={locale} onClose={() => setLightboxIndex(null)} /> : null}
                {directLayout ? (
                    <aside className={layout.commissionInvitation} aria-labelledby="sculpture-invitation-title">
                        <EditorialEmblem />
                        <h2 id="sculpture-invitation-title">{locale === 'en' ? 'A WORK IN YOUR IMAGE' : 'UNE ŒUVRE À VOTRE IMAGE'}</h2>
                        <p>{locale === 'en'
                            ? 'Discover the individual creations and sculptures commissioned from the House of Dyane Paris.'
                            : 'Découvrez les créations particulières et les sculptures réalisées sur commande par la Maison Dyane Paris.'}</p>
                        <Link href={localizedPath(locale, '/commission-a-sculpture')}>
                            {locale === 'en' ? 'DISCOVER SCULPTURE COMMISSIONS' : 'DÉCOUVRIR LES COMMANDES DE SCULPTURES'}
                        </Link>
                    </aside>
                ) : null}
                {editorialCopy ? <ProductEditorial copy={editorialCopy} locale={locale} title={produit.nom} /> : null}
            </div>
        </>
    )
}
