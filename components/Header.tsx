'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const fontNav = { fontFamily: 'Lora, serif' }

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const pathname = usePathname()
    const t = useTranslations('header')

    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    const navLinks = [
        {
            label: t('collections'),
            href: '/oeuvres',
        },
        {
            label: t('distillation'),
            href: '/distillation',
        },
        {
            label: t('experiences'),
            href: '/experiences',
        },
        {
            label: t('maison'),
            href: '/la-maison',
        },
        {
            label: t('journal'),
            href: '/le-journal',
        },
        {
            label: t('contact'),
            href: '/contact',
        },
    ]

    return (
        <header
            style={{
                background: '#0d0d0d',
                position: 'relative',
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '24px 24px 32px',
                }}
            >
                <Link
                    href={locale === 'en' ? '/en' : '/'}
                    style={{ textDecoration: 'none' }}
                >
                    <img
                        src="/LogoDYANE_blanc.png"
                        alt="Dyane Paris"
                        style={{
                            height: '70px',
                            width: 'auto',
                            display: 'block',
                        }}
                    />
                </Link>
            </div>

            {/* Desktop nav */}
            <nav
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.10)',
                }}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={
                            locale === 'en'
                                ? '/en' + link.href
                                : link.href
                        }
                        style={{
                            ...fontNav,
                            color: '#fff',
                            fontSize: '11px',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            opacity: 0.75,
                            transition: 'opacity 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = '1')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = '0.75')
                        }
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Mobile menu button */}
            <div
                style={{
                    display: 'none',
                    justifyContent: 'flex-end',
                    padding: '0 24px 16px',
                }}
                className="header-nav-mobile-btn"
            >
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        ...fontNav,
                        color: '#fff',
                        background: 'none',
                        border: 'none',
                        fontSize: '11px',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    {menuOpen ? t('close') : t('menu')}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <nav
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.10)',
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={
                                locale === 'en'
                                    ? '/en' + link.href
                                    : link.href
                            }
                            onClick={() => setMenuOpen(false)}
                            style={{
                                ...fontNav,
                                color: '#fff',
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
                </nav>
            )}
        </header>
    )
}
