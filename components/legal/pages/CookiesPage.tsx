import LegalDialog from '../LegalDialog'
import Document from '../documents/CookiesDocument'

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale}><Document /></LegalDialog>
}
