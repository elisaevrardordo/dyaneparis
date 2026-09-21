'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getSiteTheme } from '@/lib/siteTheme'

export default function SiteThemeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const theme = getSiteTheme(pathname)
  const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const isHomePage = route === '/'

  return (
    <div className="site-shell" data-home-page={isHomePage} data-site-theme={theme}>
      <Header />
      <div className="site-page-transition" data-home-scroll-container={isHomePage || undefined}>
        {children}
        {isHomePage ? <Footer /> : null}
      </div>
      {isHomePage ? null : <Footer />}
    </div>
  )
}
