import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { titleWithoutBrand } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.cgv' })
    const path = locale === 'fr' ? '/cgv' : `/${locale}/cgv`
    return {
        title: titleWithoutBrand(t('title')),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/cgv',
                en: 'https://www.dyaneparis.com/en/cgv',
                'x-default': 'https://www.dyaneparis.com/cgv',
            },
        },
    }
}

export { default } from '@/components/legal/pages/TermsPage'
