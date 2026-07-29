import Image from 'next/image'

const instaImages = [
    {
        src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413053/DSC00149_upnxh1.jpg',
        alt: 'Homme tenant une sculpture-bouteille Dyane Paris ivoire et rouge',
    },
    {
        src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777412912/DSC00087_e4xrvf.jpg',
        alt: 'Cocktail servi à côté de sa sculpture en porcelaine Dyane Paris',
    },
    {
        src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413089/DSC00084_1_mjztqk.jpg',
        alt: 'Femme tenant un cocktail devant une sculpture-bouteille Dyane Paris',
    },
    {
        src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413138/DSC00137_copie_dej6vn.jpg',
        alt: 'Sculpture-bouteille Dyane Paris en porcelaine tenue à la main',
    },
]

export default function InstagramGrid() {
    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .insta-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
                    .insta-wrap { padding: 4px 16px 48px !important; }
                }
            `}</style>
            <section className="insta-wrap" style={{ background: '#fff', padding: '4px 24px 80px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', padding: '14px 0 26px' }}>
                        <p style={{ fontFamily: 'var(--font-playfair), serif', margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>INSTAGRAM</p>
                        <a href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000', fontFamily: 'var(--font-playfair), serif', fontWeight: 500, fontSize: '20px' }}>@DYANEPARIS_</a>
                    </div>
                    <div className="insta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
                        {instaImages.map(({ src, alt }) => (
                            <a key={src} href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ display: 'block', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                                <Image src={src} alt={alt} fill sizes="(max-width: 768px) calc(50vw - 20px), 25vw" style={{ objectFit: 'cover' }} />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                <Image
                    src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777413217/VISUEL1_udys3s.png"
                    alt="Sculpture-bouteille Dyane Paris et cocktail servis sur le comptoir d'un bar"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
            </section>
        </>
    )
}
