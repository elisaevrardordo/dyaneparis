import { redirect } from 'next/navigation'
import { localizedPath } from '@/i18n/paths'

export default async function PersonnalisationRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(localizedPath(locale, '/fabrication'))
}
