import EditorialImage from './EditorialImage'
import type { ReactNode } from 'react'
import ViewportVideo from './ViewportVideo'
import EditorialHero from './EditorialHero'
import EditorialEmblem from './EditorialEmblem'
import styles from './DyaneEditorialPage.module.css'

export type DyaneEditorialMedia = {
  src?: string
  poster?: string
  alt?: string
  type?: 'image' | 'video'
  fit?: 'cover' | 'contain'
  position?: string
}

export type DyaneEditorialTextBlock = {
  eyebrow?: ReactNode
  title?: ReactNode
  titleAsEyebrow?: boolean
  body: ReactNode
  labelledBy?: string
  className?: string
}

type DyaneEditorialPageProps = {
  eyebrow?: ReactNode
  title: ReactNode
  openingAtEnd?: boolean
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

function EditorialText({ eyebrow, title, titleAsEyebrow, body, labelledBy, className }: DyaneEditorialTextBlock) {
  return (
    <section className={classes(styles.copy, className)} aria-labelledby={labelledBy}>
      <div className={styles.copyInner}>
        <EditorialEmblem />
        {eyebrow ? <p className={styles.eyebrow} data-editorial-label>{eyebrow}</p> : null}
        {title ? <h2 className={titleAsEyebrow ? styles.eyebrow : styles.copyTitle}>{title}</h2> : null}
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
              poster={item.poster}
              sizes={variant === 'two' ? '(max-width: 600px) 100vw, 50vw' : variant === 'eight' ? '(max-width: 430px) 100vw, (max-width: 900px) 50vw, 25vw' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 34vw'}
              label={item.alt ?? ''}
              className={item.fit === 'contain' ? styles.contain : styles.cover}
              style={{ objectPosition: item.position ?? 'center top' }}
            />
          ) : item.src ? (
            <EditorialImage
              src={item.src}
              alt={item.alt ?? ''}
              fill
              quality={85}
              loading="lazy"
              sizes={variant === 'two' ? '(max-width: 600px) 100vw, 50vw' : variant === 'eight' ? '(max-width: 430px) 100vw, (max-width: 900px) 50vw, 25vw' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 34vw'}
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
  openingAtEnd = false,
  video,
  textBlocks,
  gallery3,
  gallery2,
  gallery6,
  gallery8,
  className,
}: DyaneEditorialPageProps) {
  const opening = <EditorialText
    {...textBlocks[0]}
    title={textBlocks[0].title === title ? undefined : textBlocks[0].title}
    labelledBy={textBlocks[0].title === title ? 'editorial-hero-title' : undefined}
  />

  return (
    <main className={classes(styles.page, className)}>
      <EditorialHero eyebrow={eyebrow} title={title} video={video} />

      {!openingAtEnd ? opening : null}
      <MediaGrid items={gallery3} count={3} variant="three" />
      <EditorialText {...textBlocks[1]} />
      <MediaGrid items={gallery2} count={2} variant="two" />
      <EditorialText {...textBlocks[2]} />
      <MediaGrid items={gallery6} count={6} variant="six" />
      <EditorialText {...textBlocks[3]} />
      <MediaGrid items={gallery8} count={8} variant="eight" />
      <EditorialText {...textBlocks[4]} />
      {openingAtEnd ? opening : null}
    </main>
  )
}
