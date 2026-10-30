import Image from 'next/image'
import styles from './EditorialStatement.module.css'

export default function EditorialEmblem() {
  return (
    <span className={styles.emblem} aria-hidden="true" data-editorial-emblem>
      <Image
        className={styles.emblemImage}
        src="/images/dyane-editorial-icon.png"
        alt=""
        width={1254}
        height={1254}
        sizes="58px"
      />
    </span>
  )
}
