'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'
import { localizedPath } from '@/i18n/paths'
import { getSiteTheme } from '@/lib/siteTheme'
import BrandWordmark from '@/components/BrandWordmark'
import { useCart } from '@/components/commerce/CartProvider'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import CollectionsMenu from './CollectionsMenu'
import styles from './LuxuryHeader.module.css'

type NavigationKey = 'collections' | 'maison' | 'fabrication' | 'experiences' | 'journal' | 'concierge'

type HeaderMode = 'hero' | 'solid'
type HeaderForeground = 'white' | 'black'

const MOBILE_MENU_QUERY = '(max-width: 1050px)'
const DESKTOP_PRIMARY_CATEGORY_COUNT = 3
const QUIET_EDITORIAL_ROUTES = ['/la-maison', '/fabrication']
const BESPOKE_LANDING_PATH = '/experiences'

type HeaderState = {
  path: string
  mode: HeaderMode
  foreground: HeaderForeground
}

function initialHeaderState(pathname: string): HeaderState {
  const theme = getSiteTheme(pathname)
  const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const isJournalIndex = route === '/le-journal' || route === '/journal'
  const isMediaHero = ['/', '/distillation', BESPOKE_LANDING_PATH].includes(route)
  const isQuietEditorial = QUIET_EDITORIAL_ROUTES.includes(route)
  return {
    path: pathname,
    mode: isQuietEditorial || (theme === 'journal' && !isJournalIndex) || theme === 'archive' ? 'solid' : 'hero',
    foreground: isMediaHero ? 'white' : 'black',
  }
}

