import type { Artwork } from './types'

export const artworks = [
  {
    id: 'voile-monochrome',
    artistId: 'atelier-dyane',
    name: 'Étude monochrome',
    kind: 'palette',
    description: 'Une teinte profonde déposée sur le voile sculpté.',
    paletteIds: ['bordeaux-profond', 'bleu-nocturne', 'terre-de-sienne'],
  },
] as const satisfies readonly Artwork[]
