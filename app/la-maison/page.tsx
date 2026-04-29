import Image from 'next/image'

const font = { fontFamily: 'Playfair Display, serif' }

export default function LaMaisonPage() {
    return (
        <main style={{ background: '#FAF8F5' }}>

            {/* Intro */}
            <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>L'HISTOIRE DE LA MAISON</h1>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>Dyane Paris naît à Paris en 2025 d'une intuition fondatrice : faire du cocktail une œuvre à part entière. La Maison s'est construite autour d'une idée précise. Réconcilier le geste, la matière et le goût. Transformer l'instant de dégustation en expérience esthétique durable.</p>
            </section>

            {/* Image pleine page 1 */}
            <section style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447485/Capture_d_ecran_2026-03-18_a_10.00.11_xcmvzb.png" alt="La Maison Dyane" fill style={{ objectFit: 'cover' }} />
            </section>

            {/* Section Le nom Dyane */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447494/Capture_d_ecran_2026-03-07_a_10.28.26_nfqwck.png" alt="Diane chasseresse" fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '12px' }}>GENÈSE</p>
                    <h2 style={{ ...font, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>LE NOM, DYANE.</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Dyane puise son inspiration dans la figure mythologique de Diane, déesse chasseresse. Figure libre, indépendante et souveraine.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Gardienne des forêts et des cycles naturels. La Maison retient de cette symbolique la maîtrise, la précision du geste ainsi que l'exigence silencieuse.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>La chasse n'est pas ici prédation mais devient quête. Quête de justesse, Quête d'équilibre, Quête de beauté.</p>
                </div>
            </section>

            {/* Deux images atelier */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', padding: '0 24px', maxWidth: '1200px', margin: '0 auto 80px' }}>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447526/Capture_d_ecran_2026-04-26_a_17.49.30_bsje3p.png" alt="Atelier Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', height: '500px' }}>
                    <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="https://res.cloudinary.com/dazhkrimv/video/upload/v1777448171/download_8_1_qv3jyo.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>

            {/* Section Art Liquide */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px' }}>
                <div>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '12px' }}>ART & SPIRITS</p>
                    <h2 style={{ ...font, fontSize: '22px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>LA NAISSANCE D'UNE MAISON D'ART LIQUIDE</h2>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Dyane ne se définit ni comme une marque de spiritueux, ni comme une simple catégorie Ready-To-Drink.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>La Maison revendique une identité propre : l'Art Liquide. Chaque création associe un cocktail signature, élaboré avec exigence, à un contenant artistique conçu pour être conservé. Boire devient un geste. Conserver devient une mémoire.</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>La rupture est volontaire. Dyane abandonne la bouteille de verre traditionnelle pour la porcelaine. Une matière noble, pérenne, sculpturale. La forme évoque une présence.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Elle s'inscrit dans un espace comme une œuvre autonome. Une fois le cocktail dégusté, l'objet demeure. Il traverse le temps et s'inscrit dans un intérieur.</p>
                </div>
            </section>

            {/* Image pleine page artisan */}
            <section style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777447558/Capture_d_ecran_2026-04-02_a_14.59.51_ko7wku.png" alt="Artisan Dyane" fill style={{ objectFit: 'cover' }} />
            </section>

            {/* Section Le temps et la main */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777443867/Capture_d_ecran_2026-04-26_a_11.52.38_bllfjq.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <h2 style={{ ...font, fontSize: '22px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>LE TEMPS ET LA MAIN</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>La Maison s'appuie sur un processus artisanal exigeant réparti entre le Vaucluse et l'Île-de-France. La porcelaine naît d'un travail minéral, transformée, moulée, cuite selon un cycle long.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Les cocktails sont élaborés à partir d'alcool vinique français, produit après les vendanges puis travaillés par infusion. Chaque création Dyane mobilise plus de 70 mains de la poudre de kaolin à la dégustation finale. La production est volontairement limitée.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '40px' }}>La lenteur est assumée.</p>
                    <h2 style={{ ...font, fontSize: '22px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '16px' }}>UNE MAISON CONTEMPORAINE</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Dyane s'inscrit dans une évolution du luxe. Un luxe plus rare que démonstratif. Plus durable que consommable.</p>
                </div>
            </section>

            {/* Image finale */}
            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777448070/DSC00561_nfjdeh.jpg" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

        </main>
    )
}
