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
        { label: t('collections'), href: '/oeuvres' },
        { label: t('distillation'), href: '/distillation' },
        { label: t('experiences'), href: '/experiences' },
        { label: t('maison'), href: '/la-maison' },
        { label: t('journal'), href: '/le-journal' },
        { label: t('contact'), href: '/contact' },
    ]

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .header-desktop-nav { display: none !important; }
                    .header-mobile-btn { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .header-desktop-nav { display: flex !important; }
                    .header-mobile-btn { display: none !important; }
                }
            `}</style>

            <header style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>

                {/* Logo + bouton hamburger mobile */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                    <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
                        <img
                            src="/LogoDYANE_blanc.png"
                            alt="Dyane Paris"
                            style={{ height: '52px', width: 'auto', display: 'block' }}
                        />
                    </Link>

                    {/* Hamburger mobile */}
                    <button
                        className="header-mobile-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            display: 'none',
                            ...fontNav,
                            color: '#fff',
                            background: 'none',
                            border: 'none',
                            fontSize: '10px',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Desktop nav — centré sous le logo */}
                <nav
                    className="header-desktop-nav"
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
                            href={`/${locale}${link.href}`}
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
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu déroulant */}
                {menuOpen && (
                    <nav style={{
                        background: 'rgba(0,0,0,0.92)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '28px',
                        padding: '40px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={`/${locale}${link.href}`}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    ...fontNav,
                                    color: '#fff',
                                    fontSize: '13px',
                                    letterSpacing: '0.28em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    opacity: 0.85,
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
