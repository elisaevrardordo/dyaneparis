import Link from 'next/link'

export default function ProductGrid() {
    const products = [
        { name: 'Dyane No.1 - PORNSTAR MARTINI', href: '/products/dyane-paris-pornstar-martini-70-cl' },
        { name: 'Dyane No.2 - MOSCOW MULE', href: '/products/dyane-no2-moscow-mule' },
        { name: 'TEO FOR DYANE PARIS', href: '/products/bouteille-signee-teokaykay' },
    ]
    return (
        <section style={{ background: '#fff', padding: '0 24px 60px' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
                {products.map((p) => (
                    <div key={p.name} style={{ flex: '1', minWidth: '260px', maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{ width: '100%', aspectRatio: '3/4', background: '#f4f4f4', marginBottom: '12px' }} />
                        <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>{p.name}</p>
                        <Link href="/pages/contact" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>Contacter la Conciergerie</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
