'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import type { JournalIndexStory } from '@/content/journalIndex'
import { localizedPath } from '@/i18n/paths'
import JournalMediaView from './JournalMedia'
import styles from './JournalIndex.module.css'

export default function JournalStoryMedia({ story, locale, priority = false }: { story: JournalIndexStory; locale: string; priority?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const select = (index: number) => {
    const element = viewport.current
    if (!element) return
    element.scrollTo({ left: index * element.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const english = locale === 'en'
  const title = story.title[english ? 'en' : 'fr']
  const articleHref = localizedPath(locale, story.href)
  return <div className={styles.storyMedia}>
    <div ref={viewport} className={styles.mediaReel} role="group" tabIndex={0}
      aria-label={`${locale === 'en' ? 'Photographs' : 'Photographies'} - ${title}`}
      onScroll={event => setActive(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
      onKeyDown={event => {
        const index = event.key === 'ArrowRight' ? Math.min(active + 1, story.images.length - 1) : event.key === 'ArrowLeft' ? Math.max(active - 1, 0) : event.key === 'Home' ? 0 : event.key === 'End' ? story.images.length - 1 : null
        if (index !== null) { event.preventDefault(); select(index) }
      }}>
      {story.images.map((media, index) => <div className={styles.mediaFrame} key={media.kind === 'placeholder' ? media.replacementKey : `${media.src}-${index}`}
        data-journal-media data-media-src={media.kind === 'placeholder' ? undefined : media.src} data-media-poster={media.kind === 'video' ? media.poster : undefined}>
        <JournalMediaView media={media} locale={locale} priority={priority && index === 0} sizes="(max-width:760px) 90vw, (max-width:1100px) 44vw, 34vw" />
        <Link href={articleHref} className={styles.mediaLink} tabIndex={active === index ? 0 : -1}
          aria-label={`${english ? 'Read' : 'Lire'} ${title}`} />
      </div>)}
    </div>
    {story.images.length > 1 && <div className={styles.mediaNavigation} role="group" aria-label={`${locale === 'en' ? 'Choose a photograph' : 'Choisir une photographie'} - ${title}`}>
      {story.images.map((_, index) => <button type="button" key={index} onClick={() => select(index)} aria-label={`${locale === 'en' ? 'View' : 'Visuel'} ${index + 1} - ${title}`} aria-pressed={active === index} />)}
      <span aria-live="polite">{active + 1} / {story.images.length}</span>
    </div>}
  </div>
}
