/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060606',
        surface: {
          50: '#141414',
          100: '#101010',
          200: '#0C0C0C',
          300: '#080808',
          DEFAULT: '#0C0C0C',
        },
        champagne: {
          light: '#EBE2D5',
          DEFAULT: '#C5A880',
          dark: '#9A7D55',
          muted: 'rgba(197, 168, 128, 0.25)',
        },
        primary: '#EDE8E0',
        secondary: 'rgba(237, 232, 224, 0.60)',
        muted: 'rgba(237, 232, 224, 0.35)',
        border: 'rgba(237, 232, 224, 0.08)',
        'border-strong': 'rgba(237, 232, 224, 0.18)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cinzel', 'Cormorant Garamond', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
        cinematic: '0.5em',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sweep': 'sweep 8s ease-in-out infinite',
      },
      keyframes: {
        sweep: {
          '0%, 100%': { transform: 'translateX(-100%) rotate(25deg)', opacity: 0 },
          '30%': { opacity: 0.12 },
          '70%': { opacity: 0.12 },
          '100%': { transform: 'translateX(200%) rotate(25deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
