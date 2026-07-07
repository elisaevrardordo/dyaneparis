import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    // Default locale (fr) is served at the root without a prefix (e.g. `/la-maison`),
    // while other locales are prefixed (e.g. `/en/la-maison`). This matches the
    // canonical / hreflang / sitemap strategy used across the app.
    localePrefix: 'as-needed',
    localeDetection: true,
})
