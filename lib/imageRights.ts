import registry from '@/content/imageRightsRegistry.json'

// Rights ownership and permission to use an image do not identify its photographer.
// The validated register does not yet contain verified photographer/credit fields.
// No public licence or permission to sublicense is inferred from either status.
export function imageRightsKey(value: string): string | null {
    try {
        let url = new URL(value, 'https://www.dyaneparis.com')
        if (url.origin === 'https://www.dyaneparis.com' && url.pathname === '/_next/image') {
            const source = url.searchParams.get('url')
            if (!source) return null
            url = new URL(source, 'https://www.dyaneparis.com')
        }
        if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search) return null
        const path = decodeURIComponent(url.pathname)
        if (url.hostname === 'res.cloudinary.com') {
            // Keep account, media type, delivery type, version and full asset path.
            // Only delivery transformations before an explicit version are ignored.
            const match = path.match(/^\/([^/]+)\/(image|video)\/(upload)\/(?:[^/]+\/)*?(v\d+)\/(.+)$/)
            return match?.[1] === 'dazhkrimv' ? `cloudinary:${match[1]}:${match[2]}:${match[3]}:${match[4]}:${match[5]}` : null
        }
        return url.origin === 'https://www.dyaneparis.com'
            ? `${url.origin}${path}`
            : null
    } catch {
        return null
    }
}

const byKey = new Map(registry.images.flatMap((image) => image.keys.map((key) => [key, image] as const)))

export function imageRightsFor(url: string) {
    const key = imageRightsKey(url)
    return key ? byKey.get(key) : undefined
}

export function imageRightsMetadata(url: string): { copyrightNotice?: string } {
    const rights = imageRightsFor(url)
    // Confirmed ownership supports copyrightNotice, not creator or creditText.
    // Unknown assets fail closed; usage-only permission never becomes ownership.
    return rights?.status === 'CONFIRMED_DYANE' ? { copyrightNotice: 'Dyane Paris' } : {}
}
