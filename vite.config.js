import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rbac': {
        target: 'https://api-gateway-ohmz.onrender.com', 
        changeOrigin: true,
        // 🎯 CRITICAL: This line forces the proxy to correctly handle HTTPS and streaming
        secure: true, 
      },
    },
  },
})
