import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import {
    breadcrumbJsonLd,
    buildPageMetadata,
    imageObject,
    localizedUrl,
    seoImages,
    serializeJsonLd,
} from '@/lib/seo'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.distillation' })

    return buildPageMetadata({
        locale,
        path: '/distillation',
        title: t('title'),
        description: t('description'),
        image: seoImages.distillation,
    })
}

export default async function DistillationPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'distillation' })
    const pageUrl = localizedUrl(locale, '/distillation')
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                name: locale === 'en' ? 'French artisanal distillation — Dyane Paris' : 'La distillation artisanale française — Dyane Paris',
                url: pageUrl,
                isPartOf: { '@id': 'https://www.dyaneparis.com/#website' },
                about: { '@id': 'https://www.dyaneparis.com/#organization' },
                primaryImageOfPage: imageObject(seoImages.distillation, true),
                inLanguage: locale,
            },
            breadcrumbJsonLd(locale, [
                { name: locale === 'en' ? 'Home' : 'Accueil', path: '' },
                { name: locale === 'en' ? 'Distillation' : 'Distillation', path: '/distillation' },
            ]),
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <style>{`
                @media (max-width: 768px) {
                    .dist-hero { height: 55vh !important; }
                    .dist-intro { padding: 40px 20px !important; }
                    .dist-3col { grid-template-columns: 1fr !important; gap: 24px !important; padding: 40px 20px !important; }
                    .dist-2img { grid-template-columns: 1fr !important; }
                    .dist-2img-small { display: none !important; }
                    .dist-2img-large { height: 300px !important; }
                    .dist-elab { grid-template-columns: 1fr !important; gap: 24px !important; padding: 40px 20px !important; }
                    .dist-elab-img { height: 280px !important; }
                    .dist-sig { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 20px !important; }
                    .dist-sig-img { height: 300px !important; }
                    .dist-citation { padding: 40px 20px !important; }
                    .dist-final { height: 50vh !important; }
                }
            `}</style>
            <main style={{ background: '#FAF8F5' }}>

                {/* Image hero */}
                <section className="dist-hero" style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg" alt="Distillation artisanale des cocktails Dyane Paris" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
                </section>

                {/* Intro */}
                <section className="dist-intro" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>{t('kicker')}</p>
                    <h1 style={{ ...font, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>{t('titre')}</h1>
                    <p style={{ ...lora, fontSize: '14px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('intro1')}</p>
                    <p style={{ ...lora, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>{t('intro2')}</p>
                </section>

                {/* Origine 3 colonnes */}
                <section className="dist-3col" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px' }}>
                    <div>
                        <h2 style={{ ...font, fontSize: '18px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('origine_titre')}</h2>
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('origine_p1')}</p>
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('origine_p2')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>{t('origine_p3')}</p>
                    </div>
                </section>

                {/* Deux images */}
                <section className="dist-2img" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0' }}>
                    <div className="dist-2img-small" style={{ position: 'relative', height: '600px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg" alt="Alambic et distillation des cocktails d'exception Dyane Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="dist-2img-large" style={{ position: 'relative', height: '600px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444726/CREATION_m4wcwy.png" alt="Création des cocktails Dyane Paris en flacon de porcelaine" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Élaboration */}
                <section className="dist-elab" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ ...font, fontSize: '18px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('elaboration_titre')}</h2>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('elaboration_p1')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('elaboration_p2')}</p>
                    </div>
                    <div>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('elaboration_p3')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('elaboration_p4')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>{t('elaboration_p5')}</p>
                    </div>
                    <div className="dist-elab-img" style={{ position: 'relative', height: '500px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg" alt="Élaboration et assemblage des cocktails Dyane Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Signature */}
                <section className="dist-sig" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ ...font, fontSize: '18px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>{t('signature_titre')}</h2>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p1')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p2')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>{t('signature_p3')}</p>
                        <p style={{ ...lora, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>{t('signature_p4')}</p>
                    </div>
                    <div className="dist-sig-img" style={{ position: 'relative', height: '600px' }}>
                        <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444782/12_nehhxv.png" alt="Flacon signature en porcelaine peinte à la main Dyane Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Citation */}
                <section className="dist-citation" style={{ padding: '60px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ ...font, fontSize: 'clamp(13px, 2vw, 18px)', letterSpacing: '0.06em', textTransform: 'uppercase', maxWidth: '900px', margin: '0 auto 16px' }}>{t('citation')}</p>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>{t('citation_nom')}</p>
                    <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>{t('citation_titre')}</p>
                </section>

                {/* Image finale */}
                <section className="dist-final" style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444815/Design_sans_titre_41_sens76.png" alt="Distillation et savoir-faire Dyane Paris" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </section>

            </main>
        </>
    )
}
