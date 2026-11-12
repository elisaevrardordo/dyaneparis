import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { titleWithoutBrand } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.cookies' })
    const path = locale === 'fr' ? '/cookies' : `/${locale}/cookies`
    return {
        title: titleWithoutBrand(t('title')),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/cookies',
                en: 'https://www.dyaneparis.com/en/cookies',
                'x-default': 'https://www.dyaneparis.com/cookies',
            },
        },
    }
}

export { default } from '@/components/legal/pages/CookiesPage'
