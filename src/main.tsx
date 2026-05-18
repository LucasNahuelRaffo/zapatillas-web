import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './context/CartContext'
import { useGLTF } from '@react-three/drei'
import './index.css'
import App from './App'

useGLTF.setDecoderPath('/draco/')

console.log('🚀 Za-pass initializing...');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL Configured:', !!import.meta.env.VITE_SUPABASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <CartProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </CartProvider>
    </HelmetProvider>
  </StrictMode>,
)

