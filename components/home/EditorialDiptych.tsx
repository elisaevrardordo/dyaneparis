import Image from 'next/image'
import type { getHomeContent } from '@/content/home'
import styles from './Home.module.css'

type Editorial = ReturnType<typeof getHomeContent>['editorial']

export default function EditorialDiptych({ images }: { images: Editorial }) {
  return (
    <section className={styles.diptych} aria-label="Dyane Paris — études sculpturales">
      {images.map((image) => (
        <figure className={styles.editorialPanel} key={image.src}>
          <Image
            className={styles.mediaImage}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            style={{ objectPosition: image.objectPosition }}
          />
          {image.caption ? <figcaption className={styles.caption}>{image.caption}</figcaption> : null}
        </figure>
      ))}
    </section>
  )
}
