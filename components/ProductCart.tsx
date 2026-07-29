import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/components/data/products'
import { useLocale } from 'next-intl'
import { localizedPath } from '@/i18n/paths'

export default function ProductCard({ product }: { product: Product }) {
    const locale = useLocale()

    return (
        <div className="flex flex-col items-center text-center group">
            <Link href={localizedPath(locale, `/oeuvres/${product.slug}`)} className="block w-full overflow-hidden mb-4">
                <Image
                    src={product.image}
                    alt={product.alt}
                    width={400}
                    height={500}
                    sizes="(max-width: 768px) calc(100vw - 48px), 400px"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: '4/5' }}
                />
            </Link>
            <Link href={localizedPath(locale, `/oeuvres/${product.slug}`)}>
                <h3 className="title-display text-base mb-1">{product.name}</h3>
                <p className="kicker text-xs opacity-60 mb-4">{product.subtitle}</p>
            </Link>
            <Link href={localizedPath(locale, '/contact')} className="kicker text-xs hover:opacity-60 transition-opacity">
                Contacter la Conciergerie
            </Link>
        </div>
    )
}
