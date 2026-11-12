import type { ReactNode } from 'react'
import Link from 'next/link'
import { cartFontVariables } from '@/components/cart/fonts'
import EditorialImage from '@/components/editorial/EditorialImage'
import actionStyles from '@/components/editorial/EditorialAction.module.css'
import { localizedPath } from '@/i18n/paths'
import styles from './BespokeDetail.module.css'

type BespokeDetailProps = {
  id: string
  locale: string
  title: string
  subtitle?: string
  image?: { src: string; alt: string; width: number; height: number }
  cta?: string
  introduction: ReactNode
  prelude?: ReactNode
  children?: ReactNode
}

export default function BespokeDetail({ id, locale, title, subtitle, image, cta, introduction, prelude, children }: BespokeDetailProps) {
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} tabIndex={-1} className={`${styles.section} ${cartFontVariables}`}>
      {prelude}
      <div className={image ? styles.opening : styles.textOpening}>
        <div className={styles.copy}>
          <h2 id={titleId}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {introduction}
        </div>
        {image && <EditorialImage {...image} className={styles.image} sizes="(max-width: 760px) calc(100vw - 40px), 420px" />}
      </div>
      {children}
      {cta && <div className={styles.actions}>
        <Link href={localizedPath(locale, '/contact')} className={actionStyles.button}>{cta}</Link>
      </div>}
    </section>
  )
}
