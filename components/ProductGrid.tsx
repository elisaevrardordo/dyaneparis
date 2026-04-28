import Link from 'next/link'
import Image from 'next/image'

const products = [
    { name: 'Dyane No.1 — Pornstar Martini', href: '/contact', image: '/dyane-no1.png' },
    { name: 'Dyane No.2 — Moscow Mule', href: '/contact', image: '/dyane-no2.png' },
    { name: 'Teo for Dyane Paris', href: '/contact', image: '/dyane-teo.png' },
]

export default function ProductGrid() {
    return (
        <section style={{ background: '#fff', padding: '0 24px 60px' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
                {products.map((p) => (
                    <div key={p.name} style={{ flex: '1', minWidth: '260px', maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{ width: '100%', aspectRatio: '3/4', position: 'relative', marginBottom: '12px' }}>
                            <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>{p.name}</p>
                        <Link href="/contact" style={{ fontFamily: 'Playfair Display, serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>Contacter la Conciergerie</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
