import LegalDialog from '@/components/legal/LegalDialog'
import Document from '@/components/legal/documents/NoticeDocument'

export default async function NoticeModal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale} intercepted><Document /></LegalDialog>
}
