import Link from 'next/link'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import HomeConfiguratorPreview from './HomeConfiguratorPreview'
import styles from './Home.module.css'

type Customization = ReturnType<typeof getHomeContent>['customization']

export default function ArtisticCustomizationSection({
  content,
  locale,
}: {
  content: Customization
  locale: string
}) {
  return (
    <section className={styles.customization} data-header-theme="dark" aria-labelledby="customization-title">
      <HomeConfiguratorPreview fallback={content.fallback} />
      <div className={styles.customizationCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="customization-title" className={styles.sectionTitle}>{content.title}</h2>
        <p className={styles.bodyCopy}>{content.text}</p>
        <Link className={styles.cta} href={localizedPath(locale, content.href)}>
          {content.cta}
        </Link>
      </div>
    </section>
  )
}
