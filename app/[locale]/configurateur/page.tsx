import { redirect } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'

export default async function ConfigurateurRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(localizedPath(locale, '/fabrication'))
}
