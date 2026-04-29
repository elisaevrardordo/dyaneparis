import Image from 'next/image'

const font = { fontFamily: 'Playfair Display, serif' }

export default function DistillationPage() {
    return (
        <main style={{ background: '#FAF8F5' }}>

            {/* Section intro */}
            <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>L'EXCELLENCE DE LA MAISON DYANE</p>
                <h1 style={{ ...font, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px' }}>LA CUVÉE PRESTIGE</h1>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Chaque création Dyane naît d'une exigence rare : atteindre un équilibre que peu approchent, et que l'on reconnaît immédiatement.</p>
                <p style={{ ...font, fontSize: '14px', lineHeight: 1.8, opacity: 0.8 }}>Élaborées en France, au cœur du Vaucluse, nos cuvées prennent vie dans un territoire où la lumière, la matière et le temps façonnent chaque détail.</p>
            </section>

            {/* Image pleine page 1 */}
            <section style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444666/188493ca0dd368f1190e6b8c346f3658_1_wwlrse.jpg" alt="Distillation Dyane" fill style={{ objectFit: 'cover' }} />
            </section>

            {/* Section 3 colonnes */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px' }}>
                <div>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>L'ORIGINE : UNE MATIÈRE NOBLE, UNE TERRE D'EXIGENCE</h2>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Nous sélectionnons exclusivement des ingrédients bruts: gingembre frais, gousses de vanille entières, zestes d'agrumes, pour préserver la pureté des arômes.</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Chaque élément est choisi pour sa capacité à s'exprimer avec justesse, sans artifice ni correction.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>Cette rigueur dans la sélection constitue la base de chaque cuvée.</p>
                </div>
            </section>

            {/* Deux images côte à côte */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0' }}>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444695/cefabcbb6ae0a2ac3de9836e7b0792a6_1_ttgppt.jpg" alt="Distillation" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444726/CREATION_m4wcwy.png" alt="Création Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Section élaboration */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', alignItems: 'start' }}>
                <div style={{ gridColumn: '1' }}>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>L'ÉLABORATION : L'ALCOOL VINIQUE COMME FONDATION</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Au cœur de chaque création se trouve un élément fondamental : un alcool vinique d'une pureté exceptionnelle.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Issu de la transformation du vin, cet alcool se distingue par sa finesse, sa neutralité aromatique et sa capacité à sublimer les matières qu'il accueille.</p>
                </div>
                <div>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Il agit comme un révélateur, permettant aux notes de gingembre, de vanille ou d'agrumes de se déployer avec précision et élégance.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Les infusions sont réalisées lentement, sur des durées maîtrisées, afin d'extraire chaque nuance sans jamais brusquer la matière.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginTop: '16px' }}>Ce temps long permet d'obtenir une profondeur aromatique et une stabilité qui donnent à la cuvée toute sa tenue et sa signature.</p>
                </div>
                <div style={{ position: 'relative', height: '500px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444763/36a06a6ada0367a421f5ea4daf6c4e17_1_rr14il.jpg" alt="Élaboration" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Section signature */}
            <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                <div>
                    <h2 style={{ ...font, fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', marginBottom: '24px' }}>LA SIGNATURE : UNE EXPÉRIENCE SENSORIELLE MAÎTRISÉE</h2>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Chaque recette est pensée comme une composition : une attaque franche, un cœur expressif, une longueur en bouche persistante.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>L'équilibre entre puissance et finesse est ajusté au millilitre près, jusqu'à atteindre une harmonie rare.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8, marginBottom: '16px' }}>Rien n'est laissé au hasard : ni la texture, ni la structure, ni la manière dont les arômes évoluent au fil de la dégustation.</p>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.8, opacity: 0.8 }}>Chez Dyane, le cocktail n'est plus un mélange. C'est une œuvre liquide.</p>
                </div>
                <div style={{ position: 'relative', height: '600px' }}>
                    <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444782/12_nehhxv.png" alt="Signature Dyane" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Citation */}
            <section style={{ padding: '60px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ ...font, fontSize: 'clamp(14px, 2vw, 18px)', letterSpacing: '0.06em', textTransform: 'uppercase', maxWidth: '900px', margin: '0 auto 16px' }}>« CHAQUE CUVÉE DYANE EST PENSÉE COMME UNE ÉVIDENCE : UN ÉQUILIBRE SI JUSTE QU'IL S'IMPOSE DÈS LA PREMIÈRE DÉGUSTATION. »</p>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>JULIEN DUCRUET</p>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>CHEF DE CONCEPTION DES RECETTES DYANE</p>
            </section>

            {/* Image finale */}
            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                <Image src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777444815/Design_sans_titre_41_sens76.png" alt="Dyane Paris" fill style={{ objectFit: 'cover' }} />
            </section>

        </main>
    )
}
