import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../not-found.module.css'

export const metadata: Metadata = {
    title: { absolute: 'Page introuvable | Dyane Paris' },
    robots: { index: false, follow: false },
}

export default function NotFound() {
    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                <p className={styles.kicker}>Dyane Paris</p>
                <h1 className={styles.title}>404</h1>
                <p className={styles.copy}>Cette page est introuvable. Page not found.</p>
                <Link className={styles.link} href="/">Retour à l’accueil</Link>
            </div>
        </main>
    )
}
