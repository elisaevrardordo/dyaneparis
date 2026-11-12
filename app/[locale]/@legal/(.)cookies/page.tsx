import LegalDialog from '@/components/legal/LegalDialog'
import Document from '@/components/legal/documents/CookiesDocument'

export default async function CookiesModal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDialog locale={locale} intercepted><Document /></LegalDialog>
}
