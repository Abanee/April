/** @type {import('tailwindcss').Config} */
// ============================================================
//  GENEALOGY APP — TAILWIND CONFIG
//  Heritage-focused palette, custom fonts, animations, plugins
// ============================================================
module.exports = {
  // Enable class-based dark mode so JS can toggle the `dark` class
  darkMode: 'class',

  // Scan all template files for class names
  content: ['./**/*.html', './js/**/*.js'],

  theme: {
    extend: {

      // ── FONTS ───────────────────────────────────────────────
      // Cormorant Garamond: editorial display headlines
      // EB Garamond: warm, readable body text
      // Jost: clean, modern UI labels and nav
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"EB Garamond"', 'Georgia', 'serif'],
        ui:      ['Jost', 'sans-serif'],
      },

      // ── HERITAGE COLOR PALETTE ───────────────────────────────
      // Light Mode: parchment warmth, sepia gold, deep ink
      // Dark Mode: charcoal depths, antique gold, moonlit cream
      colors: {
        // ─── Light (Parchment) Scale ─────────────────────────
        parchment: {
          50:  '#FEFCF8',
          100: '#FAF6F0',   // <─ bg-parchment-100 (primary bg)
          200: '#F3EAD8',
          300: '#E8D9C0',
          400: '#D9C4A0',
        },

        // ─── Sepia / Heritage Accent ─────────────────────────
        sepia: {
          300: '#C4A274',
          400: '#B38B55',
          500: '#8B6914',   // <─ primary accent (light mode)
          600: '#6B5010',
          700: '#4A380C',
        },

        // ─── Ink Scale (Typography) ──────────────────────────
        ink: {
          50:  '#F2EDE6',
          200: '#8A7566',
          400: '#4A3728',
          700: '#2C1F10',
          900: '#1C1005',   // <─ deepest text (light mode)
        },

        // ─── Charcoal Scale (Dark Mode BGs) ──────────────────
        charcoal: {
          800: '#1E1E1E',
          900: '#161616',
          950: '#121212',   // <─ bg-charcoal-950 (dark mode primary bg)
        },

        // ─── Antique Gold (Dark Mode Accent) ─────────────────
        gold: {
          300: '#E5C97A',
          400: '#C9A84C',   // <─ primary interactive accent (dark mode)
          500: '#A8893A',
          600: '#7D6529',
        },

        // ─── Muted Cream (Dark Mode Text) ────────────────────
        cream: {
          100: '#F5EDD8',
          200: '#E8E0D0',   // <─ primary text (dark mode)
          300: '#CFC8B8',
          400: '#B0A896',
          600: '#7A7268',
        },
      },

      // ── CUSTOM BACKGROUND SIZES ──────────────────────────────
      backgroundSize: {
        '200%': '200%',
      },

      // ── CUSTOM BORDER RADIUS ─────────────────────────────────
      borderRadius: {
        'heritage': '0.375rem',  // slightly subtle rounding
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ── BOX SHADOWS (Heritage + Glow Effects) ────────────────
      boxShadow: {
        'heritage':    '0 4px 24px -4px rgba(139, 105, 20, 0.18)',
        'heritage-lg': '0 8px 48px -8px rgba(139, 105, 20, 0.28)',
        'gold-glow':   '0 0 24px rgba(201, 168, 76, 0.45)',
        'gold-sm':     '0 0 12px rgba(201, 168, 76, 0.3)',
        'sepia-glow':  '0 0 20px rgba(139, 105, 20, 0.35)',
        'card':        '0 2px 16px rgba(28, 16, 5, 0.08)',
        'card-dark':   '0 2px 16px rgba(0, 0, 0, 0.4)',
        'glass':       '0 8px 32px rgba(0,0,0,0.12)',
        'inset-top':   'inset 0 2px 0 rgba(255,255,255,0.06)',
      },

      // ── KEYFRAME ANIMATIONS ──────────────────────────────────
      keyframes: {

        // Gentle entrance for hero/section elements
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // Soft fade-in for overlay elements
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },

        // Gold pulse for CTA buttons and highlights
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(201, 168, 76, 0.22)' },
        },

        // Sepia pulse variant for light mode
        'pulse-sepia': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139, 105, 20, 0)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(139, 105, 20, 0.18)' },
        },

        // Slow drift for parallax hero decorations
        'drift': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-12px) rotate(1deg)' },
          '66%':      { transform: 'translateY(6px) rotate(-0.5deg)' },
        },

        // Shimmer sweep for skeleton loaders / glassy elements
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },

        // Slide in from left (sidebar reveal)
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },

        // Slide in from right (RTL sidebar)
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },

        // Scale pop for card hover micro-interaction
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },

        // Draw-on effect for SVG tree lines
        'draw': {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },

        // Progress bar fill animation
        'fill': {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--fill-width, 60%)' },
        },
      },

      // ── ANIMATION UTILITIES ──────────────────────────────────
      animation: {
        'fade-in-up':      'fade-in-up 0.7s ease-out both',
        'fade-in-up-slow': 'fade-in-up 1.1s ease-out both',
        'fade-in':         'fade-in 0.5s ease-out both',
        'pulse-gold':      'pulse-gold 2.4s ease-in-out infinite',
        'pulse-sepia':     'pulse-sepia 2.4s ease-in-out infinite',
        'drift':           'drift 8s ease-in-out infinite',
        'shimmer':         'shimmer 2.5s linear infinite',
        'slide-in-left':   'slide-in-left 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right':  'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'pop':             'pop 0.3s ease-out',
        'draw':            'draw 2s ease-out forwards',
        'fill':            'fill 1.2s cubic-bezier(0.4,0,0.2,1) forwards',
        // Staggered fade-ins (use with animation-delay utilities)
        'fade-in-up-d1':   'fade-in-up 0.7s 0.1s ease-out both',
        'fade-in-up-d2':   'fade-in-up 0.7s 0.2s ease-out both',
        'fade-in-up-d3':   'fade-in-up 0.7s 0.3s ease-out both',
        'fade-in-up-d4':   'fade-in-up 0.7s 0.45s ease-out both',
        'fade-in-up-d5':   'fade-in-up 0.7s 0.6s ease-out both',
      },

      // ── CUSTOM TRANSITION DURATION ───────────────────────────
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },

      // ── BACKDROP BLUR (Glassmorphism) ────────────────────────
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
      },
    },
  },

  plugins: [
    // Custom plugin: adds `.animation-delay-*` utilities
    function({ matchUtilities, theme }) {
      matchUtilities(
        { 'animation-delay': (value) => ({ animationDelay: value }) },
        { values: { 100: '100ms', 200: '200ms', 300: '300ms', 500: '500ms', 700: '700ms', 1000: '1000ms' } }
      );
    },
  ],
};
