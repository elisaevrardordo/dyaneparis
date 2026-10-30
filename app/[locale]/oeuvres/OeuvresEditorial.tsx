import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { localizedPath } from '@/i18n/paths'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import CollectionChapters from '@/components/collection/CollectionChapters'
import ProductDiptych from '@/components/home/ProductDiptych'
import { getHomeContent } from '@/content/home'
import styles from './Oeuvres.module.css'

export default async function OeuvresEditorial({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'oeuvres' })
    return (
        <main className={`theme-page ${styles.page}`} data-page-hero data-header-foreground="black">
            <ProductDiptych locale={locale} products={getHomeContent(locale).products} priority />
            <CollectionChapters locale={locale} ids={['teo']} />

            <section className={`${styles.intro} ${styles.seoCopy}`} aria-label={t('intro_title')}>
                <EditorialEmblem />
                <p className={styles.introEyebrow} data-editorial-label>{t('intro_eyebrow')}</p>
                <h1>{t('intro_title')}</h1>
                <p className={styles.introLead}>{t('intro_lead')}</p>
                <h2>{t('collector_title')}</h2>
                <p className={styles.introBody}>{t('collector_body')}</p>
                <nav className={styles.introLinks} aria-label={t('intro_links_label')}>
                    <Link href={localizedPath(locale, '/oeuvres/dyane-no1-pornstar-martini')}>{t('no1_link')}</Link>
                    <Link href={localizedPath(locale, '/oeuvres/dyane-no2-basil-smash')}>{t('no2_link')}</Link>
                    <Link href={localizedPath(locale, '/commission-a-sculpture')}>{t('commission_link')}</Link>
                </nav>
            </section>
        </main>
    )
}
