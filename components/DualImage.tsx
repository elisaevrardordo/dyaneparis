import Link from 'next/link'

export default function DualImage() {
    return (
        <section style={{ background: '#fff', padding: '68px 24px 72px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'start' }}>
                <div>
                    <p style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 10px' }}>DYANE CUVEE PRESTIGE</p>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.05, margin: '0 0 22px', textTransform: 'uppercase' }}>LA DISTILLATION ARTISANALE FRANCAISE</h2>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, opacity: 0.8, maxWidth: '360px' }}>Notre distillation en France incarne l&apos;exigence de la Maison : precision, purete, constance.</p>
                    <Link href="/pages/distillation" style={{ display: 'inline-block', marginTop: '24px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.4)', textDecoration: 'none', color: '#000', paddingBottom: '6px' }}>EN LIRE PLUS</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', alignItems: 'end' }}>
                    <div style={{ background: '#e8e4df', height: '280px' }} />
                    <div style={{ background: '#d4cec8', height: '680px' }} />
                </div>
            </div>
        </section>
    )
}
