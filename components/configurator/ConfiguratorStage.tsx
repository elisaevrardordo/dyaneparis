'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styles from './Configurator.module.css'
import type { ConfiguratorStep, FormatId, Palette } from './data'

const DyaneCanvas = dynamic(() => import('./DyaneCanvas'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading} role="status">
      <span className={styles.loadingLine} />
      <span>La matière prend forme</span>
    </div>
  ),
})

interface ConfiguratorStageProps {
  activeStep: ConfiguratorStep
  selectedFormatId: FormatId | null
  palette: Palette
}

export default function ConfiguratorStage({
  activeStep,
  selectedFormatId,
  palette,
}: ConfiguratorStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(media.matches)
    syncPreference()
    media.addEventListener('change', syncPreference)
    return () => media.removeEventListener('change', syncPreference)
  }, [])

  return (
    <div className={styles.stage} data-step={activeStep}>
      <DyaneCanvas
        activeStep={activeStep}
        selectedFormatId={selectedFormatId}
        palette={palette}
        reducedMotion={reducedMotion}
      />
    </div>
  )
}
