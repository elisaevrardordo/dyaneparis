import Image from 'next/image'

const instaImages = [
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413053/DSC00149_upnxh1.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1777412912/DSC00087_e4xrvf.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413089/DSC00084_1_mjztqk.jpg',
    'https://res.cloudinary.com/dazhkrimv/image/upload/v1777413138/DSC00137_copie_dej6vn.jpg',
]

export default function InstagramGrid() {
    return (
        <>
            <section style={{ background: '#fff', padding: '4px 24px 20px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', padding: '14px 0 26px' }}>
                        <p style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>INSTAGRAM</p>
                        <a href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000', fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '20px' }}>@DYANEPARIS_</a>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
                        {instaImages.map((src, i) => (
                            <a key={i} href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer" style={{ display: 'block', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                                <Image src={src} alt={`Dyane Paris Instagram ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section image pleine page sous Instagram */}
            <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
                <Image
                    src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777413217/VISUEL1_udys3s.png"
                    alt="Dyane Paris"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </section>
        </>
    )
}
