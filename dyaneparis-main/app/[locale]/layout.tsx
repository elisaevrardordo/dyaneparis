import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.home' })
    const path = locale === 'fr' ? '' : `/${locale}`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com',
                en: 'https://www.dyaneparis.com/en',
                'x-default': 'https://www.dyaneparis.com',
            },
        },
        openGraph: {
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
        },
    }
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const messages = await getMessages()

    return (
        <NextIntlClientProvider messages={messages}>
            <AgeGate currentLocale={locale} />
            <Header />
            {children}
            <Footer />
        </NextIntlClientProvider>
    )
}
