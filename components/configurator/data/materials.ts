import type { GlazeMaterialPreset, PaletteId } from './types'

export interface PorcelainMaterialPreset {
  color: string
  roughness: number
  metalness: 0
  ior: number
  specularIntensity: number
  specularColor: string
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
  transmission: 0
  sheen: 0
  iridescence: 0
}

export interface MaterialCalibration {
  exposure: number
  bodyRoughness: number
  bodyClearcoat: number
  bodyClearcoatRoughness: number
  bodyEnvMapIntensity: number
  keyLightIntensity: number
  fillLightIntensity: number
  veilRoughness: number
  veilClearcoat: number
}

export const porcelainPresets = {
  body: {
    color: '#f4ead9',
    roughness: 0.24,
    metalness: 0,
    ior: 1.5,
    specularIntensity: 0.78,
    specularColor: '#fff8ec',
    clearcoat: 0.22,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.18,
    transmission: 0,
    sheen: 0,
    iridescence: 0,
  },
  cap: {
    color: '#f4ead9',
    roughness: 0.255,
    metalness: 0,
    ior: 1.5,
    specularIntensity: 0.76,
    specularColor: '#fff8ec',
    clearcoat: 0.2,
    clearcoatRoughness: 0.155,
    envMapIntensity: 1.12,
    transmission: 0,
    sheen: 0,
    iridescence: 0,
  },
} as const satisfies Record<'body' | 'cap', PorcelainMaterialPreset>

export const glazePresets = {
  'bordeaux-profond': {
    color: '#82142a',
    roughness: 0.165,
    metalness: 0,
    ior: 1.5,
    specularIntensity: 0.86,
    specularColor: '#fff5ed',
    clearcoat: 0.48,
    clearcoatRoughness: 0.095,
    envMapIntensity: 1.16,
    transmission: 0,
  },
  'bleu-nocturne': {
    color: '#102b46',
    roughness: 0.18,
    metalness: 0,
    ior: 1.5,
    specularIntensity: 0.9,
    specularColor: '#f2f6ff',
    clearcoat: 0.5,
    clearcoatRoughness: 0.09,
    envMapIntensity: 1.24,
    transmission: 0,
  },
  'terre-de-sienne': {
    color: '#9f4428',
    roughness: 0.205,
    metalness: 0,
    ior: 1.5,
    specularIntensity: 0.8,
    specularColor: '#fff2e8',
    clearcoat: 0.42,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.08,
    transmission: 0,
  },
} as const satisfies Record<PaletteId, GlazeMaterialPreset>

export const defaultMaterialCalibration: MaterialCalibration = {
  exposure: 1.05,
  bodyRoughness: porcelainPresets.body.roughness,
  bodyClearcoat: porcelainPresets.body.clearcoat,
  bodyClearcoatRoughness: porcelainPresets.body.clearcoatRoughness,
  bodyEnvMapIntensity: porcelainPresets.body.envMapIntensity,
  keyLightIntensity: 2.55,
  fillLightIntensity: 0.92,
  veilRoughness: glazePresets['bordeaux-profond'].roughness,
  veilClearcoat: glazePresets['bordeaux-profond'].clearcoat,
}

export const studioPreset = {
  background: '#e7e1db',
  fog: '#e7e1db',
  floor: '#ebe5de',
  ambientIntensity: 0.28,
  contactLightIntensity: 0.48,
  topLightIntensity: 0.16,
  rimLightIntensity: 0.32,
} as const
