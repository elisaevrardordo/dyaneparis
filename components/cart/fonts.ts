import localFont from 'next/font/local'

const cormorant = localFont({
  src: '../../public/fonts/cart/CormorantGaramond-Regular.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-cart-serif',
})
const jost = localFont({
  src: [
    { path: '../../public/fonts/cart/Jost-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/cart/Jost-Medium.ttf', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-cart-sans',
})

export const cartFontVariables = `${cormorant.variable} ${jost.variable}`
