import type { JournalPlaceholder, JournalRatio } from '@/content/journal'
import styles from './Journal.module.css'

type EditorialMediaPlaceholderProps = {
    media: JournalPlaceholder
    ratio?: JournalRatio
}

export default function EditorialMediaPlaceholder({ media, ratio = media.ratio }: EditorialMediaPlaceholderProps) {
    return (
        <div
            className={`${styles.mediaPlaceholder} ${styles[`ratio${ratio}`]} ${styles[`placeholder${media.variant}`]}`}
            data-replacement-key={media.replacementKey}
            aria-hidden="true"
        />
    )
}
