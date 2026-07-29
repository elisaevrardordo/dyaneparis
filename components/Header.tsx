'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { localizedPath } from '@/i18n/paths'

const fontNav = { fontFamily: 'var(--font-lora), serif' }

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const t = useTranslations('header')
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const isConfigurator = pathname.includes('/configurateur')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinks = [
        { label: t('collections'), href: '/oeuvres' },
        { label: t('distillation'), href: '/distillation' },
        { label: t('experiences'), href: '/experiences' },
        { label: t('maison'), href: '/la-maison' },
        { label: t('journal'), href: '/le-journal' },
        { label: t('contact'), href: '/contact' },
    ]

    const isDarkBar = pathname.includes('/le-journal') || pathname.includes('/contact')
    const textColor = '#fff'
    const logoSrc = '/LogoDYANE_blanc.png'

    const headerBg = isDarkBar
        ? 'rgba(8,12,20,0.92)'
        : scrolled
            ? 'rgba(0,0,0,0.72)'
            : 'transparent'

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .header-desktop-nav { display: none !important; }
                    .header-mobile-btn { display: flex !important; }
                    .header-logo-wrap { grid-template-columns: 1fr auto 1fr !important; }
                }
                @media (min-width: 769px) {
                    .header-desktop-nav { display: flex !important; }
                    .header-mobile-btn { display: none !important; }
                    .header-logo-wrap { justify-content: center !important; display: flex !important; }
                    .header-logo-wrap.header-configurator { justify-content: flex-start !important; padding-left: 48px !important; }
                }
                .header-link { transition: opacity 0.2s ease !important; }
                .header-link:hover { opacity: 1 !important; }
            `}</style>

            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: headerBg,
                backdropFilter: (!isDarkBar && scrolled) ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: (!isDarkBar && scrolled) ? 'blur(12px)' : 'none',
                transition: 'background 0.4s ease',
            }}>

                <div className={`header-logo-wrap${isConfigurator ? ' header-configurator' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '24px 24px 12px' }}>
                    <div />
                    <Link href={localizedPath(locale)} style={{ textDecoration: 'none' }}>
                        <Image
                            src={logoSrc}
                            alt="Dyane Paris"
                            width={1554}
                            height={1389}
                            sizes="52px"
                            style={{ height: '52px', width: 'auto', display: 'block' }}
                        />
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="header-mobile-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                display: 'none',
                                color: textColor,
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                lineHeight: 1,
                            }}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {!isConfigurator && <nav
                    className="header-desktop-nav"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        paddingBottom: '20px',
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={localizedPath(locale, link.href)}
                            className="header-link"
                            style={{
                                ...fontNav,
                                color: textColor,
                                fontSize: '11px',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                opacity: 0.75,
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>}

                {menuOpen && (
                    <nav style={{
                        background: 'rgba(8,12,20,0.96)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '32px',
                        padding: '48px 24px',
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={localizedPath(locale, link.href)}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    ...fontNav,
                                    color: textColor,
                                    fontSize: '14px',
                                    letterSpacing: '0.28em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>
        </>
    )
}
