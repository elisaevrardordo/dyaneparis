import './globals.css'
import { getLocale } from 'next-intl/server'
import { fontVariables } from './fonts'
import type { Metadata, Viewport } from 'next'
import {
  absoluteUrl,
  imageObject,
  seoImages,
  serializeJsonLd,
  SITE_URL,
} from '@/lib/seo'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const OG_IMAGE = absoluteUrl(seoImages.home.url)

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dyane Paris | Maison Française d'Art Liquide",
    template: '%s | Dyane Paris',
  },
  description:
    "Dyane Paris est une Maison française d'Art Liquide créant des cocktails de luxe dans des flacons sculpturaux en porcelaine peints à la main. Artisanat français, édition limitée.",
  applicationName: 'Dyane Paris',
  keywords: [
    'Dyane Paris',
    'Art Liquide',
    'Luxury Cocktail',
    'Luxury Bottled Cocktail',
    'French Luxury House',
    'Cocktail Maison',
    'Porcelain Bottle',
    'Hand Painted Bottle',
    'French Craftsmanship',
    'Ready to Drink Cocktail',
  ],
  authors: [{ name: 'Dyane Paris', url: 'https://www.dyaneparis.com' }],
  creator: 'Dyane Paris',
  publisher: 'Dyane Paris',
  category: 'Luxury',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "Dyane Paris | Maison Française d'Art Liquide",
    description:
      "Cocktails de luxe dans des flacons sculpturaux en porcelaine peints à la main. L'art se boit.",
    url: 'https://www.dyaneparis.com',
    siteName: 'Dyane Paris',
    images: [
      {
        url: OG_IMAGE,
        width: seoImages.home.width,
        height: seoImages.home.height,
        alt: seoImages.home.alt,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dyane Paris | Maison Française d'Art Liquide",
    description:
      'Luxury cocktails presented in hand-painted porcelain sculptures, crafted in France.',
    images: [{ url: OG_IMAGE, alt: seoImages.home.alt }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.dyaneparis.com/#organization',
      name: 'Dyane Paris',
      alternateName: "Maison d'Art Liquide",
      url: 'https://www.dyaneparis.com',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        contentUrl: `${SITE_URL}/logo.png`,
        width: 1554,
        height: 1389,
        caption: 'Logo Dyane Paris',
      },
      image: imageObject(seoImages.home, true),
      description:
        "Maison française d'Art Liquide créant des cocktails prêts à déguster dans des sculptures en porcelaine peintes à la main.",
      sameAs: ['https://www.instagram.com/dyaneparis_/'],
    },
    {
      '@type': 'Brand',
      name: 'Dyane Paris',
      slogan: "Maison Française d'Art Liquide",
      logo: `${SITE_URL}/logo.png`,
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.dyaneparis.com/#website',
      url: 'https://www.dyaneparis.com',
      name: 'Dyane Paris',
      publisher: {
        '@id': 'https://www.dyaneparis.com/#organization',
      },
      image: imageObject(seoImages.home, true),
      inLanguage: ['fr', 'en'],
    },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(jsonLd),
          }}
        />
      </head>

      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
