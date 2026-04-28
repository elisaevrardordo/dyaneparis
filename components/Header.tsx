'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'OEUVRES', href: '/oeuvres' },
  { label: 'DISTILLATION', href: '/distillation' },
  { label: 'EXPERIENCES', href: '/experiences' },
  { label: 'LA MAISON', href: '/la-maison' },
  { label: 'LE JOURNAL', href: '/le-journal' },
  { label: 'CONTACTER LA CONCIERGERIE', href: '/contact' },
]

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <header style={{ background: '#0d0d0d', position: 'relative', zIndex: 50 }}>
            <div style={{ padding: '8px 24px 4px' }}>
                <span style={{ color: '#fff', fontSize: '10px', letterSpacing: '0.26em', opacity: 0.6, textTransform: 'uppercase', fontFamily: 'Playfair Display, serif' }}>
    FRANCAIS
</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 24px' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <img
                        src="https://cdn.shopify.com/s/files/1/0939/4998/5143/files/LogoDyaneParis_blanc_2048x.png?v=1716457372"
                        alt="Dyane Paris"
                        style={{ height: '64px', width: 'auto', display: 'block' }}
                    />
                </Link>
            </div>
            <nav style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.10)',
            }} className="header-nav-desktop">
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} style={{
                        color: '#fff',
                        fontSize: '11px',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        opacity: 0.85,
                        transition: 'opacity 0.2s',
                    }}>
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div style={{ display: 'none', justifyContent: 'flex-end', padding: '0 24px 16px' }} className="header-nav-mobile-btn">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ color: '#fff', background: 'none', border: 'none', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                    {menuOpen ? 'FERMER' : 'MENU'}
                </button>
            </div>
            {menuOpen && (
                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.10)',
                }}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                            color: '#fff',
                            fontSize: '11px',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            opacity: 0.85,
                        }}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
