'use client'
import type { ReactNode } from 'react'
import { useLocale } from 'next-intl'
import DyaneEditorialPage from '@/components/editorial/DyaneEditorialPage'
import { getEditorialPage } from '@/content/editorialPages'

export default function ExperiencesClient({ bespokeSections }: { bespokeSections: ReactNode }) {
  const locale = useLocale()
  return <DyaneEditorialPage page={getEditorialPage('experiences', locale)} locale={locale} afterPrelude={bespokeSections} />
}
