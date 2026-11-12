export type GiftOptions = { isGift: boolean }
export const GIFT_OPTIONS_STORAGE_KEY = 'dyane-gift-options-v1'
export function giftOptions(value: unknown, message = ''): GiftOptions {
  if (value === undefined) return { isGift: Boolean(message.trim()) }
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).length !== 1 || !Object.hasOwn(value, 'isGift')
    || typeof (value as GiftOptions).isGift !== 'boolean') throw new Error('Invalid gift options')
  if (message.trim() && !(value as GiftOptions).isGift) throw new Error('Gift message requires gift intent')
  return { isGift: (value as GiftOptions).isGift }
}
