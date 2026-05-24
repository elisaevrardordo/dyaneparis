import Image from 'next/image'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }

export default function DistillationPage() {
    const t = useTranslations('distillation')
    return (
        <main style={{ background: '#FAF8F5' }}>

            {/* Image en premier */}
<section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg" alt="Distillation Dyane" fill style={{ objectFit: 'cover' }} />
</section>

{/* Texte ensuite */}
<section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>{t('kicker')}</p>
    <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>{t('titre')}</h1>
    <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('intro1')}</p>
    <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>{t('intro2')}</p>
</section>
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px' }}>
                <div>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('origine_titre')}</h2>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('origine_p1')}</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('origine_p2')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>{t('origine_p3')}</p>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0' }}>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg" alt="Distillation" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444726/CREATION_m4wcwy.png" alt="Création Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', alignItems: 'start' }}>
                <div style={{ gridColumn: '1' }}>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('elaboration_titre')}</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('elaboration_p1')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('elaboration_p2')}</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('elaboration_p3')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('elaboration_p4')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>{t('elaboration_p5')}</p>
                </div>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg" alt="Élaboration" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                <div>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('signature_titre')}</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p1')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p2')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p3')}</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('signature_p4')}</p>
                </div>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444782/12_nehhxv.png" alt="Signature Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            <section style={{ padding: '60px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ ...font, fontSize: 'clamp(14px, 2vw, 18px)', letterSpacing: '0.06em', textTransform: 'uppercase', maxWidth: '900px', margin: '0 auto 16px' }}>{t('citation')}</p>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>{t('citation_nom')}</p>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>{t('citation_titre')}</p>
            </section>

            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444815/Design_sans_titre_41_sens76.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

        </main>
    )
}
