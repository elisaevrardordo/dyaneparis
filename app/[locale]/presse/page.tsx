import type { Metadata } from 'next'
import FooterInformation from '@/components/layout/FooterInformation'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Press' : 'Presse', robots: { index: false, follow: true } }
}

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const en = locale === 'en'
  return <FooterInformation locale={locale} title={en ? 'Press Room' : 'Espace Presse'}>
    <p>{en ? 'The Dyane Paris press space is being prepared.' : 'L’espace presse Dyane Paris est en préparation.'}</p>
    <p>{en ? 'For press enquiries, please use our contact page.' : 'Pour toute demande presse, rendez-vous sur notre page Contact.'}</p>
  </FooterInformation>
}
