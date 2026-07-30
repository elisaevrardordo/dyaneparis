import type { Metadata } from 'next'
import ConfiguratorShell from '@/components/configurator/ConfiguratorShell'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'

  return {
    title: isEnglish ? 'The Atelier — 3D study' : "L'Atelier — Étude 3D",
    description: isEnglish
      ? 'Explore the first interactive Dyane Paris porcelain sculpture study.'
      : 'Explorez la première étude interactive de la sculpture en porcelaine Dyane Paris.',
    robots: { index: false, follow: false },
  }
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ConfiguratorShell locale={locale} />
}
