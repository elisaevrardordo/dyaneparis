import Link from 'next/link'
import styles from './Oeuvres.module.css'

export default function EditorialMediaPlaceholder({
    alt,
    href,
    replacementKey,
    variant,
}: {
    alt: string
    href: string
    replacementKey: string
    variant: 'white' | 'yellow'
}) {
    return (
        <Link
            className={`${styles.mediaLink} ${styles.placeholder}`}
            data-placeholder-variant={variant}
            data-replacement-key={replacementKey}
            href={href}
            aria-label={alt}
        >
            <span className={styles.srOnly}>{alt}</span>
        </Link>
    )
}
