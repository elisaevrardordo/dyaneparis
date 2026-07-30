import type { Artist } from './types'

export const artists = [
  {
    id: 'atelier-dyane',
    name: 'Atelier Dyane',
    portrait: null,
    shortBiography: "La première étude chromatique de la Maison d'Art Liquide.",
    artisticApproach: 'La couleur révèle le mouvement du voile sans altérer la pureté de la porcelaine.',
    leadTimeWeeks: null,
    artworkIds: ['voile-monochrome'],
  },
] as const satisfies readonly Artist[]
