mport Link from 'next/link'

export default function Manifeste() {
    return (
          <section style={{ background: '#fff', padding: '72px 24px', textAlign: 'center' }}>
                  <div style={{ maxWidth: '920px', margin: '0 auto' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 16px' }}>DYANE PARIS</p>p>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: 'clamp(22px, 3.2vw, 30px)', letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' }}>MAISON D&apos;ART LIQUIDE</h2>h2>
                            <div style={{ width: '96px', height: '1px', background: 'rgba(0,0,0,0.14)', margin: '24px auto 30px' }} />
                            <p style={{ fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.82, margin: '10px 0' }}>LE COCKTAIL ELEVE AU RANG D&apos;OEUVRE.</p>p>
                            <p style={{ fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.82, margin: '10px 0' }}>CHAQUE BOUTEILLE EST UNE EXPERIENCE A VIVRE, PUIS A CONSERVER.</p>p>
                            <Link href="/pages/la-maison" style={{ display: 'inline-block', marginTop: '28px', padding: '12px 18px', textDecoration: 'none', color: '#000', border: '1px solid rgba(0,0,0,0.20)', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase' }}>DECOUVRIR LA MAISON</Link>Link>
                  </div>div>
          </section>section>
        )
}
