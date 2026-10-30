const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    poweredByHeader: false,
    outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dazhkrimv/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dazhkrimv/video/upload/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
    async redirects() {
    return [
      { source: '/oeuvres/dyane-paris-pornstar-martini-70-cl', destination: '/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/en/oeuvres/dyane-paris-pornstar-martini-70-cl', destination: '/en/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/fr/oeuvres/dyane-paris-pornstar-martini-70-cl', destination: '/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/oeuvres/dyane-no2-moscow-mule', destination: '/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/en/oeuvres/dyane-no2-moscow-mule', destination: '/en/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/fr/oeuvres/dyane-no2-moscow-mule', destination: '/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/products/dyane-paris-pornstar-martini-70-cl', destination: '/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/products/dyane-no-1', destination: '/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/products/dyane-no1-pornstar-martini', destination: '/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/products/dyane-no2-moscow-mule', destination: '/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/products/dyane-no-2', destination: '/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/products/bouteille-signee-teokaykay', destination: '/oeuvres/bouteille-signee-teokaykay', permanent: true },
      { source: '/pages/l-art-de-la-porcelaine-dyane-paris', destination: '/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/blogs/news/l-art-de-la-porcelaine-dyane-paris', destination: '/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/blogs/le-journal/l-art-de-la-porcelaine-dyane-paris', destination: '/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/en/products/dyane-paris-pornstar-martini-70-cl', destination: '/en/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/en/products/dyane-no-1', destination: '/en/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/en/products/dyane-no1-pornstar-martini', destination: '/en/oeuvres/dyane-no1-pornstar-martini', statusCode: 301 },
      { source: '/en/products/dyane-no2-moscow-mule', destination: '/en/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/en/products/dyane-no-2', destination: '/en/oeuvres/dyane-no2-basil-smash', permanent: true },
      { source: '/en/products/bouteille-signee-teokaykay', destination: '/en/oeuvres/bouteille-signee-teokaykay', permanent: true },
      { source: '/en/pages/l-art-de-la-porcelaine-dyane-paris', destination: '/en/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/en/blogs/news/l-art-de-la-porcelaine-dyane-paris', destination: '/en/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/en/blogs/le-journal/l-art-de-la-porcelaine-dyane-paris', destination: '/en/le-journal/art-de-la-porcelaine', permanent: true },
      { source: '/products/:path*', destination: '/oeuvres', permanent: true },
      { source: '/collections/:path*', destination: '/oeuvres', permanent: true },
      { source: '/blogs/:path*', destination: '/le-journal', permanent: true },
      { source: '/en/products/:path*', destination: '/en/oeuvres', permanent: true },
      { source: '/en/collections/:path*', destination: '/en/oeuvres', permanent: true },
      { source: '/en/blogs/:path*', destination: '/en/le-journal', permanent: true },
      { source: '/pages/la-maison', destination: '/la-maison', permanent: true },
      { source: '/pages/experiences', destination: '/experiences', permanent: true },
      { source: '/en/pages/la-maison', destination: '/en/la-maison', permanent: true },
      { source: '/en/pages/experiences', destination: '/en/experiences', permanent: true },
        ]
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
                ],
            },
        ]
    },
}

module.exports = withNextIntl(nextConfig)
