import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteHistory from 'vite-plugin-history'

export default defineConfig({
  plugins: [
    react(),
    ViteHistory()
  ],
  server: {
    open: true, 
  },
})
