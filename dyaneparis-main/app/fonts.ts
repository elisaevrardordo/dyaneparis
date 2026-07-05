import { Bodoni_Moda, Cormorant_Garamond, Lora, Playfair_Display } from 'next/font/google'

export const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
    display: 'swap',
})

export const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-cormorant',
    display: 'swap',
})

export const bodoni = Bodoni_Moda({
    subsets: ['latin'],
    weight: ['400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-bodoni',
    display: 'swap',
    adjustFontFallback: false,
})

export const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    variable: '--font-lora',
    display: 'swap',
})

export const fontVariables = `${playfair.variable} ${cormorant.variable} ${bodoni.variable} ${lora.variable}`
