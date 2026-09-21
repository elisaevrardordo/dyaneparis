import type { ReactNode } from 'react'
import styles from './EditorialLayout.module.css'

const classes = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

export function EditorialPage({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={classes('theme-page', styles.page, className)}>{children}</main>
}

export function EditorialHero({
  children,
  className,
  lightHeader = false,
}: {
  children: ReactNode
  className?: string
  lightHeader?: boolean
}) {
  return (
    <section
      className={classes(styles.hero, className)}
      data-page-hero
      data-header-foreground={lightHeader ? 'white' : undefined}
    >
      {children}
    </section>
  )
}

export function EditorialCopy({
  eyebrow,
  title,
  children,
  className,
  level = 2,
  align = 'center',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  children: ReactNode
  className?: string
  level?: 1 | 2
  align?: 'center' | 'left'
}) {
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <section className={classes(styles.copy, align === 'left' && styles.copyLeft, className)} data-editorial-reveal>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading className={styles.title}>{title}</Heading>
      <div className={styles.copyBody}>{children}</div>
    </section>
  )
}

export function EditorialMedia({
  children,
  className,
  full = false,
  ratio = 'landscape',
}: {
  children: ReactNode
  className?: string
  full?: boolean
  ratio?: 'hero' | 'landscape' | 'panorama' | 'portrait' | 'square' | 'natural'
}) {
  return (
    <figure
      className={classes(styles.media, full ? styles.mediaFull : styles.mediaContained, styles[`ratio${ratio}`], className)}
      data-editorial-reveal
    >
      {children}
    </figure>
  )
}

export function EditorialPair({
  children,
  className,
  reverse = false,
}: {
  children: ReactNode
  className?: string
  reverse?: boolean
}) {
  return (
    <section className={classes(styles.pair, reverse && styles.pairReverse, className)} data-editorial-reveal>
      {children}
    </section>
  )
}

export { styles as editorialStyles }
