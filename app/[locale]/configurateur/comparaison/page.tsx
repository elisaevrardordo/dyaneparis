import type { Metadata } from 'next'
import GlbComparison from '@/components/configurator/GlbComparison'

export const metadata: Metadata = {
  title: 'Audit GLB — Dyane Web V2',
  robots: { index: false, follow: false },
}

export default async function GlbComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <GlbComparison locale={locale} />
}
