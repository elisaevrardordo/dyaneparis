import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactForm from './ContactForm'
import styles from './Contact.module.css'
import { breadcrumbJsonLd, buildPageMetadata, imageObject, localizedUrl, seoImages, serializeJsonLd } from '@/lib/seo'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.contact' })

    return buildPageMetadata({
        locale,
        path: '/contact',
        title: t('title'),
        description: t('description'),
        image: seoImages.contact,
        absoluteTitle: true,
    })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'contact' })
    const pageUrl = localizedUrl(locale, '/contact')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ContactPage',
                '@id': `${pageUrl}#contact`,
                name: locale === 'en' ? 'Contact Dyane Paris' : 'Contacter la Conciergerie Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                primaryImageOfPage: imageObject(seoImages.contact, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Contact' : 'Conciergerie', path: '/contact' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <main className={styles.page}>
                <div className={styles.layout}>
                    <div className={styles.contentColumn}>
                        <header className={styles.intro}>
                            <p className={styles.kicker}>{t('kicker')}</p>
                            <h1 className={styles.title}>{t('titre')}</h1>
                            <p className={styles.introCopy}>{t('intro')}</p>
                            <p className={styles.availability}>{t('availability')}</p>
                        </header>
                        <ContactForm locale={locale} />
                    </div>

                    <figure className={styles.visual} aria-hidden="true">
                        <video
                            className={styles.visualVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            tabIndex={-1}
                        >
                            <source src="/contact/rock2.mp4" type="video/mp4" />
                        </video>
                    </figure>
                </div>
            </main>
        </>
    )
}
