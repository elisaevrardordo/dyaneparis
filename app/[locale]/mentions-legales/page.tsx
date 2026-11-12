import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { titleWithoutBrand } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.mentionsLegales' })
    const path = locale === 'fr' ? '/mentions-legales' : `/${locale}/mentions-legales`
    return {
        title: titleWithoutBrand(t('title')),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/mentions-legales',
                en: 'https://www.dyaneparis.com/en/mentions-legales',
                'x-default': 'https://www.dyaneparis.com/mentions-legales',
            },
        },
    }
}

export { default } from '@/components/legal/pages/NoticePage'
