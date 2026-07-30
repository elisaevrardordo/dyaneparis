import type { Finish } from './types'

export const finishes = [
  {
    id: 'mat',
    name: 'Mat',
    description: 'Une lumière douce, absorbée par la matière.',
    material: { roughness: 0.58, clearcoat: 0.06 },
  },
  {
    id: 'satine',
    name: 'Satiné',
    description: 'Un éclat discret qui accompagne les courbes.',
    material: { roughness: 0.36, clearcoat: 0.2 },
  },
] as const satisfies readonly Finish[]
