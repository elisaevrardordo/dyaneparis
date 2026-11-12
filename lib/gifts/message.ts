export const GIFT_MAX_CHARACTERS = 300
export const GIFT_MAX_LINES = 3
export const GIFT_STORAGE_KEY = 'dyane-gift-message'

export function normalizeGiftMessage(value: string) {
  return value.replace(/\r\n?/g, '\n').normalize('NFC')
}
export function giftMessageStats(value: string) {
  const text = normalizeGiftMessage(value)
  return { characters: Array.from(text).length, lines: text ? text.split('\n').length : 0 }
}
export function validGiftMessage(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 1200) return false
  const text = normalizeGiftMessage(value)
  const { characters, lines } = giftMessageStats(text)
  return characters <= GIFT_MAX_CHARACTERS && lines <= GIFT_MAX_LINES
    && !Array.from(text).some(character => {
      const code = character.codePointAt(0) as number
      return (code < 32 && code !== 10) || code === 127 || (code >= 0x202a && code <= 0x202e) || (code >= 0x2066 && code <= 0x2069)
    })
}
// Existing longer drafts must be reviewed rather than silently printed in part.
export function restoreGiftMessage(value: string | null) {
  return value !== null && validGiftMessage(value) ? normalizeGiftMessage(value).trim() : ''
}
