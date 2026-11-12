import { produits } from '@/components/data/productDetails'
import { imageRightsFor, imageRightsMetadata } from '@/lib/imageRights'

// Compatibility view of the single, human-validated rights register.
// Historical automatic credits are not independent photographer evidence.
export const productImageRights = Object.fromEntries(
    Array.from(new Set(Object.values(produits).flatMap((product) => product.images))).map((url) => {
        const rights = imageRightsFor(url)
        return [url, {
            registryId: rights?.id,
            status: rights?.status ?? 'UNMATCHED',
            classification: rights?.classification,
            evidence: rights ? ['inventaire-images-dyane-paris-droits-final.csv'] : [],
            currentMetadata: imageRightsMetadata(url),
        }]
    }),
)

export const legacyNo1ImageReview = {
    publicId: '63_fimus0',
    status: 'REVIEW' as const,
    officialEquivalent: null,
    reason: 'Absent du site actuel et du dernier inventaire Cloudinary consulté ; aucune correspondance certaine établie.',
}
