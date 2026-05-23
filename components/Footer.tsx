'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }

export default function Footer() {
    const t = useTranslations('footer')
    return (
        <footer style={{ background: '#fff', color: '#000', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <Link href="/" aria-label="Retour a l accueil">
                        <img src="/LogoDYANE_blanc.png" alt="Dyane Paris" style={{ height: '70px', width: 'auto', display: 'inline-block', filter: 'invert(1)' }} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', borderTop: '1px solid rgba(0,0,0,0.10)', paddingTop: '40px' }}>
                    <div>
                        <Link href="/oeuvres" style={{ ...font, display: 'block', fontSize: '13px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '16px' }}>
                            {t('collections')}
                        </Link>
                        <Link href="/oeuvres/dyane-paris-pornstar-martini-70-cl" style={{ ...font, display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '10px', opacity: 0.7 }}>
    CHAPITRE I
</Link>
<Link href="/oeuvres/dyane-no2-moscow-mule" style={{ ...font, display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '10px', opacity: 0.7 }}>
    CHAPITRE II
</Link>
<Link href="/oeuvres/bouteille-signee-teokaykay" style={{ ...font, display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.7 }}>
    TEO FOR DYANE
</Link>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.10)', paddingLeft: '32px' }}>
                        <Link href="/la-maison" style={{ ...font, display: 'block', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none', marginBottom: '14px' }}>
                            {t('maison')}
                        </Link>
                        <Link href="/le-journal" style={{ ...font, display: 'block', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none', marginBottom: '14px' }}>
                            {t('journal')}
                        </Link>
                        <Link href="/experiences" style={{ ...font, display: 'block', fontSize: '18px', fontWeight: '500', color: '#000', textDecoration: 'none' }}>
                            {t('experiences')}
                        </Link>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.10)', paddingLeft: '32px' }}>
                        <p style={{ ...font, fontSize: '13px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', margin: '0 0 16px' }}>
                            {t('aide_titre')}
                        </p>
                        <Link href="/faq" style={{ ...font, display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', marginBottom: '10px', opacity: 0.7 }}>
                            {t('aide_faq')}
                        </Link>
                        <Link href="/contact" style={{ ...font, display: 'block', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.7 }}>
                            {t('aide_contact')}
                        </Link>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    {[
                        { label: t('legal'), href: '/mentions-legales' },
                        { label: t('cgv'), href: '/cgv' },
                        { label: t('confidentialite'), href: `/${locale}/confidentialite` },
                        { label: t('cookies'), href: '/cookies' },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href} style={{ ...font, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', opacity: 0.6 }}>
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
            <div style={{ background: '#1a1a1a', color: '#fff', padding: '14px 24px', textAlign: 'center' }}>
                <p style={{ ...font, margin: 0, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
                    {t('alcool')}
                </p>
            </div>
        </footer>
    )
}
