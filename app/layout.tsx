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
            <head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-PWMTG11R5L"></script>
                <script dangerouslySetInnerHTML={{ __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-PWMTG11R5L');
                `}} />
            </head>
            <body>
                <AgeGate />
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
