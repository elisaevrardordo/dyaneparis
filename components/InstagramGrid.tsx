export default function InstagramGrid() {
    return (
        <section style={{ background: '#fff', padding: '4px 24px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', padding: '14px 0 26px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>INSTAGRAM</p>
                    <a href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000', fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '20px' }}>@DYANEPARIS_</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
                    {[1, 2, 3, 4].map((i) => (
                        <a key={i} href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ display: 'block', aspectRatio: '1/1', background: '#f0ede8' }} />
                    ))}
                </div>
            </div>
        </section>
    )
}
