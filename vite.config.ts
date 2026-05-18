import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar librerías pesadas en chunks independientes que se descargan en paralelo
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion', 'gsap', '@gsap/react'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  }
})
