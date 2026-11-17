import localFont from 'next/font/local'

const cormorant = localFont({
  src: '../../public/fonts/cart/CormorantGaramond-Regular-latin.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-cart-serif',
  // The complete face in globals.css supplies every character outside this set.
  // French and English keep the same outlines, widths and OpenType features.
  declarations: [
    { prop: 'font-family', value: 'Dyane Cormorant' },
    { prop: 'unicode-range', value: 'U+20-7E,U+A0-B4,U+B6-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,U+2000-200D,U+2010-2015,U+2018-201A,U+201C-201E,U+2020-2022,U+2026-2029,U+202F-2030,U+2032-2033,U+2039-203A,U+2042-2044,U+205F-2060,U+2063,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+FEFF' },
  ],
})
const jost = localFont({
  src: [
    { path: '../../public/fonts/cart/Jost-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/cart/Jost-Medium.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-cart-sans',
})

export const cartFontVariables = `${cormorant.variable} ${jost.variable}`
