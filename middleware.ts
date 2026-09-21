import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

const publicRootAssets = new Set([
    '/10.webp',
    '/CREATION_2.webp',
    '/LogoDYANE_blanc.png',
    '/apple-icon.png',
    '/dyane-no1.webp',
    '/dyane-no2.webp',
    '/dyane-paris-cocktails-porcelaine.webp',
    '/dyane-paris-collection-oeuvres.webp',
    '/dyane-teo.webp',
    '/favicon-48x48.png',
    '/favicon.ico',
    '/icon-192.png',
    '/icon.png',
    '/logo.png',
    '/robots.txt',
    '/site.webmanifest',
    '/sitemap.xml',
])

const publicAssetPrefixes = [
    '/contact/',
    '/editorial/',
    '/home/',
    '/images/',
    '/journal/',
    '/models/',
    '/previews/',
]

function isPublicAsset(pathname: string) {
    return publicRootAssets.has(pathname)
        || publicAssetPrefixes.some((prefix) => pathname.startsWith(prefix))
}

export default function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const internalLocale = request.headers.get('x-next-intl-locale')
    const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
        .split(':')[0]
        .toLowerCase()
    const protocol = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
    const isProductionHost = host === 'dyaneparis.com' || host === 'www.dyaneparis.com'
    let shouldRedirect = false

    if (isProductionHost && (host !== 'www.dyaneparis.com' || protocol !== 'https')) {
        url.protocol = 'https:'
        url.hostname = 'www.dyaneparis.com'
        url.port = ''
        shouldRedirect = true
    }

    if (/^\/fr(?:\/|$)/.test(url.pathname) && internalLocale !== 'fr') {
        url.pathname = url.pathname.replace(/^\/fr(?=\/|$)/, '') || '/'
        shouldRedirect = true
    }

    if (shouldRedirect) {
        return NextResponse.redirect(url, 308)
    }

    if (isPublicAsset(url.pathname)) {
        return NextResponse.next()
    }

    if (/^\/fr(?:\/|$)/.test(url.pathname) && internalLocale === 'fr') {
        return NextResponse.next()
    }

    // Let next-intl perform the locale rewrite so the internal request carries
    // the locale header expected by the App Router. A plain rewrite to `/fr`
    // is normalized back to the prefix-free URL by Next.js and creates a loop.
    return intlMiddleware(request)
}

export const config = {
    matcher: ['/((?!api|_next|_vercel).*)']
}
