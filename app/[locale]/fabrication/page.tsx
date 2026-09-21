import type { Metadata } from 'next'
import FabricationPage from '@/components/fabrication/FabricationPage'
import { buildPageMetadata } from '@/lib/seo'

const fabricationImage = {
  url: '/editorial/fabrication/DESSIN.png',
  width: 1080,
  height: 1350,
  alt: 'Dessin préparatoire de la sculpture Dyane Paris',
  caption: 'La fabrication des œuvres Dyane Paris',
  description: 'De la sculpture en porcelaine à la composition liquide, les gestes de fabrication Dyane Paris.',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'

  return buildPageMetadata({
    locale,
    path: '/fabrication',
    title: isEnglish ? 'The Making | Dyane Paris' : 'La Fabrication | Dyane Paris',
    description: isEnglish
      ? 'Discover how Dyane Paris works are made, from the creation of the porcelain sculpture to the composition of its cocktails.'
      : 'Découvrez la fabrication des œuvres Dyane Paris, de la création de la sculpture en porcelaine à l’élaboration de ses cocktails.',
    image: fabricationImage,
    absoluteTitle: true,
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <FabricationPage locale={locale} />
}
