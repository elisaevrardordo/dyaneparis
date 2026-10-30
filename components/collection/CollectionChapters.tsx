import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { OeuvreChapter, OeuvreMedia } from '@/content/oeuvres'
import { oeuvreChapters, oeuvreText } from '@/content/oeuvres'
import { localizedPath } from '@/i18n/paths'
import EditorialMediaPlaceholder from '@/app/[locale]/oeuvres/EditorialMediaPlaceholder'
import styles from '@/app/[locale]/oeuvres/Oeuvres.module.css'
import OeuvresArchiveVideo from '@/app/[locale]/oeuvres/OeuvresArchiveVideo'

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
    priority,
}: {
    chapter: OeuvreChapter
    locale: string
    description: string
    discover: string
    priority: boolean
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
                            priority={priority && mediaIndex === 0}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default async function CollectionChapters({ locale, ids, priority = false, naturalScroll = false }: {
    locale: string
    ids: readonly OeuvreChapter['id'][]
    priority?: boolean
    naturalScroll?: boolean
}) {
    const t = await getTranslations({ locale, namespace: 'oeuvres' })
    return (
        <div className={naturalScroll ? styles.naturalChapters : undefined} data-collection-chapters>
            {oeuvreChapters.filter(chapter => ids.includes(chapter.id)).map((chapter, index) => (
                <CollectionRow key={chapter.id} chapter={chapter} locale={locale}
                    description={t(chapter.descriptionKey)} discover={t('decouvrir')}
                    priority={priority && index === 0} />
            ))}
        </div>
    )
}
