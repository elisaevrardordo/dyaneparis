import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { isProductionDeployment } from '@/lib/deployment'

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
    const isNetlifyPreview = host.endsWith('.netlify.app')
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

    const testPayment = /^\/(en\/|fr\/)?paiement-test\/?$/.exec(url.pathname)
    if (testPayment && (isProductionHost || isNetlifyPreview || isProductionDeployment())) {
        url.pathname = testPayment[1] === 'en/' ? '/en/contact' : '/contact'
        url.search = ''
        return NextResponse.redirect(url, 307)
    }

    // Keep the locale header that next-intl sets during its internal rewrite.
    const isInternalFrenchRoute = /^\/fr(?:\/|$)/.test(url.pathname) && internalLocale === 'fr'
    const response = isPublicAsset(url.pathname) || isInternalFrenchRoute
        ? NextResponse.next()
        : intlMiddleware(request)

    if (isNetlifyPreview) response.headers.set('X-Robots-Tag', 'noindex')
    return response
}

export const config = {
    matcher: ['/((?!api|_next|_vercel).*)']
}
