import type { Palette } from './types'
import { glazePresets } from './materials'

export const palettes = [
  {
    id: 'bordeaux-profond',
    name: 'Bordeaux profond',
    shortName: 'Bordeaux',
    material: glazePresets['bordeaux-profond'],
  },
  {
    id: 'bleu-nocturne',
    name: 'Bleu nocturne',
    shortName: 'Nocturne',
    material: glazePresets['bleu-nocturne'],
  },
  {
    id: 'terre-de-sienne',
    name: 'Terre de Sienne',
    shortName: 'Sienne',
    material: glazePresets['terre-de-sienne'],
  },
] as const satisfies readonly Palette[]

export const defaultPaletteId = palettes[0].id
