import Link from 'next/link'
import type {
    JournalArticle as JournalArticleType,
    JournalBlock,
    JournalImage,
    JournalMedia,
    LocalizedText,
} from '@/content/journal'
import { journalText } from '@/content/journal'
import { journalIndexStoryByHref } from '@/content/journalIndex'
import { localizedPath } from '@/i18n/paths'
import styles from './Journal.module.css'
import JournalMediaView from './JournalMedia'

type TextPiece = {
    headings: readonly LocalizedText[]
    paragraph?: LocalizedText
    quote?: boolean
}

function mediaFromBlock(block: JournalBlock): readonly JournalMedia[] {
    if (block.kind === 'media' || block.kind === 'image-text') return [block.media]
    if (block.kind === 'diptych') return [block.left, block.right]
    if (block.kind === 'triptych' || block.kind === 'gallery-strip') return block.media
    return []
}

function articleImages(article: JournalArticleType): readonly JournalImage[] {
    const articleMedia: readonly (JournalMedia | undefined)[] = [
        article.cover,
        article.indexSecondary,
        article.indexTertiary,
        article.heroSecondary,
        ...article.blocks.flatMap(mediaFromBlock),
    ]

    const articleImagesBySrc = new Map(
        articleMedia
            .filter((media): media is JournalImage => media?.kind === 'image')
            .map((media) => [media.src, media]),
    )
    const indexStory = journalIndexStoryByHref[`/le-journal/${article.slug}`]
    const currentIndexImages = indexStory?.images.filter(
        (media): media is JournalImage => media.kind === 'image',
    ) ?? []
    const captionedIndexImages = currentIndexImages.filter(
        (media) => Boolean(articleImagesBySrc.get(media.src)?.caption),
    )
    const currentSelection = captionedIndexImages.length >= 2
        ? captionedIndexImages.slice(0, 2)
        : [currentIndexImages[0], currentIndexImages[currentIndexImages.length - 1]]
            .filter((media): media is JournalImage => Boolean(media))
    const candidates: readonly (JournalMedia | undefined)[] = currentSelection.length > 0
        ? currentSelection.map((media) => {
            const articleVersion = articleImagesBySrc.get(media.src)
            return articleVersion?.caption ? { ...media, caption: articleVersion.caption } : media
        })
        : articleMedia

    const seen = new Set<string>()
    return candidates.filter((media): media is JournalImage => {
        if (media?.kind !== 'image' || seen.has(media.src)) return false
        seen.add(media.src)
        return true
    }).slice(0, 2)
}

function articleText(article: JournalArticleType): readonly TextPiece[] {
    const chapterAt = new Map(article.chapters.map((chapter) => [chapter.start, chapter.title]))
    const pieces: TextPiece[] = []
    let pendingChapter: LocalizedText | undefined

    article.blocks.forEach((block, blockIndex) => {
        pendingChapter = chapterAt.get(blockIndex) ?? pendingChapter

        if (block.kind === 'text' || block.kind === 'image-text') {
            const headings = [pendingChapter, block.heading]
                .filter((heading): heading is LocalizedText => Boolean(heading))
                .filter((heading, index, allHeadings) => allHeadings.findIndex(
                    (candidate) => candidate.fr === heading.fr && candidate.en === heading.en,
                ) === index)

            if (block.paragraphs.length === 0 && headings.length > 0) {
                pieces.push({ headings })
            } else {
                block.paragraphs.forEach((paragraph, paragraphIndex) => {
                    pieces.push({
                        headings: paragraphIndex === 0 ? headings : [],
                        paragraph,
                    })
                })
            }

            pendingChapter = undefined
            return
        }

        if (block.kind === 'quote') {
            pieces.push({
                headings: pendingChapter ? [pendingChapter] : [],
                paragraph: block.text,
                quote: true,
            })
            pendingChapter = undefined
        }
    })

    if (pendingChapter) pieces.push({ headings: [pendingChapter] })
    return pieces
}

function splitText(pieces: readonly TextPiece[]): readonly [readonly TextPiece[], readonly TextPiece[]] {
    if (pieces.length < 2) return [pieces, []]
    const splitAt = Math.ceil(pieces.length / 2)
    return [pieces.slice(0, splitAt), pieces.slice(splitAt)]
}

