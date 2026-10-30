import Link from 'next/link'
import EditorialImage from '@/components/editorial/EditorialImage'
import { localizedPath } from '@/i18n/paths'
import styles from './Commission.module.css'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'

export default function CommissionEditorial({ locale }: { locale: string }) {
    const isEnglish = locale === 'en'
    const copy = isEnglish ? {
        title: 'COMMISSION A SCULPTURE',
        introduction: <>A Dyane Paris sculpture is never simply purchased.<br />It is commissioned.</>,
        discover: 'DISCOVER',
        discoverLabel: 'Discover the commission process',
        bespokeTitle: 'A BESPOKE CREATION',
        bespoke: 'Each Dyane Paris sculpture begins with a dialogue with the Maison. Made to order, it can be personalized by hand by one of our collaborating artists, giving rise to a singular piece at the meeting of porcelain and contemporary art.',
        deliveryTitle: 'DELIVERY',
        delivery: 'Delivery in France within 72 hours and internationally within one week for completed and available sculptures, from confirmation of the order. Personalized creations may require additional time.',
        contactCta: 'PLACE A PRIVATE ORDER',
        contactLabel: 'Contact the Dyane Paris Concierge',
    } : {
        title: 'COMMANDER UNE SCULPTURE',
        introduction: <>Une sculpture Dyane Paris ne s’achète pas simplement.<br />Elle se commande.</>,
        discover: 'DÉCOUVRIR',
        discoverLabel: 'Découvrir le processus de commande',
        bespokeTitle: 'UNE CRÉATION SUR MESURE',
        bespoke: "Chaque sculpture Dyane Paris naît d'un dialogue avec la Maison. Réalisée sur commande, elle peut être personnalisée à la main par l'un de nos artistes collaborateurs, donnant naissance à une pièce singulière, à la rencontre de la porcelaine et de l'art contemporain.",
        deliveryTitle: 'LIVRAISON',
        delivery: "Livraison en France sous 72 heures et à l'international sous une semaine pour les sculptures achevées et disponibles, à compter de la confirmation de commande. Les créations personnalisées peuvent nécessiter un délai supplémentaire.",
        contactCta: 'PASSER UNE COMMANDE PRIVÉE',
        contactLabel: 'Contacter la Conciergerie Dyane Paris',
    }

    return (
        <main className={`theme-page ${styles.page}`}>
            <section className={styles.spread} data-page-hero data-header-foreground="black" aria-labelledby="commission-title">
                <figure className={styles.photograph}>
                    <EditorialImage
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1788706545/dyane-paris-sculpture-porcelaine-argent-portrait.png"
                        alt={isEnglish ? 'White Dyane Paris porcelain sculpture, portrait' : 'Sculpture blanche Dyane Paris en porcelaine, portrait'}
                        width={1080} height={1350} priority fetchPriority="high" quality={85}
                        sizes="(max-width: 800px) 100vw, 50vw"
                    />
                </figure>
                <div className={styles.copy}>
                    <div className={styles.copyInner}>
                        <EditorialEmblem />
                        <p className={styles.eyebrow} data-editorial-label>DYANE PARIS</p>
                        <h1 id="commission-title">{copy.title}</h1>
                        <p className={styles.introduction}>{copy.introduction}</p>
                        <a className={styles.textLink} href="#artistic-heading" aria-label={copy.discoverLabel}>{copy.discover}</a>
                    </div>
                </div>
            </section>

            <section className={`${styles.spread} ${styles.reverse}`} aria-labelledby="artistic-heading">
                <figure className={styles.photograph}>
                    <EditorialImage
                        src="https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/dyane-paris-sculpture-argent-voile-rouge-portrait.png"
                        alt={isEnglish ? 'Red Dyane Paris porcelain sculpture, bust' : 'Sculpture rouge Dyane Paris en porcelaine, buste'}
                        width={1080} height={1350} quality={85} loading="lazy"
                        sizes="(max-width: 800px) 100vw, 50vw"
                    />
                </figure>
                <div className={styles.copy}>
                    <div className={styles.copyInner}>
                        <section id="the-concierge" aria-labelledby="artistic-heading">
                            <EditorialEmblem />
                            <h2 id="artistic-heading">{copy.bespokeTitle}</h2>
                            <p>{copy.bespoke}</p>
                            <Link className={styles.textLink} href={localizedPath(locale, '/contact')} aria-label={copy.contactLabel}>{copy.contactCta}</Link>
                        </section>
                        <section className={styles.delivery} aria-labelledby="delivery-heading">
                            <EditorialEmblem />
                            <h2 id="delivery-heading">{copy.deliveryTitle}</h2>
                            <p>{copy.delivery}</p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    )
}
