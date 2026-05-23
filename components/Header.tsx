'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const fontNav = { fontFamily: 'Lora, serif' }

const navFr = [
    { label: 'ŒUVRES', href: '/oeuvres' },
    { label: 'DISTILLATION', href: '/distillation' },
    { label: 'EXPÉRIENCES', href: '/experiences' },
    { label: 'LA MAISON', href: '/la-maison' },
    { label: 'LE JOURNAL', href: '/le-journal' },
    { label: 'CONTACTER LA CONCIERGERIE', href: '/contact' },
]

const navEn = [
    { label: 'COLLECTIONS', href: '/oeuvres' },
    { label: 'DISTILLATION', href: '/distillation' },
    { label: 'EXPERIENCES', href: '/experiences' },
    { label: 'THE HOUSE', href: '/la-maison' },
    { label: 'THE JOURNAL', href: '/le-journal' },
    { label: 'CONTACT THE CONCIERGE', href: '/contact' },
]

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [langHover, setLangHover] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const navLinks = locale === 'fr' ? navFr : navEn

    function switchLang() {
        if (locale === 'fr') {
            const newPath = '/en' + (pathname === '/fr' ? '' : pathname.replace('/fr', ''))
            router.push(newPath)
        } else {
            const newPath = pathname.replace('/en', '') || '/'
            router.push(newPath)
        }
    }

    return (
        <header style={{ background: '#0d0d0d', position: 'relative', zIndex: 50 }}>
            <div style={{ padding: '14px 40px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={switchLang}
                    onMouseEnter={() => setLangHover(true)}
                    onMouseLeave={() => setLangHover(false)}
                    style={{
                        ...fontNav,
                        color: langHover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)',
                        fontSize: '9px',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 0',
                        position: 'relative',
                        transition: 'color 0.3s ease',
                    }}
                >
                    {locale === 'fr' ? 'Français' : 'English'}
                    <span style={{
                        position: 'absolute',
                        bottom: 0, left: 0,
                        width: '100%', height: '1px',
                        background: langHover ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                        transition: 'background 0.3s ease',
                    }} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 24px 32px' }}>
                <Link href={locale === 'fr' ? '/' : '/en'} style={{ textDecoration: 'none' }}>
                    <img src="/LogoDYANE_blanc.png" alt="Dyane Paris" style={{ height: '70px', width: 'auto', display: 'block' }} />
                </Link>
            </div>

            <nav style={{ display: 'flex', justifyContent: 'center', gap: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={locale === 'en' ? '/en' + link.href : link.href}
                        style={{ ...fontNav, color: '#fff', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.75, transition: 'opacity 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div style={{ display: 'none', justifyContent: 'flex-end', padding: '0 24px 16px' }} className="header-nav-mobile-btn">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ ...fontNav, color: '#fff', background: 'none', border: 'none', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                    {menuOpen ? (locale === 'fr' ? 'FERMER' : 'CLOSE') : 'MENU'}
                </button>
            </div>

            {menuOpen && (
                <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={locale === 'en' ? '/en' + link.href : link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{ ...fontNav, color: '#fff', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.75 }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
