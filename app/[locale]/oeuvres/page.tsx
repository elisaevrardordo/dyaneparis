import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }

const oeuvres = [
    { id: 'no1', href: '/oeuvres/dyane-paris-pornstar-martini-70-cl', titre: 'DYANE NO.1', cle_sous_titre: 'no1_sous_titre', images: ['https://res.cloudinary.com/dazhkrimv/image/upload/v1777443652/Capture_d_ecran_2026-04-02_a_15.16.48_pqfxxv.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443641/3_4b8843d8-0ab7-4fd0-bcb6-6983a224d83f_kkgh41.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443700/50d1340b3c962d6a72e96d38f28aa761_1_n1elgv.jpg', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443739/DSC00193_copie_1_ulvcvq.jpg'] },
    { id: 'no2', href: '/oeuvres/dyane-no2-moscow-mule', titre: 'DYANE NO.2', cle_sous_titre: 'no2_sous_titre', images: ['https://res.cloudinary.com/dazhkrimv/image/upload/v1777443867/Capture_d_ecran_2026-04-26_a_11.52.38_bllfjq.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443864/11_d8685905-f141-4225-9957-19b78e6fd892_n8qhyt.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443862/6f8f4f66a4a6d81deb15d2f383a53d02_2_utshc8.jpg', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443860/FCE40708-7E8F-45A2-80E7-52C4AC46DA59_p4yftm.jpg'] },
    { id: 'teo', href: '/oeuvres/bouteille-signee-teokaykay', titre: 'TEO FOR DYANE', cle_sous_titre: 'teo_sous_titre', images: ['https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443893/Capture_d_ecran_2026-04-02_a_14.01.13_rixjqx.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443930/Capture_d_ecran_2026-04-02_a_13.55.34_lebijo.png', 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg'] },
]

export default function OeuvresPage() {
    const t = useTranslations('oeuvres')
    return (
        <main style={{ background: '#fff' }}>
            <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
                <Image src="/2.png" alt="Dyane Paris Oeuvres" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                <div style={{ position: 'absolute', bottom: '48px', left: '48px' }}>
                    <p style={{
                        ...font,
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '11px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        fontWeight: 400,
                    }}>
                        {t('decouvrir_intro')}
                    </p>
                </div>
            </section>

            {oeuvres.map((oeuvre) => (
                <section key={oeuvre.id} style={{ padding: '60px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px', alignItems: 'start' }}>
                        <div>
                            <h2 style={{ ...font, fontSize: '22px', fontWeight: 600, letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase' }}>{oeuvre.titre}</h2>
                            <p style={{ ...font, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, lineHeight: 1.6, margin: '0 0 24px' }}>{t(oeuvre.cle_sous_titre)}</p>
                            <Link href={oeuvre.href} style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.4)', paddingBottom: '4px' }}>
                                {t('decouvrir')}
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {oeuvre.images.map((src, i) => (
                                <Link key={i} href={oeuvre.href} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', display: 'block' }}>
                                    <Image src={src} alt={`${oeuvre.titre} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </main>
    )
}
