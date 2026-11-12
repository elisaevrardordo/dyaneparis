'use client'

import { useEffect, useId, useState } from 'react'
import { useLocale } from 'next-intl'
import styles from './SiteLoader.module.css'

export default function SiteLoader({ initial = false }: { initial?: boolean } = {}) {
  const id = useId()
  const locale = useLocale()
  return (
    <div className={`${styles.overlay}${initial ? ` ${styles.initial}` : ''}`} role="status" aria-label={locale === 'en' ? 'Loading Dyane Paris' : 'Chargement de Dyane Paris'}>
      <svg className={styles.emblem} viewBox="451 237 395 782" aria-hidden="true" focusable="false">
        <defs>
          <filter id={`${id}-ink`} colorInterpolationFilters="sRGB">
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -.6378 -2.1456 -.2166 0 2.76" />
          </filter>
          <mask id={`${id}-emblem`} maskUnits="userSpaceOnUse" x="451" y="237" width="395" height="782">
            <image href="/images/brand/dyane-loading-emblem.webp" width="1254" height="1254" filter={`url(#${id}-ink)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-emblem)`}>
          <rect x="451" y="237" width="395" height="782" fill="#242120" />
          <path className={styles.drape} d="M451 735 Q595 718 846 715 V1019 H451 Z" />
        </g>
      </svg>
    </div>
  )
}

export function InitialSiteLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const finish = () => setLoading(false)
    if (document.readyState === 'complete') {
      finish()
      return
    }
    window.addEventListener('load', finish, { once: true })
    const timeout = window.setTimeout(finish, 2400)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('load', finish)
    }
  }, [])

  return loading ? <SiteLoader initial /> : null
}
