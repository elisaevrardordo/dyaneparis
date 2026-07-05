import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LaMaisonClient from './LaMaisonClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.laMaison' })
    const path = locale === 'fr' ? '/la-maison' : `/${locale}/la-maison`

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/la-maison',
                en: 'https://www.dyaneparis.com/en/la-maison',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `https://www.dyaneparis.com${path}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779745931/Design_sans_titre_63_nbwcnv.png',
                    width: 1200,
                    height: 630,
                    alt: "La Maison Dyane Paris — Art Liquide et artisanat français",
                },
            ],
        },
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: "La Maison — Dyane Paris",
    url: 'https://www.dyaneparis.com/la-maison',
    isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
    about: { '@id': 'https://www.dyaneparis.com/#organization' },
    description:
        "L'histoire de Dyane Paris, Maison française d'Art Liquide : genèse du nom, artisanat de la porcelaine et savoir-faire français.",
}

export default function LaMaisonPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LaMaisonClient />
        </>
    )
}
