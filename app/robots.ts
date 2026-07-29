import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'Googlebot-Image',
                allow: '/',
            },
        ],
        sitemap: 'https://www.dyaneparis.com/sitemap.xml',
        host: 'www.dyaneparis.com',
    }
}
