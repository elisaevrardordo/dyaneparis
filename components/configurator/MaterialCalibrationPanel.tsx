'use client'

import Image from 'next/image'
import type { MaterialCalibration } from './data'
import styles from './Configurator.module.css'

interface CalibrationControl {
  key: keyof MaterialCalibration
  label: string
  min: number
  max: number
  step: number
}

const controls: readonly CalibrationControl[] = [
  { key: 'exposure', label: 'Exposition', min: 0.65, max: 1.25, step: 0.01 },
  { key: 'bodyRoughness', label: 'Rugosité corps', min: 0.08, max: 0.55, step: 0.005 },
  { key: 'bodyClearcoat', label: 'Clearcoat corps', min: 0, max: 0.5, step: 0.01 },
  { key: 'bodyClearcoatRoughness', label: 'Rugosité clearcoat', min: 0.03, max: 0.45, step: 0.005 },
  { key: 'bodyEnvMapIntensity', label: 'Environnement corps', min: 0.2, max: 1.8, step: 0.02 },
  { key: 'keyLightIntensity', label: 'Key light', min: 0.2, max: 5, step: 0.05 },
  { key: 'fillLightIntensity', label: 'Fill light', min: 0, max: 2.5, step: 0.05 },
  { key: 'veilRoughness', label: 'Rugosité voile', min: 0.05, max: 0.5, step: 0.005 },
  { key: 'veilClearcoat', label: 'Clearcoat voile', min: 0, max: 0.8, step: 0.01 },
] as const

interface MaterialCalibrationPanelProps {
  value: MaterialCalibration
  onChange: (value: MaterialCalibration) => void
  onReset: () => void
}

export default function MaterialCalibrationPanel({
  value,
  onChange,
  onReset,
}: MaterialCalibrationPanelProps) {
  return (
    <aside className={styles.calibrationPanel} aria-label="Calibration des matériaux">
      <div className={styles.calibrationReference}>
        <Image
          src="/dyane-no1.webp"
          alt="Photographie de référence de la bouteille Dyane rouge et ivoire"
          width={1080}
          height={1350}
          sizes="180px"
          priority
        />
      </div>
      <div className={styles.calibrationControls}>
        <div className={styles.calibrationHeading}>
          <strong>Calibration matière</strong>
          <button type="button" onClick={onReset}>
            Réinitialiser
          </button>
        </div>
        {controls.map((control) => (
          <label key={control.key} className={styles.calibrationControl}>
            <span>{control.label}</span>
            <output>{value[control.key].toFixed(3)}</output>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={value[control.key]}
              onChange={(event) =>
                onChange({ ...value, [control.key]: Number(event.currentTarget.value) })
              }
            />
          </label>
        ))}
      </div>
    </aside>
  )
}
