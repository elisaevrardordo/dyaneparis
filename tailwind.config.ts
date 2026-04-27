import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Cormorant Garamond"', 'Georgia', 'serif'],
},
      colors: {
        cream: '#FAF8F5',
        charcoal: '#111111',
        gold: '#C9A84C',
},
},
},
  plugins: [],
}
export default config
