import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
    title: "Dyane Paris — Maison d'Art Liquide",
    description: "Le cocktail élevé au rang d'œuvre.",
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
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <AgeGate currentLocale={locale} />
                    <Header />
                    {children}
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
