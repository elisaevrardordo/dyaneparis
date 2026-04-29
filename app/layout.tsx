import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'

export const metadata: Metadata = {
    title: "Dyane Paris — Maison d'Art Liquide",
    description: "Le cocktail élevé au rang d'œuvre.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body>
                <AgeGate />
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
