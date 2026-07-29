import type { FormatOption } from './types'

export const formats = [
  {
    id: '25cl',
    label: 'Dyane 25 cL',
    volume: '25 cL',
    modelPath: '/models/dyane.glb',
    sceneScale: 1,
    cameraDistance: 5.35,
    available: true,
  },
  {
    id: '1-5l',
    label: 'Dyane 1,5 L',
    volume: '1,5 L',
    modelPath: '/models/dyane-1-5l.glb',
    sceneScale: 1.2,
    cameraDistance: 5.2,
    available: false,
  },
  {
    id: '12l',
    label: 'Dyane 12 L',
    volume: '12 L',
    modelPath: '/models/dyane-12l.glb',
    sceneScale: 1.6,
    cameraDistance: 6.1,
    available: false,
  },
] as const satisfies readonly FormatOption[]
