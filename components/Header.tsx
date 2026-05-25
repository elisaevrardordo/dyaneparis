'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const fontNav = { fontFamily: 'var(--font-lora), serif' }

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
                    .header-logo-wrap { grid-template-columns: 1fr auto 1fr !important; }
                }
                @media (min-width: 769px) {
                    .header-desktop-nav { display: flex !important; }
                    .header-mobile-btn { display: none !important; }
                    .header-logo-wrap { justify-content: center !important; display: flex !important; }
                }
            `}</style>

            <header style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>

                {/* Logo centré desktop / logo gauche + hamburger droite mobile */}
                <div className="header-logo-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '20px 24px 16px' }}>

                    {/* Espace gauche vide sur desktop, invisible */}
                    <div />

                    {/* Logo centré */}
                    <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
                        <Image
                            src="/LogoDYANE_blanc.png"
                            alt="Dyane Paris"
                            width={1554}
                            height={1389}
                            sizes="60px"
                            style={{ height: '60px', width: 'auto', display: 'block' }}
                        />
                    </Link>

                    {/* Hamburger à droite sur mobile */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="header-mobile-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                display: 'none',
                                color: '#fff',
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

                {/* Desktop nav */}
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

                {/* Mobile menu déroulant transparent */}
                {menuOpen && (
                    <nav style={{
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '32px',
                        padding: '48px 24px',
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
