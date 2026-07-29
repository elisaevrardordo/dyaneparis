'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styles from './Configurator.module.css'
import {
  type ConfiguratorStep,
  defaultMaterialCalibration,
  type FormatId,
  type MaterialCalibration,
  type Palette,
} from './data'
import MaterialCalibrationPanel from './MaterialCalibrationPanel'

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
  reducedMotion: boolean
  introActive: boolean
}

export default function ConfiguratorStage({
  activeStep,
  selectedFormatId,
  palette,
  reducedMotion,
  introActive,
}: ConfiguratorStageProps) {
  const [debugMaterials, setDebugMaterials] = useState(false)
  const [calibration, setCalibration] = useState<MaterialCalibration>({
    ...defaultMaterialCalibration,
  })

  useEffect(() => {
    const queryEnabled = new URLSearchParams(window.location.search).get('debug-materials') === '1'
    setDebugMaterials(process.env.NODE_ENV === 'development' && queryEnabled)
  }, [])

  return (
    <div className={styles.stage} data-step={activeStep}>
      <DyaneCanvas
        activeStep={activeStep}
        selectedFormatId={selectedFormatId}
        palette={palette}
        reducedMotion={reducedMotion}
        introActive={introActive}
        calibration={calibration}
      />
      {debugMaterials ? (
        <MaterialCalibrationPanel
          value={calibration}
          onChange={setCalibration}
          onReset={() => setCalibration({ ...defaultMaterialCalibration })}
        />
      ) : null}
    </div>
  )
}
