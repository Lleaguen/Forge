declare module 'vite-plugin-history' {
  import { Plugin } from 'vite'

  const ViteHistory: () => Plugin
  export = ViteHistory
}
