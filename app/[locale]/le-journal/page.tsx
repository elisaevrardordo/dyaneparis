import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LeJournalClient from './LeJournalClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.journal' })
    const path = locale === 'fr' ? '/le-journal' : `/${locale}/le-journal`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/le-journal',
                en: 'https://www.dyaneparis.com/en/le-journal',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `https://www.dyaneparis.com${path}`,
        },
    }
}

export default function LeJournalPage() {
    return <LeJournalClient />
}
