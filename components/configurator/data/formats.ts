import type { FormatOption } from './types'

export const formats = [
  {
    id: '25cl',
    label: '25 cL',
    volume: '25 cL',
    physicalHeightCm: 23.5,
    modelPath: '/models/dyane-web-v2.glb',
    modelScale: 0.56,
    startingPrice: 1000,
    pricingMode: 'starting-at',
  },
  {
    id: '150cl',
    label: '1,5 L',
    volume: '1,5 L',
    physicalHeightCm: 42,
    modelPath: '/models/dyane-web-v2.glb',
    modelScale: 1,
    startingPrice: 1500,
    pricingMode: 'starting-at',
  },
  {
    id: '12l',
    label: '12 L',
    volume: '12 L',
    physicalHeightCm: null,
    modelPath: '/models/dyane-web-v2.glb',
    futureModelPath: '/models/dyane-12l.glb',
    modelScale: 1.55,
    startingPrice: null,
    pricingMode: 'on-request',
  },
] as const satisfies readonly FormatOption[]

export const formatById = Object.fromEntries(formats.map((format) => [format.id, format])) as {
  [Format in (typeof formats)[number] as Format['id']]: Format
}
