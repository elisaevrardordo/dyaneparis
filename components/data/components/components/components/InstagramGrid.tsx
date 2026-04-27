import Image from 'next/image'import ContactForm from '@/components/ContactForm'

export const metadata = { title: 'Contacter la Conciergerie - Dyane Paris' }

export default function ContactPage() {
  return (
      <div className="bg-cream min-h-screen">
            <div className="max-w-2xl mx-auto px-8 py-20">
                    <h1 className="title-display text-4xl md:text-5xl mb-4">Contacter<br/>la Maison.</h1>
                            <p className="kicker text-xs opacity-60 mb-12 leading-relaxed">
                                      Pour toute demande, nos equipes sont a votre disposition<br/>
                                                du lundi au vendredi, 10h00-18h00 (heure de Paris).
                                                        </p>
                                                                <ContactForm />
                                                                      </div>
                                                                          </div>
                                                                            )
                                                                            }

const igImages = ['/images/instagram/ig1.jpg','/images/instagram/ig2.jpg','/images/instagram/ig3.jpg','/images/instagram/ig4.jpg']

export default function InstagramGrid({ handle, profileUrl }: { handle: string; profileUrl: string }) {
  return (
      <section className="bg-white py-8 px-6">
            <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                              <p className="kicker mb-2 opacity-60">Instagram</p>
                                        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                                                    className="title-display text-xl hover:opacity-70 transition-opacity">
                                                                {handle}
                                                                          </a>
                                                                                  </div>
                                                                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                                                                    {igImages.map((src, i) => (
                                                                                                                <a key={i} href={profileUrl} target="_blank" rel="noopener noreferrer"
                                                                                                                              className="block overflow-hidden" style={{aspectRatio:'1/1'}}>
                                                                                                                                            <Image src={src} alt={`Instagram ${i+1}`} width={400} height={400}
                                                                                                                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                                                                                                                                                        </a>
                                                                                                                                                                                  ))}
                                                                                                                                                                                          </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                    </section>
                                                                                                                                                                                                      )
                                                                                                                                                                                                      }