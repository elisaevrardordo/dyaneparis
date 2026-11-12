'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CartProvider from '@/components/commerce/CartProvider'
import commerce from '@/components/commerce/Commerce.module.css'
import { getSiteTheme } from '@/lib/siteTheme'

export default function SiteThemeShell({ children, catalogueOnly }: { children: ReactNode; catalogueOnly: boolean }) {
  const pathname = usePathname()
  const theme = getSiteTheme(pathname)
  const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const isHomePage = route === '/'

  // The bag has its own quiet commerce header and footer; editorial routes retain theirs.
  if (route === '/panier') return <CartProvider><div className={commerce.entry}>{children}</div></CartProvider>

  return (
    <CartProvider><div className="site-shell"
      data-storefront-shell={isHomePage} data-home-page={isHomePage} data-site-theme={theme}>
      <Header catalogueOnly={catalogueOnly} />
      <div key={route} className={`site-page-transition ${/^\/oeuvres\/|^\/offrir-un-cocktail-de-luxe/.test(route) ? commerce.entry : ''}`} data-home-scroll-container={isHomePage || undefined}>
        {children}
        {isHomePage ? <Footer /> : null}
      </div>
      {isHomePage ? null : <Footer />}
    </div></CartProvider>
  )
}
