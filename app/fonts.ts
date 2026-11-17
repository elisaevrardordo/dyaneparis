import localFont from 'next/font/local'

export const bodoni = localFont({
    src: [
        { path: './fonts/bodoni-moda-400-normal.woff2', weight: '400', style: 'normal' },
        { path: './fonts/bodoni-moda-500-normal.woff2', weight: '500', style: 'normal' },
        { path: './fonts/bodoni-moda-400-italic.woff2', weight: '400', style: 'italic' },
        { path: './fonts/bodoni-moda-500-italic.woff2', weight: '500', style: 'italic' },
    ],
    variable: '--font-bodoni',
    display: 'swap',
    preload: false,
    adjustFontFallback: false,
})

export const playfair = localFont({
    src: [{ path: './fonts/playfair-display-400-normal.woff2', weight: '400', style: 'normal' }],
    variable: '--font-playfair',
    display: 'swap',
    preload: false,
    adjustFontFallback: false,
})

// Noe Display and Austin are commercial typefaces and are not bundled in this
// repository. Add the licensed files under app/fonts/, then load them here with
// next/font/local while keeping the public CSS variables defined in globals.css.
export const fontVariables = `${bodoni.variable} ${playfair.variable}`
