import '../globals.css'
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import AgeGate from '@/components/AgeGate'
import SiteThemeShell from '@/components/layout/SiteThemeShell'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { fontVariables } from '../fonts'
import {
    buildPageMetadata,
    imageObject,
    ORGANIZATION_ID,
    seoImages,
    serializeJsonLd,
    SITE_URL,
    WEBSITE_ID,
} from '@/lib/seo'

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
    colorScheme: 'light',
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': ['Organization', 'Brand'],
            '@id': ORGANIZATION_ID,
            name: 'Dyane Paris',
            legalName: 'Dyane Paris',
            alternateName: "Maison d'Art Liquide",
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
                contentUrl: `${SITE_URL}/logo.png`,
                width: 1554,
                height: 1389,
                caption: 'Logo Dyane Paris',
            },
            image: imageObject(seoImages.home, true),
            description: "Maison française d'Art Liquide créant des cocktails prêts à déguster dans des sculptures en porcelaine peintes à la main.",
            slogan: "Maison Française d'Art Liquide",
            founder: {
                '@type': 'Person',
                name: 'Elisa Evrard Ordonez',
            },
            foundingDate: '2025',
            foundingLocation: {
                '@type': 'Place',
                name: 'Paris, France',
            },
            address: {
                '@type': 'PostalAddress',
                streetAddress: '14 rue du Dobropol',
                postalCode: '75017',
                addressLocality: 'Paris',
                addressCountry: 'FR',
            },
            email: 'mailto:contact@dyaneparis.com',
            telephone: '+33 7 68 32 87 14',
            identifier: {
                '@type': 'PropertyValue',
                propertyID: 'SIREN',
                value: '943829002',
            },
            sameAs: ['https://www.instagram.com/dyaneparis_/'],
        },
        {
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            url: SITE_URL,
            name: 'Dyane Paris',
            publisher: { '@id': ORGANIZATION_ID },
            image: imageObject(seoImages.home, true),
            inLanguage: ['fr', 'en'],
        },
    ],
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.home' })
    const title = t('title')
    const description = t('description')
    const homeMetadata = buildPageMetadata({
        locale,
        path: '',
        title,
        description,
        image: locale === 'en'
            ? {
                  ...seoImages.home,
                  alt: 'Dyane Paris cocktail sculptures containing ready-to-drink cocktails',
                  caption: 'Dyane Paris, French Maison of Liquid Art',
                  description: 'Ready-to-drink cocktails presented in hand-painted porcelain sculptures.',
              }
            : seoImages.home,
        absoluteTitle: true,
    })

    return {
        metadataBase: new URL(SITE_URL),
        ...homeMetadata,
        title: {
            default: title,
            template: '%s | Dyane Paris',
        },
        applicationName: 'Dyane Paris',
        authors: [{ name: 'Dyane Paris', url: SITE_URL }],
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
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const messages = await getMessages({ locale })

    return (
        <html lang={locale} className={fontVariables} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
                />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <AgeGate currentLocale={locale} />
                    <SiteThemeShell>{children}</SiteThemeShell>
                </NextIntlClientProvider>
                {process.env.VERCEL === '1' ? <Analytics /> : null}
            </body>
        </html>
    )
}
