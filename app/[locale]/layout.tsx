import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { buildPageMetadata, seoImages } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.home' })

    return buildPageMetadata({
        locale,
        path: '',
        title: t('title'),
        description: t('description'),
        image: locale === 'en'
            ? {
                  ...seoImages.home,
                  alt: 'Dyane Paris cocktail sculptures containing ready-to-drink cocktails',
                  caption: 'Dyane Paris, French Maison of Liquid Art',
                  description: 'Ready-to-drink cocktails presented in hand-painted porcelain sculptures.',
              }
            : seoImages.home,
        absoluteTitle: true,
    })
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
