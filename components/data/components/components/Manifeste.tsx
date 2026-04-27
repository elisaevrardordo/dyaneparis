export default function Manifeste() {import Image from 'next/image'
    import Link from 'next/link'

    interface Props { kicker:string; title:string; text:string; ctaLabel:string; ctaHref:string; smallImage:string; mainImage:string }

    export default function DualImage({ kicker,title,text,ctaLabel,ctaHref,smallImage,mainImage }:Props) {
      return (
          <section className="bg-white py-20 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                                  <div className="flex flex-col justify-start">
                                              <p className="kicker mb-3">{kicker}</p>
                                                          <h2 className="title-display text-3xl md:text-5xl mb-6">{title}</h2>
                                                                      <p className="text-sm leading-relaxed opacity-80 max-w-sm">{text}</p>
                                                                                  <Link href={ctaHref} className="link-luxury mt-8 self-start">{ctaLabel}</Link>
                                                                                            </div>
                                                                                                      <div className="grid grid-cols-3 gap-4 items-end">
                                                                                                                  <div className="col-span-1">
                                                                                                                                <Image src={smallImage} alt={title} width={200} height={280} className="w-full object-cover" style={{height:'280px'}} />
                                                                                                                                            </div>
                                                                                                                                                        <div className="col-span-2">
                                                                                                                                                                      <Image src={mainImage} alt={title} width={400} height={680} className="w-full object-cover" style={{height:'680px'}} />
                                                                                                                                                                                  </div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                              </section>
                                                                                                                                                                                                                )
                                                                                                                                                                                                                }
      return (
          <section className="bg-white py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                        <p className="kicker mb-4">Dyane Paris</p>
                                <h2 className="title-display text-2xl md:text-4xl mb-6">
                                          Le cocktail eleve au rang d oeuvre
                                                  </h2>
                                                          <div className="w-24 h-px bg-black/14 mx-auto mb-8" />
                                                                  <div className="space-y-2">
                                                                            <p className="kicker text-xs opacity-80">Des flacons sculpturaux concus comme des pieces de caractere.</p>
                                                                                      <p className="kicker text-xs opacity-80">Une vision artistique.</p>
                                                                                                <p className="kicker text-xs opacity-80">Chaque bouteille est une experience a vivre, puis a conserver.</p>
                                                                                                        </div>
                                                                                                                <a href="/oeuvres" className="btn-luxury inline-block mt-10">Decouvrir la Maison</a>
                                                                                                                      </div>
                                                                                                                          </section>
                                                                                                                            )
                                                                                                                            }
}