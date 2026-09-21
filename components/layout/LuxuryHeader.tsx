'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import { getSiteTheme } from '@/lib/siteTheme'
import styles from './LuxuryHeader.module.css'

type HeaderMode = 'hero' | 'solid'
type HeaderForeground = 'white' | 'black'

type HeaderState = {
  path: string
  mode: HeaderMode
  foreground: HeaderForeground
}

function initialHeaderState(pathname: string): HeaderState {
  const theme = getSiteTheme(pathname)
  const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const isJournalIndex = route === '/le-journal' || route === '/journal'
  const isExperiencesPage = route === '/experiences'
  return {
    path: pathname,
    mode: (theme === 'journal' && !isJournalIndex) || theme === 'archive' ? 'solid' : 'hero',
    foreground: isExperiencesPage || isJournalIndex ? 'white' : 'black',
  }
}

export default function LuxuryHeader() {
  const pathname = usePathname()
  const t = useTranslations('header')
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const pageTheme = getSiteTheme(pathname)
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const pathWithoutLocale = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const localePath = locale === 'en'
    ? pathWithoutLocale
    : `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerState, setHeaderState] = useState<HeaderState>(() => initialHeaderState(pathname))
  const resolvedHeaderState = headerState.path === pathname ? headerState : initialHeaderState(pathname)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const leftLinks = [
    { label: t('collections'), href: '/oeuvres' },
    { label: t('maison'), href: '/la-maison' },
    { label: t('personalization'), href: '/fabrication' },
  ]
  const rightLinks = [
    { label: t('experiences'), href: '/experiences' },
    { label: t('journal'), href: '/le-journal' },
    { label: t('concierge'), href: '/contact' },
  ]
  const mobileLinks = [...leftLinks, ...rightLinks]

  useEffect(() => {
    let updateFrame = 0

    const commitHeaderState = (mode: HeaderMode, foreground: HeaderForeground) => {
      setHeaderState((current) => {
        if (current.path === pathname && current.mode === mode && current.foreground === foreground) {
          return current
        }
        return { path: pathname, mode, foreground }
      })
    }

    const updateHeaderMode = () => {
      updateFrame = 0
      if (pageTheme === 'archive') {
        commitHeaderState('solid', 'black')
        return
      }

      const hero = document.querySelector<HTMLElement>('[data-page-hero]')
      if (!hero) {
        commitHeaderState('solid', 'black')
        return
      }

      const bounds = hero.getBoundingClientRect()
      const headerHeight = headerRef.current?.getBoundingClientRect().height
        ?? Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))
        ?? 112
      const heroIsBehindHeader = bounds.bottom > headerHeight
      const declaredForeground = hero.getAttribute('data-header-foreground')
      const foreground: HeaderForeground = declaredForeground === 'black' ? 'black' : 'white'

      const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
      const isHomePage = route === '/'
      if (isHomePage) {
        const sampleY = headerHeight / 2
        const home = document.querySelector<HTMLElement>('main[data-section-scroll]')
        const sections = Array.from(
          home?.querySelectorAll<HTMLElement>('[data-scroll-section]') ?? [],
        )
        const controlledIndex = Number(home?.dataset.activeSlide ?? 0)
        const activeSection = home?.dataset.controlledScroll === 'true'
          ? sections[controlledIndex]
          : sections.find((section) => {
              const sectionBounds = section.getBoundingClientRect()
              return sectionBounds.top <= sampleY && sectionBounds.bottom > sampleY
            })
        const activeForeground = activeSection?.getAttribute('data-header-foreground')

        commitHeaderState('hero', activeForeground === 'white' ? 'white' : 'black')
        return
      }

      commitHeaderState(
        heroIsBehindHeader ? 'hero' : 'solid',
        heroIsBehindHeader ? foreground : 'black',
      )
    }

    const scheduleHeaderUpdate = () => {
      if (updateFrame) return
      updateFrame = window.requestAnimationFrame(updateHeaderMode)
    }

    scheduleHeaderUpdate()
    const homeScrollContainer = document.querySelector<HTMLElement>('[data-home-scroll-container]')
    homeScrollContainer?.addEventListener('scroll', scheduleHeaderUpdate, { passive: true })
    window.addEventListener('home-slide-change', scheduleHeaderUpdate)
    window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true })
    window.addEventListener('resize', scheduleHeaderUpdate, { passive: true })
    window.addEventListener('orientationchange', scheduleHeaderUpdate, { passive: true })
    window.addEventListener('pageshow', scheduleHeaderUpdate)

    return () => {
      window.cancelAnimationFrame(updateFrame)
      homeScrollContainer?.removeEventListener('scroll', scheduleHeaderUpdate)
      window.removeEventListener('home-slide-change', scheduleHeaderUpdate)
      window.removeEventListener('scroll', scheduleHeaderUpdate)
      window.removeEventListener('resize', scheduleHeaderUpdate)
      window.removeEventListener('orientationchange', scheduleHeaderUpdate)
      window.removeEventListener('pageshow', scheduleHeaderUpdate)
    }
  }, [pageTheme, pathname])

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
      ref={headerRef}
      className={`${styles.header}${resolvedHeaderState.mode === 'solid' ? ' is-solid' : ''}`}
      data-menu-open={menuOpen}
      data-foreground={resolvedHeaderState.foreground}
      data-theme={pageTheme}
    >
      <div className={`${styles.bar}${pageTheme === 'archive' ? ` ${styles.archiveBar}` : ''}`}>
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

        <Link
          className={`${styles.logo}${pageTheme === 'archive' ? ` ${styles.archiveLogo}` : ''}`}
          href={localizedPath(locale)}
          aria-label="Dyane Paris — accueil"
        >
          <Image
            className={styles.logoImage}
            src="/LogoDYANE_blanc.png"
            alt="Dyane Paris"
            width={1554}
            height={1389}
            sizes="98px"
            priority
          />
        </Link>

        <a className={`${styles.languageLink} ${styles.mobileOnly}`} href={localePath} hrefLang={otherLocale}>
          {otherLocale.toUpperCase()}
        </a>

        <nav className={styles.desktopGroup} aria-label={t('secondaryNavigation')}>
          {rightLinks.map((link) => (
            <Link className={styles.navLink} href={localizedPath(locale, link.href)} key={link.href}>
              {link.label}
            </Link>
          ))}
          <a className={styles.languageLink} href={localePath} hrefLang={otherLocale}>
            {locale === 'fr' ? 'FR / EN' : 'EN / FR'}
          </a>
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
            <a href={localePath} hrefLang={otherLocale} onClick={() => setMenuOpen(false)}>
              {otherLocale === 'en' ? 'English' : 'Français'}
            </a>
            <a href="https://www.instagram.com/dyaneparis_/" rel="noreferrer" target="_blank">Instagram</a>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
