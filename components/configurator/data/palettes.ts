import type { Palette } from './types'

export const palettes = [
  {
    id: 'bordeaux-profond',
    name: 'Bordeaux profond',
    shortName: 'Bordeaux',
    color: '#6f172b',
    material: { roughness: 0.34, metalness: 0.02, clearcoat: 0.22 },
  },
  {
    id: 'bleu-nocturne',
    name: 'Bleu nocturne',
    shortName: 'Nocturne',
    color: '#152c45',
    material: { roughness: 0.3, metalness: 0.03, clearcoat: 0.26 },
  },
  {
    id: 'terre-de-sienne',
    name: 'Terre de Sienne',
    shortName: 'Sienne',
    color: '#a15332',
    material: { roughness: 0.38, metalness: 0.01, clearcoat: 0.18 },
  },
] as const satisfies readonly Palette[]

export const defaultPaletteId = palettes[0].id
