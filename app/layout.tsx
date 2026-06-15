export const metadata = {
  icons: {
    icon: '/favicon.svg',
  },
} import './globals.css'
import { getLocale } from 'next-intl/server'
import { fontVariables } from './fonts'

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
