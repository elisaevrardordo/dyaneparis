import Image from 'next/image'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }
const BG = 'rgb(252, 250, 247)'

export default function LaMaisonPage() {
    const t = useTranslations('maison')
    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .maison-hero { height: 55vh !important; }
                    .maison-intro { padding: 40px 20px !important; }
                    .maison-genese { grid-template-columns: 1fr !important; gap: 32px !important; padding: 48px 20px !important; }
                    .maison-genese-img { height: 340px !important; }
                    .maison-duo { grid-template-columns: 1fr !important; gap: 24px !important; padding: 0 20px 60px !important; margin-bottom: 0 !important; }
                    .maison-duo-img1 { height: 260px !important; }
                    .maison-duo-video { height: 300px !important; }
                    .maison-art { grid-template-columns: 1fr !important; gap: 24px !important; padding: 48px 20px !important; }
                    .maison-fullimg { height: 50vh !important; }
                    .maison-temps { grid-template-columns: 1fr !important; gap: 32px !important; padding: 48px 20px !important; }
                    .maison-temps-img { height: 300px !important; }
                    .maison-final { height: 50vh !important; }
                }
            `}</style>
            <div style={{ background: BG }}>

                {/* Hero */}
                <section className="maison-hero" style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '80vh', overflow: 'hidden' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447485/Capture_d_ecran_2026-03-18_a_10.00.11_xcmvzb.png" alt="La Maison Dyane" fill style={{ objectFit: 'cover' }} />
                </section>

                {/* Intro */}
                <section className="maison-intro" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>{t('kicker')}</p>
                    <h1 style={{ ...font, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>{t('titre')}</h1>
                    <p style={{ ...lora, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>{t('intro')}</p>
                </section>

                {/* Genèse */}
                <section className="maison-genese" style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                    <div className="maison-genese-img" style={{ position: 'relative', height: '640px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447494/Capture_d_ecran_2026-03-07_a_10.28.26_nfqwck.png" alt="Diane chasseresse" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '14px' }}>{t('genese_kicker')}</p>
                        <h2 style={{ ...font, fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 500, textTransform: 'uppercase', marginBottom: '28px' }}>{t('genese_titre')}</h2>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('genese_p1')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('genese_p2')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('genese_p3')}</p>
                    </div>
                </section>

                {/* Duo image + vidéo */}
                <section className="maison-duo" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', padding: '0 80px', maxWidth: '1400px', margin: '0 auto 140px', alignItems: 'end' }}>
                    <div className="maison-duo-img1" style={{ position: 'relative', height: '420px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447526/Capture_d_ecran_2026-04-26_a_17.49.30_bsje3p.png" alt="Atelier Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                    </div>
                    <div className="maison-duo-video" style={{ position: 'relative', height: '620px' }}>
                        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                            <source src="https://res.cloudinary.com/dazhkrimv/video/upload/v1777448171/download_8_1_qv3jyo.mp4" type="video/mp4" />
                        </video>
                    </div>
                </section>

                {/* Art 3 colonnes */}
                <section className="maison-art" style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '64px' }}>
                    <div>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '14px' }}>{t('art_kicker')}</p>
                        <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', lineHeight: 1.4 }}>{t('art_titre')}</h2>
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('art_p1')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('art_p2')}</p>
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('art_p3')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('art_p4')}</p>
                    </div>
                </section>

                {/* Image plein écran */}
                <section className="maison-fullimg" style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447558/Capture_d_ecran_2026-04-02_a_14.59.51_ko7wku.png" alt="Artisan Dyane" fill style={{ objectFit: 'cover' }} />
                </section>

                {/* Temps */}
                <section className="maison-temps" style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                    <div className="maison-temps-img" style={{ position: 'relative', height: '560px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777443867/Capture_d_ecran_2026-04-26_a_11.52.38_bllfjq.png" alt="Dyane Paris" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                    </div>
                    <div>
                        <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '28px' }}>{t('temps_titre')}</h2>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('temps_p1')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>{t('temps_p2')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '48px' }}>{t('temps_p3')}</p>
                        <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>{t('contemporaine_titre')}</h2>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>{t('contemporaine_p')}</p>
                    </div>
                </section>

                {/* Image finale */}
                <section className="maison-final" style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777448070/DSC00561_nfjdeh.jpg" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                </section>

            </div>
        </>
    )
}
