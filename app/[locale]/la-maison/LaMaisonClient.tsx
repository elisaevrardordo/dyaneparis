'use client'
import { useLocale } from 'next-intl'
import DyaneEditorialPage from '@/components/editorial/DyaneEditorialPage'
import { getEditorialPage } from '@/content/editorialPages'

export default function LaMaisonClient() {
  const locale = useLocale()
  return <DyaneEditorialPage page={getEditorialPage('la-maison', locale)} locale={locale} />
}
