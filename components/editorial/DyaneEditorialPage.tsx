import Link from 'next/link'
import type { ReactNode } from 'react'
import EditorialImage from './EditorialImage'
import EditorialEmblem from './EditorialEmblem'
import EditorialFilm from './EditorialFilm'
import { cartFontVariables } from '@/components/cart/fonts'
import { localizedPath } from '@/i18n/paths'
import type { EditorialChapter, EditorialLink, EditorialPageContent } from '@/content/editorialPages'
import dimensions from '@/content/editorialMediaDimensions.json'
import styles from './DyaneEditorialPage.module.css'
import actionStyles from './EditorialAction.module.css'

export type DyaneEditorialMedia = {
  src?: string; poster?: string; alt?: string; type?: 'image' | 'video'
  fit?: 'cover' | 'contain'; position?: string; caption?: string; href?: string
}

function Media({ item, locale, priority = false }: { item: DyaneEditorialMedia; locale: string; priority?: boolean }) {
  if (!item.src) return null
  const sizes = dimensions as Record<string, { width: number; height: number }>
  const size = sizes[item.src] || sizes[item.poster || ''] || { width: 1080, height: 1350 }
  const figure = <figure className={styles.media} data-editorial-media data-media-src={item.src} data-media-poster={item.poster}>
    {item.type === 'video'
      ? <EditorialFilm src={item.src} poster={item.poster} label={item.alt || ''} width={size.width} height={size.height} priority={priority} />
      : <EditorialImage src={item.src} alt={item.alt || ''} width={size.width} height={size.height}
          sizes={item.caption ? '(max-width: 760px) 100vw, 50vw' : priority ? '(max-width: 760px) 90vw, 1040px' : '(max-width: 760px) 90vw, (max-width: 1050px) 44vw, 35vw'}
          quality={85} priority={priority} className={styles.image} />}
    {item.caption && <figcaption className={styles.mediaCaption}>{item.caption}</figcaption>}
  </figure>
  if (!item.href) return figure
  const href = item.href.startsWith('#') ? item.href : localizedPath(locale, item.href)
  return <Link className={styles.mediaLink} href={href} aria-label={item.caption}>{figure}</Link>
}

function EditorialHeading({ title, text, eyebrow, id, as: Heading = 'h2', textClassName }: {
  title: string
  text: string | string[]
  eyebrow?: string
  id?: string
  as?: 'h1' | 'h2'
  textClassName?: string
}) {
  return <>
    {eyebrow && <>
      <EditorialEmblem />
      <p className={styles.eyebrow}>{eyebrow}</p>
    </>}
    <Heading id={id}>{title}</Heading>
    {typeof text === 'string'
      ? <p className={textClassName}>{text}</p>
      : text.map(paragraph => <p key={paragraph} className={textClassName}>{paragraph}</p>)}
  </>
}

export default function DyaneEditorialPage({ page, locale, afterPrelude }: { page: EditorialPageContent; locale: string; afterPrelude?: ReactNode }) {
  const links = (items: EditorialLink[]) => <nav className={styles.links} aria-label={locale === 'en' ? 'Continue exploring' : 'Poursuivre la découverte'}>
    {items.map(item => <Link key={item.href} href={localizedPath(locale, item.href)} className={item.variant === 'button' ? actionStyles.button : styles.textLink}>{item.label}</Link>)}
  </nav>
  const renderChapter = (chapter: EditorialChapter, index: number) => {
    const featured = chapter.layout === 'feature'
    const prelude = chapter === page.prelude
    const copy = <div className={styles.copy}>
      <EditorialHeading
        id={`chapter-${chapter.id}`}
        as={prelude && !page.introduction ? 'h1' : 'h2'}
        title={chapter.title}
        text={chapter.text}
        eyebrow={chapter.eyebrow ?? (featured ? undefined : `${String(index + 1).padStart(2, '0')} · ${page.eyebrow}`)}
      />
      {chapter.links && links(chapter.links)}
    </div>
    const gallery = <div className={styles.gallery} data-page-hero={prelude || undefined} data-header-foreground={prelude ? 'white' : undefined}>
      {chapter.media.map((item, mediaIndex) => (
        <Media item={item} locale={locale} key={`${item.src}-${mediaIndex}`} priority={prelude && mediaIndex === 0} />
      ))}
    </div>
    return <section key={chapter.id} className={styles.chapter} data-layout={chapter.layout} aria-labelledby={`chapter-${chapter.id}`}>
      {featured ? <>{gallery}{copy}</> : <>{copy}{gallery}</>}
    </section>
  }
  return <main className={`${styles.page} ${cartFontVariables}`} lang={locale} data-editorial-page={page.slug} data-editorial-prelude={page.prelude ? true : undefined}>
    {page.prelude && renderChapter(page.prelude, 0)}
    {afterPrelude}
    {page.introduction && <header className={styles.opening}>
      <EditorialHeading as="h1" title={page.title} text={page.introduction} eyebrow={page.eyebrow} textClassName={styles.introduction} />
    </header>}
    {page.hero && <div className={styles.hero} data-page-hero={!page.prelude || undefined} data-header-foreground="black"><Media item={page.hero} locale={locale} priority={!page.prelude} /></div>}
    {page.chapters.map(renderChapter)}
    <section className={styles.closing} aria-label={page.closing?.title || (locale === 'en' ? 'Explore the House' : 'Découvrir la Maison')}>
      {page.closing?.media?.map(item => <div className={styles.finalMedia} key={item.src}><Media item={item} locale={locale} /></div>)}
      {page.closing && <EditorialHeading {...page.closing} />}
      {links(page.links)}
    </section>
  </main>
}
