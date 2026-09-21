import Image from 'next/image'
import type { ReactNode } from 'react'
import ViewportVideo from './ViewportVideo'
import styles from './DyaneEditorialPage.module.css'

export type DyaneEditorialMedia = {
  src?: string
  alt?: string
  type?: 'image' | 'video'
  fit?: 'cover' | 'contain'
  position?: string
}

export type DyaneEditorialTextBlock = {
  eyebrow?: ReactNode
  title?: ReactNode
  body: ReactNode
}

type DyaneEditorialPageProps = {
  eyebrow?: ReactNode
  title: ReactNode
  compactTitle?: boolean
  video?: {
    src?: string
    poster?: string
    label?: string
  }
  textBlocks: [
    DyaneEditorialTextBlock,
    DyaneEditorialTextBlock,
    DyaneEditorialTextBlock,
    DyaneEditorialTextBlock,
    DyaneEditorialTextBlock,
  ]
  gallery3: DyaneEditorialMedia[]
  gallery2: DyaneEditorialMedia[]
  gallery6: DyaneEditorialMedia[]
  gallery8: DyaneEditorialMedia[]
  className?: string
}

const classes = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

function EditorialText({ eyebrow, title, body }: DyaneEditorialTextBlock) {
  return (
    <section className={styles.copy}>
      <div className={styles.copyInner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        {title ? <h2 className={styles.copyTitle}>{title}</h2> : null}
        <div className={styles.body}>{body}</div>
      </div>
    </section>
  )
}

function MediaGrid({
  items,
  count,
  variant,
}: {
  items: DyaneEditorialMedia[]
  count: number
  variant: 'three' | 'two' | 'six' | 'eight'
}) {
  const slots = Array.from({ length: count }, (_, index) => items[index] ?? {})

  return (
    <section className={classes(styles.gallery, styles[variant])} aria-label="Galerie éditoriale">
      {slots.map((item, index) => (
        <figure className={classes(styles.media, !item.src && styles.placeholder)} key={`${variant}-${index}`}>
          {item.src && item.type === 'video' ? (
            <ViewportVideo
              src={item.src}
              label={item.alt ?? ''}
              className={item.fit === 'contain' ? styles.contain : styles.cover}
              style={{ objectPosition: item.position ?? 'center top' }}
            />
          ) : item.src ? (
            <Image
              src={item.src}
              alt={item.alt ?? ''}
              fill
              sizes={variant === 'two' ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 34vw'}
              className={item.fit === 'contain' ? styles.contain : styles.cover}
              style={{ objectPosition: item.position ?? 'center top' }}
            />
          ) : null}
        </figure>
      ))}
    </section>
  )
}

export default function DyaneEditorialPage({
  eyebrow,
  title,
  compactTitle = false,
  video,
  textBlocks,
  gallery3,
  gallery2,
  gallery6,
  gallery8,
  className,
}: DyaneEditorialPageProps) {
  return (
    <main className={classes(styles.page, className)}>
      <header className={classes(styles.pageTitle, compactTitle && styles.pageTitleCompact)} data-page-hero data-header-foreground="black">
        <div>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1>{title}</h1>
        </div>
      </header>

      <section className={styles.video} aria-label={video?.label}>
        {video?.src ? (
          <video autoPlay muted loop playsInline preload="metadata" poster={video.poster || undefined}>
            <source src={video.src} />
          </video>
        ) : (
          <div className={styles.videoPlaceholder} aria-hidden="true" />
        )}
      </section>

      <EditorialText {...textBlocks[0]} />
      <MediaGrid items={gallery3} count={3} variant="three" />
      <EditorialText {...textBlocks[1]} />
      <MediaGrid items={gallery2} count={2} variant="two" />
      <EditorialText {...textBlocks[2]} />
      <MediaGrid items={gallery6} count={6} variant="six" />
      <EditorialText {...textBlocks[3]} />
      <MediaGrid items={gallery8} count={8} variant="eight" />
      <EditorialText {...textBlocks[4]} />
    </main>
  )
}
