'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'Oeuvres', href: '/oeuvres' },
    { label: 'Distillation', href: '/distillation' },
      { label: 'Experiences', href: '/experiences' },
        { label: 'La Maison', href: '/la-maison' },
          { label: 'Le Journal', href: '/le-journal' },
            { label: 'Contacter la Conciergerie', href: '/contact' },
            ]

import Link from 'next/link'

export default function Footer() {
  return (
      <footer className="bg-black text-white py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
                    <Link href="/" className="font-playfair text-xl tracking-widest uppercase text-white block mb-8 opacity-80 hover:opacity-100">
                              DYANE <span className="text-sm">Paris</span>
                                      </Link>
                                              <nav className="flex flex-wrap justify-center gap-8 mb-10">
                                                        {[['Oeuvres','/oeuvres'],['Distillation','/distillation'],['Experiences','/experiences'],['La Maison','/la-maison'],['Le Journal','/le-journal'],['Contact','/contact']].map(([label,href])=>(
                                                                    <Link key={href} href={href} className="text-white/60 hover:text-white transition-colors text-xs uppercase" style={{letterSpacing:'0.22em'}}>{label}</Link>
                                                                              ))}
                                                                                      </nav>
                                                                                              <div className="flex justify-center gap-6 mb-10">
                                                                                                        <a href="https://instagram.com/dyaneparis_" target="_blank" rel="noopener noreferrer"
                                                                                                                    className="text-white/50 hover:text-white transition-colors text-xs uppercase" style={{letterSpacing:'0.2em'}}>
                                                                                                                                Instagram @dyaneparis_
                                                                                                                                          </a>
                                                                                                                                                  </div>
                                                                                                                                                          <div className="border-t border-white/10 pt-8">
                                                                                                                                                                    <p className="text-white/30 text-xs uppercase" style={{letterSpacing:'0.18em'}}>
                                                                                                                                                                                {new Date().getFullYear()} Dyane Paris. Tous droits reserves.
                                                                                                                                                                                          </p>
                                                                                                                                                                                                    <p className="text-white/20 text-xs mt-2 uppercase" style={{letterSpacing:'0.14em'}}>
                                                                                                                                                                                                                L'abus d'alcool est dangereux pour la sante. A consommer avec moderation.
                                                                                                                                                                                                                          </p>
                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                            </footer>
                                                                                                                                                                                                                                              )
                                                                                                                                                                                                                                              }            export default function Header() {
              const [menuOpen, setMenuOpen] = useState(false)
                return (
                    <header style={{ background: '#000' }} className="relative z-50">
                          <div className="flex justify-start px-6 pt-4 pb-1">
                                  <span className="text-white text-xs tracking-widest opacity-60 uppercase" style={{letterSpacing:'0.25em'}}>Francais</span>
                                        </div>
                                              <div className="flex justify-center py-4">
                                                      <Link href="/" className="text-white font-playfair text-2xl tracking-widest uppercase">DYANE<br/><span className="text-xs tracking-widest">Paris</span></Link>
                                                            </div>
                                                                  <nav className="hidden md:flex justify-center gap-8 pb-5 border-b border-white/10">
                                                                          {navLinks.map((link) => (
                                                                                    <Link key={link.href} href={link.href}
                                                                                                className="text-white hover:opacity-70 transition-opacity text-xs uppercase"
                                                                                                            style={{letterSpacing:'0.22em'}}>
                                                                                                                        {link.label}
                                                                                                                                  </Link>
                                                                                                                                          ))}
                                                                                                                                                </nav>
                                                                                                                                                      <div className="md:hidden flex justify-end px-6 pb-4">
                                                                                                                                                              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xs uppercase tracking-widest">
                                                                                                                                                                        {menuOpen ? 'x' : 'Menu'}
                                                                                                                                                                                </button>
                                                                                                                                                                                      </div>
                                                                                                                                                                                            {menuOpen && (
                                                                                                                                                                                                    <nav className="md:hidden flex flex-col items-center gap-6 py-6 border-t border-white/10">
                                                                                                                                                                                                              {navLinks.map((link) => (
                                                                                                                                                                                                                          <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                                                                                                                                                                                                                                        className="text-white hover:opacity-70 text-xs uppercase" style={{letterSpacing:'0.22em'}}>
                                                                                                                                                                                                                                                      {link.label}
                                                                                                                                                                                                                                                                  </Link>
                                                                                                                                                                                                                                                                            ))}
                                                                                                                                                                                                                                                                                    </nav>
                                                                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                                                              </header>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                }