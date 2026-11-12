import LegalDialog from '../LegalDialog'
import Document from '../documents/NoticeDocument'

export default async function NoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale}><Document /></LegalDialog>
}
