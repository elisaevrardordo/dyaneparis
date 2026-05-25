'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const font = { fontFamily: 'Playfair Display, serif' }
const lora = { fontFamily: 'Lora, serif' }

const heroImages: Record<string, string> = {
    'dyane-paris-pornstar-martini-70-cl': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/1_ecqqiv.png',
    'dyane-no2-moscow-mule': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1779649567/DYANE_NO._2_Inspired_by_Moscow_Mule_aqgviv.png',
    'bouteille-signee-teokaykay': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg',
}

const produits: Record<string, {
    nom: string
    sousTitre: string
    description: string
    images: string[]
    plusInfos: string
    livraison: string
    disponibilite: string
    formats?: string[]
}> = {
    'dyane-paris-pornstar-martini-70-cl': {
        nom: 'DYANE NO.1 — PORNSTAR MARTINI',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'ALCOOL VINIQUE 96 % ÉLABORÉ EN FRANCE, INFUSÉ AUX GOUSSES DE VANILLE MADAGASCAR BOURBON GOLD. PURÉE DE FRUIT DE LA PASSION, SUBLIMÉE PAR UNE TOUCHE DE FRAMBOISE SAUVAGE. JUS DE CITRON BIOLOGIQUE. EMBOUTEILLÉ EN FRANCE, DANS LA RÉGION D\'AVIGNON.',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/3_ijldt6.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/8_lvzjty.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/10_kzmspj.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634416/12_vfl7v7.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779635735/1_wstqkf.png',
        ],
        plusInfos: 'VANILLE & PASSION\nSOLAIRE. CHARNELLE. UNE INTERPRÉTATION INTENSE DU FRUIT DE LA PASSION, INFUSÉE DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE. L\'ACIDITÉ SE TEND, LA DOUCEUR S\'ÉQUILIBRE. LA VANILLE MADAGASCAR BOURBON GOLD APPORTE UNE RONDEUR SOYEUSE.\nDENSE. LUMINEUSE. UNE ŒUVRE LIQUIDE.\n—\nPROFIL SENSORIEL\nROBE — OR AMBRÉ\nNEZ — PASSION FRAÎCHE, VANILLE CHAUDE\nBOUCHE — PULPEUSE, ÉQUILIBRÉE\nFINALE — LONGUE, SOLAIRE.',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'dyane-no2-moscow-mule': {
        nom: 'DYANE NO.2 — MOSCOW MULE',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'ALCOOL VINIQUE INFUSÉ AUX GRAINES DE GINGEMBRE. JUS DE CITRON FRAIS. EAU PURE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE.',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779635739/3_rtyiii.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634414/7_swv5cg.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779634413/11_tsm9n9.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1779636087/Design_sans_titre_61_roxrkv.png',
        ],
        plusInfos: 'GINGEMBRE & CITRON VERT\nÉCLATANT. STRUCTURÉ. LE GINGEMBRE S\'IMPOSE, INFUSÉ LENTEMENT DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE.\nLES GRAINES DE GINGEMBRE FRANÇAISES LIBÈRENT UNE ÉNERGIE NETTE. LE CITRON VERT TRACE UNE FRAÎCHEUR LUMINEUSE. UNE TOUCHE DE VANILLE ET LE BOIS APPORTE L\'ÉQUILIBRE.\nSEC. ÉLÉGANT. VIVANT. UNE ŒUVRE DE CONTRASTE.\n—\nORIGINE : ALCOOL VINIQUE 96 % ÉLABORÉ EN FRANCE. INFUSION DE GINGEMBRE FRANÇAIS. JUS DE CITRON BIOLOGIQUE. ÉLEVAGE EN FÛT DE CHÊNE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE, RÉGION D\'AVIGNON.\n—\nPROFIL SENSORIEL\nROBE — CRISTAL ARGENTÉ\nNEZ — GINGEMBRE FRAIS, ZESTE VIF\nBOUCHE — ATTAQUE TONIQUE, TEXTURE SOYEUSE\nFINALE — SÈCHE, PRÉCISE.',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'bouteille-signee-teokaykay': {
        nom: 'TEO FOR DYANE PARIS',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE.',
        images: [
            '/dyane-teo.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443893/Capture_d_ecran_2026-04-02_a_14.01.13_rixjqx.png',
        ],
        plusInfos: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE. À L\'INTÉRIEUR, LE COCKTAIL PROLONGE L\'ŒUVRE : DES INGRÉDIENTS NOBLES POUR UNE DÉGUSTATION INTENSE ET PRÉCISE. L\'ART SE BOIT, PUIS SE GARDE. CONTIENT UN COCKTAIL SIGNATURE DYANE (28–30 % VOL.) : PORNSTAR MARTINI OU MOSCOW MULE AU CHOIX. UNE PIÈCE RARE, À BOIRE OU À COLLECTIONNER.',
        livraison: 'PRODUCTION SUR COMMANDE. LIVRAISON ESTIMÉE SOUS TROIS SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
        formats: ['PORNSTAR MARTINI', 'MOSCOW MULE'],
    },
}

