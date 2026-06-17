'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

const lora = { fontFamily: 'var(--font-lora), serif' }
const playfair = { fontFamily: 'var(--font-playfair), serif' }

export default function Manifeste() {
    const t = useTranslations('manifeste')
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    return (
        <>
            <style>{`
                .manifeste-outer {
                    background: #fff;
                    width: 100%;
                    overflow: hidden;
                }
                .manifeste-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    min-height: 820px;
                }
                .manifeste-col-left {
                    position: relative;
                    overflow: hidden;
                }
                .manifeste-col-center {
                    display: flex;
                    flex-direction: column;
                    padding: 48px 40px;
                }
                .manifeste-center-img {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .manifeste-col-right {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 48px 48px 64px 40px;
                }
                .heritage-body {
                    font-size: 10px;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    line-height: 2;
                    text-align: justify;
                    opacity: 0.85;
                }
                .heritage-body p { margin: 0 0 10px 0; }

                @media (max-width: 900px) {
                    .manifeste-row { grid-template-columns: 1fr; min-height: unset; }
                    .manifeste-col-left { height: 420px; }
                    .manifeste-col-center, .manifeste-col-right { padding: 32px 24px; }
                }
            `}</style>

           <section className="manifeste-outer" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <div className="manifeste-row">

                    {/* Colonne gauche : photo sculpture plein cadre */}
                    <div className="manifeste-col-left">
                        <Image
                            src="https://res.cloudinary.com/dazhkrimv/image/upload/v1781703414/DSC00189_1_zvm9vh.jpg"
                            alt="Sculpture Dyane Paris"
                            fill
                            sizes="33vw"
                            style={{ objectFit: 'cover', objectPosition: 'center top' }}
                            priority
                        />
                    </div>

                    {/* Colonne centre : titre + image flacon */}
                    <div className="manifeste-col-center">
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ ...playfair, fontSize: '18px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>DYANE PARIS</p>
                            <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, margin: '0 0 2px 0' }}>COCKTAILS D'EXCEPTION.</p>
                            <p style={{ ...lora, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, margin: 0 }}>FLACONS EN PORCELAINE PEINTS À LA MAIN.</p>
                        </div>
                        <div className="manifeste-center-img">
                            <Image
                                src="https://res.cloudinary.com/dazhkrimv/image/upload/v1781702999/Capture_d_e%CC%81cran_2026-05-29_a%CC%80_22.30.42_td92ih.png"
                                alt="Flacon Dyane Paris"
                                width={460}
                                height={500}
                                sizes="33vw"
                                style={{ width: '100%', maxWidth: '460px', height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Colonne droite : texte HÉRITAGE uppercase justifié */}
                    <div className="manifeste-col-right">
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '4px' }}>(1)</p>
                        <p style={{ ...playfair, fontSize: '20px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>HÉRITAGE</p>
                        <div style={{ ...lora, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, lineHeight: 1.9, marginBottom: '20px' }}>
                            <p style={{ margin: 0 }}>CRÉÉE EN 2025</p>
                            <p style={{ margin: 0 }}>PARIS, FRANCE</p>
                        </div>
                        <div className="heritage-body" style={{ ...lora }}>
                            <p>DYANE PARIS EST NÉE D'UNE CONVICTION : LE COCKTAIL PEUT ÊTRE PLUS QU'UN INSTANT, IL PEUT DEVENIR UNE ŒUVRE.</p>
                            <p>INSPIRÉE PAR L'ART, LE PATRIMOINE ET LE SAVOIR-FAIRE ARTISANAL, LA MAISON IMAGINE DES CRÉATIONS UNIQUES OÙ CHAQUE DÉTAIL RACONTE UNE HISTOIRE.</p>
                            <p style={{ margin: 0 }}>ENTRE TRADITION ET AUDACE, DYANE PARIS RÉINVENTE L'EXPÉRIENCE DU LUXE À TRAVERS DES FLACONS EN PORCELAINE PEINTS À LA MAIN, DE VÉRITABLES OBJETS DE COLLECTION CONÇUS POUR TRAVERSER LE TEMPS.</p>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}
