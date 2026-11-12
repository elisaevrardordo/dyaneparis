import LegalDialog from '../LegalDialog'
import Document from '../documents/PrivacyDocument'

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale}><Document /></LegalDialog>
}
