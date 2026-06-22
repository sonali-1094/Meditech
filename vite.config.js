import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

const apiTarget = process.env.VITE_PROXY_API_TARGET || 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  envDir: '.',
  envPrefix: ['VITE_'],
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
