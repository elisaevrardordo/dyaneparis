'use client'

import { useMemo, useState } from 'react'
import styles from './Configurator.module.css'
import ConfiguratorStage from './ConfiguratorStage'
import {
  type ConfiguratorStep,
  defaultPaletteId,
  type FormatId,
  formatPrice,
  formats,
  type PaletteId,
  palettes,
} from './data'

const copy = {
  fr: {
    atelier: 'Atelier de personnalisation',
    stepFormat: 'Étape 1 — Le format',
    formatTitle: 'Choisissez les proportions de votre œuvre',
    startingAt: 'À partir de',
    onRequest: 'Prix sur demande',
    continue: 'Continuer',
    selected: 'Format sélectionné',
    paletteStep: 'Étape 2 — La matière',
    paletteTitle: 'Interprétez le voile',
    paletteIntro: 'La couleur se dépose progressivement sur le voile, sans altérer la porcelaine.',
    shadeSelected: 'Teinte sélectionnée',
    back: 'Revoir les formats',
    hint: 'Déplacez doucement le pointeur pour contempler la sculpture.',
  },
  en: {
    atelier: 'Personalisation Atelier',
    stepFormat: 'Step 1 — Format',
    formatTitle: 'Choose the proportions of your work',
    startingAt: 'Starting at',
    onRequest: 'Price on request',
    continue: 'Continue',
    selected: 'Selected format',
    paletteStep: 'Step 2 — The material',
    paletteTitle: 'Interpret the veil',
    paletteIntro: 'Colour settles gradually on the veil while preserving the porcelain.',
    shadeSelected: 'Selected shade',
    back: 'Review formats',
    hint: 'Move the pointer gently to contemplate the sculpture.',
  },
} as const

export default function ConfiguratorShell({ locale }: { locale: string }) {
  const [activeStep, setActiveStep] = useState<ConfiguratorStep>('format')
  const [selectedFormatId, setSelectedFormatId] = useState<FormatId | null>(null)
  const [paletteId, setPaletteId] = useState<PaletteId>(defaultPaletteId)
  const isEnglish = locale === 'en'
  const text = isEnglish ? copy.en : copy.fr
  const numberLocale = isEnglish ? 'en-GB' : 'fr-FR'
  const selectedFormat = useMemo(
    () => formats.find((format) => format.id === selectedFormatId) ?? null,
    [selectedFormatId],
  )
  const selectedPalette = useMemo(
    () => palettes.find((palette) => palette.id === paletteId) ?? palettes[0],
    [paletteId],
  )

  function formatStartingPrice(startingPrice: number | null) {
    return startingPrice === null ? text.onRequest : `${text.startingAt} ${formatPrice(startingPrice * 100, numberLocale)}`
  }

  function continueToPalette() {
    if (!selectedFormatId) return
    setActiveStep('palette')
  }

  return (
    <main className={styles.configurator} data-step={activeStep}>
      <ConfiguratorStage
        activeStep={activeStep}
        selectedFormatId={selectedFormatId}
        palette={selectedPalette}
      />

      <div className={styles.atelierMark} aria-hidden="true">
        <span>{text.atelier}</span>
        <span>{activeStep === 'format' ? '01 / 04' : '02 / 04'}</span>
      </div>

      {activeStep === 'format' ? (
        <section className={styles.formatPanel} aria-labelledby="format-title">
          <div className={styles.formatInner}>
            <p className={styles.stepLabel}>{text.stepFormat}</p>
            <h1 id="format-title" className={styles.formatTitle}>
              {text.formatTitle}
            </h1>

            <fieldset className={styles.formatChoices} aria-labelledby="format-title">
              {formats.map((format) => {
                const selected = format.id === selectedFormatId
                return (
                  <button
                    key={format.id}
                    type="button"
                    aria-pressed={selected}
                    className={styles.formatChoice}
                    onClick={() => setSelectedFormatId(format.id)}
                  >
                    <span className={styles.formatLabel}>{format.label}</span>
                    <span className={styles.formatPrice}>{formatStartingPrice(format.startingPrice)}</span>
                  </button>
                )
              })}
            </fieldset>

            <div className={styles.continueRow}>
              <p className={styles.currentSelection} aria-live="polite">
                {selectedFormat ? `${text.selected} — Dyane ${selectedFormat.label}` : text.stepFormat}
              </p>
              <button
                type="button"
                className={styles.continueButton}
                disabled={!selectedFormatId}
                onClick={continueToPalette}
              >
                {text.continue}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.palettePanel} aria-labelledby="palette-title">
          <button type="button" className={styles.backButton} onClick={() => setActiveStep('format')}>
            <span aria-hidden="true">←</span>
            {text.back}
          </button>
          <p className={styles.stepLabel}>{text.paletteStep}</p>
          <h1 id="palette-title" className={styles.paletteTitle}>
            {text.paletteTitle}
          </h1>
          <p className={styles.paletteIntro}>{text.paletteIntro}</p>

          <div className={styles.paletteList}>
            {palettes.map((palette) => {
              const selected = palette.id === selectedPalette.id
              return (
                <button
                  className={styles.paletteButton}
                  type="button"
                  key={palette.id}
                  aria-pressed={selected}
                  aria-label={`${palette.name}${selected ? `, ${text.shadeSelected.toLowerCase()}` : ''}`}
                  onClick={() => setPaletteId(palette.id)}
                >
                  <span
                    className={`${styles.swatch} ${selected ? styles.swatchSelected : ''}`}
                    style={{ '--swatch-color': palette.color } as React.CSSProperties}
                    aria-hidden="true"
                  />
                  <span className={styles.paletteName}>{palette.shortName}</span>
                </button>
              )
            })}
          </div>

          <div className={styles.paletteMeta}>
            <span>{selectedFormat ? `Dyane ${selectedFormat.label}` : ''}</span>
            <span>{selectedPalette.name}</span>
          </div>
          <p className={styles.interactionHint}>{text.hint}</p>
        </section>
      )}

      <p className={styles.signature}>L’art se boit.</p>
    </main>
  )
}
