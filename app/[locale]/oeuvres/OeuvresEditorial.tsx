import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { OeuvreChapter, OeuvreMedia } from '@/content/oeuvres'
import { oeuvreChapters, oeuvreText } from '@/content/oeuvres'
import { localizedPath } from '@/i18n/paths'
import EditorialMediaPlaceholder from './EditorialMediaPlaceholder'
import styles from './Oeuvres.module.css'
import OeuvresArchiveVideo from './OeuvresArchiveVideo'

type MediaStyle = CSSProperties & {
    '--media-fit'?: string
    '--media-position-desktop'?: string
    '--media-position-tablet'?: string
    '--media-position-mobile'?: string
}

function ArchiveMedia({
    media,
    href,
    locale,
    priority,
}: {
    media: OeuvreMedia
    href: string
    locale: string
    priority: boolean
}) {
    const localizedHref = localizedPath(locale, href)

    if (media.type === 'placeholder') {
        return (
            <EditorialMediaPlaceholder
                alt={oeuvreText(media.alt, locale)}
                href={localizedHref}
                replacementKey={media.replacementKey}
                variant={media.variant}
            />
        )
    }

    const mediaStyle: MediaStyle = {
        '--media-fit': media.objectFit ?? 'cover',
        '--media-position-desktop': media.objectPositionDesktop ?? '50% 50%',
        '--media-position-tablet': media.objectPositionTablet ?? media.objectPositionDesktop ?? '50% 50%',
        '--media-position-mobile': media.objectPositionMobile ?? media.objectPositionTablet ?? media.objectPositionDesktop ?? '50% 50%',
    }

    return (
        <Link
            className={styles.mediaLink}
            href={localizedHref}
            aria-label={oeuvreText(media.alt, locale)}
            style={mediaStyle}
        >
            {media.type === 'image' ? (
                <Image
                    src={media.src}
                    alt={oeuvreText(media.alt, locale)}
                    fill
                    priority={priority}
                    sizes="(max-width: 700px) 78vw, (max-width: 1100px) 38vw, 27vw"
                    className={styles.mediaImage}
                />
            ) : (
                <OeuvresArchiveVideo
                    alt={oeuvreText(media.alt, locale)}
                    src={media.src}
                    mobileSrc={media.mobileSrc}
                    poster={media.poster}
                    className={styles.mediaVideo}
                />
            )}
        </Link>
    )
}

function CollectionRow({
    chapter,
    locale,
    description,
    discover,
    rowIndex,
}: {
    chapter: OeuvreChapter
    locale: string
    description: string
    discover: string
    rowIndex: number
}) {
    const href = localizedPath(locale, chapter.href)

    return (
        <section className={styles.collectionRow} aria-labelledby={`oeuvre-${chapter.id}`}>
            <header className={styles.collectionMeta}>
                <p className={styles.eyebrow}>{oeuvreText(chapter.eyebrow, locale)}</p>
                <h2 id={`oeuvre-${chapter.id}`}>
                    <Link href={href}>{chapter.title}</Link>
                </h2>
                <p className={styles.note}>{oeuvreText(chapter.note, locale)}</p>
                <p className={styles.description}>{description}</p>
                <Link className={styles.discover} href={href}>
                    {discover}
                </Link>
            </header>

            <ul
                className={styles.mediaRail}
                aria-label={`${chapter.title} — ${locale === 'en' ? 'gallery' : 'galerie'}`}
            >
                {chapter.media.map((media, mediaIndex) => (
                    <li className={styles.mediaItem} key={`${chapter.id}-${mediaIndex}`}>
                        <ArchiveMedia
                            media={media}
                            href={chapter.href}
                            locale={locale}
                            priority={rowIndex === 0}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default async function OeuvresEditorial({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'oeuvres' })

    return (
        <main className={`theme-page ${styles.page}`}>
            <header className={styles.intro} data-page-hero data-header-foreground="black">
                <p className={styles.introEyebrow}>{t('intro_eyebrow')}</p>
                <h1>{t('intro_title')}</h1>
                <p className={styles.introLead}>{t('intro_lead')}</p>
                <h2>{t('collector_title')}</h2>
                <p className={styles.introBody}>{t('collector_body')}</p>
                <nav className={styles.introLinks} aria-label={t('intro_links_label')}>
                    <Link href={localizedPath(locale, '/oeuvres/dyane-paris-pornstar-martini-70-cl')}>{t('no1_link')}</Link>
                    <Link href={localizedPath(locale, '/oeuvres/dyane-no2-moscow-mule')}>{t('no2_link')}</Link>
                    <Link href={localizedPath(locale, '/commission-a-sculpture')}>{t('commission_link')}</Link>
                </nav>
            </header>

            {oeuvreChapters.map((chapter, rowIndex) => (
                <CollectionRow
                    key={chapter.id}
                    chapter={chapter}
                    locale={locale}
                    description={t(chapter.descriptionKey)}
                    discover={t('decouvrir')}
                    rowIndex={rowIndex}
                />
            ))}
        </main>
    )
}
