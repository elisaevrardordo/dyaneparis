'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import styles from './LuxuryHeader.module.css'

export default function LuxuryHeader() {
  const pathname = usePathname()
  const t = useTranslations('header')
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const localePath = locale === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : `/en${pathname === '/' ? '' : pathname}`
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [surfaceTheme, setSurfaceTheme] = useState<'light' | 'dark'>(
    pathname.includes('/configurateur') ? 'dark' : 'light',
  )
  const menuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const leftLinks = [
    { label: t('collections'), href: '/oeuvres' },
    { label: t('maison'), href: '/la-maison' },
    { label: t('personalization'), href: '/configurateur' },
  ]
  const rightLinks = [
    { label: t('experiences'), href: '/experiences' },
    { label: t('journal'), href: '/le-journal' },
    { label: t('concierge'), href: '/contact' },
  ]
  const mobileLinks = [...leftLinks, ...rightLinks]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const themedSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'))
    if (themedSections.length === 0) {
      setSurfaceTheme(pathname.includes('/configurateur') ? 'dark' : 'light')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        const theme = active?.target.getAttribute('data-header-theme')
        if (theme === 'light' || theme === 'dark') setSurfaceTheme(theme)
      },
      { rootMargin: '0px 0px -88% 0px', threshold: 0 },
    )
    themedSections.forEach((section) => {
      observer.observe(section)
    })
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const menu = menuRef.current
    const menuItems = Array.from(menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    const focusable = menuButtonRef.current ? [menuButtonRef.current, ...menuItems] : menuItems
    menuItems[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header
      className={styles.header}
      data-solid={scrolled}
      data-menu-open={menuOpen}
      data-route-theme={surfaceTheme}
    >
      <div className={styles.bar}>
        <nav className={styles.desktopGroup} aria-label={t('primaryNavigation')}>
          {leftLinks.map((link) => (
            <Link className={styles.navLink} href={localizedPath(locale, link.href)} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-label={menuOpen ? t('close') : t('menu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>

        <Link className={styles.logo} href={localizedPath(locale)} aria-label="Dyane Paris — accueil">
          <Image
            className={styles.logoImage}
            src="/LogoDYANE_blanc.png"
            alt="Dyane Paris"
            width={1554}
            height={1389}
            sizes="74px"
            priority
          />
        </Link>

        <Link className={`${styles.languageLink} ${styles.mobileOnly}`} href={localePath} hrefLang={otherLocale}>
          {otherLocale.toUpperCase()}
        </Link>

        <nav className={styles.desktopGroup} aria-label={t('secondaryNavigation')}>
          {rightLinks.map((link) => (
            <Link className={styles.navLink} href={localizedPath(locale, link.href)} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className={styles.languageLink} href={localePath} hrefLang={otherLocale}>
            {locale === 'fr' ? 'FR / EN' : 'EN / FR'}
          </Link>
        </nav>
      </div>

      {menuOpen ? (
        <nav
          ref={menuRef}
          id="mobile-navigation"
          className={styles.mobileMenu}
          aria-label={t('mobileNavigation')}
        >
          <div className={styles.mobileNav}>
            {mobileLinks.map((link) => (
              <Link
                className={styles.mobileNavLink}
                href={localizedPath(locale, link.href)}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileMeta}>
            <Link href={localePath} hrefLang={otherLocale} onClick={() => setMenuOpen(false)}>
              {otherLocale === 'en' ? 'English' : 'Français'}
            </Link>
            <a href="https://www.instagram.com/dyaneparis_/" rel="noreferrer" target="_blank">Instagram</a>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
