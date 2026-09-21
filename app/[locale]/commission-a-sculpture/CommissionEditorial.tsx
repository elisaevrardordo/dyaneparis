'use client'

import Link from 'next/link'
import { type CSSProperties, useEffect, useRef } from 'react'
import { localizedPath } from '@/i18n/paths'
import styles from './Commission.module.css'

export default function CommissionEditorial({ locale }: { locale: string }) {
    const pageRef = useRef<HTMLElement>(null)
    const isEnglish = locale === 'en'
    const copy = isEnglish ? {
        title: 'COMMISSION A SCULPTURE',
        introduction: <>A Dyane Paris sculpture is never simply purchased.<br /><em>It is commissioned.</em></>,
        discover: 'DISCOVER',
        discoverLabel: 'Discover the commission process',
        conciergeTitle: 'THE CONCIERGE',
        concierge: [
            'Every Dyane Paris sculpture begins with a conversation.',
            'Our Concierge accompanies each commission from the first exchange to the final delivery, ensuring that every detail reflects your vision and the standards of the Maison.',
            'Every sculpture is created exclusively upon request.',
        ],
        artisticTitle: 'ARTISTIC PERSONALIZATION',
        artistic: [
            'Each sculpture may be entrusted to one of the artists collaborating with Dyane Paris.',
            'The artist transforms the porcelain sculpture by hand, creating a singular work where craftsmanship and contemporary art meet.',
            'No two commissions are ever identical.',
            'Each piece becomes a unique collector’s object.',
        ],
        deliveryTitle: 'DELIVERY',
        france: 'FRANCE',
        franceLead: 'Delivery within',
        franceTime: '72 hours.',
        international: 'INTERNATIONAL',
        internationalLead: 'Worldwide delivery within',
        internationalTime: 'one week.',
        deliveryNote: 'Delivery times apply to available completed sculptures and begin once the commission has been confirmed by the Concierge. Bespoke artistic personalization may require additional creation time.',
        beginTitle: 'BEGIN YOUR COMMISSION',
        contact: [
            'To commission a sculpture or discuss a bespoke project, we invite you to contact our Concierge.',
            'Every conversation marks the beginning of a unique creation.',
        ],
        contactCta: 'CONTACT THE CONCIERGE',
        contactLabel: 'Contact the Dyane Paris Concierge',
    } : {
        title: 'COMMANDER UNE SCULPTURE',
        introduction: <>Une sculpture Dyane Paris ne s’achète pas simplement.<br /><em>Elle se commande.</em></>,
        discover: 'DÉCOUVRIR',
        discoverLabel: 'Découvrir le processus de commande',
        conciergeTitle: 'LA CONCIERGERIE',
        concierge: [
            'Chaque sculpture Dyane Paris commence par une conversation.',
            'Notre Conciergerie accompagne chaque commande, du premier échange à la livraison finale, afin que chaque détail reflète votre vision et les exigences de la Maison.',
            'Chaque sculpture est créée exclusivement sur demande.',
        ],
        artisticTitle: 'PERSONNALISATION ARTISTIQUE',
        artistic: [
            'Chaque sculpture peut être confiée à l’un des artistes qui collaborent avec Dyane Paris.',
            'L’artiste transforme à la main la sculpture en porcelaine et crée une œuvre singulière, à la rencontre de l’artisanat et de l’art contemporain.',
            'Aucune commande n’est jamais identique à une autre.',
            'Chaque pièce devient un objet de collection unique.',
        ],
        deliveryTitle: 'LIVRAISON',
        france: 'FRANCE',
        franceLead: 'Livraison sous',
        franceTime: '72 heures.',
        international: 'INTERNATIONAL',
        internationalLead: 'Livraison dans le monde entier sous',
        internationalTime: 'une semaine.',
        deliveryNote: 'Les délais s’appliquent aux sculptures achevées disponibles et commencent dès la confirmation de la commande par la Conciergerie. Une personnalisation artistique sur mesure peut nécessiter un délai de création supplémentaire.',
        beginTitle: 'COMMENCER VOTRE COMMANDE',
        contact: [
            'Pour commander une sculpture ou évoquer un projet sur mesure, nous vous invitons à contacter notre Conciergerie.',
            'Chaque conversation marque le début d’une création unique.',
        ],
        contactCta: 'CONTACTER LA CONCIERGERIE',
        contactLabel: 'Contacter la Conciergerie Dyane Paris',
    }

    useEffect(() => {
        const page = pageRef.current
        if (!page) return

        const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'))
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reducedMotion || !('IntersectionObserver' in window)) {
            revealItems.forEach((item) => {
                item.setAttribute('data-reveal-visible', 'true')
            })
            return
        }

        page.setAttribute('data-motion-ready', 'true')
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                entry.target.setAttribute('data-reveal-visible', 'true')
                observer.unobserve(entry.target)
            })
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })

        revealItems.forEach((item) => {
            observer.observe(item)
        })
        return () => observer.disconnect()
    }, [])

    return (
        <main ref={pageRef} className={`theme-page ${styles.page}`}>
            <section
                data-page-hero
                data-header-foreground="black"
                className={styles.hero}
                aria-labelledby="commission-title"
            >
                <div className={styles.heroContent}>
                    <h1 id="commission-title" className={styles.heroTitle}>
                        {copy.title}
                    </h1>
                    <p className={`${styles.heroIntroduction} editorial-quote`} data-font="quote">
                        {copy.introduction}
                    </p>
                </div>

                <a className={styles.discover} href="#the-concierge" aria-label={copy.discoverLabel}>
                    <span>{copy.discover}</span>
                    <span className={styles.discoverLine} aria-hidden="true" />
                </a>
            </section>

            <section id="the-concierge" className={styles.editorialSection} aria-labelledby="concierge-heading">
                <div className={styles.editorialGrid}>
                    <h2
                        id="concierge-heading"
                        className={styles.sectionLabel}
                        data-reveal
                        style={{ '--reveal-delay': '120ms' } as CSSProperties}
                    >
                        {copy.conciergeTitle}
                    </h2>
                    <div className={styles.editorialCopy} data-reveal>
                        {copy.concierge.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </div>
            </section>

            <section className={`${styles.editorialSection} ${styles.artisticSection}`} aria-labelledby="artistic-heading">
                <div className={`${styles.editorialGrid} ${styles.editorialGridReverse}`}>
                    <div className={styles.editorialCopy} data-reveal>
                        {copy.artistic.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                    <h2
                        id="artistic-heading"
                        className={`${styles.sectionLabel} ${styles.sectionLabelRight}`}
                        data-reveal
                        style={{ '--reveal-delay': '120ms' } as CSSProperties}
                    >
                        {copy.artisticTitle}
                    </h2>
                </div>
            </section>

            <section className={`${styles.editorialSection} ${styles.deliverySection}`} aria-labelledby="delivery-heading">
                <div className={styles.deliveryLayout}>
                    <h2 id="delivery-heading" className={styles.sectionLabel} data-reveal>
                        {copy.deliveryTitle}
                    </h2>

                    <div className={styles.deliveryContent}>
                        <div className={styles.deliveryOptions}>
                            <article className={styles.deliveryOption} data-reveal>
                                <h3>{copy.france}</h3>
                                <p className={styles.deliveryTime}>
                                    <span>{copy.franceLead}</span>
                                    {copy.franceTime}
                                </p>
                            </article>
                            <article
                                className={styles.deliveryOption}
                                data-reveal
                                style={{ '--reveal-delay': '100ms' } as CSSProperties}
                            >
                                <h3>{copy.international}</h3>
                                <p className={styles.deliveryTime}>
                                    <span>{copy.internationalLead}</span>
                                    {copy.internationalTime}
                                </p>
                            </article>
                        </div>

                        <p className={styles.deliveryNote} data-reveal>
                            {copy.deliveryNote}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.contactSection} aria-labelledby="begin-heading">
                <div className={styles.contactContent}>
                    <h2 id="begin-heading" className={styles.contactTitle} data-reveal>
                        {copy.beginTitle}
                    </h2>
                    <div className={styles.contactCopy} data-reveal>
                        {copy.contact.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                    <Link
                        className={styles.contactLink}
                        href={localizedPath(locale, '/contact')}
                        aria-label={copy.contactLabel}
                        data-reveal
                    >
                        <span>{copy.contactCta}</span>
                        <span className={styles.contactArrow} aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>
        </main>
    )
}
