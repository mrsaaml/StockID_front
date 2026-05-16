/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#8191f8',
          500: '#6366f1',
          600: '#2d4eb3',
          700: '#1e3a8a',
          800: '#1e2f6b',
          900: '#1a2456',
          950: '#0f172a',
        },
        agro: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#baddff',
          300: '#7dc4ff',
          400: '#38a5fc',
          500: '#0e87ed',
          600: '#0268cb',
          700: '#0353a4',
          800: '#074786',
          900: '#0c3d6f',
          950: '#082549',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        elevated: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)',
        nav: '0 1px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
