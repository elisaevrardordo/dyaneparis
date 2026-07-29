export type Product = {
    name: string
    slug: string
    subtitle: string
    image: string
    alt: string
}

export const products: Product[] = [
    {
        name: 'Dyane No.1 — Pornstar Martini',
        slug: 'dyane-paris-pornstar-martini-70-cl',
        subtitle: 'Chapitre I',
        image: '/dyane-no1.webp',
        alt: 'Sculpture-bouteille Dyane No.1 en porcelaine contenant un cocktail Pornstar Martini',
    },
    {
        name: 'Dyane No.2 — Moscow Mule',
        slug: 'dyane-no2-moscow-mule',
        subtitle: 'Chapitre II',
        image: '/dyane-no2.webp',
        alt: 'Sculpture-bouteille Dyane No.2 en porcelaine contenant un cocktail Moscow Mule',
    },
    {
        name: 'Teo for Dyane Paris',
        slug: 'bouteille-signee-teokaykay',
        subtitle: 'Edition Limitée',
        image: '/dyane-teo.webp',
        alt: 'Bouteille-sculpture Teo for Dyane Paris peinte à la main en édition limitée',
    },
]
