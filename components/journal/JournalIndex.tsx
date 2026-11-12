import Link from 'next/link'
import { journalText } from '@/content/journal'
import { journalArchives, journalCategory, journalFilters, journalFilterLabel, journalIndexTitle, journalSelection } from '@/content/journalPresentation'
import { localizedPath } from '@/i18n/paths'
import { cartFontVariables } from '@/components/cart/fonts'
import JournalStoryMedia from './JournalStoryMedia'
import styles from './JournalIndex.module.css'

export default function JournalIndex({ locale, category, page: requestedPage }: { locale: string; category?: string; page?: string }) {
  const en = locale === 'en'
  const selection = journalSelection(category, requestedPage)
  const path = (href: string) => localizedPath(locale, href)
  const indexUrl = (filter: string, page = 1) => {
    const query = new URLSearchParams()
    if (filter !== 'all') query.set('rubrique', filter)
    if (page > 1) query.set('page', String(page))
    return `${path('/le-journal')}${query.size ? `?${query}` : ''}`
  }
  const article = selection.featured && journalArchives.find(article => `/le-journal/${article.slug}` === selection.featured?.href)
  const date = article?.datePublished
  return <main className={`${styles.page} ${cartFontVariables}`} lang={locale}>
    <header className={styles.opening}>
      <p className={styles.eyebrow}>DYANE PARIS</p>
      <h1>{en ? 'The Journal' : 'Le Journal'}</h1>
      <p>{en ? 'Creations, craftsmanship, the art of hosting and encounters. The Journal explores the connections between art, porcelain and cocktails through the life of the House.' : 'Créations, savoir-faire, art de recevoir et rencontres. Le Journal explore les liens entre l’art, la porcelaine et le cocktail, au fil de la vie de la Maison.'}</p>
    </header>
    {selection.featured && <article className={styles.feature} data-featured-story={selection.featured.href}>
      <JournalStoryMedia story={selection.featured} locale={locale} priority />
      <div className={styles.featureCopy}>
        <p className={styles.eyebrow}>{en ? 'IN FOCUS' : 'À LA UNE'} · {journalFilterLabel(journalCategory(selection.featured), locale)}</p>
        <h2><Link href={path(selection.featured.href)}>{journalIndexTitle(selection.featured, locale)}</Link></h2>
        <p>{journalText(selection.featured.excerpt, locale)}</p>
        {date && <time dateTime={date}>{new Intl.DateTimeFormat(en ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))}</time>}
        <Link className={styles.read} href={path(selection.featured.href)}>{en ? 'Read the story' : 'Lire le récit'}</Link>
      </div>
    </article>}
    <section className={styles.selection} id="journal-selection" aria-label={en ? 'Editorial selection' : 'Sélection éditoriale'}>
      <nav className={styles.filters} aria-label={en ? 'Journal categories' : 'Rubriques du Journal'}>
        {journalFilters.map(filter => <Link key={filter} href={indexUrl(filter)} aria-current={selection.filter === filter ? 'page' : undefined}>{journalFilterLabel(filter, locale)}</Link>)}
      </nav>
      <p className={styles.count}>{selection.total} {en ? 'stories' : 'récits'} · {en ? 'Page' : 'Page'} {selection.page} / {selection.pageCount}</p>
      <div className={styles.grid}>
        {selection.entries.map(story => <article className={styles.entry} key={story.href} data-journal-story={story.href}>
          <JournalStoryMedia story={story} locale={locale} />
          <p className={styles.eyebrow}>{journalFilterLabel(journalCategory(story), locale)}</p>
          <h2><Link href={path(story.href)}>{journalIndexTitle(story, locale)}</Link></h2>
          <p className={styles.excerpt}>{journalText(story.excerpt, locale)}</p>
          <Link className={styles.read} href={path(story.href)}>{en ? 'Read the story' : 'Lire le récit'}</Link>
        </article>)}
      </div>
      {selection.pageCount > 1 && <nav className={styles.pagination} aria-label={en ? 'Journal pages' : 'Pages du Journal'}>
        {selection.page > 1 && <Link href={indexUrl(selection.filter, selection.page - 1)} rel="prev">{en ? 'Previous' : 'Précédent'}</Link>}
        {Array.from({ length: selection.pageCount }, (_, index) => <Link key={index} href={indexUrl(selection.filter, index + 1)} aria-current={selection.page === index + 1 ? 'page' : undefined}>{index + 1}</Link>)}
        {selection.page < selection.pageCount && <Link href={indexUrl(selection.filter, selection.page + 1)} rel="next">{en ? 'Next' : 'Suivant'}</Link>}
      </nav>}
    </section>
    <section className={styles.archives} aria-labelledby="journal-archives-title">
      <h2 id="journal-archives-title">{en ? 'The archives' : 'Les archives'}</h2>
      <details>
        <summary>{en ? 'Explore every published story' : 'Retrouver tous les récits publiés'} <span>{journalArchives.length}</span></summary>
        <ul>{journalArchives.map(article => <li key={article.slug}><Link href={path(`/le-journal/${article.slug}`)}>{journalText(article.title, locale)}</Link>{article.datePublished && <time dateTime={article.datePublished}>{new Intl.DateTimeFormat(en ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${article.datePublished}T12:00:00Z`))}</time>}</li>)}</ul>
      </details>
    </section>
  </main>
}
