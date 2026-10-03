import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
   "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── Dark mode ──────────────────────────────
          primaryLight: '#FFC233',
          bg: '#0B1020',
          surface2: '#081b6fff',
          surface: '#121826',
          border: 'rgba(255,255,255,0.06)',
          text: '#E5E7EB',
          Muted: '#9CA3AF',
          primary: '#FF7A1A',
          primaryHover: '#E66A14',
          secondary: '#ffa15d73',
          bgCard: '#12172B',

          // ── Light mode ─────────────────────────────
          light: {
            bg: '#FFF7F0',           // fondo cálido casi blanco
            surface: '#FFFFFF',      // cards
            surface2: '#FFF1E6',     // inputs / capas
            border: 'rgba(255,122,26,0.15)',
            text: '#1A1A1A',
            muted: '#7A6A5A',
            accent: '#FF7A1A',       // naranja principal
            accentHover: '#E66A14',
            accentSoft: '#FFE0CC',   // naranja muy suave para fondos
            accentMid: '#FFB380',    // naranja medio para bordes/badges
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}

export default config
