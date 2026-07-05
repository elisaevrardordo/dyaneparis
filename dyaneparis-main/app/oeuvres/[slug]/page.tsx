'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const font = { fontFamily: 'var(--font-playfair), serif' }

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
            '/dyane-no1.webp',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443652/Capture_d_ecran_2026-04-02_a_15.16.48_pqfxxv.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443700/50d1340b3c962d6a72e96d38f28aa761_1_n1elgv.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443739/DSC00193_copie_1_ulvcvq.jpg',
        ],
        plusInfos: 'VANILLE & PASSION\nSOLAIRE. CHARNELLE. UNE INTERPRÉTATION INTENSE DU FRUIT DE LA PASSION, INFUSÉE DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE. L\'ACIDITÉ SE TEND, LA DOUCEUR S\'ÉQUILIBRE. LA VANILLE MADAGASCAR BOURBON GOLD APPORTE UNE RONDEUR SOYEUSE.\nDENSE. LUMINEUSE. UNE ŒUVRE LIQUIDE.\n—\nPROFIL SENSORIEL\nROBE — OR AMBRÉ\nNEZ — PASSION FRAÎCHE, VANILLE CHAUDE\nBOUCHE — PULPEUSE, ÉQUILIBRÉE\nFINALE — LONGUE, SOLAIRE.',
        livraison: 'LIVRAISON ESTIMÉE LE 15 AVRIL 2026.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'dyane-no2-moscow-mule': {
        nom: 'DYANE NO.2 — MOSCOW MULE',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'ALCOOL VINIQUE INFUSÉ AUX GRAINES DE GINGEMBRE. JUS DE CITRON FRAIS. EAU PURE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE.',
        images: [
            '/dyane-no2.webp',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443867/Capture_d_ecran_2026-04-26_a_11.52.38_bllfjq.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443862/6f8f4f66a4a6d81deb15d2f383a53d02_2_utshc8.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443860/FCE40708-7E8F-45A2-80E7-52C4AC46DA59_p4yftm.jpg',
        ],
        plusInfos: 'GINGEMBRE & CITRON VERT\nÉCLATANT. STRUCTURÉ. LE GINGEMBRE S\'IMPOSE, INFUSÉ LENTEMENT DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE.\nLES GRAINES DE GINGEMBRE FRANÇAISES LIBÈRENT UNE ÉNERGIE NETTE. LE CITRON VERT TRACE UNE FRAÎCHEUR LUMINEUSE. UNE TOUCHE DE VANILLE ET LE BOIS APPORTE L\'ÉQUILIBRE.\nSEC. ÉLÉGANT. VIVANT. UNE ŒUVRE DE CONTRASTE.\n—\nORIGINE : ALCOOL VINIQUE 96 % ÉLABORÉ EN FRANCE. INFUSION DE GINGEMBRE FRANÇAIS. JUS DE CITRON BIOLOGIQUE. ÉLEVAGE EN FÛT DE CHÊNE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE, RÉGION D\'AVIGNON.\n—\nPROFIL SENSORIEL\nROBE — CRISTAL ARGENTÉ\nNEZ — GINGEMBRE FRAIS, ZESTE VIF\nBOUCHE — ATTAQUE TONIQUE, TEXTURE SOYEUSE\nFINALE — SÈCHE, PRÉCISE.',
        livraison: 'LIVRAISON ESTIMÉE LE 15 AVRIL 2026.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'bouteille-signee-teokaykay': {
        nom: 'TEO FOR DYANE PARIS',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE.',
        images: [
            '/dyane-teo.webp',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443893/Capture_d_ecran_2026-04-02_a_14.01.13_rixjqx.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
        ],
        plusInfos: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE. À L\'INTÉRIEUR, LE COCKTAIL PROLONGE L\'ŒUVRE : DES INGRÉDIENTS NOBLES POUR UNE DÉGUSTATION INTENSE ET PRÉCISE. L\'ART SE BOIT, PUIS SE GARDE. CONTIENT UN COCKTAIL SIGNATURE DYANE (28–30 % VOL.) : PORNSTAR MARTINI OU MOSCOW MULE AU CHOIX. UNE PIÈCE RARE, À BOIRE OU À COLLECTIONNER.',
        livraison: 'LIVRAISON ESTIMÉE LE 15 AVRIL 2026.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
        formats: ['PORNSTAR MARTINI', 'MOSCOW MULE'],
    },
}

function Accordion({ titre, contenu }: { titre: string, contenu: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{ ...font, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
                <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{titre}</span>
                <span style={{ fontSize: '16px', opacity: 0.5 }}>{open ? '∧' : '›'}</span>
            </button>
            {open && (
                <div style={{ paddingBottom: '16px' }}>
                    {contenu.split('\n').map((ligne, i) => (
                        <p key={i} style={{ ...font, fontSize: '12px', letterSpacing: '0.08em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase' }}>{ligne}</p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const produit = produits[slug]

    if (!produit) return (
        <main style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'var(--font-playfair), serif' }}>
            <p>Produit non trouvé</p>
            <Link href="/oeuvres">← Retour aux œuvres</Link>
        </main>
    )

    return (
        <div style={{ background: '#FAF8F5' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                {/* Galerie gauche */}
                <div>
                    <div style={{ marginBottom: '8px', fontSize: '12px', fontFamily: 'var(--font-playfair), serif', opacity: 0.5 }}>
                        1<br />—<br />{produit.images.length}
                    </div>
                    {produit.images.map((src, i) => (
                        <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '8px', overflow: 'hidden' }}>
                            <Image src={src} alt={`${produit.nom} ${i + 1}`} fill sizes="100vw" style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>

                {/* Infos droite — sticky */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <h1 style={{ ...font, fontSize: '14px', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>{produit.nom}</h1>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>{produit.sousTitre}</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.12em', lineHeight: 1.8, opacity: 0.8, textTransform: 'uppercase', marginBottom: '24px' }}>{produit.description}</p>

                    {produit.formats && (
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ ...font, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>FORMAT</p>
                            <select style={{ ...font, width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.2)', background: '#FAF8F5', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none' }}>
                                {produit.formats.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                    )}

                    <Link href="/contact" style={{ display: 'block', background: '#000', color: '#fff', textAlign: 'center', padding: '18px 24px', ...font, fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '40px' }}>
                        CONTACTER LA CONCIERGERIE
                    </Link>

                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>DATE ESTIMÉE DE LIVRAISON :</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px' }}>AVRIL 2026</p>

                    <Accordion titre="PLUS D'INFORMATIONS" contenu={produit.plusInfos} />
                    <Accordion titre="LIVRAISON" contenu={produit.livraison} />
                    <Accordion titre="DISPONIBILITÉ EN BOUTIQUE" contenu={produit.disponibilite} />
                    <Accordion titre="NOUS CONTACTER" contenu={'REJOIGNEZ LA LISTE D\'ATTENTE\n\nE-MAIL : CONTACT@DYANEPARIS.COM\nINSTAGRAM : @DYANEPARIS_'} />
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }} />
                </div>

            </div>
        </div>
    )
}
