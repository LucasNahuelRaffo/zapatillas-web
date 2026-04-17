import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import './index.css'
import App from './App'

console.log('🚀 Za-pass initializing...');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL Configured:', !!import.meta.env.VITE_SUPABASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CartProvider>
  </StrictMode>,
)
