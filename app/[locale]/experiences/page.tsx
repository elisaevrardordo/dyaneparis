import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }
const BG = 'rgb(252, 250, 247)'

export default function ExperiencesPage() {
    const t = useTranslations('experiences')
    return (
        <div style={{ background: BG }}>
            <section style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '80vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg" alt="Expériences Dyane" fill style={{ objectFit: 'cover' }} />
            </section>


            <section style={{ padding: '60px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>{t('kicker')}</p>
                <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>{t('titre')}</h1>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('intro1')}</p>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>{t('intro2')}</p>
            </section>

            <section style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '64px' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4 }}>{t('mesure_titre')}</h2>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('mesure_p1')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('mesure_p2')}</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('mesure_p3')}</p>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '0 80px', maxWidth: '1400px', margin: '0 auto 140px', alignItems: 'end' }}>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777413089/DSC00084_1_mjztqk.jpg" alt="Expérience Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
                <div style={{ position: 'relative', height: '680px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445376/DSC00189_2_evwuct.jpg" alt="Expérience Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            <section style={{ padding: '0 80px 140px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4, marginBottom: '28px' }}>{t('perso_titre')}</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('perso_p1')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '36px' }}>{t('perso_p2')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('perso_p3')}</p>
                        <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('perso_p4')}</p>
                    </div>
                </div>
                <div style={{ position: 'relative', height: '720px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445572/13_qpfuhh.png" alt="Personnalisation Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            <section style={{ padding: '0 80px 140px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4, marginBottom: '28px' }}>{t('ancrages_titre')}</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('ancrages_p1')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('ancrages_p2')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('ancrages_p3')}</p>
                </div>
                <div style={{ position: 'relative', height: '620px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445589/Capture_d_ecran_2026-04-26_a_11.55.45_areo1l.png" alt="Dyane Paris" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p style={{ ...font, fontSize: 'clamp(12px, 1.3vw, 16px)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.7, marginBottom: '36px' }}>{t('citation')}</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '8px' }}>{t('citation_nom')}</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '48px' }}>{t('citation_titre')}</p>
                    <Link href="/contact" style={{ ...font, fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.4)', paddingBottom: '4px' }}>
                        {t('citation_cta')}
                    </Link>
                </div>
            </section>

            <section style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

        </div>
    )
}
