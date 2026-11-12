import { cartProducts } from '@/components/cart/catalog'

export const projectFinishes = ['to-discuss', 'matte', 'glossy'] as const
export const projectMixology = ['existing', 'exclusive', 'no-low-alcohol', 'specific'] as const
export const projectBudgets = ['under-500', '500-1000', '1000-2500', '2500-5000', '5000-10000'] as const

export const budgetLabels = {
  fr: ['Moins de 500 €', '500 € - 1 000 €', '1 000 € - 2 500 €', '2 500 € - 5 000 €', '5 000 € - 10 000 €'],
  en: ['Under €500', '€500 - €1,000', '€1,000 - €2,500', '€2,500 - €5,000', '€5,000 - €10,000'],
} as const

export type ConciergeProject = {
  sculpture: string
  bodyColour: string
  drapeColour: string
  finish: (typeof projectFinishes)[number]
  paintedDetails: string
  inscription: string
  meaningfulDate: string
  personalMessage: string
  artisticMotif: string
  exclusive: boolean
  mixology: (typeof projectMixology)[number]
  flavours: string
  budget: (typeof projectBudgets)[number] | ''
  firstName: string
  lastName: string
  email: string
  phone: string
  desiredDate: string
  message: string
  consent: boolean
}

export function emptyProject(): ConciergeProject {
  return {
    sculpture: cartProducts[0].sku, bodyColour: '', drapeColour: '', finish: 'to-discuss',
    paintedDetails: '', inscription: '', meaningfulDate: '', personalMessage: '', artisticMotif: '',
    exclusive: false, mixology: 'existing', flavours: '', budget: '',
    firstName: '', lastName: '', email: '', phone: '', desiredDate: '', message: '', consent: false,
  }
}

const limits = {
  bodyColour: 120, drapeColour: 120, paintedDetails: 1000, inscription: 160, meaningfulDate: 120,
  personalMessage: 1000, artisticMotif: 1000, flavours: 1500,
  firstName: 80, lastName: 100, email: 180, phone: 60, desiredDate: 10, message: 2000,
} as const

function realDate(value: string) {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function hasInvalidControlCharacters(value: string) {
  return Array.from(value).some(character => {
    const code = character.charCodeAt(0)
    return (code < 32 && ![9, 10, 13].includes(code)) || code === 127
  })
}

/** Only submitted wishes are recorded; no option implies a manufacturing guarantee. */
export function validateProject(value: unknown, options: { bespoke?: boolean } = {}): ConciergeProject | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const candidate = value as Record<string, unknown>
  const keys = Object.keys(emptyProject())
  if (Object.keys(candidate).some(key => !keys.includes(key)) || keys.some(key => !(key in candidate))) return null
  if ((!cartProducts.some(product => product.personalization.enabled && product.sku === candidate.sculpture) && !(options.bespoke && candidate.sculpture === 'to-discuss'))
    || !projectFinishes.includes(candidate.finish as never)
    || !projectMixology.includes(candidate.mixology as never)
    || (!projectBudgets.includes(candidate.budget as never) && !(options.bespoke && candidate.budget === ''))
    || typeof candidate.exclusive !== 'boolean' || candidate.consent !== true) return null
  const clean = { ...candidate } as ConciergeProject
  for (const [key, maximum] of Object.entries(limits)) {
    const text = candidate[key]
    if (typeof text !== 'string' || text.length > maximum || hasInvalidControlCharacters(text)) return null
    Object.assign(clean, { [key]: text.trim() })
  }
  clean.email = clean.email.toLowerCase()
  if (!clean.firstName || !clean.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)
    || !realDate(clean.desiredDate)) return null
  return clean
}

export function projectSummary(project: ConciergeProject, locale: 'fr' | 'en') {
  const en = locale === 'en'
  const product = cartProducts.find(item => item.sku === project.sculpture)
  const finishes = en ? ['To discuss', 'Matte, subject to feasibility', 'Glossy, subject to feasibility']
    : ['À étudier ensemble', 'Mate, sous réserve de faisabilité', 'Brillante, sous réserve de faisabilité']
  const mixology = en ? ['Existing Dyane composition', 'Exclusive composition', 'No or low alcohol, subject to feasibility', 'Specific request']
    : ['Composition Dyane existante', 'Composition exclusive', 'Sans alcool ou faiblement alcoolisée, sous réserve de faisabilité', 'Demande particulière']
  return [
    [en ? 'Starting work' : 'Œuvre de départ', product ? `${product.name} - ${product.format}` : (en ? 'To discuss with the House' : 'À définir avec la Maison')],
    [en ? 'Main colour' : 'Couleur principale', project.bodyColour],
    [en ? 'Drape colour' : 'Couleur du drapé', project.drapeColour],
    [en ? 'Finish requested' : 'Finition souhaitée', finishes[projectFinishes.indexOf(project.finish)]],
    [en ? 'Hand-painted details' : 'Détails peints à la main', project.paintedDetails],
    [en ? 'Initials / inscription' : 'Initiales / inscription', project.inscription],
    [en ? 'Meaningful date' : 'Date importante', project.meaningfulDate],
    [en ? 'Personal message' : 'Message personnel', project.personalMessage],
    [en ? 'Artistic motif' : 'Motif artistique', project.artisticMotif],
    [en ? 'Exclusive work requested' : 'Création exclusive souhaitée', project.exclusive ? (en ? 'Yes' : 'Oui') : (en ? 'No' : 'Non')],
    [en ? 'Mixology' : 'Mixologie', mixology[projectMixology.indexOf(project.mixology)]],
    [en ? 'Flavours / inspirations' : 'Saveurs / inspirations', project.flavours],
    [en ? 'Indicative budget' : 'Budget indicatif', budgetLabels[locale][projectBudgets.indexOf(project.budget as never)] ?? (en ? 'Not specified' : 'Non renseigné')],
    [en ? 'First name' : 'Prénom', project.firstName],
    [en ? 'Last name' : 'Nom', project.lastName],
    ['E-mail', project.email],
    [en ? 'Phone' : 'Téléphone', project.phone],
    [en ? 'Desired reception date, to confirm' : 'Réception souhaitée, à confirmer', project.desiredDate],
    [en ? 'Additional message' : 'Message complémentaire', project.message],
  ] as const
}
