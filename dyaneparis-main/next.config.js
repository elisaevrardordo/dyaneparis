const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dazhkrimv/image/upload/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      { source: '/products/:path*', destination: '/oeuvres', permanent: true },
      { source: '/collections/:path*', destination: '/oeuvres', permanent: true },
      { source: '/blogs/:path*', destination: '/le-journal', permanent: true },
      { source: '/pages/la-maison', destination: '/la-maison', permanent: true },
      { source: '/pages/experiences', destination: '/experiences', permanent: true },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
