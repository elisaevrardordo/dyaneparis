'use client'
import Image from 'next/image'
import { useState } from 'react'
import NewsletterForm from '@/components/NewsletterForm'

const font = { fontFamily: 'var(--font-playfair), serif' }

const faqs = [
    {
        question: "QU'EST-CE QUE DYANE PARIS ?",
        reponse: "Dyane Paris est une Maison d'Art Liquide française. Nous créons des cocktails premium présentés dans des flacons en porcelaine peints à la main, inspirés de la Venus de Milo. Chaque création associe un spiritueux d'exception à un objet sculptural conçu pour être conservé.",
    },
    {
        question: "COMMENT SE DÉGUSTE UNE CRÉATION DYANE ?",
        reponse: "Nos créations se dégustent froides, idéalement entre 6°C et 8°C. Vous pouvez les servir directement sur glace ou en cocktail. L'expérience Dyane est avant tout rituelle, laissant place à l'émotion avant toute analyse.",
    },
    {
        question: "CHAQUE FLACON EST-IL UNIQUE ?",
        reponse: "Oui.\n\nChaque flacon Dyane est peint et travaillé à la main. Les variations font partie intégrante de l'œuvre et garantissent le caractère singulier de chaque pièce.",
    },
    {
        question: "PEUT-ON CONSERVER LA BOUTEILLE APRÈS DÉGUSTATION ?",
        reponse: "Une création Dyane peut se conserver plusieurs années avant ouverture, dans un endroit sec et à l'abri de la lumière.\n\nAprès ouverture, nous recommandons de la consommer dans un délai de quatre mois afin de préserver l'équilibre aromatique.",
    },
    {
        question: "PEUT-ON OFFRIR OU PERSONNALISER UNE CRÉATION DYANE ?",
        reponse: "Absolument.\n\nLes flacons Dyane sont conçus pour être conservés comme des objets d'art. Une fois la dégustation terminée, ils trouvent naturellement leur place dans un intérieur, prolongeant l'expérience au-delà du moment.",
    },
    {
        question: "COMBIEN DE TEMPS PEUT-ON CONSERVER UNE CRÉATION DYANE ?",
        reponse: "Les créations Dyane bénéficient d'une DLC de 15 mois.\n\nUne fois ouverte, nous recommandons une consommation dans les 3 mois, à conserver à l'abri de la lumière et de la chaleur.",
    },
]

export default function FaqClient() {
    const [open, setOpen] = useState<number | null>(null)

    return (
        <div style={{ background: '#FAF8F5' }}>

            {/* Hero image — edge to edge, 100vh */}
            <section style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)', height: '100vh', overflow: 'hidden' }}>
                <Image
                    src="https://res.cloudinary.com/dazhkrimv/image/upload/v1777492634/DSC00107_copie_1_yps0ji.jpg"
                    alt="Sculpture en porcelaine Dyane Paris accompagnant la foire aux questions"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
            </section>

            {/* FAQ */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
                <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, textAlign: 'center', marginBottom: '64px' }}>
                    RETROUVEZ RÉPONSES À VOS QUESTIONS JUSTE ICI.
                </p>

                {faqs.map((faq, i) => (
                    <div key={i} style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                        <button
                            type="button"
                            onClick={() => setOpen(open === i ? null : i)}
                            style={{ ...font, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                        >
                            <span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 400 }}>{faq.question}</span>
                            <span style={{ fontSize: '18px', opacity: 0.4, transition: 'transform 0.2s', transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: '24px' }}>∨</span>
                        </button>
                        {open === i && (
                            <div style={{ paddingBottom: '28px' }}>
                                {faq.reponse.split('\n\n').map((para, j) => (
                                    <p key={j} style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, marginBottom: '12px' }}>{para}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }} />
            </section>

            {/* Newsletter */}
            <NewsletterForm />

        </div>
    )
}