function EditorialCopy({
    title,
    pieces,
    locale,
}: {
    title?: string
    pieces: readonly TextPiece[]
    locale: string
}) {
    return (
        <div className={styles.editorialArticleCopyInner}>
            {title ? <h1>{title}</h1> : null}
            <div className={styles.editorialArticleText}>
                {pieces.map((piece, pieceIndex) => (
                    <div className={styles.editorialArticlePiece} key={pieceIndex}>
                        {piece.headings.map((heading, headingIndex) => (
                            <h2 key={headingIndex}>{journalText(heading, locale)}</h2>
                        ))}
                        {piece.paragraph ? (
                            piece.quote
                                ? <blockquote>{journalText(piece.paragraph, locale)}</blockquote>
                                : <p>{journalText(piece.paragraph, locale)}</p>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

function EditorialMediaPanel({
    media,
    locale,
    priority = false,
}: {
    media?: JournalImage
    locale: string
    priority?: boolean
}) {
    return (
        <div className={styles.editorialArticleMedia}>
            {media ? (
                <JournalMediaView
                    media={media}
                    locale={locale}
                    priority={priority}
                    showCaption
                    sizes="(max-width: 800px) 100vw, 50vw"
                />
            ) : null}
        </div>
    )
}

type JournalArticleProps = {
    article: JournalArticleType
    previous?: JournalArticleType
    next?: JournalArticleType
    locale: string
}

export default function JournalArticle({ article, previous, next, locale }: JournalArticleProps) {
    const isEnglish = locale === 'en'
    const title = journalText(article.title, locale).replace(/\s+[—–-]\s+/g, ', ')
    const images = articleImages(article)
    const [firstText, secondText] = splitText(articleText(article))

    return (
        <main className={`theme-page ${styles.journalPage} ${styles.articlePage}`}>
            <article className={styles.editorialArticle}>
                <section className={styles.editorialArticleSpread}>
                    <EditorialMediaPanel media={images[0]} locale={locale} priority />
                    <div className={styles.editorialArticleCopy}>
                        <EditorialCopy title={title} pieces={firstText} locale={locale} />
                    </div>
                </section>

                <section className={`${styles.editorialArticleSpread} ${styles.editorialArticleSpreadReverse}`}>
                    <EditorialMediaPanel media={images[1]} locale={locale} />
                    <div className={styles.editorialArticleCopy}>
                        <EditorialCopy pieces={secondText} locale={locale} />
                    </div>
                </section>
            </article>

            {article.credits?.length ? (
                <section className={styles.credits} aria-labelledby="journal-credits-title">
                    <h2 id="journal-credits-title">{isEnglish ? 'Credits' : 'Crédits'}</h2>
                    <dl>
                        {article.credits.map((credit) => (
                            <div key={`${credit.name}-${journalText(credit.role, locale)}`}>
                                <dt>{journalText(credit.role, locale)}</dt>
                                <dd>{credit.name}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}

            {article.relatedLinks?.length ? (
                <nav className={styles.articleConnections} aria-label={isEnglish ? 'Continue exploring' : 'Poursuivre la découverte'}>
                    <p>{isEnglish ? 'Continue exploring' : 'Dans le Journal'}</p>
                    <div>
                        {article.relatedLinks.map((link) => (
                            <Link className={styles.connectionLink} href={localizedPath(locale, link.href)} key={link.href}>
                                <span>{journalText(link.label, locale)}</span>
                                <span aria-hidden="true">↗</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            ) : null}

            <nav className={styles.articlePagination} aria-label={isEnglish ? 'Other Journal stories' : 'Autres récits du Journal'}>
                {previous ? (
                    <Link className={styles.paginationLink} href={localizedPath(locale, `/le-journal/${previous.slug}`)}>
                        <span>← {isEnglish ? 'Previous' : 'Précédent'}</span>
                        <strong>{journalText(previous.title, locale)}</strong>
                    </Link>
                ) : <span />}
                {next ? (
                    <Link className={styles.paginationLink} href={localizedPath(locale, `/le-journal/${next.slug}`)}>
                        <span>{isEnglish ? 'Next' : 'Suivant'} →</span>
                        <strong>{journalText(next.title, locale)}</strong>
                    </Link>
                ) : <span />}
            </nav>
        </main>
    )
}
