import Image from 'next/image'export default function HeroVideo() {
      return (
          <section className="relative w-full overflow-hidden" style={{ height: '80vh' }}>
                <video src="/videos/dyane-hero.mp4" autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                                            <p className="kicker mb-4 opacity-80" style={{color:'white'}}>En avant-premiere</p>
                                                    <h1 className="title-display text-4xl md:text-6xl mb-6 max-w-3xl" style={{color:'white'}}>
                                                              Dyane Paris
                                                                      </h1>
                                                                              <p className="text-white/80 text-sm mb-8 uppercase" style={{letterSpacing:'0.2em'}}>Maison d Art Liquide</p>
                                                                                      <a href="/oeuvres" className="btn-luxury" style={{color:'white',borderColor:'rgba(255,255,255,0.4)'}}>
                                                                                                Decouvrir la Maison
                                                                                                        </a>
                                                                                                              </div>
                                                                                                                  </section>
                                                                                                                    )
                                                                                                                    }
}
import Link from 'next/link'
import type { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {
  return (
      <div className="flex flex-col items-center text-center group">
            <Link href={`/oeuvres/${product.slug}`} className="block w-full overflow-hidden mb-4">
                    <Image src={product.image} alt={product.name} width={400} height={500}
                              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ aspectRatio: '4/5' }} />
                                              </Link>
                                                    <Link href={`/oeuvres/${product.slug}`}>
                                                            <h3 className="title-display text-base mb-1">{product.name}</h3>
                                                                    <p className="kicker text-xs opacity-60 mb-4">{product.subtitle}</p>
                                                                          </Link>
                                                                                <Link href="/contact" className="kicker text-xs hover:opacity-60 transition-opacity">
                                                                                        Contacter la Conciergerie
                                                                                              </Link>
                                                                                                  </div>
                                                                                                    )
                                                                                                    }