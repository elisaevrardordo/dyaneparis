import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactClient from './ContactClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.contact' })
    const path = locale === 'fr' ? '/contact' : `/${locale}/contact`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/contact',
                en: 'https://www.dyaneparis.com/en/contact',
                'x-default': 'https://www.dyaneparis.com/contact',
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
    return <ContactClient />
}
