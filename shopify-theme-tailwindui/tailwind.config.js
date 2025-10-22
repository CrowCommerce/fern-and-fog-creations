/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.{liquid,json}',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        moss: 'var(--color-moss, #33593D)',
        fern: 'var(--color-fern, #4F7942)',
        parchment: 'var(--color-parchment, #F5F0E6)',
        bark: 'var(--color-bark, #5B4636)',
        mist: 'var(--color-mist, #E6ECE8)',
        gold: 'var(--color-gold, #C5A05A)',
      },
      fontFamily: {
        display: ['var(--font-heading-family, Cormorant Garamond)', 'serif'],
        sans: ['var(--font-body-family, Inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '7xl': 'var(--max-width, 1280px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  safelist: [
    'bg-moss',
    'bg-fern',
    'bg-parchment',
    'bg-bark',
    'bg-mist',
    'bg-gold',
    'text-moss',
    'text-fern',
    'text-parchment',
    'text-bark',
    'text-mist',
    'text-gold',
    'border-moss',
    'border-fern',
    'border-bark',
    'hover:bg-moss',
    'hover:bg-fern',
    'hover:text-moss',
    'hover:text-fern',
    'hover:text-gold',
    'font-display',
    'font-sans',
  ],
};
