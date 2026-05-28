import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb'],
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1400, // Three.js chunk (~1.2MB) is lazy-loaded and isolated; warning is expected
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion', 'gsap', '@gsap/react'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  }
})
