import { Bodoni_Moda, Playfair_Display } from 'next/font/google'

export const bodoni = Bodoni_Moda({
    subsets: ['latin'],
    weight: ['400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-bodoni',
    display: 'swap',
    adjustFontFallback: false,
})

export const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal'],
    variable: '--font-playfair',
    display: 'swap',
    adjustFontFallback: false,
})

// Noe Display and Austin are commercial typefaces and are not bundled in this
// repository. Add the licensed files under app/fonts/, then load them here with
// next/font/local while keeping the public CSS variables defined in globals.css.
export const fontVariables = `${bodoni.variable} ${playfair.variable}`
