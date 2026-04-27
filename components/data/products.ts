export interface Product {import ProductCard from './ProductCard'
    import type { Product } from '@/data/products'

    export default function ProductGrid({ products }: { products: Product[] }) {
      return (
          <section className="bg-white py-16 px-6">
                <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  {products.map((product) => (
                                              <ProductCard key={product.id} product={product} />
                                                        ))}
                                                                </div>
                                                                      </div>
                                                                          </section>
                                                                            )
                                                                            }
      id: string
        name: string
          subtitle: string
            description: string
              slug: string
                image: string
                }

                export const products: Product[] = [
                  {
                      id: 'dyane-no1',
                          name: 'Dyane No.1',
                              subtitle: 'Pornstar Martini',
                                  description: 'Une interpretation sculpturale du cocktail le plus desirable. Notes de fruit de la passion, vanille et vodka infusee. Flacon en porcelaine, numerote a la main.',
                                      slug: 'dyane-no1-pornstar-martini',
                                          image: '/images/products/dyane-no1.jpg',
                                            },
                                              {
                                                  id: 'dyane-no2',
                                                      name: 'Dyane No.2',
                                                          subtitle: 'Moscow Mule',
                                                              description: 'La vivacite du gingembre sublimee dans un flacon d exception. Vodka artisanale, gingembre frais, citron vert.',
                                                                  slug: 'dyane-no2-moscow-mule',
                                                                      image: '/images/products/dyane-no2.jpg',
                                                                        },
                                                                          {
                                                                              id: 'teo-dyane',
                                                                                  name: 'Teo for Dyane Paris',
                                                                                      subtitle: 'Edition Artistique',
                                                                                          description: 'Une collaboration exclusive avec l artiste Teo. Flacon unique peint a la main, numerote et certifie.',
                                                                                              slug: 'teo-for-dyane-paris',
                                                                                                  image: '/images/products/teo-dyane.jpg',
                                                                                                    },
                                                                                                    ]
}