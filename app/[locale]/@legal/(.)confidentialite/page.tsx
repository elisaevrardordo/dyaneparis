import LegalDialog from '@/components/legal/LegalDialog'
import Document from '@/components/legal/documents/PrivacyDocument'

export default async function PrivacyModal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale} intercepted><Document /></LegalDialog>
}
