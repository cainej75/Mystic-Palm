import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split jsPDF into its own vendor chunk so it's cached separately
          // and doesn't bloat the main bundle
          if (id.includes('jspdf') || id.includes('jsPDF')) {
            return 'vendor-jspdf'
          }
          // Split React core for long-term caching
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // Split react-router separately
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          // Split Stripe
          if (id.includes('node_modules/@stripe') || id.includes('node_modules/stripe')) {
            return 'vendor-stripe'
          }
        }
      }
    }
  }
})
