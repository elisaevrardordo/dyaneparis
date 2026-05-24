import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const font = { fontFamily: 'Playfair Display, serif' }

const oeuvres = [
    {
        id: 'no1',
        href: '/oeuvres/dyane-paris-pornstar-martini-70-cl',
        titre: 'DYANE NO.1',
        cle_sous_titre: 'no1_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/3_ijldt6.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/8_lvzjty.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/10_kzmspj.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634416/12_vfl7v7.png',
        ]
    },
    {
        id: 'no2',
        href: '/oeuvres/dyane-no2-moscow-mule',
        titre: 'DYANE NO.2',
        cle_sous_titre: 'no2_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/4_os0a6z.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/7_swv5cg.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/9_a5maeo.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/11_tsm9n9.png',
        ]
    },
    {
        id: 'teo',
        href: '/oeuvres/bouteille-signee-teokaykay',
        titre: 'TEO FOR DYANE',
        cle_sous_titre: 'teo_sous_titre',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443893/Capture_d_ecran_2026-04-02_a_14.01.13_rixjqx.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
                        'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443930/Capture_d_ecran_2026-04-02_a_13.55.34_lebijo.png',

        ]
    },
]

export default function OeuvresPage() {
    const t = useTranslations('oeuvres')
    return (
        <main style={{ background: '#fff' }}>
            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
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
