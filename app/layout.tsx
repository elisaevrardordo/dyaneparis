import './globals.css'
import { getLocale } from 'next-intl/server'
import { fontVariables } from './fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dyane Paris — Maison d\'Art Liquide',
    template: '%s | Dyane Paris',
  },
  description: 'Cocktails d\'exception embouteillés dans des œuvres d\'art en porcelaine peintes à la main. Désormais, l\'art se boit.',
  metadataBase: new URL('https://www.dyaneparis.com'),
  openGraph: {
    title: 'Dyane Paris — Maison d\'Art Liquide',
    description: 'Cocktails d\'exception embouteillés dans des œuvres d\'art en porcelaine peintes à la main.',
    url: 'https://www.dyaneparis.com',
    siteName: 'Dyane Paris',
    images: [
      {
        url: '/og-image.jpg', // place une image 1200x630 dans /public
        width: 1200,
        height: 630,
        alt: 'Dyane Paris — Maison d\'Art Liquide',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dyane Paris — Maison d\'Art Liquide',
    description: 'Cocktails d\'exception embouteillés dans des œuvres d\'art en porcelaine peintes à la main.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dyane Paris',
  alternateName: 'Dyane Paris — Maison d\'Art Liquide',
  url: 'https://www.dyaneparis.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.dyaneparis.com/logo.png', // ton logo dans /public/logo.png
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://www.instagram.com/dyaneparis_/',
  ],
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
