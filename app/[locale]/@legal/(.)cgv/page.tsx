import LegalDialog from '@/components/legal/LegalDialog'
import Document from '@/components/legal/documents/TermsDocument'

export default async function TermsModal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale} intercepted><Document /></LegalDialog>
}
