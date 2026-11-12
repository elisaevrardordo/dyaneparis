import LegalDialog from '../LegalDialog'
import Document from '../documents/TermsDocument'

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale}><Document /></LegalDialog>
}
