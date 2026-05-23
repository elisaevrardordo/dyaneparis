const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async redirects() {
    return [
      { source: '/products/:path*', destination: '/oeuvres', permanent: true },
      { source: '/collections/:path*', destination: '/oeuvres', permanent: true },
      { source: '/blogs/:path*', destination: '/le-journal', permanent: true },
      { source: '/pages/la-maison', destination: '/la-maison', permanent: true },
      { source: '/pages/experiences', destination: '/experiences', permanent: true },
      { source: '/contact', destination: '/fr/contact', permanent: false },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
