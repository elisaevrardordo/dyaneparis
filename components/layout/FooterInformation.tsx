import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import { localizedPath } from '@/i18n/paths'
import styles from './FooterInformation.module.css'

export default function FooterInformation({ locale, title, children }: {
  locale: string; title: string; children: React.ReactNode
}) {
  return <main className={`${styles.page} ${cartFontVariables}`}>
    <div className={styles.content}>
      <h1>{title}</h1>
      <div className={styles.copy}>{children}</div>
      <Link className={styles.contact} href={localizedPath(locale, '/contact')}>
        {locale === 'en' ? 'Contact the House' : 'Contacter la Maison'}
      </Link>
    </div>
  </main>
}
