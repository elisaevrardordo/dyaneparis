import { officialImageUrl } from '@/content/officialImages'

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
        slug: 'dyane-no1-pornstar-martini',
        subtitle: 'Chapitre I',
        image: officialImageUrl('https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/dyane-paris-sculpture-argent-voile-rouge-portrait.png'),
        alt: 'Sculpture-bouteille Dyane No.1 en porcelaine contenant un cocktail Pornstar Martini',
    },
    {
        name: 'Dyane No.2 — Basil Smash',
        slug: 'dyane-no2-basil-smash',
        subtitle: 'Chapitre II',
        image: officialImageUrl('https://res.cloudinary.com/dazhkrimv/image/upload/v1788365385/dyane-paris-sculpture-argent-voile-vert-portrait.png'),
        alt: 'Sculpture-bouteille Dyane No.2 en porcelaine contenant un cocktail Basil Smash',
    },
    {
        name: 'Teo for Dyane Paris',
        slug: 'bouteille-signee-teokaykay',
        subtitle: 'Edition Limitée',
        image: officialImageUrl('/dyane-teo.webp'),
        alt: 'Bouteille-sculpture Teo for Dyane Paris peinte à la main en édition limitée',
    },
]
