export default function HeroVideo() {
    return (
        <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0d0d0d' }}>
            <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: '#fff', whiteSpace: 'nowrap' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.75, margin: 0 }}>EN AVANT-PREMIERE</p>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1, margin: '16px 0' }}>DYANE PARIS, MAISON D&apos;ART LIQUIDE</h1>
            </div>
        </section>
    )
}
