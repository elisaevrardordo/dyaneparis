import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { titleWithoutBrand } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.confidentialite' })
    const path = locale === 'fr' ? '/confidentialite' : `/${locale}/confidentialite`
    return {
        title: titleWithoutBrand(t('title')),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/confidentialite',
                en: 'https://www.dyaneparis.com/en/confidentialite',
                'x-default': 'https://www.dyaneparis.com/confidentialite',
            },
        },
    }
}

export { default } from '@/components/legal/pages/PrivacyPage'
