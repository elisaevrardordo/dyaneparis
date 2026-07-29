'use client'

import { useMemo, useState } from 'react'
import styles from './Configurator.module.css'
import ConfiguratorStage from './ConfiguratorStage'
import { defaultPaletteId, type PaletteId, palettes } from './data'

const copy = {
  fr: {
    eyebrow: "Maison d'Art Liquide — Paris",
    title: 'Votre Dyane, comme une œuvre.',
    intro: "Explorez la matière. La première étude de l'Atelier révèle le voile sans altérer la porcelaine.",
    study: 'Étude I',
    choice: 'La couleur du voile',
    hint: 'Faites délicatement glisser la sculpture pour la contempler.',
    selected: 'Teinte sélectionnée',
  },
  en: {
    eyebrow: 'Liquid Art House — Paris',
    title: 'Your Dyane, as a work of art.',
    intro: 'Explore the material. The first Atelier study reveals the veil while preserving the porcelain.',
    study: 'Study I',
    choice: 'Veil colour',
    hint: 'Gently drag the sculpture to contemplate it.',
    selected: 'Selected shade',
  },
} as const

export default function ConfiguratorShell({ locale }: { locale: string }) {
  const [paletteId, setPaletteId] = useState<PaletteId>(defaultPaletteId)
  const selectedPalette = useMemo(
    () => palettes.find((palette) => palette.id === paletteId) ?? palettes[0],
    [paletteId],
  )
  const text = locale === 'en' ? copy.en : copy.fr

  return (
    <main className={styles.configurator}>
      <ConfiguratorStage palette={selectedPalette} />

      <section className={styles.introduction} aria-labelledby="configurator-title">
        <p className={styles.eyebrow}>{text.eyebrow}</p>
        <h1 id="configurator-title" className={styles.title}>
          {text.title}
        </h1>
        <p className={styles.intro}>{text.intro}</p>
      </section>

      <section className={styles.palettePanel} aria-labelledby="palette-title">
        <div className={styles.panelHeading}>
          <p>{text.study}</p>
          <span aria-hidden="true" />
          <h2 id="palette-title">{text.choice}</h2>
        </div>

        <div className={styles.paletteList}>
          {palettes.map((palette) => {
            const selected = palette.id === selectedPalette.id
            return (
              <button
                className={styles.paletteButton}
                type="button"
                key={palette.id}
                aria-pressed={selected}
                aria-label={`${palette.name}${selected ? `, ${text.selected.toLowerCase()}` : ''}`}
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
        <p className={styles.selectedName} aria-live="polite">
          {text.selected} — <strong>{selectedPalette.name}</strong>
        </p>
      </section>

      <p className={styles.interactionHint}>
        <span aria-hidden="true">↔</span>
        {text.hint}
      </p>
      <p className={styles.signature}>L’art se boit.</p>
    </main>
  )
}