export default function LuxuryHeader({ catalogueOnly = false }: { catalogueOnly?: boolean }) {
  const emblemId = useId()
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
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<NavigationKey | null>(null)
  const [headerState, setHeaderState] = useState<HeaderState>(() => initialHeaderState(pathname))
  const resolvedHeaderState = headerState.path === pathname ? headerState : initialHeaderState(pathname)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const collectionsButtonRef = useRef<HTMLButtonElement>(null)
  const collectionsDisclosureRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const categoryTitleRef = useRef<HTMLHeadingElement>(null)

  const { items } = useCart()
  const cartCount = catalogueOnly ? 0 : items.reduce((sum, item) => sum + item.quantity, 0)
  const isEnglish = locale === 'en'
  const collectionsLabel = t('collections')
  const closeMenu = () => setMenuOpen(false)
  const commerceHref = localizedPath(locale, catalogueOnly ? '/boutique' : '/panier')
  const commerceLabel = catalogueOnly ? (isEnglish ? 'Shop' : 'Boutique') : (isEnglish ? 'Bag' : 'Panier')
  const bagLink = (
    <Link
      className={styles.bagLink}
      href={commerceHref}
      aria-label={catalogueOnly ? commerceLabel : `${isEnglish ? 'My bag' : 'Mon panier'} (${cartCount})`}
      onClick={closeMenu}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
        <path d="M5 8h14v13H5zM8 8V6a4 4 0 0 1 8 0v2" />
      </svg>
      {cartCount > 0 && <span className={styles.bagCount} aria-hidden="true">{cartCount}</span>}
    </Link>
  )
  const cloud = 'https://res.cloudinary.com/dazhkrimv/image/upload/'
  const categories: Array<{
    key: Exclude<NavigationKey, 'collections'>
    label: string
    href: string
    links: Array<{ label: string; href: string }>
    cards: Array<{ label: string; href: string; src: string; alt: string }>
  }> = [
    {
      key: 'maison', label: t('maison'), href: '/la-maison',
      links: [
        { label: isEnglish ? 'Our story' : 'Notre histoire', href: '/la-maison' },
        { label: isEnglish ? 'Official gallery' : 'Galerie officielle', href: '/galerie' },
        { label: isEnglish ? 'The art of giving' : 'L’art d’offrir', href: '/offrir-un-cocktail-de-luxe' },
      ],
      cards: [
        { label: isEnglish ? 'A house of liquid art' : 'Une maison d’art liquide', href: '/la-maison', src: `${cloud}v1792596466/dyane-paris-sculpture-porcelaine-rouge-art-floral.png`, alt: isEnglish ? 'Dyane sculpture in a floral composition' : 'Sculpture Dyane dans une composition florale' },
        { label: isEnglish ? 'The collection' : 'La collection', href: '/galerie', src: `${cloud}v1791499963/dyane-paris-collection-sculptures-porcelaine-rouge-verte.png`, alt: isEnglish ? 'The red and green Dyane sculptures' : 'Les sculptures Dyane rouge et verte' },
      ],
    },
    {
      key: 'fabrication', label: t('personalization'), href: '/fabrication',
      links: [
        { label: isEnglish ? 'The time and the hand' : 'Le temps et la main', href: '/fabrication' },
        { label: isEnglish ? 'Distillation' : 'La distillation', href: '/distillation' },
      ],
      cards: [
        { label: isEnglish ? 'Porcelain' : 'La porcelaine', href: '/fabrication', src: `${cloud}v1791499963/dyane-paris-fabrication-sculpture-porcelaine.png`, alt: isEnglish ? 'Crafting a Dyane porcelain sculpture' : 'Fabrication d’une sculpture en porcelaine Dyane' },
        { label: isEnglish ? 'The hand-painted finish' : 'La peinture à la main', href: '/fabrication', src: `${cloud}v1792596468/dyane-paris-peinture-main-sculpture-porcelaine.png`, alt: isEnglish ? 'Hand-painting a Dyane sculpture' : 'Peinture à la main d’une sculpture Dyane' },
      ],
    },
    {
      key: 'experiences', label: t('experiences'), href: '/experiences',
      links: [
        { label: isEnglish ? 'The art of entertaining' : 'L’art de recevoir', href: '/experiences' },
        { label: isEnglish ? 'Your project' : 'Votre projet', href: '/contact' },
      ],
      cards: [
        { label: isEnglish ? 'The Dyane experience' : 'L’expérience Dyane', href: '/experiences', src: `${cloud}v1792596446/dyane-paris-art-de-recevoir-cocktail-signature.png`, alt: isEnglish ? 'A Dyane signature cocktail' : 'Un cocktail signature Dyane' },
        { label: 'Hospitality', href: '/experiences', src: `${cloud}v1793574951/rf_5_t0ljhk.png`, alt: isEnglish ? 'Dyane cocktail at the bar' : 'Cocktail Dyane au bar' },
      ],
    },
    {
      key: 'journal', label: t('journal'), href: '/le-journal',
      links: [
        { label: isEnglish ? 'All the stories' : 'Tous les récits', href: '/le-journal' },
        { label: 'Pornstar Martini', href: '/le-journal/pornstar-martini' },
        { label: 'Basil Smash', href: '/le-journal/basil-smash' },
      ],
      cards: [
        { label: isEnglish ? 'Stories from the House' : 'Les récits de la Maison', href: '/le-journal', src: `${cloud}v1792596466/dyane-paris-sculpture-porcelaine-rouge-art-floral.png`, alt: isEnglish ? 'Dyane porcelain and flowers' : 'Porcelaine Dyane et fleurs' },
        { label: isEnglish ? 'Craft and creation' : 'Savoir-faire et création', href: '/le-journal', src: `${cloud}v1792596468/dyane-paris-peinture-main-sculpture-porcelaine.png`, alt: isEnglish ? 'The hand of the artisan' : 'Le geste de l’artisan' },
      ],
    },
    {
      key: 'concierge', label: isEnglish ? 'BESPOKE WORKS' : 'ŒUVRE SUR COMMANDE', href: '/oeuvre-sur-commande',
      links: [
        { label: isEnglish ? 'Contact the House' : 'Contacter la Maison', href: '/contact' },
        { label: isEnglish ? 'Bespoke works' : 'Œuvre sur commande', href: '/oeuvre-sur-commande' },
        { label: isEnglish ? 'Commission a sculpture' : 'Commander une sculpture', href: '/commission-a-sculpture' },
        { label: isEnglish ? 'Help' : 'Service d’aide', href: '/faq' },
      ],
      cards: [
        { label: isEnglish ? 'Private commissions' : 'Commande privée', href: '/commission-a-sculpture', src: `${cloud}v1791499963/dyane-paris-collection-sculptures-porcelaine-rouge-verte.png`, alt: isEnglish ? 'Dyane porcelain creations' : 'Créations en porcelaine Dyane' },
        { label: isEnglish ? 'The art of giving' : 'L’art d’offrir', href: '/offrir-un-cocktail-de-luxe', src: `${cloud}v1792596466/dyane-paris-sculpture-porcelaine-rouge-art-floral.png`, alt: isEnglish ? 'A Dyane sculpture with flowers' : 'Une sculpture Dyane avec des fleurs' },
      ],
    },
  ]
  const mobileCategories = [{ key: 'collections' as const, label: collectionsLabel }, ...categories]
  const currentCategory = categories.find((category) => category.key === activeCategory)
  const openMenu = (trigger: HTMLElement, category: NavigationKey | null) => {
    if (!window.matchMedia(MOBILE_MENU_QUERY).matches) return
    triggerRef.current = trigger
    setActiveCategory(category)
    setMenuOpen(true)
  }
  const closeCollections = () => setCollectionsOpen(false)

  useEffect(() => {
    setCollectionsOpen(false)
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
      const route = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
      if (pageTheme === 'archive' || QUIET_EDITORIAL_ROUTES.includes(route)) {
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

        commitHeaderState(activeForeground === 'white' ? 'hero' : 'solid', activeForeground === 'white' ? 'white' : 'black')
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
    if (!collectionsOpen) return

    const mobileLayout = window.matchMedia(MOBILE_MENU_QUERY)
    const closeOnMobile = () => {
      if (mobileLayout.matches) setCollectionsOpen(false)
    }
    const closeOnOutside = (event: Event) => {
      if (event.target instanceof Node && !collectionsDisclosureRef.current?.contains(event.target)) {
        setCollectionsOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setCollectionsOpen(false)
      collectionsButtonRef.current?.focus()
    }

    mobileLayout.addEventListener('change', closeOnMobile)
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('focusin', closeOnOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      mobileLayout.removeEventListener('change', closeOnMobile)
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('focusin', closeOnOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [collectionsOpen])

  useEffect(() => {
    if (!menuOpen) return
    const mobileLayout = window.matchMedia(MOBILE_MENU_QUERY)
    if (!mobileLayout.matches) {
      setMenuOpen(false)
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    const closeOnDesktop = () => {
      if (!mobileLayout.matches) setMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
        .filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && (document.activeElement === first || !menuRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !menuRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    mobileLayout.addEventListener('change', closeOnDesktop)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      mobileLayout.removeEventListener('change', closeOnDesktop)
      if (triggerRef.current?.isConnected && triggerRef.current.getClientRects().length > 0) {
        triggerRef.current.focus()
      } else if (logoRef.current?.isConnected) {
        logoRef.current.focus()
      }
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const frame = window.requestAnimationFrame(() => {
      if (activeCategory) {
        menuRef.current?.scrollTo({ top: 0 })
        categoryTitleRef.current?.focus({ preventScroll: true })
      } else {
        menuRef.current?.querySelector<HTMLButtonElement>('[data-menu-category]')?.focus()
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeCategory, menuOpen])

  return (
    <header
      ref={headerRef}
      className={`${styles.header}${collectionsOpen || resolvedHeaderState.mode === 'solid' ? ' is-solid' : ''}`}
      data-menu-open={menuOpen}
      data-collections-open={collectionsOpen}
      data-foreground={collectionsOpen ? 'black' : resolvedHeaderState.foreground}
      data-theme={pageTheme}
      data-bespoke-landing={pathWithoutLocale === BESPOKE_LANDING_PATH || undefined}
    >
      <div className={`${styles.bar}${pageTheme === 'archive' ? ` ${styles.archiveBar}` : ''}`} inert={menuOpen}>
        <nav className={styles.desktopGroup} aria-label={t('primaryNavigation')}>
          <div className={styles.collectionsDisclosure} ref={collectionsDisclosureRef}>
            <button
              ref={collectionsButtonRef}
              type="button"
              className={styles.navLink}
              aria-expanded={collectionsOpen}
              aria-controls="collections-navigation"
              onClick={() => setCollectionsOpen(open => !open)}
            >
              {collectionsLabel}
            </button>
            <div id="collections-navigation" className={styles.collectionsPanel} hidden={!collectionsOpen}>
              {collectionsOpen && <CollectionsMenu locale={locale} onNavigate={closeCollections} />}
            </div>
          </div>
          {categories.slice(0, DESKTOP_PRIMARY_CATEGORY_COUNT).map((category) => (
            <Link className={styles.navLink} href={localizedPath(locale, category.href)} key={category.key}>
              {category.label}
            </Link>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-label={t('menu')}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-haspopup="dialog"
          onClick={(event) => openMenu(event.currentTarget, null)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>

        <Link
          ref={logoRef}
          className={`${styles.logo}${pageTheme === 'archive' ? ` ${styles.archiveLogo}` : ''}`}
          href={localizedPath(locale)}
          aria-label={isEnglish ? 'Dyane Paris home' : 'Accueil Dyane Paris'}
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
          <svg className={styles.mobileEmblem} viewBox="449 455 182 397" aria-hidden="true" focusable="false">
            <defs>
              <filter id={`${emblemId}-ink`} colorInterpolationFilters="sRGB">
                <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -.2126 -.7152 -.0722 0 1" />
              </filter>
              <mask id={`${emblemId}-mask`} maskUnits="userSpaceOnUse" x="449" y="455" width="182" height="397">
                {/* The supplied black-on-white artwork defines the emblem's opacity. */}
                <image href="/images/brand/dyane-mobile-emblem.png" width="1080" height="1350" filter={`url(#${emblemId}-ink)`} />
              </mask>
            </defs>
            <rect x="449" y="455" width="182" height="397" fill="currentColor" mask={`url(#${emblemId}-mask)`} />
          </svg>
        </Link>

        <div className={styles.mobileUtilities}>
          <a className={styles.languageLink} href={localePath} hrefLang={otherLocale}>
            {otherLocale.toUpperCase()}
          </a>
          {bagLink}
        </div>

        <nav className={styles.desktopGroup} aria-label={t('secondaryNavigation')}>
          {categories.slice(DESKTOP_PRIMARY_CATEGORY_COUNT).map((category) => (
            <Link className={styles.navLink} href={localizedPath(locale, category.href)} key={category.key}>
              {category.label}
            </Link>
          ))}
          <div className={styles.desktopUtilities}>
            {pathWithoutLocale === '/' ? bagLink : (
              <Link className={styles.navLink} href={commerceHref}>{commerceLabel}{cartCount ? ` (${cartCount})` : ''}</Link>
            )}
            <a className={styles.languageLink} href={localePath} hrefLang={otherLocale}>
              {locale === 'fr' ? 'FR / EN' : 'EN / FR'}
            </a>
          </div>
        </nav>
      </div>

      {menuOpen ? (
        <div ref={menuRef} id="site-navigation" className={styles.menuPanel} role="dialog" aria-modal="true" aria-label={isEnglish ? 'Explore Dyane Paris' : 'Explorer Dyane Paris'} data-category-open={activeCategory !== null} data-collections-view={activeCategory === 'collections'}>
          <div className={styles.panelBar}>
            <button className={styles.backButton} type="button" onClick={() => setActiveCategory(null)} aria-label={isEnglish ? 'Back to the menu' : 'Retour au menu'}>
              {isEnglish ? 'Back' : 'Retour'}
            </button>
            <Link href={localizedPath(locale)} className={styles.panelBrand} onClick={closeMenu} aria-label={isEnglish ? 'Dyane Paris home' : 'Accueil Dyane Paris'}><BrandWordmark /></Link>
            <button ref={closeButtonRef} className={styles.closeButton} type="button" aria-label={t('close')} onClick={closeMenu}><span aria-hidden="true" /></button>
            <div className={styles.panelBag}>{bagLink}</div>
          </div>
          <div className={styles.panelBody}>
            <nav className={styles.categoryList} aria-label={t('primaryNavigation')}>
              {mobileCategories.map((category) => (
                <button type="button" className={styles.categoryButton} data-menu-category key={category.key} data-active={(activeCategory ?? 'collections') === category.key} onClick={() => setActiveCategory(category.key)}>
                  {category.label}
                </button>
              ))}
            </nav>
            {currentCategory ? (
              <div className={styles.categoryContent}>
                <div className={styles.categoryIntro}>
                  <h2 ref={categoryTitleRef} tabIndex={-1} className={styles.categoryTitle}>{currentCategory.label}</h2>
                  <Link href={localizedPath(locale, currentCategory.href)} className={styles.discoverLink} onClick={closeMenu}>{isEnglish ? 'Discover' : 'Découvrir'}</Link>
                  <nav className={styles.categoryLinks} aria-label={currentCategory.label}>
                    {currentCategory.links.map((link) => <Link href={localizedPath(locale, link.href)} key={`${link.href}-${link.label}`} onClick={closeMenu}>{link.label}</Link>)}
                  </nav>
                </div>
                <div className={styles.cards}>
                  {currentCategory.cards.map((card) => (
                    <Link href={localizedPath(locale, card.href)} key={`${currentCategory.key}-${card.src}`} className={styles.card} onClick={closeMenu}>
                      <span className={styles.cardImage}><Image src={card.src} alt={card.alt} fill sizes="(max-width: 700px) 44vw, (max-width: 1050px) 38vw, 25vw" style={{ objectFit: 'cover' }} /></span>
                      <span className={styles.cardLabel}>{card.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : activeCategory === 'collections' ? (
              <div>
                <h2 ref={categoryTitleRef} tabIndex={-1} className={styles.collectionsScreenTitle}>{collectionsLabel}</h2>
                <CollectionsMenu locale={locale} onNavigate={closeMenu} />
              </div>
            ) : (
              <div className={styles.panelShop}>
                <EditorialEmblem />
                <Link href={`${localizedPath(locale, '/boutique/sculpture')}#boutique-products`} onClick={closeMenu}>
                  <span>{isEnglish ? 'Art, now drinkable' : 'Désormais, l’art se boit'}</span>
                  <span className={styles.panelShopLabel}>{isEnglish ? 'The shop' : 'La Boutique'}</span>
                </Link>
              </div>
            )}
          </div>
          <div className={styles.panelMeta}>
            <a href={localePath} hrefLang={otherLocale}>{otherLocale === 'en' ? 'English' : 'Français'}</a>
            <Link href={localizedPath(locale, '/contact')} onClick={closeMenu}>{isEnglish ? 'Contact the House' : 'Contacter la Maison'}</Link>
            <a href="https://www.instagram.com/dyaneparis_/" rel="noreferrer" target="_blank">Instagram</a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
