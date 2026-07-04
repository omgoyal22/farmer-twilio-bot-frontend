import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/initiate-call': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/calls': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/transcript': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      }
    }
  }
})
