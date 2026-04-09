/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
        body:    ['Outfit', 'sans-serif'],
      },
      colors: {
        neon: {
          yellow: '#e8ff00',
          pink:   '#ff2d78',
          cyan:   '#00f0ff',
          green:  '#39ff14',
        },
        urban: {
          black:    '#080808',
          dark:     '#111111',
          card:     '#181818',
          border:   '#2c2c2c',
          concrete: '#f0ebe4',
          ink:      '#0d0d0d',
          grey:     '#3a3a3a',
        },
      },
      fontSize: {
        'fluid-xl':  'clamp(3rem, 10vw, 9rem)',
        'fluid-lg':  'clamp(2rem, 6vw, 5rem)',
        'fluid-md':  'clamp(1.25rem, 3vw, 2rem)',
      },
      animation: {
        marquee:  'marquee 28s linear infinite',
        flicker:  'flicker 4s linear infinite',
        float:    'float 7s ease-in-out infinite',
        'fade-up': 'fadeUp .6s ease forwards',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flicker: {
          '0%,89%,91%,100%': { opacity: '1' },
          '90%':              { opacity: '0.15' },
          '92%':              { opacity: '0.7' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%':     { transform: 'translateY(-14px) rotate(1deg)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
