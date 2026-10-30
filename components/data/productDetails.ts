import { officialImageUrl } from '@/content/officialImages'

export const heroImages: Record<string, string> = {
    'dyane-no1-pornstar-martini': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/dyane-paris-sculpture-porcelaine-voile-rouge-interieur.png',
    'dyane-no2-basil-smash': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/dyane-paris-sculpture-porcelaine-voile-vert-interieur.png',
    'bouteille-signee-teokaykay': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg',
}

export const productVideos: Record<string, string> = {
    'dyane-no1-pornstar-martini': 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708147/dyane-paris-service-cocktail-rituel.mp4',
    'dyane-no2-basil-smash': 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708474/dyane-paris-jeremy-bacquet-mixologie-bar.mp4',
}

export type ProductDetails = {
    nom: string
    sousTitre: string
    description: string
    images: string[]
    plusInfos: string
    livraison: string
    disponibilite: string
    formats?: string[]
}

export const produits: Record<string, ProductDetails> = {
    'dyane-no1-pornstar-martini': {
        nom: 'DYANE NO.1 — PORNSTAR MARTINI',
        sousTitre: 'PASSER UNE COMMANDE PRIVÉE',
        description: 'VODKA ARTISANALE FRANÇAISE, INFUSÉE AUX GOUSSES DE VANILLE MADAGASCAR BOURBON GOLD. PURÉE DE FRUIT DE LA PASSION, SUBLIMÉE PAR UNE TOUCHE DE FRAMBOISE SAUVAGE. JUS DE CITRON BIOLOGIQUE. EMBOUTEILLÉE EN FRANCE, DANS LA RÉGION D\'AVIGNON. ŒUVRE PRINCIPALE : 1,5 L.',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-rouge.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499964/dyane-paris-sculpture-porcelaine-rouge-cocktail.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/dyane-paris-sculpture-porcelaine-voile-rouge-interieur.png',
        ],
        plusInfos: 'VANILLE & PASSION\nSOLAIRE. CHARNELLE. UNE INTERPRÉTATION INTENSE DU FRUIT DE LA PASSION, INFUSÉE DANS UNE VODKA ARTISANALE FRANÇAISE. L\'ACIDITÉ SE TEND, LA DOUCEUR S\'ÉQUILIBRE. LA VANILLE MADAGASCAR BOURBON GOLD APPORTE UNE RONDEUR SOYEUSE.\nDENSE. LUMINEUSE. UNE ŒUVRE LIQUIDE.\n—\nPROFIL SENSORIEL\nROBE — OR AMBRÉ\nNEZ — PASSION FRAÎCHE, VANILLE CHAUDE\nBOUCHE — PULPEUSE, ÉQUILIBRÉE\nFINALE — LONGUE, SOLAIRE.',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'ŒUVRE PRINCIPALE : 1,5 L.\nUN FORMAT 25 CL EST PRÉVU POUR LA FUTURE BOUTIQUE. IL N’EST PAS ENCORE PROPOSÉ À L’ACHAT EN LIGNE.\nCONTACTEZ LA CONCIERGERIE POUR TOUTE DEMANDE CONCERNANT L’ŒUVRE.',
    },
    'dyane-no2-basil-smash': {
        nom: 'DYANE NO.2 — BASIL SMASH',
        sousTitre: 'PASSER UNE COMMANDE PRIVÉE',
        description: 'Gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-vert.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1792700959/dyane-paris-dyaneno2-statue-luxe-cocktail-prestige.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/dyane-paris-sculpture-porcelaine-voile-vert-interieur.png',
        ],
        plusInfos: 'BASIL SMASH\nGin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'bouteille-signee-teokaykay': {
        nom: 'TEO FOR DYANE PARIS',
        sousTitre: 'PASSER UNE COMMANDE PRIVÉE',
        description: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE.',
        images: [
            '/dyane-teo.webp',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
        ],
        plusInfos: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE. À L\'INTÉRIEUR, LE COCKTAIL PROLONGE L\'ŒUVRE : DES INGRÉDIENTS NOBLES POUR UNE DÉGUSTATION INTENSE ET PRÉCISE. L\'ART SE BOIT, PUIS SE GARDE. CONTIENT UN COCKTAIL SIGNATURE DYANE : PORNSTAR MARTINI OU BASIL SMASH AU CHOIX. UNE PIÈCE RARE, À BOIRE OU À COLLECTIONNER.',
        livraison: 'PRODUCTION SUR COMMANDE. LIVRAISON ESTIMÉE SOUS TROIS SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
        formats: ['PORNSTAR MARTINI', 'BASIL SMASH'],
    },
}

export const productMediaDimensions: Record<string, { width: number; height: number }> = {
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499964/dyane-paris-sculpture-porcelaine-rouge-cocktail.jpg': { width: 3228, height: 5176 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1792700959/dyane-paris-dyaneno2-statue-luxe-cocktail-prestige.png': { width: 992, height: 1585 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/dyane-paris-sculpture-porcelaine-voile-rouge-interieur.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/dyane-paris-sculpture-porcelaine-voile-vert-interieur.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708147/dyane-paris-service-cocktail-rituel.mp4': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708474/dyane-paris-jeremy-bacquet-mixologie-bar.mp4': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-rouge.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788442898/dyane-paris-sculpture-verte-lumiere-ambree.png': { width: 514, height: 640 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1785936020/dyane-paris-cocktail-dyaneno2-glace-detail.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706612/dyane-paris-cocktail-signature-dyaneno1.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1791496575/dyane-paris-sculpture-porcelaine-voile-vert.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1788643897/dyane-paris-sculpture-rouge-lumiere-chaude.png': { width: 1080, height: 1350 },
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1781703609/Design_sans_titre_68_azlqdk.png': { width: 1080, height: 1920 },
}

// Progressive aliases use the exact original bytes and dimensions, preserving
// image framing while sharing one official URL across HTML, schema and sitemap.
for (const [slug, source] of Object.entries(heroImages)) {
    heroImages[slug] = officialImageUrl(source)
}
for (const product of Object.values(produits)) {
    product.images = product.images.map(officialImageUrl)
}
for (const [source, dimensions] of Object.entries(productMediaDimensions)) {
    productMediaDimensions[officialImageUrl(source)] = dimensions
}
