import Image from 'next/image'
import Link from 'next/link'
import type { getHomeContent } from '@/content/home'
import { localizedPath } from '@/i18n/paths'
import styles from './Home.module.css'

type Presences = ReturnType<typeof getHomeContent>['presences']

export default function LatestPresencesSection({ content, locale }: { content: Presences; locale: string }) {
  return (
    <section className={styles.presences} data-header-theme="dark" aria-labelledby="presences-title">
      <header className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 id="presences-title" className={styles.sectionTitle}>{content.title}</h2>
        </div>
      </header>

      <div className={styles.presenceGrid}>
        {content.items.map((item) => {
          const card = (
            <>
              <div className={styles.presenceMedia}>
                <Image
                  className={styles.presenceImage}
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 700px) calc(100vw - 36px), (max-width: 980px) 50vw, 36vw"
                  style={{ objectPosition: item.objectPosition }}
                />
              </div>
              <div className={styles.presenceInfo}>
                <div>
                  <p className={styles.smallMeta}>{item.location}</p>
                  <h3 className={styles.presencePlace}>{item.place}</h3>
                </div>
                <p className={styles.presenceMeta}>{item.kind}</p>
              </div>
            </>
          )

          return item.href ? (
            <Link className={styles.presenceCard} href={localizedPath(locale, item.href)} key={item.place}>
              {card}
            </Link>
          ) : (
            <article className={styles.presenceCard} key={item.place}>{card}</article>
          )
        })}
      </div>
    </section>
  )
}
