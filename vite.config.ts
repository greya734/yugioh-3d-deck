import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true })],
  server: {
    proxy: {
      '/ygo-images': {
        target: 'https://images.ygoprodeck.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ygo-images/, ''),
      },
    },
  },
})