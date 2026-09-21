import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { JournalMedia, JournalRatio } from '@/content/journal'
import { journalText } from '@/content/journal'
import EditorialMediaPlaceholder from './EditorialMediaPlaceholder'
import EditorialVideo from './EditorialVideo'
import styles from './Journal.module.css'

type JournalMediaProps = {
    media: JournalMedia
    locale: string
    priority?: boolean
    showCaption?: boolean
    sizes?: string
    ratio?: JournalRatio
}

export default function JournalMediaView({ media, locale, priority = false, showCaption = false, sizes = '100vw', ratio }: JournalMediaProps) {
    const resolvedRatio = ratio ?? media.ratio

    if (media.kind === 'placeholder') {
        return <EditorialMediaPlaceholder media={media} ratio={resolvedRatio} />
    }

    if (media.kind === 'video') {
        return (
            <EditorialVideo
                src={media.src}
                mobileSrc={media.mobileSrc}
                poster={media.poster}
                label={journalText(media.alt, locale)}
                ratio={resolvedRatio === 'square' ? media.ratio : resolvedRatio}
                autoplay={media.autoplay}
                locale={locale}
            />
        )
    }

    const imageView = (
        <div className={`${styles.imageFrame} ${styles[`ratio${resolvedRatio}`]}`}>
            <Image
                src={media.src}
                alt={journalText(media.alt, locale)}
                fill
                priority={priority}
                sizes={sizes}
                className={styles.image}
                style={{
                    '--media-position-desktop': media.objectPosition ?? media.position ?? 'center',
                    '--media-position-mobile': media.positionMobile ?? media.objectPosition ?? media.position ?? 'center',
                    objectFit: media.fit ?? 'cover',
                } as CSSProperties}
            />
        </div>
    )

    if (showCaption && media.caption) {
        return (
            <figure className={styles.captionedMedia}>
                {imageView}
                <figcaption className={styles.mediaCaption}>{journalText(media.caption, locale)}</figcaption>
            </figure>
        )
    }

    return imageView
}
