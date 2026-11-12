import Image from 'next/image'
import styles from './EditorialStory.module.css'

export default function EditorialPhotoStrip({ photos, label }: {
  photos: readonly { src: string; alt: string }[]
  label: string
}) {
  return (
    <section
      className={styles.photos}
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the photo strip on small screens.
      tabIndex={0}
    >
      {photos.map(({ src, alt }) => (
        <div key={src} className={styles.photo}>
          <Image src={src} alt={alt} fill sizes={`(max-width: 768px) 82vw, ${100 / photos.length}vw`} />
        </div>
      ))}
    </section>
  )
}
