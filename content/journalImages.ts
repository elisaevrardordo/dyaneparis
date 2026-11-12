import type { JournalArticle as JournalArticleType, JournalBlock, JournalImage, JournalMedia } from './journal'
import { journalIndexStoryByHref } from './journalIndex'

// Exactly the image selection used by the rendered article; metadata and sitemap
// must not advertise historical blocks that the two-image layout no longer shows.
function mediaFromBlock(block: JournalBlock): readonly JournalMedia[] {
    if (block.kind === 'media' || block.kind === 'image-text') return [block.media]
    if (block.kind === 'diptych') return [block.left, block.right]
    if (block.kind === 'triptych' || block.kind === 'gallery-strip') return block.media
    return []
}

export function articleImages(article: JournalArticleType): readonly JournalImage[] {
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

