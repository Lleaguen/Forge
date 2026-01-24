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
          //  primary: '#FF7A1A',
           primaryLight: '#FFC233',
          // primaryDark: 'rgba(227, 50, 50, 1)',
          // dark: '#343434ff',
          // surface: '#383838ff',
          // border: '#464646ff',
          // text: '#E5E7EB',
          // bgbody: '#333333ff',
          // muted: '#9CA3AF',
             bg: '#0B1020',        // arriba
    surface2: '#081b6fff',// inputs / layers
             surface: '#121826',   // cards
      border: 'rgba(255,255,255,0.06)',
      text: '#E5E7EB',
      Muted: '#9CA3AF',
      primary: '#FF7A1A',
      primaryHover: '#E66A14',
      secondary: '#ffa15d73',
      bgCard: '#12172B',
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