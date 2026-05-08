import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2e4a',
          light: '#243d60',
          dark: '#0f1c2d',
        },
        teal: {
          DEFAULT: '#2a9d8f',
          light: '#3ab5a5',
        },
        gold: '#e9c46a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
