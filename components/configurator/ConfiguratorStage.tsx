'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styles from './Configurator.module.css'
import type { Palette } from './data'

const DyaneCanvas = dynamic(() => import('./DyaneCanvas'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading} role="status">
      <span className={styles.loadingLine} />
      <span>La matière prend forme</span>
    </div>
  ),
})

export default function ConfiguratorStage({ palette }: { palette: Palette }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(media.matches)
    syncPreference()
    media.addEventListener('change', syncPreference)
    return () => media.removeEventListener('change', syncPreference)
  }, [])

  return (
    <div className={styles.stage}>
      <div className={styles.halo} aria-hidden="true" />
      <DyaneCanvas palette={palette} reducedMotion={reducedMotion} />
    </div>
  )
}
