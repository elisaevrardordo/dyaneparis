'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { localizedPath } from '@/i18n/paths'
import styles from './layout/SiteFooter.module.css'

export default function Footer() {
  const pathname = usePathname()
  const t = useTranslations('footer')
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const year = new Date().getFullYear()

  const houseLinks = [
    { label: t('collections'), href: '/oeuvres' },
    { label: t('maison'), href: '/la-maison' },
    { label: t('journal'), href: '/le-journal' },
    { label: t('experiences'), href: '/experiences' },
  ]
  const helpLinks = [
    { label: t('aide_faq'), href: '/faq' },
    { label: t('aide_contact'), href: '/contact' },
  ]
  const legalLinks = [
    { label: t('legal'), href: '/mentions-legales' },
    { label: t('cgv'), href: '/cgv' },
    { label: t('confidentialite'), href: '/confidentialite' },
    { label: t('cookies'), href: '/cookies' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link className={styles.brandLink} href={localizedPath(locale)} aria-label="Dyane Paris — accueil">
              <Image
                className={styles.brandImage}
                src="/LogoDYANE_blanc.png"
                alt="Dyane Paris"
                width={1554}
                height={1389}
                sizes="88px"
              />
            </Link>
            <p className={styles.signature}>{t('signature')}</p>
          </div>

          <nav aria-label={t('maison')}>
            <p className={styles.columnTitle}>{t('maison')}</p>
            {houseLinks.map((link) => (
              <Link className={styles.link} href={localizedPath(locale, link.href)} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label={t('aide_titre')}>
            <p className={styles.columnTitle}>{t('aide_titre')}</p>
            {helpLinks.map((link) => (
              <Link className={styles.link} href={localizedPath(locale, link.href)} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className={styles.columnTitle}>{t('follow')}</p>
            <a className={styles.link} href="https://www.instagram.com/dyaneparis_/" rel="noreferrer" target="_blank">
              Instagram
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <nav className={styles.legal} aria-label={t('legal')}>
            {legalLinks.map((link) => (
              <Link className={styles.legalLink} href={localizedPath(locale, link.href)} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <span className={styles.copyright}>© {year} DYANE PARIS</span>
        </div>
      </div>
      <p className={styles.alcohol}>{t('alcool')}</p>
    </footer>
  )
}
