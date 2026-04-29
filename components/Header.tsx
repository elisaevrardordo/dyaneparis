'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'ŒUVRES', href: '/oeuvres' },
  { label: 'DISTILLATION', href: '/distillation' },
  { label: 'EXPÉRIENCES', href: '/experiences' },
  { label: 'LA MAISON', href: '/la-maison' },
  { label: 'LE JOURNAL', href: '/le-journal' },
  { label: 'CONTACTER LA CONCIERGERIE', href: '/contact' },
]

const fontNav = { fontFamily: 'Playfair Display, serif' }

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [lang, setLang] = useState<'fr' | 'en'>('fr')

    return (
        <header style={{ background: '#0d0d0d', position: 'relative', zIndex: 50 }}>
            {/* Langue */}
            <div style={{ padding: '12px 32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                    style={{ ...fontNav, color: '#fff', fontSize: '12px', letterSpacing: '0.26em', opacity: 1, textTransform: 'uppercase', background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0', cursor: 'pointer', padding: '6px 14px' }}
                >
                    {lang === 'fr' ? 'FRANÇAIS' : 'ENGLISH'}
                </button>
            </div>

            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 24px 32px' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <img
                        src="/LogoDYANE_blanc.png"
                        alt="Dyane Paris"
                        style={{ height: '70px', width: 'auto', display: 'block' }}
                    />
                </Link>
            </div>

            {/* Navigation desktop */}
            <nav style={{ display: 'flex', justifyContent: 'center', gap: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} style={{ ...fontNav, color: '#fff', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.85, transition: 'opacity 0.2s' }}>
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Burger mobile */}
            <div style={{ display: 'none', justifyContent: 'flex-end', padding: '0 24px 16px' }} className="header-nav-mobile-btn">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ ...fontNav, color: '#fff', background: 'none', border: 'none', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                    {menuOpen ? 'FERMER' : 'MENU'}
                </button>
            </div>

            {menuOpen && (
                <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ ...fontNav, color: '#fff', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.85 }}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
