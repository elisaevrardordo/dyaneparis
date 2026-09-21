'use client'

import Link from 'next/link'
import { useRef, useState, type CSSProperties } from 'react'
import { journalText } from '@/content/journal'
import { journalIndexStories, type JournalIndexCategory } from '@/content/journalIndex'
import { localizedPath } from '@/i18n/paths'
import styles from './Journal.module.css'
import JournalMediaView from './JournalMedia'

type Story = (typeof journalIndexStories)[number]
type JournalMediaCellStyle = CSSProperties & { '--journal-overlap'?: string }
type JournalFilter = 'all' | JournalIndexCategory

const JOURNAL_FILTERS: readonly JournalFilter[] = [
    'all',
    'hospitality',
    'cocktails',
    'craftsmanship',
    'art-collaborations',
]

const filterLabel = (filter: JournalFilter, isEnglish: boolean) => {
    const labels: Record<JournalFilter, readonly [string, string]> = {
        all: ['TOUS', 'ALL'],
        hospitality: ['HOSPITALITÉ', 'HOSPITALITY'],
        cocktails: ['COCKTAILS', 'COCKTAILS'],
        craftsmanship: ['SAVOIR-FAIRE', 'CRAFTSMANSHIP'],
        'art-collaborations': ['ART & COLLABORATIONS', 'ART & COLLABORATIONS'],
    }

    return labels[filter][isEnglish ? 1 : 0]
}

function JournalEditorialRow({ story, index, locale }: { story: Story; index: number; locale: string }) {
    const isEnglish = locale === 'en'
    const href = localizedPath(locale, story.href)
    const columns = story.indexLayout?.columns ?? [1.42, 0.7, 0.88]
    const compositionStyle: CSSProperties = {
        gridTemplateColumns: columns
            .map((column) => `minmax(0, ${column}fr)`)
            .join(' '),
    }

    return (
        <article className={styles.storyEntry} data-variant={story.variant}>
            <div className={styles.storyCopy}>
                <p className={styles.storyNumber}>{String(index + 1).padStart(2, '0')}</p>
                <p className={styles.storyMeta}>
                    {journalText(story.category, locale)}<br />
                    {journalText(story.rubric, locale)}
                </p>
                <h2><Link href={href}>{journalText(story.title, locale)}</Link></h2>
                {story.subtitle && <p className={styles.storySubtitle}>{journalText(story.subtitle, locale)}</p>}
                <p className={styles.storyExcerpt}>{journalText(story.excerpt, locale)}</p>
                <Link className={styles.readLink} href={href}>
                    {isEnglish ? 'Read the story' : 'Lire le récit'} <span aria-hidden="true">↗</span>
                </Link>
            </div>

            <Link
                className={styles.indexComposition}
                href={href}
                aria-label={journalText(story.title, locale)}
                data-media-count={story.images.length}
                data-layout={story.variant}
                style={compositionStyle}
            >
                {story.images.map((item, mediaIndex) => {
                    const overlap = story.indexLayout?.overlap
                    const hasRightOverlap = overlap?.image === mediaIndex + 1
                    const mediaStyle = hasRightOverlap
                        ? { '--journal-overlap': overlap.amount } as JournalMediaCellStyle
                        : undefined

                    return (
                        <div
                            className={styles.indexMediaCell}
                            data-prominence={story.images.length === 3 && mediaIndex === 0 ? 'wide' : 'standard'}
                            data-overlap={hasRightOverlap ? 'right' : undefined}
                            style={mediaStyle}
                            key={item.kind === 'placeholder' ? item.replacementKey : `${item.src}-${mediaIndex}`}
                        >
                            <JournalMediaView
                                media={item}
                                locale={locale}
                                priority={index === 0 && mediaIndex === 0}
                                sizes="(max-width: 800px) 100vw, 38vw"
                            />
                        </div>
                    )
                })}
            </Link>
        </article>
    )
}

export default function JournalIndex({ locale }: { locale: string }) {
    const isEnglish = locale === 'en'
    const [activeFilter, setActiveFilter] = useState<JournalFilter>('all')
    const archiveRef = useRef<HTMLElement>(null)

    const selectFilter = (filter: JournalFilter) => {
        setActiveFilter(filter)
        window.requestAnimationFrame(() => {
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            archiveRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        })
    }

    return (
        <main className={`theme-page ${styles.journalPage} ${styles.indexPage}`}>
            <header className={styles.indexHeader}>
                <h1>{isEnglish ? 'THE JOURNAL' : 'LE JOURNAL'}</h1>
                <nav className={styles.indexFilters} aria-label={isEnglish ? 'Filter journal stories' : 'Filtrer les récits du Journal'}>
                    {JOURNAL_FILTERS.map((filter) => (
                        <button
                            className={styles.indexFilter}
                            type="button"
                            aria-controls="journal-archive"
                            aria-pressed={activeFilter === filter}
                            data-active={activeFilter === filter}
                            onClick={() => selectFilter(filter)}
                            key={filter}
                        >
                            {filterLabel(filter, isEnglish)}
                        </button>
                    ))}
                </nav>
            </header>

            <section
                ref={archiveRef}
                id="journal-archive"
                className={styles.storyArchive}
                data-filter={activeFilter}
                aria-label={isEnglish ? 'Journal stories' : 'Récits du Journal'}
            >
                {journalIndexStories.map((story, index) => (
                    (activeFilter === 'all' || story.filter === activeFilter)
                        ? <JournalEditorialRow story={story} index={index} locale={locale} key={story.href} />
                        : null
                ))}
            </section>
        </main>
    )
}
