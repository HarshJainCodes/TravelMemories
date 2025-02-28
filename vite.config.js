import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'corecomponentsHJ': path.resolve(__dirname, 'node_modules/corecomponentsHJ')
    },
  },
  build: {
    rollupOptions: {
        external: ['corecomponentsHJ/dist/hjcorecomponents.css', 'corecomponentsHJ']
    }
  }
})
