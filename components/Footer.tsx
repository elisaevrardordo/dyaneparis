import Link from 'next/link'

export default function Footer() {
    return (
          <footer style={{ background: '#fff', color: '#000', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                        <Link href="/" aria-label="Retour a l accueil">
                                                    <img
                                                                    src="https://cdn.shopify.com/s/files/1/0939/4998/5143/files/LogoDYNANE_noir_90bacb21-ee5f-441d-ba8a-7f121a192c2a.svg?v=1768902066"
                                                                    alt="Dyane Paris"
                                                                    style={{ height: '70px', width: 'auto', display: 'inline-block' }}
                                                                  />
                                        </Link>Link>
                            </div>div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', borderTop: '1px solid rgba(0,0,0,0.10)', paddingTop: '40px' }}>
                                    <div>
                                                <Link href="/collections" style={{ display: 'block', fontSize: '13px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '16px' }}>
                                                              COLLECTIONS
                                                </Link>Link>
                                                <Link href="/products/dyane-paris-pornstar-martini-70-cl" style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '10px', opacity: 0.7 }}>
                                                              CHAPITRE I
                                                </Link>Link>
                                                <Link href="/products/bouteille-signee-teokaykay" style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.7 }}>
                                                              TEO FOR DYANE
                                                </Link>Link>
                                    </div>div>
                                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.10)', paddingLeft: '32px' }}>
                                                <Link href="/pages/la-maison" style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none', marginBottom: '14px' }}>
                                                              LA MAISON
                                                </Link>Link>
                                                <Link href="/blogs/journal" style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none', marginBottom: '14px' }}>
                                                              LE JOURNAL
                                                </Link>Link>
                                                <Link href="/pages/experiences" style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none' }}>
                                                              EXPERIENCES
                                                </Link>Link>
                                    </div>div>
                                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.10)', paddingLeft: '32px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', margin: '0 0 16px' }}>
                                                              BESOIN D&apos;AIDE ?
                                                </p>p>
                                                <Link href="/pages/service-aide" style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '10px', opacity: 0.7 }}>
                                                              SERVICE D&apos;AIDE
                                                </Link>Link>
                                                <Link href="/pages/contact" style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.7 }}>
                                                              CONTACTEZ LA MAISON
                                                </Link>Link>
                                    </div>div>
                          </div>div>
                  </div>div>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                          {[
            { label: 'MENTIONS LEGALES', href: '/pages/mentions-legales' },
            { label: 'CGV', href: '/pages/cgv' },
            { label: 'CONFIDENTIALITE', href: '/policies/privacy-policy' },
            { label: 'COOKIES', href: '/pages/cookies' },
                      ].map(({ label, href }) => (
                                    <Link key={label} href={href} style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.6 }}>
                                      {label}
                                    </Link>Link>
                                  ))}
                        </div>div>
                </div>div>
                <div style={{ background: '#1a1a1a', color: '#fff', padding: '14px 24px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
                                  L&apos;ABUS D&apos;ALCOOL EST DANGEREUX POUR LA SANTE. A CONSOMMER AVEC MODERATION.
                        </p>p>
                </div>div>
          </footer>footer>
        )
}</Link>
