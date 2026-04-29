import Image from 'next/image'
import Link from 'next/link'

const font = { fontFamily: 'Playfair Display, serif' }
const BG = 'rgb(252, 250, 247)'

export default function ExperiencesPage() {
    return (
        <div style={{ background: BG }}>

            {/* Intro */}
            <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>EXPÉRIENCES</h1>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Dyane Paris est une Maison d'Art Liquide française dédiée à révister des saveurs de cocktails exclusives sous forme de spiritueux raffinés.</p>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>Sa vocation est claire : préserver la maîtrise du goût, du geste et du temps dans un univers dominé par l'industrialisation. Chaque création est issue d'une production volontairement contenue, conduite avec méthode et discernement.</p>
            </section>

            {/* Image pleine largeur 1 — edge to edge, cover, 100vh */}
            <section style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg" alt="Expériences Dyane" fill style={{ objectFit: 'cover' }} />
            </section>

            {/* Section Le choix de la mesure */}
            <section style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '64px' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4 }}>LE CHOIX DE LA MESURE</h2>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>La Maison s'inscrit à rebours des logiques de volume. La production n'est jamais standardisée.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>Elle est définie selon la nature du projet, l'identité du lieu, l'exigence du partenaire. Chaque lot fait l'objet d'un suivi précis, depuis l'assemblage jusqu'à la mise en bouteille. La constance prévaut sur la cadence. La précision sur la quantité.</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>Chaque série est réalisée à la commande, dans une temporalité maîtrisée. Cette organisation garantit l'intégrité des arômes, la cohérence des assemblages et l'adaptation exacte des formats, du 70 cL au 12 L. La production demeure ajustée pour ne jamais devenir mécanisée à grande échelle.</p>
                </div>
            </section>

            {/* Duo images — contain, alignement bas */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '0 80px', maxWidth: '1400px', margin: '0 auto 140px', alignItems: 'end' }}>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777413089/DSC00084_1_mjztqk.jpg" alt="Expérience Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
                <div style={{ position: 'relative', height: '680px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445376/DSC00189_2_evwuct.jpg" alt="Expérience Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            {/* Section personnalisation */}
            <section style={{ padding: '0 80px 140px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4, marginBottom: '28px' }}>LA PERSONNALISATION DES BOUTEILLES DYANE.</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>La personnalisation constitue l'une des expressions les plus abouties du savoir-faire de la Maison. Chaque projet fait l'objet d'une étude attentive, afin d'assurer une parfaite cohérence entre contenu et le contenant.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '36px' }}>Les recettes peuvent être ajustées dans leurs équilibres, leur intensité, leur signature aromatique, pour répondre aux attentes les plus spécifiques.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>Le contenant est développé avec le même niveau d'exigence. Formats, finitions, interventions artistiques : chaque détail est envisagé comme une composante essentielle de l'ensemble.</p>
                        <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>Elle engage la Maison dans une démarche d'écoute et de précision afin d'accompagner les demandes de nos partenaires les plus exigeants.</p>
                    </div>
                </div>
                <div style={{ position: 'relative', height: '720px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445572/13_qpfuhh.png" alt="Personnalisation Dyane" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            {/* Section deux ancrages */}
            <section style={{ padding: '0 80px 140px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'end' }}>
                <div>
                    <h2 style={{ ...font, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.4, marginBottom: '28px' }}>DEUX ANCRAGES, UNE MÊME EXIGENCE</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>La Maison opère sur deux sites de production en France.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '16px' }}>En Île-de-France, au cœur d'un écosystème culturel et hôtelier d'excellence, où sont conduites les productions événementielles et les séries sur mesure. Dans la région d'Avignon, territoire de tradition artisanale, dédié aux assemblages et à la stabilité des infusions.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8 }}>Deux implantations complémentaires, guidées par une même discipline.</p>
                </div>
                <div style={{ position: 'relative', height: '620px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777445589/Capture_d_ecran_2026-04-26_a_11.55.45_areo1l.png" alt="Dyane Paris" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
            </section>

            {/* Citation */}
            <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p style={{ ...font, fontSize: 'clamp(12px, 1.3vw, 16px)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.7, marginBottom: '36px' }}>"MA COLLABORATION AVEC DYANE EST NÉE D'UN RESPECT MUTUEL ET D'UNE AMBITION PARTAGÉE : PROPOSER DES COCKTAILS PREMIUM QUI ALLIENT AUTHENTICITÉ, ÉLÉGANCE ET MODERNITÉ. CHAQUE SPIRITUEUX EST IMAGINÉ ET ASSEMBLÉ AVEC UNE PRÉCISION D'ORFÈVRE AFIN DE SUBLIMER LES MATIÈRES PREMIÈRES ET RÉVÉLER LA PURETÉ DES ARÔMES."</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '8px' }}>JULIEN DUCRUET</p>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '48px' }}>NEZ, DISTILLATEUR, PRODUCTEUR FRANÇAIS</p>
                    <Link href="/contact" style={{ ...font, fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.4)', paddingBottom: '4px' }}>
                        CONTACTER LA CONCIERGERIE
                    </Link>
                </div>
            </section>

            {/* Image finale pleine largeur — edge to edge, cover, 100vh */}
            <section style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                <Image src="/1.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

        </div>
    )
}
