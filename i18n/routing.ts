import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    // Default locale (fr) is served at the root without a prefix (e.g. `/la-maison`),
    // while other locales are prefixed (e.g. `/en/la-maison`). This matches the
    // canonical / hreflang / sitemap strategy used across the app.
    localePrefix: 'as-needed',
    // Locale is encoded by the URL. Disabling detection and the locale cookie
    // avoids non-canonical redirects and a Set-Cookie header on editorial pages.
    localeDetection: false,
    localeCookie: false,
})
