export type HomeLocale = 'fr' | 'en'
export type HeaderTheme = 'light' | 'dark'

export type HomeImage = {
  src: string
  alt: string
  objectPosition: string
}

type HomeContent = {
  hero: {
    enabled: boolean
    theme: HeaderTheme
    eyebrow: string
    title: string
    cta: string
    href: string
    poster: string
    desktopVideo: string
    mobileVideo: string
  }
  products: Array<HomeImage & {
    title: string
    subtitle: string
    cta: string
    href: string
    theme: HeaderTheme
  }>
  customization: {
    eyebrow: string
    title: string
    text: string
    cta: string
    href: string
    fallback: HomeImage
  }
  presences: {
    eyebrow: string
    title: string
    items: Array<HomeImage & {
      place: string
      location: string
      kind: string
      href?: string
    }>
  }
  editorial: Array<HomeImage & { caption?: string }>
  film: {
    theme: HeaderTheme
    title: string
    poster: string
    desktopVideo: string
    mobileVideo: string
  }
}

const sharedMedia = {
  hero: {
    poster: '/home/hero/hero-dyane-poster.webp',
    desktopVideo: '/home/hero/hero-dyane-desktop.mp4',
    mobileVideo: '/home/hero/hero-dyane-mobile.mp4',
  },
  products: ['/home/products/dyane-no1.webp', '/home/products/dyane-no2.webp'],
  presence: [
    '/home/presences/presence-paris.webp',
    '/home/presences/presence-mediterranee.webp',
    '/home/presences/presence-maison.webp',
  ],
  editorial: [
    '/home/editorial/dyane-full-01.webp',
    '/home/editorial/dyane-full-02.webp',
  ],
  film: {
    poster: '/home/film/dyane-film-poster.webp',
    desktopVideo: '/home/film/dyane-film-desktop.mp4',
    mobileVideo: '/home/film/dyane-film-mobile.mp4',
  },
} as const

