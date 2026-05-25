import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix: 'always',
    localeDetection: true
})

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
}
