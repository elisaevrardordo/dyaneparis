'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandWordmark from '@/components/BrandWordmark'
import FooterNewsletter from '@/components/layout/FooterNewsletter'
import { cartFontVariables as footerFonts } from '@/components/cart/fonts'
import { localizedPath } from '@/i18n/paths'
import styles from './layout/SiteFooter.module.css'

export default function Footer() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const en = locale === 'en'
  const t = (fr: string, english: string) => en ? english : fr
  const currentPath = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/'
  const groups = [
    { title: t('Nos Créations', 'Our Creations'), links: [
      { label: t('Toutes les créations', 'All creations'), href: '/oeuvres' },
      { label: 'Dyane No.1', href: '/oeuvres/dyane-no1-pornstar-martini' },
      { label: 'Dyane No.2', href: '/oeuvres/dyane-no2-basil-smash' },
      { label: t('Éditions limitées & Collaborations', 'Limited editions & Collaborations'), href: '/oeuvres/bouteille-signee-teokaykay' },
      { label: t('Œuvres sur commande', 'Bespoke works'), href: '/oeuvre-sur-commande' },
    ] },
    { title: t('La Conciergerie', 'The Concierge'), links: [
      { label: t('Contacter la Maison', 'Contact the House'), href: '/contact' },
      { label: t('Questions fréquentes', 'Frequently asked questions'), href: '/faq' },
      { label: t('Cadeaux & Entreprises', 'Gifts & Corporate'), href: '/offrir-un-cocktail-de-luxe' },
    ] },
    { title: t('La Maison Dyane', 'The House of Dyane'), links: [
      { label: t('Notre Histoire', 'Our Story'), href: '/la-maison' },
      { label: t('Savoir-Faire', 'Craftsmanship'), href: '/fabrication' },
      { label: t('Le Journal', 'The Journal'), href: '/le-journal' },
      { label: t('Expériences', 'Experiences'), href: '/experiences' },
      { label: t('Presse', 'Press'), href: '/presse' },
    ] },
    { title: t('Informations Légales', 'Legal Information'), links: [
      { label: t('Mentions légales', 'Legal notice'), href: '/mentions-legales' },
      { label: t('Conditions générales de vente', 'Terms of sale'), href: '/cgv' },
      { label: t('Politique de confidentialité', 'Privacy policy'), href: '/confidentialite' },
      { label: t('Gestion des cookies', 'Cookie settings'), href: '/cookies' },
      { label: t('Nos engagements', 'Our commitments'), href: '/sustainability' },
    ] },
  ]

  return <footer id="site-footer" className={`${styles.footer} ${footerFonts}`}>
    <div className={styles.inner}>
      <div className={styles.main}>
        <FooterNewsletter locale={locale} />
        <nav className={styles.navigation} aria-label={t('Explorer Dyane Paris', 'Explore Dyane Paris')}>
          {groups.map(group => <section className={styles.group} key={group.title}>
            <h2 className={styles.title}>{group.title}</h2>
              <div className={styles.links}>{group.links.map(link => link.href.startsWith('/')
                ? <Link className={styles.link} href={localizedPath(locale, link.href)} scroll={['/mentions-legales', '/cgv', '/confidentialite', '/cookies'].includes(link.href) ? false : undefined} key={link.label}>{link.label}</Link>
                : <a className={styles.link} href={link.href} key={link.label}>{link.label}</a>)}</div>
          </section>)}
        </nav>
      </div>
      <div className={styles.bottom}>
        <div className={styles.social}><span>{t('Suivez la Maison', 'Follow the House')}</span><a href="https://www.instagram.com/dyaneparis_/" target="_blank" rel="noopener noreferrer">Instagram</a></div>
        <Link className={styles.wordmark} href={localizedPath(locale)} aria-label={t('Accueil Dyane Paris', 'Dyane Paris home')}><BrandWordmark /></Link>
        <div className={styles.region}><span>{t('Pays/Région : France (Français)', 'Country/Region: France (English)')}</span><nav aria-label={t('Choisir la langue', 'Choose your language')}><Link href={localizedPath('fr', currentPath === '/' ? '' : currentPath)} lang="fr" hrefLang="fr" aria-current={!en ? 'page' : undefined}>FR</Link><span aria-hidden="true">/</span><Link href={localizedPath('en', currentPath === '/' ? '' : currentPath)} lang="en" hrefLang="en" aria-current={en ? 'page' : undefined}>EN</Link></nav></div>
      </div>
      <p className={styles.alcohol} id="consommation-responsable">L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</p>
    </div>
  </footer>
}
