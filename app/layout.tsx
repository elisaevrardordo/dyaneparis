import './globals.css'
import { getLocale } from 'next-intl/server'
import { fontVariables } from './fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  icons: { icon: '/favicon.png' },
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={fontVariables}>
      <body>
        {children}
      </body>
    </html>
  )
}
