import { journalIndexStories, type JournalIndexStory } from './journalIndex'
import { journalPublishedArticles } from './journal'
import { michelRothArticle } from './journalMichelRoth'

export const journalFilters = ['all', 'creations', 'savoir-faire', 'art-de-recevoir', 'rencontres'] as const
export type JournalFilter = typeof journalFilters[number]
export const JOURNAL_PAGE_SIZE = 6
export const featuredJournalHref = `/le-journal/${michelRothArticle.slug}`

export function journalCategory(story: JournalIndexStory): JournalFilter {
  if (story.href === '/le-journal/cocktail-oeuvre-collectionner') return 'creations'
  return ({ cocktails: 'creations', craftsmanship: 'savoir-faire', hospitality: 'art-de-recevoir', 'art-collaborations': 'rencontres' } as const)[story.filter]
}
export function journalFilterLabel(filter: JournalFilter, locale: string) {
  return ({ all: ['Tous', 'All'], creations: ['Créations', 'Creations'], 'savoir-faire': ['Savoir-faire', 'Craftsmanship'], 'art-de-recevoir': ['Art de recevoir', 'Art of hosting'], rencontres: ['Rencontres', 'Encounters'] } as const)[filter][locale === 'en' ? 1 : 0]
}
export function journalSelection(category: unknown, requestedPage: unknown) {
  const filter: JournalFilter = journalFilters.includes(category as JournalFilter) ? category as JournalFilter : 'all'
  const featured = journalIndexStories.find(story => story.href === featuredJournalHref)!
  const entries = journalIndexStories.filter(story => story.href !== featuredJournalHref && (filter === 'all' || journalCategory(story) === filter))
  const pageCount = Math.max(1, Math.ceil(entries.length / JOURNAL_PAGE_SIZE))
  const pageValue = typeof requestedPage === 'string' && /^\d{1,5}$/.test(requestedPage) ? Number(requestedPage) : 1
  const page = Math.min(pageCount, Math.max(1, pageValue))
  return { filter, page, pageCount, total: entries.length,
    featured: page === 1 && (filter === 'all' || filter === 'rencontres') ? featured : null,
    entries: entries.slice((page - 1) * JOURNAL_PAGE_SIZE, page * JOURNAL_PAGE_SIZE),
  }
}

export function journalIndexTitle(story: JournalIndexStory, locale: string) {
  if (story.href === '/le-journal/teo-for-dyane') return 'Teo for Dyane'
  if (story.href === '/le-journal/pressiat-dyane-fashion-week') return 'Pressiat × Dyane Paris'
  return story.title[locale === 'en' ? 'en' : 'fr']
}

// The complete published catalogue, including the existing Rungis article absent from the old index.
// Article contents, dates, credits, media and canonical URLs remain in their original data source.
export const journalArchives = journalPublishedArticles
