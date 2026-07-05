import './globals.css'
import { getLocale } from 'next-intl/server'
import { fontVariables } from './fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dyaneparis.com'),
  title: {
    default: "Dyane Paris | Maison Française d'Art Liquide",
    template: '%s | Dyane Paris',
  },
  description:
    "Dyane Paris est une Maison française d'Art Liquide créant des cocktails de luxe dans des flacons sculpturaux en porcelaine peints à la main. Artisanat français, édition limitée.",
  applicationName: 'Dyane Paris',
  keywords: [
    'Dyane Paris',
    "Art Liquide",
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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Dyane Paris — Maison Française d'Art Liquide",
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
    images: ['/og-image.jpg'],
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
        url: 'https://www.dyaneparis.com/logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://www.dyaneparis.com/logo.png',
      sameAs: ['https://www.instagram.com/dyaneparis_/'],
    },
    {
      '@type': 'Brand',
      name: 'Dyane Paris',
      slogan: "Maison Française d'Art Liquide",
      logo: 'https://www.dyaneparis.com/logo.png',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.dyaneparis.com/#website',
      url: 'https://www.dyaneparis.com',
      name: 'Dyane Paris',
      publisher: { '@id': 'https://www.dyaneparis.com/#organization' },
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
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
