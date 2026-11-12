import DyaneEditorialPage from '@/components/editorial/DyaneEditorialPage'
import { getEditorialPage } from '@/content/editorialPages'

export default function FabricationPage({ locale }: { locale: string }) {
  return <DyaneEditorialPage page={getEditorialPage('fabrication', locale)} locale={locale} />
}
