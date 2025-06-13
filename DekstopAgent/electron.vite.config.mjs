import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['ngrok'] // ✅ Mark ngrok as external for the main process
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      host: true,             // ✅ Allows access via IP or domain (important for ngrok)
      port: 5174,
      strictPort: true,
      allowedHosts: 'all'     // ✅ Allow all hosts, including ngrok public URLs
    },
    plugins: [react(), tailwindcss()]
  }
})