export const homeContent: Record<HomeLocale, HomeContent> = {
  fr: {
    hero: {
      enabled: true,
      theme: 'light',
      eyebrow: 'DYANE PARIS',
      title: 'MAISON D’ART LIQUIDE',
      cta: 'DÉCOUVRIR LA MAISON',
      href: '/la-maison',
      ...sharedMedia.hero,
    },
    products: [
      {
        title: 'DYANE No.1',
        subtitle: 'PORNSTAR MARTINI',
        cta: 'DÉCOUVRIR',
        href: '/oeuvres/dyane-paris-pornstar-martini-70-cl',
        src: sharedMedia.products[0],
        alt: 'Dyane No.1, flacon sculptural en porcelaine pour cocktail Pornstar Martini',
        objectPosition: '50% 50%',
        theme: 'dark',
      },
      {
        title: 'DYANE No.2',
        subtitle: 'MOSCOW MULE',
        cta: 'DÉCOUVRIR',
        href: '/oeuvres/dyane-no2-moscow-mule',
        src: sharedMedia.products[1],
        alt: 'Dyane No.2, flacon sculptural en porcelaine pour cocktail Moscow Mule',
        objectPosition: '50% 50%',
        theme: 'dark',
      },
    ],
    customization: {
      eyebrow: 'L’ATELIER DYANE',
      title: 'PERSONNALISATION ARTISTIQUE',
      text: 'Une œuvre unique, imaginée pour vous et peinte à la main par un artiste.',
      cta: 'CRÉER VOTRE DYANE',
      href: '/configurateur',
      fallback: {
        src: '/home/customization/customization-fallback.webp',
        alt: 'Étude de la sculpture Dyane destinée à la personnalisation artistique',
        objectPosition: '50% 48%',
      },
    },
    presences: {
      eyebrow: 'JOURNAL DE LA MAISON',
      title: 'NOS DERNIÈRES PRÉSENCES',
      items: [
        {
          place: 'PARIS',
          location: 'RITZ PARIS',
          kind: 'PRÉSENCE',
          href: '/le-journal/ritz-paris-fashion-week',
          src: sharedMedia.presence[0],
          alt: 'Présence Dyane Paris dans un lieu d’exception à Paris',
          objectPosition: '50% 50%',
        },
        {
          place: 'CÔTE D’AZUR',
          location: 'ZANNIER ÎLE DE BENDOR',
          kind: 'À VENIR',
          src: sharedMedia.presence[1],
          alt: 'Atmosphère méditerranéenne évoquant une future présence Dyane Paris',
          objectPosition: '50% 50%',
        },
        {
          place: 'VAUCLUSE',
          location: 'LA MATIÈRE',
          kind: 'SAVOIR-FAIRE',
          href: '/distillation',
          src: sharedMedia.presence[2],
          alt: 'Savoir-faire de la Maison Dyane Paris autour de la distillation',
          objectPosition: '50% 50%',
        },
      ],
    },
    editorial: [
      {
        src: sharedMedia.editorial[0],
        alt: 'Sculpture Dyane Paris en pied, drapée de rouge profond',
        objectPosition: '50% 50%',
        caption: 'DYANE — ÉTUDE I',
      },
      {
        src: sharedMedia.editorial[1],
        alt: 'Sculpture Dyane Paris en pied, drapée de bleu nocturne',
        objectPosition: '50% 50%',
        caption: 'DYANE — ÉTUDE II',
      },
    ],
    film: {
      theme: 'light',
      title: 'L’ART SE BOIT.',
      ...sharedMedia.film,
    },
  },
  en: {
    hero: {
      enabled: true,
      theme: 'light',
      eyebrow: 'DYANE PARIS',
      title: 'HOUSE OF LIQUID ART',
      cta: 'DISCOVER THE HOUSE',
      href: '/la-maison',
      ...sharedMedia.hero,
    },
    products: [
      {
        title: 'DYANE No.1',
        subtitle: 'PORNSTAR MARTINI',
        cta: 'DISCOVER',
        href: '/oeuvres/dyane-paris-pornstar-martini-70-cl',
        src: sharedMedia.products[0],
        alt: 'Dyane No.1 sculptural porcelain bottle for a Pornstar Martini cocktail',
        objectPosition: '50% 50%',
        theme: 'dark',
      },
      {
        title: 'DYANE No.2',
        subtitle: 'MOSCOW MULE',
        cta: 'DISCOVER',
        href: '/oeuvres/dyane-no2-moscow-mule',
        src: sharedMedia.products[1],
        alt: 'Dyane No.2 sculptural porcelain bottle for a Moscow Mule cocktail',
        objectPosition: '50% 50%',
        theme: 'dark',
      },
    ],
    customization: {
      eyebrow: 'THE DYANE ATELIER',
      title: 'ARTISTIC CUSTOMIZATION',
      text: 'A unique work, imagined for you and painted by hand by an artist.',
      cta: 'CREATE YOUR DYANE',
      href: '/configurateur',
      fallback: {
        src: '/home/customization/customization-fallback.webp',
        alt: 'Study of the Dyane sculpture for artistic customization',
        objectPosition: '50% 48%',
      },
    },
    presences: {
      eyebrow: 'THE HOUSE JOURNAL',
      title: 'OUR LATEST APPEARANCES',
      items: [
        {
          place: 'PARIS',
          location: 'RITZ PARIS',
          kind: 'APPEARANCE',
          href: '/le-journal/ritz-paris-fashion-week',
          src: sharedMedia.presence[0],
          alt: 'Dyane Paris appearance at an exceptional venue in Paris',
          objectPosition: '50% 50%',
        },
        {
          place: 'FRENCH RIVIERA',
          location: 'ZANNIER ÎLE DE BENDOR',
          kind: 'FORTHCOMING',
          src: sharedMedia.presence[1],
          alt: 'Mediterranean atmosphere evoking a future Dyane Paris appearance',
          objectPosition: '50% 50%',
        },
        {
          place: 'VAUCLUSE',
          location: 'THE MATERIAL',
          kind: 'CRAFT',
          href: '/distillation',
          src: sharedMedia.presence[2],
          alt: 'Dyane Paris craftsmanship and the art of distillation',
          objectPosition: '50% 50%',
        },
      ],
    },
    editorial: [
      {
        src: sharedMedia.editorial[0],
        alt: 'Full-length Dyane Paris sculpture draped in deep red',
        objectPosition: '50% 50%',
        caption: 'DYANE — STUDY I',
      },
      {
        src: sharedMedia.editorial[1],
        alt: 'Full-length Dyane Paris sculpture draped in nocturnal blue',
        objectPosition: '50% 50%',
        caption: 'DYANE — STUDY II',
      },
    ],
    film: {
      theme: 'light',
      title: 'ART, NOW DRINKABLE.',
      ...sharedMedia.film,
    },
  },
}

export function getHomeContent(locale: string) {
  return homeContent[locale === 'en' ? 'en' : 'fr']
}
