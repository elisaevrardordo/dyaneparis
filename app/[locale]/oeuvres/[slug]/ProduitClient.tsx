'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'
import { heroImages, produits } from '@/components/data/productDetails'

const font = { fontFamily: 'var(--font-playfair), serif' }
const lora = { fontFamily: 'var(--font-lora), serif' }

function Accordion({ titre, contenu }: { titre: string, contenu: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <button type="button" onClick={() => setOpen(!open)} style={{ ...font, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
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
                <Image src={images[current]} alt={`${nom} — cocktail Dyane Paris en flacon de porcelaine peint à la main (vue ${current + 1})`} fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
            <button type="button" onClick={() => setCurrent((current - 1 + images.length) % images.length)} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', padding: '10px 14px', fontSize: '18px' }}>‹</button>
            <button type="button" onClick={() => setCurrent((current + 1) % images.length)} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', padding: '10px 14px', fontSize: '18px' }}>›</button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                {images.map((_, i) => (
                    <button type="button" key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '20px' : '6px', height: '2px', background: i === current ? '#111' : 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                ))}
            </div>
        </div>
    )
}

export default function ProduitClient({ params }: { params: { slug: string } }) {
    const { slug } = params
    const produit = produits[slug]
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    if (!produit) return (
        <main style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'var(--font-playfair), serif' }}>
            <p>Produit non trouvé</p>
            <Link href={localizedPath(locale, '/oeuvres')}>← Retour aux œuvres</Link>
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
                        <Image src={heroImg} alt={`${produit.nom} — cocktail Dyane Paris en sculpture de porcelaine`} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
                    </section>
                )}

                <div className="produit-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                    {/* Galerie desktop */}
                    <div className="produit-galerie-desktop">
                        <div style={{ marginBottom: '8px', fontSize: '12px', fontFamily: 'var(--font-playfair), serif', opacity: 0.5 }}>
                            1<br />—<br />{produit.images.length}
                        </div>
                        {produit.images.map((src, i) => (
                            <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '8px', overflow: 'hidden' }}>
                                <Image src={src} alt={`${produit.nom} — flacon Dyane Paris (vue ${i + 1})`} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
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

                        <Link href={localizedPath(locale, '/contact')} style={{ display: 'block', background: '#000', color: '#fff', textAlign: 'center', padding: '18px 24px', ...font, fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '40px' }}>
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
