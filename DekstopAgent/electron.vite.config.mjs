import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['ngrok']
      }
    }
  },
  preload: {
    input: resolve(__dirname, 'src/preload/index.js'),
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      allowedHosts: 'all'
    },
    plugins: [react(), tailwindcss()]
  }
})
