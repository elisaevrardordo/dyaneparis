import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ExperiencesClient from './ExperiencesClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.experiences' })
    const path = locale === 'fr' ? '/experiences' : `/${locale}/experiences`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/experiences',
                en: 'https://www.dyaneparis.com/en/experiences',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `https://www.dyaneparis.com${path}`,
        },
    }
}

export default function Page() {
    return <ExperiencesClient />
}