function Accordion({ titre, contenu }: { titre: string, contenu: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <button onClick={() => setOpen(!open)} style={{ ...font, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{titre}</span>
                <span style={{ fontSize: '16px', opacity: 0.5 }}>{open ? '∧' : '›'}</span>
            </button>
            {open && (
                <div style={{ paddingBottom: '16px' }}>
                    {contenu.split('\n').map((ligne, i) => (
                        <p key={i} style={{ ...lora, fontSize: '12px', letterSpacing: '0.08em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase' }}>{ligne}</p>
                    ))}
                </div>
            )}
        </div>
    )
}

function MobileImageCarousel({ images, nom }: { images: string[], nom: string }) {
    const [current, setCurrent] = useState(0)
    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                <Image src={images[current]} alt={`${nom} ${current + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
            <button onClick={() => setCurrent((current - 1 + images.length) % images.length)} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', padding: '10px 14px', fontSize: '18px' }}>‹</button>
            <button onClick={() => setCurrent((current + 1) % images.length)} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', padding: '10px 14px', fontSize: '18px' }}>›</button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '20px' : '6px', height: '2px', background: i === current ? '#111' : 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                ))}
            </div>
        </div>
    )
}

export default function ProduitPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const produit = produits[slug]
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    if (!produit) return (
        <main style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
            <p>Produit non trouvé</p>
            <Link href="/oeuvres">← Retour aux œuvres</Link>
        </main>
    )

    const heroImg = heroImages[slug]

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .produit-hero { height: 40vh !important; }
                    .produit-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 24px 20px !important; }
                    .produit-galerie-desktop { display: none !important; }
                    .produit-galerie-mobile { display: block !important; }
                    .produit-sticky { position: static !important; }
                }
                @media (min-width: 769px) {
                    .produit-galerie-desktop { display: block !important; }
                    .produit-galerie-mobile { display: none !important; }
                }
            `}</style>
            <div style={{ background: '#FAF8F5' }}>

                {/* Hero */}
                {heroImg && (
                    <section className="produit-hero" style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
                        <Image src={heroImg} alt={produit.nom} fill style={{ objectFit: 'cover' }} />
                    </section>
                )}

                <div className="produit-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                    {/* Galerie desktop */}
                    <div className="produit-galerie-desktop">
                        <div style={{ marginBottom: '8px', fontSize: '12px', fontFamily: 'Playfair Display, serif', opacity: 0.5 }}>
                            1<br />—<br />{produit.images.length}
                        </div>
                        {produit.images.map((src, i) => (
                            <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '8px', overflow: 'hidden' }}>
                                <Image src={src} alt={`${produit.nom} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>

                    {/* Carousel mobile */}
                    <div className="produit-galerie-mobile" style={{ display: 'none' }}>
                        <MobileImageCarousel images={produit.images} nom={produit.nom} />
                    </div>

                    {/* Infos droite */}
                    <div className="produit-sticky" style={{ position: 'sticky', top: '120px' }}>
                        <h1 style={{ ...font, fontSize: '14px', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>{produit.nom}</h1>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>{produit.sousTitre}</p>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.12em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase', marginBottom: '24px' }}>{produit.description}</p>

                        {produit.formats && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ ...font, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>FORMAT</p>
                                <select style={{ ...lora, width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.2)', background: '#FAF8F5', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none' }}>
                                    {produit.formats.map(f => <option key={f}>{f}</option>)}
                                </select>
                            </div>
                        )}

                        <Link href={`/${locale}/contact`} style={{ display: 'block', background: '#000', color: '#fff', textAlign: 'center', padding: '18px 24px', ...font, fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '40px' }}>
                            CONTACTER LA CONCIERGERIE
                        </Link>

                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>DATE ESTIMÉE DE LIVRAISON :</p>
                        <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px' }}>SOUS DEUX SEMAINES</p>

                        <Accordion titre="PLUS D'INFORMATIONS" contenu={produit.plusInfos} />
                        <Accordion titre="LIVRAISON" contenu={produit.livraison} />
                        <Accordion titre="DISPONIBILITÉ EN BOUTIQUE" contenu={produit.disponibilite} />
                        <Accordion titre="NOUS CONTACTER" contenu={'REJOIGNEZ LA LISTE D\'ATTENTE\n\nE-MAIL : CONTACT@DYANEPARIS.COM\nINSTAGRAM : @DYANEPARIS_'} />
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }} />
                    </div>
                </div>
            </div>
        </>
    )
}
