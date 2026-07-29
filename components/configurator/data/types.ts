export type PriceAmount = number | null

export type FormatId = '25cl' | '1-5l' | '12l'
export type ArtistId = 'atelier-dyane'
export type ArtworkId = 'voile-monochrome'
export type PaletteId = 'bordeaux-profond' | 'bleu-nocturne' | 'terre-de-sienne'
export type FinishId = 'mat' | 'satine'

export interface FormatOption {
  id: FormatId
  label: string
  volume: string
  modelPath: string
  sceneScale: number
  cameraDistance: number
  available: boolean
}

export interface Artist {
  id: ArtistId
  name: string
  portrait: string | null
  shortBiography: string
  artisticApproach: string
  leadTimeWeeks: number | null
  artworkIds: ArtworkId[]
}

export interface Artwork {
  id: ArtworkId
  artistId: ArtistId
  name: string
  kind: 'palette' | 'painting' | 'pattern' | 'texture' | 'numbered-edition' | 'unique-work'
  description: string
  paletteIds: PaletteId[]
}

export interface Palette {
  id: PaletteId
  name: string
  shortName: string
  color: string
  material: {
    roughness: number
    metalness: number
    clearcoat: number
  }
}

export interface Finish {
  id: FinishId
  name: string
  description: string
  material: {
    roughness: number
    clearcoat: number
  }
}

export interface PricingCatalog {
  currency: 'EUR'
  formatBase: Record<FormatId, PriceAmount>
  artistSupplements: Record<ArtistId, PriceAmount>
  artworkSupplements: Record<ArtworkId, PriceAmount>
  paletteSupplements: Record<PaletteId, PriceAmount>
  finishSupplements: Record<FinishId, PriceAmount>
}

export interface ConfigurationSelection {
  formatId: FormatId
  artistId: ArtistId
  artworkId: ArtworkId
  paletteId: PaletteId
  finishId: FinishId
}
